import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import {
  queuePhonesForEnrichment,
  queueStalePhonesForEnrichment,
  runQueuedEnrichmentBatch
} from "@/lib/pipeline/enrichment";
import { prisma } from "@/lib/prisma";
import { RateLimitError, enforceRateLimit } from "@/lib/services/rate-limit";
import { ensureApplicationBootstrapped } from "@/lib/services/bootstrap";
import { getErrorMessage, hasDatabaseUrl, isPrismaRuntimeError } from "@/lib/services/runtime-safety";

const enrichSchema = z.object({
  phoneIds: z.array(z.string()).optional(),
  runNow: z.boolean().default(false),
  limit: z.number().min(1).max(10).optional()
});

export async function GET() {
  if (!hasDatabaseUrl()) {
    return NextResponse.json({
      queued: 0,
      processing: 0,
      completed: 0,
      fallback: 0,
      skipped: true,
      reason: "Database is not configured."
    });
  }

  try {
    await ensureApplicationBootstrapped();
    const [queued, processing, completed, fallback] = await Promise.all([
      prisma.enrichmentJob.count({ where: { status: "queued" } }),
      prisma.enrichmentJob.count({ where: { status: "processing" } }),
      prisma.enrichmentJob.count({ where: { status: "completed" } }),
      prisma.enrichmentJob.count({ where: { status: "fallback" } })
    ]);

    return NextResponse.json({
      queued,
      processing,
      completed,
      fallback
    });
  } catch (error) {
    return NextResponse.json({
      queued: 0,
      processing: 0,
      completed: 0,
      fallback: 0,
      skipped: true,
      reason: getErrorMessage(error, "Enrichment status is unavailable.")
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!hasDatabaseUrl()) {
      return NextResponse.json({
        queued: 0,
        processed: [],
        skipped: true,
        reason: "Database is not configured."
      });
    }

    await ensureApplicationBootstrapped();
    enforceRateLimit(
      `enrich:${request.headers.get("x-forwarded-for") ?? "local"}`,
      8,
      60_000
    );

    const body = enrichSchema.parse(await request.json().catch(() => ({})));
    const queued = body.phoneIds?.length
      ? await queuePhonesForEnrichment(body.phoneIds)
      : await queueStalePhonesForEnrichment();
    const processed = body.runNow ? await runQueuedEnrichmentBatch(body.limit) : [];

    return NextResponse.json({
      queued,
      processed
    });
  } catch (error) {
    if (isPrismaRuntimeError(error)) {
      return NextResponse.json({
        queued: 0,
        processed: [],
        skipped: true,
        reason: getErrorMessage(error, "Enrichment is unavailable.")
      });
    }

    if (error instanceof RateLimitError) {
      return NextResponse.json({ error: error.message }, { status: 429 });
    }

    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Enrichment failed." },
      { status: 400 }
    );
  }
}
