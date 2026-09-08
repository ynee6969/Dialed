import { CRITERION_KEYS, roundScore, sumWeights } from "@/lib/recommendation/criteria";
import { calculateWeightedScore } from "@/lib/recommendation/scoring";
import type {
  Criterion,
  CriterionWeight,
  NormalizedCriterionScore,
  SensitivityAnalysis,
  SensitivityScenario
} from "@/lib/recommendation/types";

export interface SensitivityInput {
  id: string;
  normalizedScores: NormalizedCriterionScore;
}

function adjustedWeights(base: CriterionWeight, changedCriterion: Criterion, delta: number) {
  const target = Math.max(0, Math.min(1, base[changedCriterion] + delta));
  const otherCriteria = CRITERION_KEYS.filter((criterion) => criterion !== changedCriterion);
  const otherTotal = otherCriteria.reduce((total, criterion) => total + base[criterion], 0);

  if (otherTotal === 0 && target < 1) {
    throw new Error("Cannot redistribute a sensitivity change from zero-weight criteria.");
  }

  const next = { ...base, [changedCriterion]: target };
  for (const criterion of otherCriteria) {
    next[criterion] = otherTotal === 0 ? 0 : base[criterion] * ((1 - target) / otherTotal);
  }

  const correction = 1 - sumWeights(next);
  next[otherCriteria[0]] += correction;
  return next;
}

function rankIds(items: readonly SensitivityInput[], weights: CriterionWeight) {
  return [...items]
    .map((item) => ({
      id: item.id,
      score: calculateWeightedScore(item.normalizedScores, weights).overall
    }))
    .sort((left, right) => right.score - left.score || left.id.localeCompare(right.id))
    .map((item) => item.id);
}

export function analyzeWeightSensitivity(
  items: readonly SensitivityInput[],
  baseWeights: CriterionWeight,
  step = 0.1
): SensitivityAnalysis {
  if (!Number.isFinite(step) || step <= 0 || step > 0.5) {
    throw new Error("Sensitivity step must be greater than 0 and at most 0.5.");
  }

  const baseRanking = rankIds(items, baseWeights);
  const scenarios: SensitivityScenario[] = [];

  for (const criterion of CRITERION_KEYS) {
    for (const direction of ["increase", "decrease"] as const) {
      const delta = direction === "increase" ? step : -step;
      const weights = adjustedWeights(baseWeights, criterion, delta);
      const ranking = rankIds(items, weights);
      scenarios.push({
        label: `${criterion} ${direction} by ${roundScore(step * 100, 2)} percentage points`,
        changedCriterion: criterion,
        direction,
        weights,
        ranking,
        topRankChanged: ranking[0] !== baseRanking[0]
      });
    }
  }

  return { step, baseRanking, scenarios };
}
