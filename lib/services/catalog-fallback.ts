import { EnrichmentStatus, type Phone, type PhoneSegment, type Prisma } from "@prisma/client";

import { seedPhones, type SeedPhone } from "@/lib/data/seed-phones";
import { deriveSeedScores } from "@/lib/services/scoring";
import { getPhoneDisplayName } from "@/lib/utils/phone-presentation";
import { slugify } from "@/lib/utils/format";

type CatalogSort = "top" | "price_asc" | "price_desc" | "camera" | "battery" | "performance";

export interface FallbackPhoneFilters {
  search?: string;
  segment?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  minRam?: number;
  minBattery?: number;
  sort?: CatalogSort;
  take?: number;
  skip?: number;
}

const catalogTimestamp = new Date("2026-01-01T00:00:00.000Z");

function buildFallbackPhone(seedPhone: SeedPhone): Phone {
  const slug = slugify(`${seedPhone.brand}-${seedPhone.model}`);
  const scores = deriveSeedScores(seedPhone);

  return {
    id: `seed-${slug}`,
    slug,
    brand: seedPhone.brand,
    model: seedPhone.model,
    segment: seedPhone.segment as PhoneSegment,
    price: seedPhone.price,
    performanceScore: scores.performanceScore,
    cameraScore: scores.cameraScore,
    batteryScore: scores.batteryScore,
    valueScore: scores.valueScore,
    finalScore: scores.finalScore,
    display: null,
    chipset: null,
    gpu: null,
    ram: null,
    storage: null,
    cameraMain: null,
    cameraUltrawide: null,
    battery: seedPhone.battery,
    charging: null,
    os: null,
    releaseYear: null,
    releaseDate: null,
    benchmarkScore: null,
    aiSummary: null,
    enrichmentStatus: EnrichmentStatus.pending,
    enrichmentConfidence: null,
    preferredSource: null,
    lastEnrichedAt: null,
    rawSeed: seedPhone as unknown as Prisma.JsonValue,
    enrichmentPayload: null,
    createdAt: catalogTimestamp,
    updatedAt: catalogTimestamp
  };
}

const fallbackCatalog = seedPhones.map(buildFallbackPhone);

function compareBySort(left: Phone, right: Phone, sort: CatalogSort = "top") {
  switch (sort) {
    case "price_asc":
      return left.price - right.price;
    case "price_desc":
      return right.price - left.price;
    case "camera":
      return Number(right.cameraScore ?? 0) - Number(left.cameraScore ?? 0);
    case "battery":
      return Number(right.batteryScore ?? 0) - Number(left.batteryScore ?? 0);
    case "performance":
      return Number(right.performanceScore ?? 0) - Number(left.performanceScore ?? 0);
    case "top":
    default:
      return (
        Number(right.finalScore ?? 0) - Number(left.finalScore ?? 0) ||
        Number(right.performanceScore ?? 0) - Number(left.performanceScore ?? 0)
      );
  }
}

export function listFallbackPhones(filters: FallbackPhoneFilters = {}) {
  const search = filters.search?.trim().toLowerCase();

  const phones = fallbackCatalog
    .filter((phone) => {
      if (filters.segment && phone.segment !== filters.segment) {
        return false;
      }

      if (filters.brand && phone.brand !== filters.brand) {
        return false;
      }

      if (search) {
        const haystack = getPhoneDisplayName(phone.brand, phone.model).toLowerCase();
        if (!haystack.includes(search)) {
          return false;
        }
      }

      if (filters.minPrice !== undefined && phone.price < filters.minPrice) {
        return false;
      }

      if (filters.maxPrice !== undefined && phone.price > filters.maxPrice) {
        return false;
      }

      if (filters.minBattery !== undefined && Number(phone.battery ?? 0) < filters.minBattery) {
        return false;
      }

      if (filters.minRam !== undefined && phone.ram !== null && phone.ram < filters.minRam) {
        return false;
      }

      return true;
    })
    .sort((left, right) => compareBySort(left, right, filters.sort));

  const skip = filters.skip ?? 0;
  const take = filters.take ?? 100;

  return {
    phones: phones.slice(skip, skip + take),
    total: phones.length,
    brands: [...new Set(fallbackCatalog.map((phone) => phone.brand))].sort((left, right) =>
      left.localeCompare(right)
    )
  };
}

export function getFallbackPhoneBySlug(slug: string) {
  return fallbackCatalog.find((phone) => phone.slug === slug) ?? null;
}

export function getFallbackPhonesByIds(ids: string[]) {
  const idSet = new Set(ids);
  return fallbackCatalog.filter((phone) => idSet.has(phone.id));
}

export function getFallbackPhoneCountsBySegment() {
  const grouped = fallbackCatalog.reduce<Record<string, number>>((accumulator, phone) => {
    accumulator[phone.segment] = (accumulator[phone.segment] ?? 0) + 1;
    return accumulator;
  }, {});

  return Object.entries(grouped).map(([segment, count]) => ({
    segment: segment as PhoneSegment,
    _count: count
  }));
}
