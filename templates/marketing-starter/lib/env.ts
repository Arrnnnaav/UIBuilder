import { z } from "zod";

// Server env. Every integration is optional: missing keys disable the feature instead of
// crashing, so a fresh clone builds and tests with zero accounts.
const serverSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  RESEND_API_KEY: z.string().optional(),
  CONTACT_TO_EMAIL: z.string().email().optional(),
  CONTACT_FROM_EMAIL: z.string().optional(),
  TURNSTILE_SECRET_KEY: z.string().optional(),
  SENTRY_DSN: z.string().url().optional(),
  // Test-only: accept contact messages without sending email. Never set in production.
  CONTACT_DRY_RUN: z.enum(["0", "1"]).default("0"),
  RATE_LIMIT_PER_MINUTE: z.coerce.number().int().positive().default(5),
});

const clientSchema = z.object({
  NEXT_PUBLIC_TURNSTILE_SITE_KEY: z.string().optional(),
  NEXT_PUBLIC_POSTHOG_KEY: z.string().optional(),
  NEXT_PUBLIC_POSTHOG_HOST: z.string().url().default("https://us.i.posthog.com"),
  NEXT_PUBLIC_SENTRY_DSN: z.string().url().optional(),
});

const blankToUndefined = (source: Record<string, string | undefined>) =>
  Object.fromEntries(Object.entries(source).map(([k, v]) => [k, v === "" ? undefined : v]));

export const serverEnv = () => serverSchema.parse(blankToUndefined(process.env));

// NEXT_PUBLIC_* must be referenced literally so Next inlines them into the client bundle.
export const clientEnv = clientSchema.parse(
  blankToUndefined({
    NEXT_PUBLIC_TURNSTILE_SITE_KEY: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
    NEXT_PUBLIC_POSTHOG_KEY: process.env.NEXT_PUBLIC_POSTHOG_KEY,
    NEXT_PUBLIC_POSTHOG_HOST: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
  }),
);
