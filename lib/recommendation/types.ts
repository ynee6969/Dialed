export const CRITERION_KEYS = ["performance", "camera", "battery", "value"] as const;

export type Criterion = (typeof CRITERION_KEYS)[number];

export type CriterionWeight = Record<Criterion, number>;
export type NormalizedCriterionScore = Record<Criterion, number>;

export interface CriterionContribution {
  label: string;
  normalizedScore: number;
  weight: number;
  weightedContribution: number;
}

export type RecommendationScore = {
  overall: number;
  overallPercentage: number;
  criteria: Record<Criterion, CriterionContribution>;
};

export interface PhoneRanking<TPhone = unknown> {
  rank: number;
  phone: TPhone;
  finalScore: number;
  personalizedScore: number;
  score: RecommendationScore;
  reasons: string[];
}

export interface UserPreference {
  weights: CriterionWeight;
  source: "user" | "preset" | "default";
  preset: string | null;
}

export interface DecisionConstraints {
  minPrice?: number;
  maxPrice?: number;
  brands: string[];
  os: "any" | "android" | "ios";
  minBattery?: number;
  minRam?: number;
}

export interface SensitivityScenario {
  label: string;
  changedCriterion: Criterion;
  direction: "increase" | "decrease";
  weights: CriterionWeight;
  ranking: string[];
  topRankChanged: boolean;
}

export interface SensitivityAnalysis {
  step: number;
  baseRanking: string[];
  scenarios: SensitivityScenario[];
}

export interface RecommendationResult<TPhone = unknown> {
  methodology: "weighted_scoring";
  formula: "S_j = Σ(w_i × r_ij)";
  criteria: readonly Criterion[];
  preferences: UserPreference;
  weights: CriterionWeight;
  constraints: DecisionConstraints;
  eligibleCount: number;
  matches: PhoneRanking<TPhone>[];
  sensitivity?: SensitivityAnalysis;
}
