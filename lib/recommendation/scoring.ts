import { CRITERIA, roundScore, sumWeights } from "@/lib/recommendation/criteria";
import type {
  CriterionWeight,
  NormalizedCriterionScore,
  RecommendationScore
} from "@/lib/recommendation/types";

export function validateWeights(weights: CriterionWeight) {
  const values = Object.values(weights);
  const total = sumWeights(weights);

  if (values.some((weight) => !Number.isFinite(weight) || weight < 0)) {
    throw new Error("Weights must be finite, non-negative numbers.");
  }

  if (Math.abs(total - 1) > 0.000001) {
    throw new Error("Weights must sum to exactly 1 (100%).");
  }

  return weights;
}

/** Implements S_j = Σ(w_i × r_ij) for one phone. */
export function calculateWeightedScore(
  normalizedScores: NormalizedCriterionScore,
  weights: CriterionWeight
): RecommendationScore {
  validateWeights(weights);

  const criteria = Object.fromEntries(
    CRITERIA.map((criterion) => {
      const normalizedScore = normalizedScores[criterion.key];
      const weight = weights[criterion.key];
      return [
        criterion.key,
        {
          label: criterion.label,
          normalizedScore,
          weight,
          weightedContribution: roundScore(normalizedScore * weight)
        }
      ];
    })
  ) as RecommendationScore["criteria"];

  const overall = roundScore(
    Object.values(criteria).reduce((total, criterion) => total + criterion.weightedContribution, 0)
  );

  return {
    overall,
    overallPercentage: roundScore(overall * 100, 2),
    criteria
  };
}
