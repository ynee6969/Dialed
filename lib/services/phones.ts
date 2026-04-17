import { type Phone, Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import {
  getFallbackPhoneBySlug,
  getFallbackPhoneCountsBySegment,
  getFallbackPhonesByIds,
  listFallbackPhones
} from "@/lib/services/catalog-fallback";
import {
  hasDatabaseUrl,
  isPrismaRuntimeError,
  logServerFailure
} from "@/lib/services/runtime-safety";
import {
  type BatteryCapacityFilter,
  type CameraQualityFilter,
  type PerformanceTierFilter,
  type PriceRangeFilter,
  resolveBatteryCapacity,
  resolveCameraQuality,
  resolvePerformanceTier,
  resolvePriceRange
} from "@/lib/utils/phone-filters";

export interface PhoneFilters {
  search?: string;
  segment?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  minRam?: number;
  minBattery?: number;
  priceRange?: PriceRangeFilter;
  performanceTier?: PerformanceTierFilter;
  cameraQuality?: CameraQualityFilter;
  batteryCapacity?: BatteryCapacityFilter;
  sort?: "top" | "price_asc" | "price_desc" | "camera" | "battery" | "performance";
  take?: number;
  skip?: number;
}

function buildNumericRangeFilter<T extends "performanceScore" | "cameraScore" | "battery">(
  field: T,
  range?: { min?: number; max?: number }
): Prisma.PhoneWhereInput {
  if (!range) {
    return {};
  }

  const bounds: { gte?: number; lte?: number } = {};

  if (range.min !== undefined) {
    bounds.gte = range.min;
  }

  if (range.max !== undefined) {
    bounds.lte = range.max;
  }

  if (!Object.keys(bounds).length) {
    return {};
  }

  return {
    [field]: bounds
  } as Prisma.PhoneWhereInput;
}

export interface PhoneListResult {
  phones: Phone[];
  total: number;
  brands: string[];
}

function buildOrderBy(sort: PhoneFilters["sort"]): Prisma.PhoneOrderByWithRelationInput[] {
  switch (sort) {
    case "price_asc":
      return [{ price: "asc" }];
    case "price_desc":
      return [{ price: "desc" }];
    case "camera":
      return [{ cameraScore: "desc" }, { finalScore: "desc" }];
    case "battery":
      return [{ batteryScore: "desc" }, { finalScore: "desc" }];
    case "performance":
      return [{ performanceScore: "desc" }, { finalScore: "desc" }];
    case "top":
    default:
      return [{ finalScore: "desc" }, { performanceScore: "desc" }];
  }
}

export async function listPhones(filters: PhoneFilters = {}): Promise<PhoneListResult> {
  if (!hasDatabaseUrl()) {
    return listFallbackPhones(filters);
  }

  const resolvedPriceRange = resolvePriceRange(filters.priceRange);
  const resolvedPerformanceTier = resolvePerformanceTier(filters.performanceTier);
  const resolvedCameraQuality = resolveCameraQuality(filters.cameraQuality);
  const resolvedBatteryCapacity = resolveBatteryCapacity(filters.batteryCapacity);
  const minimumPrice = Math.max(filters.minPrice ?? 0, resolvedPriceRange?.min ?? 0) || undefined;
  const maximumPriceCandidates = [filters.maxPrice, resolvedPriceRange?.max].filter(
    (value): value is number => value !== undefined
  );
  const maximumPrice = maximumPriceCandidates.length ? Math.min(...maximumPriceCandidates) : undefined;
  const minimumBattery = Math.max(filters.minBattery ?? 0, resolvedBatteryCapacity?.min ?? 0) || undefined;

  const where: Prisma.PhoneWhereInput = {
    AND: [
      filters.segment ? { segment: filters.segment as never } : {},
      filters.brand ? { brand: { equals: filters.brand } } : {},
      filters.search
        ? {
            OR: [
              { brand: { contains: filters.search } },
              { model: { contains: filters.search } }
            ]
          }
        : {},
      minimumPrice !== undefined || maximumPrice !== undefined
        ? {
            price: {
              gte: minimumPrice,
              lte: maximumPrice
            }
          }
        : {},
      filters.minRam ? { ram: { gte: filters.minRam } } : {},
      minimumBattery ? { battery: { gte: minimumBattery } } : {},
      buildNumericRangeFilter("performanceScore", resolvedPerformanceTier),
      buildNumericRangeFilter("cameraScore", resolvedCameraQuality)
    ]
  };

  try {
    const [phones, total, brandRows] = await Promise.all([
      prisma.phone.findMany({
        where,
        orderBy: buildOrderBy(filters.sort),
        take: filters.take ?? 100,
        skip: filters.skip ?? 0
      }),
      prisma.phone.count({ where }),
      prisma.phone.findMany({
        distinct: ["brand"],
        orderBy: { brand: "asc" },
        select: { brand: true }
      })
    ]);

    return {
      phones,
      total,
      brands: brandRows.map((row) => row.brand)
    };
  } catch (error) {
    if (isPrismaRuntimeError(error)) {
      logServerFailure("phones.list", error);
      return listFallbackPhones(filters);
    }

    throw error;
  }
}

export async function getPhoneBySlug(slug: string) {
  if (!hasDatabaseUrl()) {
    return getFallbackPhoneBySlug(slug);
  }

  try {
    return await prisma.phone.findUnique({
      where: { slug }
    });
  } catch (error) {
    if (isPrismaRuntimeError(error)) {
      logServerFailure("phones.bySlug", error);
      return getFallbackPhoneBySlug(slug);
    }

    throw error;
  }
}

export async function getPhonesByIds(ids: string[]) {
  if (!hasDatabaseUrl()) {
    return getFallbackPhonesByIds(ids);
  }

  try {
    return await prisma.phone.findMany({
      where: {
        id: {
          in: ids
        }
      }
    });
  } catch (error) {
    if (isPrismaRuntimeError(error)) {
      logServerFailure("phones.byIds", error);
      return getFallbackPhonesByIds(ids);
    }

    throw error;
  }
}

export async function getPhoneCountsBySegment() {
  if (!hasDatabaseUrl()) {
    return getFallbackPhoneCountsBySegment();
  }

  try {
    return await prisma.phone.groupBy({
      by: ["segment"],
      _count: true
    });
  } catch (error) {
    if (isPrismaRuntimeError(error)) {
      logServerFailure("phones.countsBySegment", error);
      return getFallbackPhoneCountsBySegment();
    }

    throw error;
  }
}
