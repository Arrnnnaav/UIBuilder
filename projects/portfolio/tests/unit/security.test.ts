import { describe, expect, it, vi } from "vitest";
import { createRateLimiter } from "@/lib/rate-limit";
import { verifyTurnstile } from "@/lib/turnstile";
import { contactInput } from "@/lib/contact-schema";
import { contactClientIp } from "@/lib/client-ip";

describe("trusted contact IP", () => {
  it("uses Vercel's overwritten IP and ignores a spoofed Cloudflare header", () => {
    expect(contactClientIp(new Headers({ "x-vercel-forwarded-for": "203.0.113.1", "cf-connecting-ip": "203.0.113.99" }), true)).toBe("203.0.113.1");
    expect(contactClientIp(new Headers({ "x-forwarded-for": "2001:db8::1" }), true)).toBe("2001:db8::1");
  });
  it("does not let malformed or untrusted forwarding headers create limiter keys", () => {
    expect(contactClientIp(new Headers({ "x-forwarded-for": "203.0.113.1, 203.0.113.2" }), true)).toBe("unknown");
    expect(contactClientIp(new Headers({ "cf-connecting-ip": "203.0.113.1" }), true)).toBe("unknown");
    expect(contactClientIp(new Headers({ "x-forwarded-for": "203.0.113.1" }), false)).toBe("unknown");
  });
});

describe("rate limiter", () => {
  it("caps active keys without discarding an existing sender's quota", () => {
    const check = createRateLimiter({ limit: 1, windowMs: 1000, maxKeys: 2 });
    expect(check("a", 0).ok).toBe(true);
    expect(check("b", 0).ok).toBe(true);
    expect(check("c", 1).ok).toBe(false);
    expect(check("a", 2).ok).toBe(false);
    expect(check("c", 1001).ok).toBe(true);
  });
  it("allows up to the limit then blocks until the window resets", () => {
    const check = createRateLimiter({ limit: 2, windowMs: 1000 });
    expect(check("ip", 0).ok).toBe(true);
    expect(check("ip", 10).ok).toBe(true);
    expect(check("ip", 20).ok).toBe(false);
    expect(check("other", 20).ok).toBe(true);
    expect(check("ip", 1001).ok).toBe(true);
  });
});

describe("turnstile", () => {
  it("rejects oversized tokens before sending them to the provider", async () => {
    const request = vi.fn();
    expect(await verifyTurnstile("x".repeat(2049), { secret: "s", isProd: true, fetchImpl: request })).toBe(false);
    expect(request).not.toHaveBeenCalled();
  });
  it("fails closed on HTTP errors even if the body claims success", async () => {
    const request = vi.fn(async () => new Response('{"success":true}', { status: 500 }));
    expect(await verifyTurnstile("t", { secret: "s", isProd: true, fetchImpl: request })).toBe(false);
  });
  it("aborts stalled verification within the configured deadline", async () => {
    const request: typeof fetch = vi.fn((_url, options) => new Promise<Response>((_resolve, reject) => {
      options?.signal?.addEventListener("abort", () => reject(new Error("aborted")), { once: true });
    }));
    expect(await verifyTurnstile("t", { secret: "s", isProd: true, fetchImpl: request })).toBe(false);
  }, 7000);
  it("skips verification without a secret outside production only", async () => {
    expect(await verifyTurnstile(null, { isProd: false })).toBe(true);
    expect(await verifyTurnstile(null, { isProd: true })).toBe(false);
  });

  it("rejects a missing token when a secret is set", async () => {
    expect(await verifyTurnstile(null, { secret: "s", isProd: true })).toBe(false);
  });

  it("returns the siteverify result", async () => {
    const ok = vi.fn(async () => new Response(JSON.stringify({ success: true })));
    const bad = vi.fn(async () => new Response(JSON.stringify({ success: false })));
    expect(await verifyTurnstile("t", { secret: "s", isProd: true, fetchImpl: ok })).toBe(true);
    expect(await verifyTurnstile("t", { secret: "s", isProd: true, fetchImpl: bad })).toBe(false);
  });

  it("fails closed when siteverify is unreachable", async () => {
    const down = vi.fn(async () => {
      throw new Error("network");
    });
    expect(await verifyTurnstile("t", { secret: "s", isProd: true, fetchImpl: down })).toBe(false);
  });
});

describe("contact input", () => {
  it("accepts a valid message and rejects bad input", () => {
    expect(contactInput.safeParse({ name: "Ada", email: "ada@example.com", message: "Hello there, a project." }).success).toBe(true);
    expect(contactInput.safeParse({ name: "A", email: "nope", message: "short" }).success).toBe(false);
  });

  it("rejects a filled honeypot", () => {
    const r = contactInput.safeParse({ name: "Bot", email: "b@x.io", message: "spam spam spam", company: "x" });
    expect(r.success).toBe(false);
  });
});
