// Backward-compatible service boundary for enrichment and catalog seeding.
// The canonical scoring implementation lives in lib/recommendation/raw-scoring.ts.
export {
  clampScore,
  computeBatteryScore,
  computeCameraScore,
  computeFinalScore,
  computeValueScore,
  deriveSeedScores,
  estimatePerformanceFromChipset
} from "@/lib/recommendation/raw-scoring";
export type { ScoreBreakdown } from "@/lib/recommendation/raw-scoring";
