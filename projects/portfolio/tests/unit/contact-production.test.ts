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
