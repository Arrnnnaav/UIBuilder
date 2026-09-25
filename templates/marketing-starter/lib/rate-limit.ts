// Fixed-window, per-key limiter kept in instance memory. On serverless this limits per
// warm instance, which is enough when paired with Turnstile on a contact form. Swap the
// store for Upstash/KV if a site ever needs a global limit.

type Window = { count: number; resetAt: number };

export function createRateLimiter({ limit, windowMs }: { limit: number; windowMs: number }) {
  const hits = new Map<string, Window>();

  return function check(key: string, now = Date.now()) {
    const current = hits.get(key);
    if (!current || current.resetAt <= now) {
      hits.set(key, { count: 1, resetAt: now + windowMs });
      if (hits.size > 10_000) {
        for (const [k, w] of hits) if (w.resetAt <= now) hits.delete(k);
      }
      return { ok: true, remaining: limit - 1, resetAt: now + windowMs };
    }
    current.count += 1;
    return {
      ok: current.count <= limit,
      remaining: Math.max(0, limit - current.count),
      resetAt: current.resetAt,
    };
  };
}
