import { describe, expect, it, vi } from "vitest";
import { createRateLimiter } from "@/lib/rate-limit";
import { verifyTurnstile } from "@/lib/turnstile";
import { contactInput } from "@/lib/contact-schema";

describe("rate limiter", () => {
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
