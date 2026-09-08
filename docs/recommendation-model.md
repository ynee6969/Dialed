# DeviceIQ recommendation model

## Audited implementation before the refactor

The recommendation endpoint queried phones using price, battery, and RAM filters, then filtered brands and operating system in `lib/services/recommendations.ts`. It combined persisted 0–100 `performanceScore`, `cameraScore`, `batteryScore`, and `valueScore` values with fixed weights. A selected use case silently replaced the submitted priorities, and the result contained only a personalized score plus heuristic reasons. There was no normalized criterion breakdown, explicit eligibility result, or sensitivity analysis.

The old catalog `valueScore` was calculated as `performance / price`, which counted Performance again when both criteria were aggregated.

## Canonical implementation after the refactor

The active recommendation path is:

```text
request preferences and constraints
  -> validate explicit weights
  -> filter eligible phones
  -> normalize Performance, Camera, Battery, and Value
  -> calculate S_j = Σ(w_i × r_ij)
  -> rank deterministically
  -> return score contributions and applied constraints
```

The criteria are centralized in `lib/recommendation/criteria.ts`. Stored 0–100 benefit scores are converted to `[0, 1]`. Value is a cost criterion normalized from price within the eligible set: the lowest eligible price scores 1 and the highest scores 0. This removes the old Performance/Value double-counting while keeping the initial four criteria manageable.

Weights must be non-negative and sum to 1. Explicit `weights` (or the backwards-compatible `priorities` field) always win. Use-case presets are defaults only when the user does not provide weights.

AI enrichment remains responsible for extracting and structuring phone data. It does not provide weights, calculate final recommendation scores, or determine ranking.

`lib/recommendation/sensitivity.ts` provides eight small perturbation scenarios (each criterion increased and decreased by a configurable step) and proportionally redistributes the remaining weight so the total remains 1.
