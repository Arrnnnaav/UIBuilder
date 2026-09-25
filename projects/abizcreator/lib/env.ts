import { z } from "zod";

// Frontend-only site: public, build-time env only. Missing keys disable the feature.
const clientSchema = z.object({
  NEXT_PUBLIC_POSTHOG_KEY: z.string().optional(),
  NEXT_PUBLIC_POSTHOG_HOST: z.string().url().default("https://us.i.posthog.com"),
});

const blankToUndefined = (source: Record<string, string | undefined>) =>
  Object.fromEntries(Object.entries(source).map(([k, v]) => [k, v === "" ? undefined : v]));

// NEXT_PUBLIC_* must be referenced literally so Next inlines them into the client bundle.
export const clientEnv = clientSchema.parse(
  blankToUndefined({
    NEXT_PUBLIC_POSTHOG_KEY: process.env.NEXT_PUBLIC_POSTHOG_KEY,
    NEXT_PUBLIC_POSTHOG_HOST: process.env.NEXT_PUBLIC_POSTHOG_HOST,
  }),
);
