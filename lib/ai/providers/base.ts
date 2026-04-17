export const extractionPrompt = `Extract smartphone specifications into structured JSON format including chipset, GPU, display, camera system, battery, charging, OS, release date, and benchmark indicators if available.

Return ONLY valid JSON using these keys:
{
  "display": "string | null",
  "chipset": "string | null",
  "gpu": "string | null",
  "ram": "number | null",
  "storage": "number | null",
  "camera_main": "number | null",
  "camera_ultrawide": "number | null",
  "battery": "number | null",
  "charging": "number | null",
  "os": "string | null",
  "release_year": "number | null",
  "release_date": "ISO date string | null",
  "benchmark_score": "number | null",
  "ai_summary": "short one sentence summary | null"
}`;
