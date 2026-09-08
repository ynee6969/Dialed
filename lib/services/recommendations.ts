import { z } from "zod";

import { CRITERION_KEYS, DEFAULT_WEIGHTS, USE_CASE_PRESETS } from "@/lib/recommendation/criteria";
import { normalizePhoneCriteria } from "@/lib/recommendation/normalization";
import { calculateWeightedScore, validateWeights } from "@/lib/recommendation/scoring";
import { analyzeWeightSensitivity } from "@/lib/recommendation/sensitivity";
import type {
  CriterionWeight,
  DecisionConstraints,
  RecommendationResult,
  UserPreference
} from "@/lib/recommendation/types";
import { listPhones } from "@/lib/services/phones";

const weightSchema = z.object({
  performance: z.number().finite().min(0).max(1),
  camera: z.number().finite().min(0).max(1),
  battery: z.number().finite().min(0).max(1),
  value: z.number().finite().min(0).max(1)
});

const recommendationSchema = z
  .object({
    budget: z.number().finite().positive().optional(),
    minBudget: z.number().finite().positive().optional(),
    brands: z.array(z.string().min(1)).default([]),
    osPreference: z.enum(["any", "android", "ios"]).default("any"),
    useCase: z.enum(["balanced", "gaming", "camera", "battery", "value"]).default("balanced"),
    minBattery: z.number().finite().positive().optional(),
    minRam: z.number().finite().positive().optional(),
    weights: weightSchema.optional(),
    /** Legacy request name retained as an explicit user-weight alias. */
    priorities: weightSchema.optional(),
    limit: z.number().int().min(1).max(10).default(5),
    includeSensitivity: z.boolean().default(false)
  })
  .superRefine((input, context) => {
    if (input.minBudget !== undefined && input.budget !== undefined && input.minBudget > input.budget) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["minBudget"],
        message: "Minimum budget cannot exceed maximum budget."
      });
    }
  });

export type RecommendationInput = z.infer<typeof recommendationSchema>;

function resolvePreference(input: RecommendationInput): UserPreference {
  const explicitWeights = input.weights ?? input.priorities;
  if (explicitWeights) {
    validateWeights(explicitWeights);
    return { weights: explicitWeights, source: "user", preset: null };
  }

  const preset = USE_CASE_PRESETS[input.useCase] ?? DEFAULT_WEIGHTS;
  validateWeights(preset);
  return {
    weights: preset,
    source: input.useCase === "balanced" ? "default" : "preset",
    preset: input.useCase === "balanced" ? null : input.useCase
  };
}

function inferOs(phone: { brand: string; os: string | null }) {
  if (phone.brand.toLowerCase() === "apple" || phone.os?.toLowerCase().includes("ios")) {
    return "ios";
  }

  return "android";
}

function matchesConstraints(
  phone: {
    brand: string;
    os: string | null;
    price: number;
    battery: number | null;
    ram: number | null;
  },
  constraints: DecisionConstraints
) {
  if (constraints.brands.length > 0 && !constraints.brands.includes(phone.brand)) {
    return false;
  }

  if (constraints.minPrice !== undefined && phone.price < constraints.minPrice) {
    return false;
  }

  if (constraints.maxPrice !== undefined && phone.price > constraints.maxPrice) {
    return false;
  }

  if (constraints.minBattery !== undefined && (phone.battery === null || phone.battery < constraints.minBattery)) {
    return false;
  }

  if (constraints.minRam !== undefined && (phone.ram === null || phone.ram < constraints.minRam)) {
    return false;
  }

  return constraints.os === "any" || inferOs(phone) === constraints.os;
}

function buildReasons(score: ReturnType<typeof calculateWeightedScore>) {
  return Object.entries(score.criteria)
    .sort((left, right) => right[1].weightedContribution - left[1].weightedContribution)
    .slice(0, 3)
    .map(
      ([, criterion]) =>
        `${criterion.label} contributes ${criterion.weightedContribution.toFixed(3)} (${(
          criterion.normalizedScore * 100
        ).toFixed(1)}% score × ${(criterion.weight * 100).toFixed(1)}% weight).`
    );
}

export async function recommendPhones(rawInput: unknown) {
  const input = recommendationSchema.parse(rawInput);
  const preference = resolvePreference(input);
  const constraints: DecisionConstraints = {
    minPrice: input.minBudget,
    maxPrice: input.budget,
    brands: input.brands,
    os: input.osPreference,
    minBattery: input.minBattery,
    minRam: input.minRam
  };

  // Constraints are applied before normalization so Value is comparable within
  // the same eligible decision set and never changes eligibility after ranking.
  const catalog = await listPhones({
    minPrice: input.minBudget,
    maxPrice: input.budget,
    minBattery: input.minBattery,
    minRam: input.minRam,
    take: 1000
  });
  const eligiblePhones = catalog.phones.filter((phone) => matchesConstraints(phone, constraints));
  const normalizedScores = normalizePhoneCriteria(eligiblePhones);

  const ranked = eligiblePhones
    .map((phone) => {
      const normalized = normalizedScores.get(phone.id);
      if (!normalized) {
        throw new Error(`Missing normalized scores for phone ${phone.id}.`);
      }

      const score = calculateWeightedScore(normalized, preference.weights);
      return {
        rank: 0,
        phone,
        finalScore: score.overallPercentage,
        personalizedScore: score.overallPercentage,
        score,
        reasons: buildReasons(score)
      };
    })
    .sort(
      (left, right) =>
        right.score.overall - left.score.overall ||
        left.phone.price - right.phone.price ||
        left.phone.model.localeCompare(right.phone.model)
    )
    .map((match, index) => ({ ...match, rank: index + 1 }))
    .slice(0, input.limit);

  const sensitivityItems = eligiblePhones.flatMap((phone) => {
    const normalized = normalizedScores.get(phone.id);
    return normalized ? [{ id: phone.id, normalizedScores: normalized }] : [];
  });
  const sensitivity = input.includeSensitivity
    ? analyzeWeightSensitivity(sensitivityItems, preference.weights)
    : undefined;

  const result: RecommendationResult<typeof ranked[number]["phone"]> = {
    methodology: "weighted_scoring",
    formula: "S_j = Σ(w_i × r_ij)",
    criteria: CRITERION_KEYS,
    preferences: preference,
    // Retained at the top level for clients using the previous API shape.
    weights: preference.weights,
    constraints,
    eligibleCount: eligiblePhones.length,
    matches: ranked,
    ...(sensitivity ? { sensitivity } : {})
  };

  return result;
}
