interface RateLimitRecord {
  count: number;
  resetAt: number;
}

declare global {
  // eslint-disable-next-line no-var
  var _rateLimitStore: Map<string, RateLimitRecord> | undefined;
}

const store: Map<string, RateLimitRecord> =
  global._rateLimitStore || (global._rateLimitStore = new Map());

/**
 * In-memory sliding window rate limiter suitable for serverless / single instances.
 * 5 requests per 10 minutes per IP.
 */
export function checkRateLimit(
  ip: string,
  limit = 5,
  windowMs = 10 * 60 * 1000
): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const record = store.get(ip);

  // Clean old entries periodically
  if (store.size > 10000) {
    for (const [key, val] of store.entries()) {
      if (val.resetAt < now) store.delete(key);
    }
  }

  if (!record || record.resetAt < now) {
    store.set(ip, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1 };
  }

  if (record.count >= limit) {
    return { allowed: false, remaining: 0 };
  }

  record.count += 1;
  return { allowed: true, remaining: limit - record.count };
}
