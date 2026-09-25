# marketing-starter

The UIBuilder production starter for marketing sites: portfolios and company sites. Every
project in `projects/<slug>` is a copy of this template (`node scripts/new-project.mjs`).

It works with zero accounts. Each integration switches on when its env key is present (see
`.env.example`).

## Commands
| Command | What it does |
|---|---|
| `pnpm dev` | local dev server |
| `pnpm typecheck` / `pnpm lint` | tsc + eslint |
| `pnpm lint:tokens` | fails on raw colours outside `app/styles/tokens.css` |
| `pnpm validate:content` | checks the SEO contract files (runs before every build) |
| `pnpm test` | unit tests (Vitest) |
| `pnpm build` | production build (`NEXT_BUILD_CPUS=2` on low-memory machines) |
| `pnpm test:e2e` | Playwright: every page, a11y (axe), visual snapshots, contact form, 404, error boundary, headers; Chromium + WebKit at 390px and 1440px |
| `pnpm seo:audit [url]` | SEO/AEO/GEO audit of a running server. It uses the same rule codes as the BusinessOS dashboard |
| `pnpm perf [url]` | Lighthouse gate on a running server: every category ≥ 0.9, LCP < 2.5s, CLS < 0.1. Windows-safe |
| `pnpm lhci` | Lighthouse CI (used in GitHub Actions) |
| `pnpm check` | everything except perf |

## The SEO contract
All SEO data lives in data files. Code never holds it. BusinessOS edits only the paths listed in
`seo.manifest.json`, through an approved PR followed by a separate publish approval.

| File | Holds |
|---|---|
| `content/seo/routes.json` | title, description, canonical, robots and OG for every route |
| `content/schema/*.json` | JSON-LD (rendered on every page) |
| `content/faq/*.json` | answer-first FAQ blocks and their FAQPage JSON-LD |
| `public/llms.txt` | summary for LLMs |
| `content/seo/crawlers.json` | AI crawler allow/deny policy, which feeds `robots.txt` |

Adding a page requires three things: its entry in `routes.json`, `export const metadata = metadataFor("/route")` in the page, and a link from somewhere.

## Rules that matter
- Colours, spacing, type and motion come only from `tokens.css`. The design-director agent writes those from `DESIGN.md`.
- Never wrap content that can appear in the first viewport with `<Reveal>`, because it delays LCP.
- The CSP is static (so pages stay static). Add a host in `next.config.ts` only when a feature needs it.
- `CONTACT_DRY_RUN` and `E2E_ERROR_ROUTE` are for tests only. Never set them in production.

## Deploy
- **Vercel** (personal sites): import the repo. PR previews come automatically.
- **Cloudflare Workers** (commercial clients): add `@opennextjs/cloudflare`, then `wrangler.jsonc`, in the client's account. See `pipelines/company-site/PIPELINE.md` in UIBuilder.
