import { CRITERION_KEYS, type Criterion, type CriterionWeight } from "@/lib/recommendation/types";

export { CRITERION_KEYS } from "@/lib/recommendation/types";

export interface CriterionDefinition {
  key: Criterion;
  label: string;
  direction: "benefit" | "cost";
  description: string;
}

export const CRITERIA: readonly CriterionDefinition[] = [
  {
    key: "performance",
    label: "Performance",
    direction: "benefit",
    description: "Higher performance score is preferred."
  },
  {
    key: "camera",
    label: "Camera",
    direction: "benefit",
    description: "Higher camera score is preferred."
  },
  {
    key: "battery",
    label: "Battery",
    direction: "benefit",
    description: "Higher battery/endurance score is preferred."
  },
  {
    key: "value",
    label: "Value",
    direction: "cost",
    description: "Lower price is preferred within the eligible set."
  }
] as const;

export const DEFAULT_WEIGHTS: CriterionWeight = {
  performance: 0.4,
  camera: 0.2,
  battery: 0.25,
  value: 0.15
};

export const USE_CASE_PRESETS: Readonly<Record<string, CriterionWeight>> = {
  balanced: DEFAULT_WEIGHTS,
  gaming: { performance: 0.5, camera: 0.15, battery: 0.2, value: 0.15 },
  camera: { performance: 0.2, camera: 0.5, battery: 0.15, value: 0.15 },
  battery: { performance: 0.2, camera: 0.15, battery: 0.45, value: 0.2 },
  value: { performance: 0.25, camera: 0.2, battery: 0.2, value: 0.35 }
};

export function sumWeights(weights: CriterionWeight) {
  return Object.values(weights).reduce((total, weight) => total + weight, 0);
}

export function roundScore(value: number, decimals = 6) {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}
