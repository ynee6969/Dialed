import { CRITERION_KEYS, roundScore } from "@/lib/recommendation/criteria";
import type { NormalizedCriterionScore } from "@/lib/recommendation/types";

export interface RecommendationPhoneData {
  id: string;
  price: number;
  performanceScore: number | null;
  cameraScore: number | null;
  batteryScore: number | null;
}

function normalizeStoredScore(value: number | null) {
  if (value === null || !Number.isFinite(value)) {
    return 0;
  }

  return roundScore(Math.max(0, Math.min(100, value)) / 100);
}

export function normalizeCost(value: number, minimum: number, maximum: number) {
  if (maximum <= minimum) {
    return 1;
  }

  return roundScore(1 - (value - minimum) / (maximum - minimum));
}

/**
 * Converts persisted 0–100 benefit scores and price into reproducible [0, 1]
 * criterion scores. Value is a cost criterion: price is normalized within the
 * already eligible set, which avoids double-counting Performance.
 */
export function normalizePhoneCriteria(
  phones: readonly RecommendationPhoneData[]
): ReadonlyMap<string, NormalizedCriterionScore> {
  const prices = phones.map((phone) => phone.price);
  const minimumPrice = Math.min(...prices);
  const maximumPrice = Math.max(...prices);

  return new Map(
    phones.map((phone) => [
      phone.id,
      {
        performance: normalizeStoredScore(phone.performanceScore),
        camera: normalizeStoredScore(phone.cameraScore),
        battery: normalizeStoredScore(phone.batteryScore),
        value: normalizeCost(phone.price, minimumPrice, maximumPrice)
      }
    ])
  );
}

export function isNormalizedCriterionScore(value: unknown): value is NormalizedCriterionScore {
  return (
    typeof value === "object" &&
    value !== null &&
    CRITERION_KEYS.every((criterion) => {
      const score = (value as Record<string, unknown>)[criterion];
      return typeof score === "number" && score >= 0 && score <= 1;
    })
  );
}
