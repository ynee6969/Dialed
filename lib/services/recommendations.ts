import { z } from "zod";

import { listPhones } from "@/lib/services/phones";

const recommendationSchema = z.object({
  budget: z.number().positive().optional(),
  minBudget: z.number().positive().optional(),
  brands: z.array(z.string()).default([]),
  osPreference: z.enum(["any", "android", "ios"]).default("any"),
  useCase: z.enum(["balanced", "gaming", "camera", "battery", "value"]).default("balanced"),
  minBattery: z.number().positive().optional(),
  minRam: z.number().positive().optional(),
  priorities: z
    .object({
      performance: z.number().min(0).max(1).default(0.35),
      camera: z.number().min(0).max(1).default(0.3),
      battery: z.number().min(0).max(1).default(0.2),
      value: z.number().min(0).max(1).default(0.15)
    })
    .default({
      performance: 0.35,
      camera: 0.3,
      battery: 0.2,
      value: 0.15
    }),
  limit: z.number().min(1).max(10).default(5)
});

export type RecommendationInput = z.infer<typeof recommendationSchema>;

function normalizeWeights(input: RecommendationInput["priorities"], useCase: RecommendationInput["useCase"]) {
  let weights = input;

  if (useCase === "gaming") {
    weights = { performance: 0.5, camera: 0.15, battery: 0.2, value: 0.15 };
  }
  if (useCase === "camera") {
    weights = { performance: 0.2, camera: 0.5, battery: 0.15, value: 0.15 };
  }
  if (useCase === "battery") {
    weights = { performance: 0.2, camera: 0.15, battery: 0.45, value: 0.2 };
  }
  if (useCase === "value") {
    weights = { performance: 0.25, camera: 0.2, battery: 0.2, value: 0.35 };
  }

  const total = weights.performance + weights.camera + weights.battery + weights.value;

  return {
    performance: weights.performance / total,
    camera: weights.camera / total,
    battery: weights.battery / total,
    value: weights.value / total
  };
}

function inferOs(phone: { brand: string; os: string | null }) {
  if (phone.brand.toLowerCase() === "apple") {
    return "ios";
  }

  if (phone.os?.toLowerCase().includes("ios")) {
    return "ios";
  }

  return "android";
}

function buildReasons(phone: {
  performanceScore: number | null;
  cameraScore: number | null;
  batteryScore: number | null;
  valueScore: number | null;
  aiSummary: string | null;
}) {
  const reasons: string[] = [];

  if ((phone.performanceScore ?? 0) >= 90) {
    reasons.push("Strong performance headroom for gaming and multitasking.");
  }
  if ((phone.cameraScore ?? 0) >= 90) {
    reasons.push("Camera profile stands out for photography-focused buyers.");
  }
  if ((phone.batteryScore ?? 0) >= 85) {
    reasons.push("Battery endurance is one of the stronger options in this shortlist.");
  }
  if ((phone.valueScore ?? 0) >= 55) {
    reasons.push("Pricing stays competitive relative to its performance tier.");
  }
  if (phone.aiSummary) {
    reasons.push(phone.aiSummary);
  }

  return reasons.slice(0, 3);
}

export async function recommendPhones(rawInput: unknown) {
  const input = recommendationSchema.parse(rawInput);
  const weights = normalizeWeights(input.priorities, input.useCase);

  const catalog = await listPhones({
    minPrice: input.minBudget,
    maxPrice: input.budget,
    minBattery: input.minBattery,
    minRam: input.minRam,
    take: 200
  });

  const phones = catalog.phones.filter((phone) =>
    input.brands.length ? input.brands.includes(phone.brand) : true
  );

  const ranked = phones
    .filter((phone) => input.osPreference === "any" || inferOs(phone) === input.osPreference)
    .map((phone) => {
      const personalizedScore =
        (phone.performanceScore ?? 0) * weights.performance +
        (phone.cameraScore ?? 0) * weights.camera +
        (phone.batteryScore ?? 0) * weights.battery +
        (phone.valueScore ?? 0) * weights.value;

      return {
        phone,
        personalizedScore: Number(personalizedScore.toFixed(2)),
        reasons: buildReasons(phone)
      };
    })
    .sort((a, b) => b.personalizedScore - a.personalizedScore)
    .slice(0, input.limit);

  return {
    weights,
    matches: ranked
  };
}
