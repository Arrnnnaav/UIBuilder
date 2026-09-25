# M2 — marketing-starter template

**Goal:** a production-grade Next.js starter that every site copies. The infra, security, SEO
contract and tests are wired once so projects don't redo them.

## Contents
- Next.js App Router, TypeScript strict, Tailwind v4, shadcn/ui base, Motion, Zod
- `app/styles/tokens.css` for the design tokens, `/styleguide` route, and `npm run lint:tokens` (flags raw hex/rgb outside tokens)
- Security headers and CSP in `next.config.ts`; `lib/env.ts` validates env with Zod
- `app/error.tsx`, `app/not-found.tsx`, `app/global-error.tsx`
- SEO contract:
  - `content/seo/routes.json`, `content/seo/crawlers.json`, `content/schema/*.json`, `content/faq/*.json`
  - `lib/seo.ts` (`metadataFor(route)`), `components/seo/JsonLd.tsx`, `components/seo/Faq.tsx`
  - `app/sitemap.ts`, `app/robots.ts`, `public/llms.txt`, `seo.manifest.json`
- Contact form: server action + Zod + Turnstile verification + in-memory/Upstash-optional per-IP rate limit + Resend (all optional via env; without keys it no-ops safely)
- Optional analytics and errors: PostHog (cookieless) and Sentry, switched on via env
- `scripts/seo-audit.mjs`: the same rule codes as the BusinessOS auditor (R7), run against the built site
- Tests: Vitest unit tests (seo lib, rate limit, schemas); Playwright e2e + axe + visual snapshots; `lighthouserc.json`
- `.github/workflows/ci.yml`: typecheck, lint, unit, build, e2e, lhci, audit
- Deploy configs: Vercel (zero config) and `wrangler.jsonc` + `open-next.config.ts` for Cloudflare

## Done when
On a fresh copy in scratch, `pnpm i && pnpm typecheck && pnpm lint && pnpm test && pnpm build && pnpm test:e2e && pnpm seo:audit` is all green, and Lighthouse on `pnpm start` is ≥ 90.
