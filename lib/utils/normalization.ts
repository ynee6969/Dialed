import { z } from "zod";

import type { SeedPhone } from "@/lib/data/seed-phones";
import {
  computeBatteryScore,
  computeCameraScore,
  computeFinalScore,
  computeValueScore,
  estimatePerformanceFromChipset
} from "@/lib/services/scoring";

const numberish = z
  .union([z.number(), z.string(), z.null(), z.undefined()])
  .transform((value) => {
    if (value === null || value === undefined || value === "") {
      return null;
    }

    const parsed = typeof value === "number" ? value : Number(String(value).replace(/[^\d.]/g, ""));
    return Number.isFinite(parsed) ? parsed : null;
  });

export const extractedPhoneSchema = z.object({
  display: z.string().nullish(),
  chipset: z.string().nullish(),
  gpu: z.string().nullish(),
  ram: numberish,
  storage: numberish,
  camera_main: numberish,
  camera_ultrawide: numberish,
  battery: numberish,
  charging: numberish,
  os: z.string().nullish(),
  release_year: numberish,
  release_date: z.string().nullish(),
  benchmark_score: numberish,
  ai_summary: z.string().nullish()
});

export type ExtractedPhonePayload = z.infer<typeof extractedPhoneSchema>;

export interface NormalizedPhoneRecord {
  display: string | null;
  chipset: string | null;
  gpu: string | null;
  ram: number | null;
  storage: number | null;
  cameraMain: number | null;
  cameraUltrawide: number | null;
  battery: number | null;
  charging: number | null;
  os: string | null;
  releaseYear: number | null;
  releaseDate: Date | null;
  benchmarkScore: number | null;
  aiSummary: string | null;
  performanceScore: number;
  cameraScore: number;
  batteryScore: number;
  valueScore: number;
  finalScore: number;
}

function asString(value: unknown) {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : null;
}

function asDate(value: string | null | undefined) {
  if (!value) {
    return null;
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.valueOf()) ? null : parsed;
}

export function coerceExtractedPayload(payload: unknown) {
  if (!payload || typeof payload !== "object") {
    return extractedPhoneSchema.parse({});
  }

  const record = payload as Record<string, unknown>;
  const transformed = {
    display: record.display,
    chipset: record.chipset,
    gpu: record.gpu,
    ram: record.ram,
    storage: record.storage,
    camera_main: record.camera_main ?? record.cameraMain,
    camera_ultrawide: record.camera_ultrawide ?? record.cameraUltrawide,
    battery: record.battery,
    charging: record.charging,
    os: record.os,
    release_year: record.release_year ?? record.releaseYear,
    release_date: record.release_date ?? record.releaseDate,
    benchmark_score: record.benchmark_score ?? record.benchmarkScore,
    ai_summary: record.ai_summary ?? record.aiSummary
  };

  return extractedPhoneSchema.parse(transformed);
}

export function normalizeExtractedPhone(seedPhone: SeedPhone, payload: unknown): NormalizedPhoneRecord {
  const extracted = coerceExtractedPayload(payload);
  const performanceScore =
    estimatePerformanceFromChipset(asString(extracted.chipset), extracted.benchmark_score) ??
    seedPhone.performance_score;
  const cameraScore = computeCameraScore(
    seedPhone.camera_score,
    extracted.camera_main,
    extracted.camera_ultrawide,
    asString(extracted.ai_summary)
  );
  const battery = extracted.battery ?? seedPhone.battery;
  const batteryScore = computeBatteryScore(battery, extracted.charging);
  const valueScore = computeValueScore(performanceScore, seedPhone.price);

  return {
    display: asString(extracted.display),
    chipset: asString(extracted.chipset),
    gpu: asString(extracted.gpu),
    ram: extracted.ram ? Math.round(extracted.ram) : null,
    storage: extracted.storage ? Math.round(extracted.storage) : null,
    cameraMain: extracted.camera_main ? Math.round(extracted.camera_main) : null,
    cameraUltrawide: extracted.camera_ultrawide ? Math.round(extracted.camera_ultrawide) : null,
    battery: battery ? Math.round(battery) : null,
    charging: extracted.charging ? Math.round(extracted.charging) : null,
    os: asString(extracted.os),
    releaseYear: extracted.release_year ? Math.round(extracted.release_year) : null,
    releaseDate: asDate(extracted.release_date),
    benchmarkScore: extracted.benchmark_score ? Math.round(extracted.benchmark_score) : null,
    aiSummary: asString(extracted.ai_summary),
    performanceScore,
    cameraScore,
    batteryScore,
    valueScore,
    finalScore: computeFinalScore({
      performanceScore,
      cameraScore,
      batteryScore,
      valueScore
    })
  };
}
