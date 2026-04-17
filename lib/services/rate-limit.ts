export class RateLimitError extends Error {
  status = 429;
}

declare global {
  // eslint-disable-next-line no-var
  var rateLimitBuckets: Map<string, number[]> | undefined;
}

const buckets = global.rateLimitBuckets ?? new Map<string, number[]>();

if (!global.rateLimitBuckets) {
  global.rateLimitBuckets = buckets;
}

export function enforceRateLimit(key: string, maxRequests: number, windowMs: number) {
  const now = Date.now();
  const existing = buckets.get(key) ?? [];
  const valid = existing.filter((timestamp) => timestamp > now - windowMs);

  if (valid.length >= maxRequests) {
    throw new RateLimitError("Rate limit exceeded.");
  }

  valid.push(now);
  buckets.set(key, valid);
}
