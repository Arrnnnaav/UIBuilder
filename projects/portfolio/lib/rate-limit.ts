// Fixed-window, per-key limiter kept in instance memory. On serverless this limits per
// warm instance only. Turnstile is independent abuse protection, not a distributed
// quota. A shared store or edge limit is required for a deployment-wide quota.

type Window = { count: number; resetAt: number };

export function createRateLimiter({ limit, windowMs, maxKeys = 10_000 }: { limit: number; windowMs: number; maxKeys?: number }) {
  if (!Number.isSafeInteger(limit) || limit < 1 || !Number.isFinite(windowMs) || windowMs <= 0 || !Number.isSafeInteger(maxKeys) || maxKeys < 1) {
    throw new Error("Invalid rate limiter configuration");
  }
  const hits = new Map<string, Window>();

  return function check(key: string, now = Date.now()) {
    const current = hits.get(key);
    if (!current || current.resetAt <= now) {
      if (!current && hits.size >= maxKeys) {
        for (const [k, w] of hits) if (w.resetAt <= now) hits.delete(k);
        // Fail closed for new keys instead of evicting active windows, which would
        // let rotating addresses reset an existing sender's limit.
        if (hits.size >= maxKeys) return { ok: false, remaining: 0, resetAt: now + windowMs };
      }
      hits.set(key, { count: 1, resetAt: now + windowMs });
      return { ok: true, remaining: limit - 1, resetAt: now + windowMs };
    }
    current.count = Math.min(limit + 1, current.count + 1);
    return {
      ok: current.count <= limit,
      remaining: Math.max(0, limit - current.count),
      resetAt: current.resetAt,
    };
  };
}
