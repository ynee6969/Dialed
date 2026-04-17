import type { SeedPhone } from "@/lib/data/seed-phones";

export interface ScoreBreakdown {
  performanceScore: number;
  cameraScore: number;
  batteryScore: number;
  valueScore: number;
  finalScore: number;
}

export function clampScore(value: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, Number(value.toFixed(2))));
}

export function computeBatteryScore(batteryCapacity?: number | null, chargingWatts?: number | null) {
  if (!batteryCapacity) {
    return 0;
  }

  const capacityContribution = (batteryCapacity - 3000) / 35;
  const chargingContribution = chargingWatts ? Math.min(chargingWatts / 4, 18) : 6;
  return clampScore(35 + capacityContribution + chargingContribution);
}

export function computeValueScore(performanceScore: number, price: number) {
  if (!price) {
    return 0;
  }

  return clampScore((performanceScore / price) * 7000);
}

export function computeCameraScore(
  baselineScore: number,
  cameraMain?: number | null,
  cameraUltrawide?: number | null,
  aiSummary?: string | null
) {
  const primaryBoost = cameraMain ? Math.min(cameraMain / 12, 10) : 0;
  const ultrawideBoost = cameraUltrawide ? 3 : 0;
  const summaryBoost =
    aiSummary && /telephoto|ois|periscope|hdr|night mode/i.test(aiSummary) ? 2 : 0;

  return clampScore(baselineScore + primaryBoost + ultrawideBoost + summaryBoost);
}

export function computeFinalScore({
  performanceScore,
  cameraScore,
  batteryScore,
  valueScore
}: Omit<ScoreBreakdown, "finalScore">) {
  return clampScore(
    performanceScore * 0.35 +
      cameraScore * 0.3 +
      batteryScore * 0.2 +
      valueScore * 0.15
  );
}

export function deriveSeedScores(seedPhone: SeedPhone): ScoreBreakdown {
  const batteryScore = computeBatteryScore(seedPhone.battery, null);
  const valueScore = computeValueScore(seedPhone.performance_score, seedPhone.price);

  return {
    performanceScore: seedPhone.performance_score,
    cameraScore: seedPhone.camera_score,
    batteryScore,
    valueScore,
    finalScore: computeFinalScore({
      performanceScore: seedPhone.performance_score,
      cameraScore: seedPhone.camera_score,
      batteryScore,
      valueScore
    })
  };
}

const chipsetScoreMap: Record<string, number> = {
  "snapdragon 8 elite": 99,
  "snapdragon 8 gen 3": 97,
  "snapdragon 8 gen 2": 94,
  "snapdragon 8s gen 3": 93,
  "snapdragon 7+ gen 3": 89,
  "snapdragon 7 gen 3": 84,
  "dimensity 9400": 99,
  "dimensity 9300": 97,
  "dimensity 8300": 90,
  "dimensity 8200": 87,
  "tensor g4": 94,
  "tensor g3": 90,
  "a18 pro": 99,
  "a18": 97,
  "a17 pro": 98,
  "a16 bionic": 95,
  "exynos 2400": 95,
  "exynos 1580": 86
};

export function estimatePerformanceFromChipset(chipset?: string | null, benchmarkScore?: number | null) {
  if (benchmarkScore && benchmarkScore > 0) {
    if (benchmarkScore > 2200000) return 99;
    if (benchmarkScore > 1800000) return 95;
    if (benchmarkScore > 1400000) return 90;
    if (benchmarkScore > 1000000) return 84;
    if (benchmarkScore > 700000) return 76;
    return 68;
  }

  if (!chipset) {
    return null;
  }

  const normalized = chipset.toLowerCase();
  for (const [key, score] of Object.entries(chipsetScoreMap)) {
    if (normalized.includes(key)) {
      return score;
    }
  }

  if (normalized.includes("snapdragon 7")) return 82;
  if (normalized.includes("snapdragon 6")) return 72;
  if (normalized.includes("helio g99")) return 74;
  if (normalized.includes("dimensity 700")) return 70;
  if (normalized.includes("dimensity 7200")) return 84;
  if (normalized.includes("unisonic") || normalized.includes("unisoc")) return 58;

  return null;
}
