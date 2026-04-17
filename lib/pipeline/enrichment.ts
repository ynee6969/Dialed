import { EnrichmentStatus, Prisma, SourceKind, type EnrichmentJob, type Phone } from "@prisma/client";
import { subDays } from "date-fns";

import { extractWithBestProvider } from "@/lib/ai/providers";
import type { SourceDocument } from "@/lib/ai/types";
import type { SeedPhone } from "@/lib/data/seed-phones";
import { env } from "@/lib/env";
import { prisma } from "@/lib/prisma";
import { buildTrustedSourceCandidates } from "@/lib/pipeline/source-adapters";
import { fetchCleanMarkdown } from "@/lib/services/firecrawl";
import { computeBatteryScore, computeFinalScore, computeValueScore } from "@/lib/services/scoring";
import { normalizeExtractedPhone } from "@/lib/utils/normalization";

function sourceKindToPrisma(kind: SourceDocument["kind"]) {
  switch (kind) {
    case "gsmarena":
      return SourceKind.gsmarena;
    case "kimovil":
      return SourceKind.kimovil;
    case "nanoreview":
      return SourceKind.nanoreview;
  }
}

function getSeedPhone(phone: Phone) {
  return phone.rawSeed as Prisma.JsonObject as unknown as SeedPhone;
}

function buildCacheKey(phoneId: string, sourceKind: SourceKind) {
  return `${phoneId}:${sourceKind}`;
}

async function saveSuccessfulExtraction(params: {
  phone: Phone;
  job: EnrichmentJob;
  document: SourceDocument;
  provider: string;
  payload: unknown;
}) {
  const normalized = normalizeExtractedPhone(getSeedPhone(params.phone), params.payload);
  const sourceKind = sourceKindToPrisma(params.document.kind);

  await prisma.$transaction([
    prisma.phone.update({
      where: { id: params.phone.id },
      data: {
        display: normalized.display,
        chipset: normalized.chipset,
        gpu: normalized.gpu,
        ram: normalized.ram,
        storage: normalized.storage,
        cameraMain: normalized.cameraMain,
        cameraUltrawide: normalized.cameraUltrawide,
        battery: normalized.battery,
        charging: normalized.charging,
        os: normalized.os,
        releaseYear: normalized.releaseYear,
        releaseDate: normalized.releaseDate,
        benchmarkScore: normalized.benchmarkScore,
        aiSummary: normalized.aiSummary,
        performanceScore: normalized.performanceScore,
        cameraScore: normalized.cameraScore,
        batteryScore: normalized.batteryScore,
        valueScore: normalized.valueScore,
        finalScore: normalized.finalScore,
        enrichmentStatus: EnrichmentStatus.completed,
        enrichmentConfidence: 0.87,
        preferredSource: sourceKind,
        lastEnrichedAt: new Date(),
        enrichmentPayload: params.payload as Prisma.InputJsonValue
      }
    }),
    prisma.phoneSource.upsert({
      where: { cacheKey: buildCacheKey(params.phone.id, sourceKind) },
      update: {
        sourceUrl: params.document.url,
        rawMarkdown: params.document.markdown,
        rawExtraction: params.payload as Prisma.InputJsonValue,
        fetchedAt: params.document.fetchedAt
      },
      create: {
        phoneId: params.phone.id,
        sourceKind,
        sourceUrl: params.document.url,
        cacheKey: buildCacheKey(params.phone.id, sourceKind),
        rawMarkdown: params.document.markdown,
        rawExtraction: params.payload as Prisma.InputJsonValue,
        fetchedAt: params.document.fetchedAt
      }
    }),
    prisma.enrichmentJob.update({
      where: { id: params.job.id },
      data: {
        status: EnrichmentStatus.completed,
        provider: params.provider,
        sourceKind,
        finishedAt: new Date(),
        error: null
      }
    })
  ]);
}

async function applyFallback(phone: Phone, job: EnrichmentJob, error: string) {
  const seedPhone = getSeedPhone(phone);
  const batteryScore = computeBatteryScore(seedPhone.battery, phone.charging);
  const valueScore = computeValueScore(seedPhone.performance_score, seedPhone.price);

  await prisma.$transaction([
    prisma.phone.update({
      where: { id: phone.id },
      data: {
        performanceScore: seedPhone.performance_score,
        cameraScore: seedPhone.camera_score,
        battery: phone.battery ?? seedPhone.battery,
        batteryScore,
        valueScore,
        finalScore: computeFinalScore({
          performanceScore: seedPhone.performance_score,
          cameraScore: seedPhone.camera_score,
          batteryScore,
          valueScore
        }),
        enrichmentStatus: EnrichmentStatus.fallback,
        lastEnrichedAt: new Date()
      }
    }),
    prisma.enrichmentJob.update({
      where: { id: job.id },
      data: {
        status: EnrichmentStatus.fallback,
        error,
        finishedAt: new Date()
      }
    })
  ]);
}

async function fetchDocument(url: string, kind: SourceDocument["kind"]) {
  const markdown = await fetchCleanMarkdown(url);

  return {
    kind,
    url,
    markdown,
    fetchedAt: new Date()
  } satisfies SourceDocument;
}

export async function queuePhonesForEnrichment(phoneIds: string[]) {
  const uniquePhoneIds = [...new Set(phoneIds)];
  let queued = 0;

  for (const phoneId of uniquePhoneIds) {
    const existing = await prisma.enrichmentJob.findFirst({
      where: {
        phoneId,
        status: {
          in: [EnrichmentStatus.queued, EnrichmentStatus.processing]
        }
      }
    });

    if (existing) {
      continue;
    }

    await prisma.enrichmentJob.create({
      data: {
        phoneId,
        status: EnrichmentStatus.queued
      }
    });
    queued += 1;
  }

  return queued;
}

export async function queueStalePhonesForEnrichment() {
  const stalenessThreshold = subDays(new Date(), env.ENRICHMENT_STALENESS_DAYS);
  const phones = await prisma.phone.findMany({
    where: {
      OR: [
        { chipset: null },
        { display: null },
        { lastEnrichedAt: null },
        { lastEnrichedAt: { lt: stalenessThreshold } },
        {
          enrichmentStatus: {
            in: [EnrichmentStatus.pending, EnrichmentStatus.failed, EnrichmentStatus.fallback]
          }
        }
      ]
    },
    select: { id: true }
  });

  return queuePhonesForEnrichment(phones.map((phone) => phone.id));
}

export async function runEnrichmentJob(jobId: string) {
  const job = await prisma.enrichmentJob.findUnique({
    where: { id: jobId },
    include: { phone: true }
  });

  if (!job) {
    throw new Error("Enrichment job not found.");
  }

  await prisma.enrichmentJob.update({
    where: { id: job.id },
    data: {
      status: EnrichmentStatus.processing,
      attempts: { increment: 1 },
      startedAt: new Date()
    }
  });

  const seedPhone = getSeedPhone(job.phone);
  const sourceCandidates = buildTrustedSourceCandidates(seedPhone);
  let lastError = "No extraction provider configured.";

  for (const candidate of sourceCandidates) {
    try {
      const sourceKind = sourceKindToPrisma(candidate.kind);
      const cachedSource = await prisma.phoneSource.findUnique({
        where: {
          cacheKey: buildCacheKey(job.phone.id, sourceKind)
        }
      });

      if (cachedSource?.rawExtraction) {
        await saveSuccessfulExtraction({
          phone: job.phone,
          job,
          document: {
            kind: candidate.kind,
            url: cachedSource.sourceUrl,
            markdown: cachedSource.rawMarkdown ?? "",
            fetchedAt: cachedSource.fetchedAt ?? new Date()
          },
          provider: "cache",
          payload: cachedSource.rawExtraction
        });

        return {
          jobId: job.id,
          phoneId: job.phoneId,
          status: EnrichmentStatus.completed
        };
      }

      const document = await fetchDocument(candidate.url, candidate.kind);
      const extracted = await extractWithBestProvider({
        phone: seedPhone,
        document
      });

      if (!extracted) {
        lastError = "No extraction provider configured.";
        continue;
      }

      await saveSuccessfulExtraction({
        phone: job.phone,
        job,
        document,
        provider: extracted.provider,
        payload: extracted.payload
      });

      return {
        jobId: job.id,
        phoneId: job.phoneId,
        status: EnrichmentStatus.completed
      };
    } catch (error) {
      lastError = error instanceof Error ? error.message : "Unknown enrichment error.";
    }
  }

  await applyFallback(job.phone, job, lastError);

  return {
    jobId: job.id,
    phoneId: job.phoneId,
    status: EnrichmentStatus.fallback,
    error: lastError
  };
}

export async function runQueuedEnrichmentBatch(limit = env.MAX_ENRICHMENT_BATCH) {
  const jobs = await prisma.enrichmentJob.findMany({
    where: { status: EnrichmentStatus.queued },
    orderBy: { createdAt: "asc" },
    take: limit
  });

  const results = [];
  for (const job of jobs) {
    results.push(await runEnrichmentJob(job.id));
  }

  return results;
}
