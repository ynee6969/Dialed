import { Prisma, SourceKind, type Phone } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { resolvePhoneImageUrl } from "@/lib/services/phone-images";
import { getGsmArenaBdReference } from "@/lib/services/gsmarena-bd-reference";
import { getPhoneBySlug, getPhoneBySlugWithPreviewSource } from "@/lib/services/phones";
import {
  hasDatabaseUrl,
  isPrismaRuntimeError,
  logServerFailure
} from "@/lib/services/runtime-safety";
import type { PhoneReference, PhoneReferenceItem, PhoneReferenceSection } from "@/lib/types/phone-reference";
import {
  getPhoneDisplayName,
  stripBrandFromModel
} from "@/lib/utils/phone-presentation";

const GSM_ARENA_BASE = "https://www.gsmarena.com/";

declare global {
  // eslint-disable-next-line no-var
  var gsmArenaBrowserPromise: Promise<import("playwright").Browser> | undefined;
  // eslint-disable-next-line no-var
  var gsmArenaReferenceCache: Map<string, PhoneReference> | undefined;
}

const referenceCache = global.gsmArenaReferenceCache ?? new Map<string, PhoneReference>();

if (!global.gsmArenaReferenceCache) {
  global.gsmArenaReferenceCache = referenceCache;
}

function normalizeForMatch(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "");
}

function buildCacheKey(phoneId: string) {
  return `${phoneId}:${SourceKind.gsmarena}`;
}

function rowValue(sections: PhoneReferenceSection[], title: string, label: string) {
  const section = sections.find((entry) => entry.title.toLowerCase() === title.toLowerCase());
  const item = section?.items.find((entry) => entry.label.toLowerCase() === label.toLowerCase());
  return item?.value ?? null;
}

function firstNonEmpty(...values: Array<string | null>) {
  for (const value of values) {
    if (value && value.trim().length > 0) {
      return value.trim();
    }
  }

  return null;
}

function extractDisplaySize(value: string | null) {
  if (!value) {
    return null;
  }

  const match = value.match(/([\d.]+)\s*inches/i);
  return match ? `${match[1]}"` : value.split(",")[0].trim();
}

function extractResolution(value: string | null) {
  if (!value) {
    return null;
  }

  const match = value.match(/(\d+\s*x\s*\d+\s*pixels)/i);
  return match ? match[1].replace(/\s+/g, "") : value.split(",")[0].trim();
}

function extractCamera(value: string | null) {
  if (!value) {
    return null;
  }

  const match = value.match(/(\d+\s*MP)/i);
  return match ? match[1].replace(/\s+/g, "") : value.split(",")[0].trim();
}

function extractVideo(value: string | null) {
  if (!value) {
    return null;
  }

  if (/\b2160p\b/i.test(value)) {
    return "2160p";
  }

  if (/\b4k\b/i.test(value)) {
    return "2160p";
  }

  const match = value.match(/(\d{3,4}p)/i);
  return match ? match[1].toLowerCase() : value.split(",")[0].trim();
}

function extractMemory(value: string | null) {
  if (!value) {
    return null;
  }

  const matches = [...value.matchAll(/(\d+)\s*GB RAM/gi)].map((match) => Number(match[1]));
  if (!matches.length) {
    return value.split(",")[0].trim();
  }

  const unique = [...new Set(matches)].sort((left, right) => left - right);
  return `${unique.join("/")}GB RAM`;
}

function extractBattery(value: string | null) {
  if (!value) {
    return null;
  }

  const match = value.match(/(\d+\s*mAh)/i);
  return match ? match[1].replace(/\s+/g, "") : value.split(",")[0].trim();
}

function extractCharging(value: string | null) {
  if (!value) {
    return null;
  }

  const match = value.match(/(\d+\s*W)/i);
  return match ? match[1].replace(/\s+/g, "") : value.split(",")[0].trim();
}

function extractAlternativeNames(bodyText: string) {
  const match = bodyText.match(/Also known as\s+([^\n]+)/i);
  if (!match) {
    return [];
  }

  return match[1]
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);
}

function buildSummary(sections: PhoneReferenceSection[]) {
  return {
    displaySize: extractDisplaySize(rowValue(sections, "Display", "Size")),
    resolution: extractResolution(rowValue(sections, "Display", "Resolution")),
    cameraMain: extractCamera(
      firstNonEmpty(
        rowValue(sections, "Main Camera", "Single"),
        rowValue(sections, "Main Camera", "Dual"),
        rowValue(sections, "Main Camera", "Triple"),
        rowValue(sections, "Main Camera", "Quad")
      )
    ),
    video: extractVideo(rowValue(sections, "Main Camera", "Video")),
    memory: extractMemory(
      firstNonEmpty(
        rowValue(sections, "Memory", "Internal"),
        rowValue(sections, "Memory", "Card slot")
      )
    ),
    chipset: rowValue(sections, "Platform", "Chipset"),
    battery: extractBattery(rowValue(sections, "Battery", "Type")),
    charging: extractCharging(rowValue(sections, "Battery", "Charging"))
  };
}

function withResolvedReferenceImage(slug: string, reference: PhoneReference): PhoneReference {
  return {
    ...reference,
    imageUrl: resolvePhoneImageUrl(slug, reference.imageUrl)
  };
}

export function buildLocalPhoneReference(phone: Phone): PhoneReference {
  const memory = phone.ram ? `${phone.ram}GB RAM` : phone.storage ? `${phone.storage}GB` : null;
  const battery = phone.battery ? `${phone.battery}mAh` : null;
  const charging = phone.charging ? `${phone.charging}W` : null;
  const displayName = getPhoneDisplayName(phone.brand, phone.model);
  const modelName = stripBrandFromModel(phone.brand, phone.model) || phone.model;

  return {
    title: displayName,
    imageUrl: resolvePhoneImageUrl(phone.slug, null),
    sourceUrl: `${GSM_ARENA_BASE}results.php3?sQuickSearch=yes&sName=${encodeURIComponent(displayName)}`,
    alternativeNames: [],
    summary: {
      displaySize: extractDisplaySize(phone.display),
      resolution: null,
      cameraMain: phone.cameraMain ? `${phone.cameraMain}MP` : null,
      video: null,
      memory,
      chipset: phone.chipset,
      battery,
      charging
    },
    sections: [
      {
        title: "Overview",
        items: [
          { label: "Brand", value: phone.brand },
          { label: "Model", value: modelName },
          { label: "Price", value: `PHP ${phone.price.toLocaleString("en-PH")}` },
          ...(phone.display ? [{ label: "Display", value: phone.display }] : []),
          ...(phone.chipset ? [{ label: "Chipset", value: phone.chipset }] : []),
          ...(memory ? [{ label: "Memory", value: memory }] : []),
          ...(battery ? [{ label: "Battery", value: battery }] : []),
          ...(charging ? [{ label: "Charging", value: charging }] : [])
        ]
      }
    ],
    lastFetchedAt: new Date().toISOString()
  };
}

function isPhoneReference(value: Prisma.JsonValue | null | undefined): value is Prisma.JsonObject {
  return Boolean(
    value &&
      typeof value === "object" &&
      !Array.isArray(value) &&
      "title" in value &&
      "sections" in value &&
      "summary" in value
  );
}

function shouldRefreshReference(reference: PhoneReference) {
  if (reference.sourceUrl.includes("results.php3")) {
    return true;
  }

  if (reference.imageUrl && /gsmarenabd-logo/i.test(reference.imageUrl)) {
    return true;
  }

  const summaryValues = Object.values(reference.summary ?? {});
  const meaningfulSummaryCount = summaryValues.filter(
    (value) => Boolean(value && !/^[\d]+mAh$/i.test(value.trim()))
  ).length;

  return meaningfulSummaryCount === 0;
}

async function getBrowser() {
  if (!global.gsmArenaBrowserPromise) {
    global.gsmArenaBrowserPromise = (async () => {
      const { chromium } = await import("playwright");
      return chromium.launch({
        headless: true
      });
    })();
  }

  return global.gsmArenaBrowserPromise;
}

async function withPage<T>(callback: (page: import("playwright").Page) => Promise<T>) {
  const browser = await getBrowser();
  const context = await browser.newContext({
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
    viewport: { width: 1440, height: 1200 }
  });
  const page = await context.newPage();

  await page.route("**/*", async (route) => {
    const resourceType = route.request().resourceType();
    if (resourceType === "media" || resourceType === "font") {
      await route.abort();
      return;
    }

    await route.continue();
  });

  try {
    return await callback(page);
  } finally {
    await context.close();
  }
}

function pickBestResult(
  candidates: Array<{ name: string; href: string; imageUrl: string | null }>,
  brand: string,
  model: string
) {
  const displayName = getPhoneDisplayName(brand, model);
  const normalizedBrand = normalizeForMatch(brand);
  const normalizedModel = normalizeForMatch(stripBrandFromModel(brand, model));
  const target = normalizeForMatch(displayName);

  const scored = candidates.map((candidate) => {
    const normalized = normalizeForMatch(candidate.name);
    let score = 0;

    if (normalized === target) score += 10;
    if (normalizedModel && normalized.includes(normalizedModel)) score += 6;
    if (normalizedBrand && normalized.includes(normalizedBrand)) score += 3;
    if (normalizedModel && normalizedModel.includes(normalized)) score += 2;

    return { candidate, score };
  });

  scored.sort((left, right) => right.score - left.score);
  return scored[0]?.candidate ?? null;
}

async function resolveSearchResult(brand: string, model: string) {
  const queries = [...new Set([
    getPhoneDisplayName(brand, model),
    stripBrandFromModel(brand, model)
  ].filter(Boolean))];

  for (const query of queries) {
    const result = await withPage(async (page) => {
      await page.goto(
        `${GSM_ARENA_BASE}results.php3?sQuickSearch=yes&sName=${encodeURIComponent(query)}`,
        {
          waitUntil: "domcontentloaded",
          timeout: 120_000
        }
      );

      await page.waitForTimeout(1200);

      const candidates = await page.locator(".makers li").evaluateAll((nodes) =>
        nodes
          .map((node) => {
            const anchor = node.querySelector("a");
            const href = anchor?.getAttribute("href");
            const text = node.textContent?.replace(/\s+/g, " ").trim() ?? "";
            const imageUrl = node.querySelector("img")?.getAttribute("src") ?? null;

            if (!href || !text) {
              return null;
            }

            return {
              name: text,
              href,
              imageUrl
            };
          })
          .filter(Boolean)
      );

      return candidates as Array<{ name: string; href: string; imageUrl: string | null }>;
    }).catch(() => []);

    const best = pickBestResult(result, brand, model);
    if (best) {
      return {
        ...best,
        sourceUrl: new URL(best.href, GSM_ARENA_BASE).toString()
      };
    }
  }

  return null;
}

async function scrapeReferenceFromDetailPage(phone: Phone) {
  const searchResult = await resolveSearchResult(phone.brand, phone.model);
  if (!searchResult) {
    return null;
  }

  return withPage(async (page) => {
    await page.goto(searchResult.sourceUrl, {
      waitUntil: "domcontentloaded",
      timeout: 120_000
    });

    await page.waitForSelector("#specs-list table", { timeout: 30_000 });

    const title =
      (await page.locator("h1.specs-phone-name-title").textContent().catch(() => null)) ??
      getPhoneDisplayName(phone.brand, phone.model);
    const imageUrl =
      (await page.locator(".specs-photo-main img").first().getAttribute("src").catch(() => null)) ??
      searchResult.imageUrl;
    const bodyText = (await page.locator("body").textContent()) ?? "";

    const sections = await page.locator("#specs-list table").evaluateAll((tables) =>
      tables.map((table) => {
        const title = table.querySelector("th")?.textContent?.trim() ?? "Details";
        const items = Array.from(table.querySelectorAll("tr"))
          .map((row) => {
            const cells = Array.from(row.querySelectorAll("td"));
            if (cells.length < 2) {
              return null;
            }

            const label = cells[0]?.textContent?.replace(/\s+/g, " ").trim() ?? "";
            const value = cells[1]?.textContent?.replace(/\s+/g, " ").trim() ?? "";

            if (!value) {
              return null;
            }

            return {
              label,
              value
            };
          })
          .filter(Boolean);

        return {
          title,
          items
        };
      })
    );

    const normalizedSections = sections as Array<{
      title: string;
      items: PhoneReferenceItem[];
    }>;

    return {
      title: getPhoneDisplayName(phone.brand, title.trim()),
      imageUrl,
      sourceUrl: searchResult.sourceUrl,
      alternativeNames: extractAlternativeNames(bodyText),
      summary: buildSummary(normalizedSections),
      sections: normalizedSections,
      lastFetchedAt: new Date().toISOString()
    } satisfies PhoneReference;
  });
}

async function cacheReference(phoneId: string, reference: PhoneReference) {
  referenceCache.set(phoneId, reference);

  if (!hasDatabaseUrl()) {
    return;
  }

  await prisma.phoneSource.upsert({
    where: {
      cacheKey: buildCacheKey(phoneId)
    },
    update: {
      sourceUrl: reference.sourceUrl,
      rawExtraction: reference as unknown as Prisma.InputJsonValue,
      fetchedAt: new Date(reference.lastFetchedAt)
    },
    create: {
      phoneId,
      sourceKind: SourceKind.gsmarena,
      sourceUrl: reference.sourceUrl,
      cacheKey: buildCacheKey(phoneId),
      rawExtraction: reference as unknown as Prisma.InputJsonValue,
      fetchedAt: new Date(reference.lastFetchedAt)
    }
  });
}

function readCachedReference(
  phoneId: string,
  source?: { rawExtraction: Prisma.JsonValue | null } | null
) {
  const memory = referenceCache.get(phoneId);
  if (memory && !shouldRefreshReference(memory)) {
    return memory;
  }

  if (isPhoneReference(source?.rawExtraction)) {
    const reference = source.rawExtraction as unknown as PhoneReference;
    if (!shouldRefreshReference(reference)) {
      referenceCache.set(phoneId, reference);
      return reference;
    }
  }

  return null;
}

export function getCachedPhoneReferenceForPhone(
  phone: Phone & {
    sources?: Array<{
      rawExtraction: Prisma.JsonValue | null;
    }>;
  }
) {
  const cachedReference = readCachedReference(phone.id, phone.sources?.[0]);
  return cachedReference
    ? withResolvedReferenceImage(phone.slug, cachedReference)
    : buildLocalPhoneReference(phone);
}

export async function getCachedPhoneReferenceBySlug(slug: string) {
  const phone = await getPhoneBySlugWithPreviewSource(slug);

  if (!phone) {
    return null;
  }

  return getCachedPhoneReferenceForPhone(phone);
}

export async function getPhoneReferenceBySlug(slug: string) {
  const phone = await getPhoneBySlug(slug);

  if (!phone) {
    return null;
  }

  const cachedWithoutDb = readCachedReference(phone.id);
  if (cachedWithoutDb) {
    return cachedWithoutDb;
  }

  if (!hasDatabaseUrl()) {
    try {
      const fallbackReference = await getGsmArenaBdReference(phone);
      if (fallbackReference) {
        await cacheReference(phone.id, fallbackReference);
        return withResolvedReferenceImage(phone.slug, fallbackReference);
      }
    } catch (error) {
      logServerFailure("reference.bdFallbackNoDb", error);
    }

    return buildLocalPhoneReference(phone);
  }

  try {
    const phoneWithSources = await prisma.phone.findUnique({
      where: { slug },
      include: {
        sources: {
          where: {
            sourceKind: SourceKind.gsmarena
          },
          take: 1
        }
      }
    });

    if (!phoneWithSources) {
      return buildLocalPhoneReference(phone);
    }

    const cached = readCachedReference(phoneWithSources.id, phoneWithSources.sources[0]);
    if (cached) {
      return cached;
    }

    if (process.env.VERCEL !== "1") {
      try {
        const reference = await scrapeReferenceFromDetailPage(phoneWithSources);
        if (reference) {
          await cacheReference(phoneWithSources.id, reference);
          return withResolvedReferenceImage(phoneWithSources.slug, reference);
        }
      } catch (error) {
        logServerFailure("reference.scrape", error);
      }
    }

    try {
      const fallbackReference = await getGsmArenaBdReference(phoneWithSources);
      if (fallbackReference) {
        await cacheReference(phoneWithSources.id, fallbackReference);
        return withResolvedReferenceImage(phoneWithSources.slug, fallbackReference);
      }
    } catch (error) {
      logServerFailure("reference.bdFallback", error);
    }

    return buildLocalPhoneReference(phoneWithSources);
  } catch (error) {
    if (isPrismaRuntimeError(error)) {
      logServerFailure("reference.lookup", error);

      try {
        const fallbackReference = await getGsmArenaBdReference(phone);
        if (fallbackReference) {
          await cacheReference(phone.id, fallbackReference);
          return withResolvedReferenceImage(phone.slug, fallbackReference);
        }
      } catch (fallbackError) {
        logServerFailure("reference.bdFallbackAfterPrismaError", fallbackError);
      }

      return buildLocalPhoneReference(phone);
    }

    throw error;
  }
}
