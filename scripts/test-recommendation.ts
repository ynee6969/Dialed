import assert from "node:assert/strict";

import { DEFAULT_WEIGHTS, sumWeights } from "@/lib/recommendation/criteria";
import { normalizePhoneCriteria } from "@/lib/recommendation/normalization";
import { calculateWeightedScore, validateWeights } from "@/lib/recommendation/scoring";
import { analyzeWeightSensitivity } from "@/lib/recommendation/sensitivity";

const phones = [
  { id: "cheap", price: 100, performanceScore: 80, cameraScore: 70, batteryScore: 90 },
  { id: "premium", price: 200, performanceScore: 90, cameraScore: 90, batteryScore: 80 }
];
const normalized = normalizePhoneCriteria(phones);

assert.ok((normalized.get("cheap")?.value ?? 0) > (normalized.get("premium")?.value ?? 0));
assert.equal(
  calculateWeightedScore(normalized.get("cheap")!, DEFAULT_WEIGHTS).overall,
  0.835
);
assert.equal(sumWeights(DEFAULT_WEIGHTS), 1);
assert.throws(
  () => validateWeights({ performance: 0.5, camera: 0.2, battery: 0.2, value: 0.2 }),
  /sum to exactly 1/
);

const sensitivity = analyzeWeightSensitivity(
  [...normalized.entries()].map(([id, normalizedScores]) => ({ id, normalizedScores })),
  DEFAULT_WEIGHTS,
  0.1
);
assert.equal(sensitivity.scenarios.length, 8);
for (const scenario of sensitivity.scenarios) {
  assert.ok(Math.abs(sumWeights(scenario.weights) - 1) < 0.000001);
  assert.ok(scenario.weights.performance >= 0);
}

console.log("Recommendation domain tests passed.");
