# S4 content contract

Shared file contract for the frontend and growth roles, 2026-09-26.
`DESIGN.md`, `MOTION.md`, `WIREFRAMES.md` and G1 evidence policy remain authoritative.

## Ownership

- growth: `content/**`, `public/llms.txt`, `seo.manifest.json`, content-source updates and growth handoff
- frontend: `app/**` except contact action, `components/**`, `lib/portfolio.ts` and frontend handoff
- orchestrator/backend: contact action, other `lib/**`, scripts/tests, QA, hosting and state
- platform: root scripts/CI and agent definitions; never edit portfolio UI or content

## Data

`content/portfolio.json` holds identity and editorial content:

- `name`, `role`, `positioning`, `bio` (string array), `location` (string or null),
  `email` (string or null), `github`, `linkedin` (string or null), `resumePath`
- `education`: `{ institution, degree, period }`
- `timeline`: `{ period, title, description, href? }[]`
- `skills`: `{ group, items: string[] }[]`
- `achievements`: string[]
- `moreWork`: `{ label, items: { name, url, description }[] }[]`
- `projects`: records with `slug`, `title`, `descriptor`, `year`, `role`, `repo`,
  `stack: string[]`, `summary`, `problem`, `approach: string[]`, `result`,
  `limits: string[]`, `figure: { type: "bars" | "flow" | "records", title,
  caption, steps?: string[] }`.

Each `content/evidence/<slug>.json` is `{ project: slug, sources, metrics }`:

- `sources`: `{ id: number, title: string, url: string }[]`
- `metrics`: `{ label, kind: "comparison" | "value" | "fact", before?: number,
  after?: number, value?: string, unit?: string, source: number,
  status: "verified" | "pending-source", caveat?: string }[]`
- Only verified metrics render. Every metric points to an existing source.
- Comparison values are literal source values; ratios/deltas are computed by UI.
- FAQ and llms.txt must use the same precision and caveats.

## Routes and SEO

Routes: `/`, `/work`, six `/work/<slug>` pages, `/about`, `/contact`, `/resume`,
and public indexable `/styleguide` (owner decision, 2026-09-26). The error-test
route remains noindex. Use existing SEO data format and FAQ format.
Person + WebSite replace Organization. Page-specific schema files may be read
through `jsonLdFor(route)` once integration is added by the orchestrator.
Shared schema filenames are `person.json` and `website.json` and are emitted
once by the root layout through `globalJsonLd()`. Route schema filenames are
`home.json` for `/`, otherwise path segments joined by `-` (for example
`work-edge-node.json`); optional companion files use `-breadcrumb.json` or
`-software.json`. `jsonLdFor(route)` emits only those three matching files.
The provisional site URL is `https://arnav-khandelwal.vercel.app`; it is a target,
not evidence of a deployed site. Adjust all canonical/entity URLs after the actual
deployment URL is known. Never guess a personal LinkedIn URL.

## Verification sequence

No concurrent production builds, browser suites or Lighthouse on this machine.
Agents may run focused checks; orchestrator runs the integrated build and G3.
All agents finish with schema-valid file handoffs.
