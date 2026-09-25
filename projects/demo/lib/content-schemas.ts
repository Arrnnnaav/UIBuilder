import { z } from "zod";

// Schemas for the SEO contract files. The same rules are enforced by
// scripts/validate-content.mjs and by BusinessOS before it opens a PR.

export const robotsValue = z.enum(["index,follow", "noindex,follow", "index,nofollow", "noindex,nofollow"]);

export const routeMeta = z.object({
  title: z.string().min(10).max(70),
  description: z.string().min(50).max(160),
  canonical: z.string().startsWith("/"),
  robots: robotsValue,
  og: z
    .object({
      title: z.string().max(90).optional(),
      description: z.string().max(200).optional(),
      image: z.string().optional(),
    })
    .optional(),
});
export const routesFile = z.record(z.string().startsWith("/"), routeMeta);
export type RouteMeta = z.infer<typeof routeMeta>;

export const crawlersFile = z.object({
  default: z.boolean(),
  bots: z.record(z.string(), z.boolean()),
  disallowPaths: z.array(z.string().startsWith("/")),
});
export type CrawlerPolicy = z.infer<typeof crawlersFile>;

export const faqFile = z.object({
  route: z.string().startsWith("/"),
  items: z
    .array(
      z.object({
        q: z.string().min(8).max(160),
        a: z.string().min(80).max(1200),
      }),
    )
    .min(1),
});
export type FaqFile = z.infer<typeof faqFile>;

export const jsonLd = z
  .object({
    "@context": z.literal("https://schema.org"),
    "@type": z.union([z.string(), z.array(z.string())]),
  })
  .passthrough();

export const siteFile = z.object({
  name: z.string().min(1),
  shortName: z.string().min(1),
  url: z.string().url(),
  locale: z.string(),
  description: z.string().min(20).max(200),
  email: z.string().email(),
  socials: z.record(z.string(), z.string()),
});
