import { afterEach, expect, it, vi } from "vitest";

const turnstile = vi.hoisted(() => ({ verify: vi.fn(async () => true) }));
const resend = vi.hoisted(() => ({ constructor: vi.fn() }));
vi.mock("@/lib/turnstile", () => ({ verifyTurnstile: turnstile.verify }));
vi.mock("next/headers", () => ({ headers: async () => new Headers({ "x-vercel-forwarded-for": "203.0.113.8" }) }));
vi.mock("resend", () => ({ Resend: resend.constructor }));

afterEach(() => {
  vi.unstubAllEnvs();
  vi.clearAllMocks();
  vi.resetModules();
});

it("never reports success when production email delivery is unconfigured", async () => {
  vi.stubEnv("NODE_ENV", "production");
  vi.stubEnv("CONTACT_DRY_RUN", "0");
  vi.stubEnv("RESEND_API_KEY", "");
  vi.stubEnv("CONTACT_TO_EMAIL", "");
  vi.stubEnv("CONTACT_FROM_EMAIL", "");
  vi.stubEnv("TURNSTILE_SECRET_KEY", "");
  turnstile.verify.mockResolvedValue(true);

  const { submitContact } = await import("../../app/actions/contact");
  const form = new FormData();
  form.set("name", "Ada Lovelace");
  form.set("email", "ada@example.com");
  form.set("message", "Please contact me about a backend engineering role.");
  form.set("cf-turnstile-response", "verified-test-token");

  const result = await submitContact({ status: "idle" }, form);

  expect(result.status).toBe("error");
  if (result.status === "error") {
    expect(result.message).toContain("Email is not configured");
    expect(result.message).toContain("arnavkhandelwal446@gmail.com");
  }
  expect(resend.constructor).not.toHaveBeenCalled();
});

it("returns a retry window after the configured sender limit", async () => {
  vi.stubEnv("NODE_ENV", "production");
  vi.stubEnv("RATE_LIMIT_PER_MINUTE", "1");
  vi.stubEnv("CONTACT_DRY_RUN", "1");
  vi.stubEnv("TURNSTILE_SECRET_KEY", "test-secret");
  turnstile.verify.mockResolvedValue(true);

  const { processContactSubmission } = await import("../../lib/submit-contact");
  const form = new FormData();
  form.set("name", "Ada Lovelace");
  form.set("email", "ada@example.com");
  form.set("message", "Please contact me about a backend engineering role.");
  form.set("cf-turnstile-response", "verified-test-token");
  const headers = new Headers({ "x-vercel-forwarded-for": "203.0.113.8" });

  expect((await processContactSubmission(form, headers)).statusCode).toBe(200);
  const limited = await processContactSubmission(form, headers);

  expect(limited.statusCode).toBe(429);
  expect(limited.state).toEqual({ status: "error", message: "Too many messages. Try again in a minute." });
  expect(limited.retryAfter).toBeGreaterThan(0);
  expect(limited.retryAfter).toBeLessThanOrEqual(60);
  expect(turnstile.verify).toHaveBeenCalledOnce();
});

it("fails closed when Turnstile rejects a message", async () => {
  vi.stubEnv("NODE_ENV", "production");
  vi.stubEnv("CONTACT_DRY_RUN", "0");
  vi.stubEnv("TURNSTILE_SECRET_KEY", "test-secret");
  turnstile.verify.mockResolvedValue(false);

  const { processContactSubmission } = await import("../../lib/submit-contact");
  const form = new FormData();
  form.set("name", "Ada Lovelace");
  form.set("email", "ada@example.com");
  form.set("message", "Please contact me about a backend engineering role.");
  form.set("cf-turnstile-response", "invalid-test-token");

  const result = await processContactSubmission(form, new Headers());

  expect(result.statusCode).toBe(200);
  expect(result.state).toEqual({ status: "error", message: "Verification failed. Refresh and try again." });
  expect(resend.constructor).not.toHaveBeenCalled();
});

it("returns provider failures without exposing their details", async () => {
  vi.stubEnv("NODE_ENV", "production");
  vi.stubEnv("CONTACT_DRY_RUN", "0");
  vi.stubEnv("TURNSTILE_SECRET_KEY", "test-secret");
  vi.stubEnv("RESEND_API_KEY", "re_test_key");
  vi.stubEnv("CONTACT_TO_EMAIL", "owner@example.com");
  turnstile.verify.mockResolvedValue(true);
  const send = vi.fn(async () => ({ error: { name: "ProviderSecretError" } }));
  resend.constructor.mockImplementation(function MockResend() {
    return { emails: { send } };
  });

  const { processContactSubmission } = await import("../../lib/submit-contact");
  const form = new FormData();
  form.set("name", "Ada Lovelace");
  form.set("email", "ada@example.com");
  form.set("message", "Please contact me about a backend engineering role.");
  form.set("cf-turnstile-response", "verified-test-token");

  const result = await processContactSubmission(form, new Headers());

  expect(result.statusCode).toBe(502);
  expect(result.state).toEqual({ status: "error", message: "Could not send right now. Write to arnavkhandelwal446@gmail.com instead." });
});
