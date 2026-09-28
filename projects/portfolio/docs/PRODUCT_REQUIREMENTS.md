# Portfolio product requirements

Product-manager delivery contract, reconciled 2026-09-28. Inputs: owner-approved
`PRODUCT.md`, `CONTENT_SOURCE.md`, `S4_CONTENT_CONTRACT.md`, `DESIGN.md`,
`WIREFRAMES.md`, current `STATE.md`, and D30 in `plan/DECISIONS.md`. This records
approved scope and grants no gate authority.

## Audience and outcome

Recruiters and engineering managers hiring backend/AI engineers are primary;
collaborators, hackathon judges and founders are secondary. In 60 seconds, the site
should make Arnav's positioning legible: fast, auditable systems with honest numbers.
Visitors can inspect source-backed work, contact Arnav, open GitHub or download his
resume. A timed reviewer session can test comprehension; analytics after launch cannot
prove hiring outcomes.

## Capability map

| ID | Approved capability | User outcome | Authoritative source |
|---|---|---|---|
| P01 | Home, Work, six case studies, About, Contact and Resume | Clear path from identity to evidence to contact | `PRODUCT.md`; `S4_CONTENT_CONTRACT.md` |
| P02 | Six flagship studies: Edge Node, Cited Researcher, LedgerBridge, GhostCursor, NeuroUX and StudyOS | Understand problem, role, approach, outcome and limits | `CONTENT_SOURCE.md`; public source snapshots |
| P03 | Evidence ledgers and source links | Audit every quantitative claim and caveat | `DESIGN.md`; `content/evidence/*.json`; G1 policy |
| P04 | Approved report visual language | Read on mobile/desktop and identify sourced results | `DESIGN.md`; `MOTION.md`; `WIREFRAMES.md` |
| P05 | Contact form and confirmed direct email | Start a conversation without losing form state | `WIREFRAMES.md`; owner-confirmed resume details |
| P06 | Resume PDF and accessible HTML resume | Recruiter can read and download owner material | Supplied resume; `PRODUCT.md` |
| P07 | Route SEO, Person identity, linked case-study schemas and answer-first FAQs | Crawlers and readers receive coherent factual information | `SEO_STRATEGY.md`; `AGENTS.md` section 6 |
| P08 | Editable growth files and BusinessOS manifest | Owner-approved maintenance cannot edit arbitrary source | `seo.manifest.json`; BusinessOS connector contract |
| P09 | Utility pages and recovery | Styleguide supports review; 404/error boundary recover | `WIREFRAMES.md` |
| P10 | Optional monitoring with clean no-op behavior | Observe visits/errors when configured | `AGENTS.md` sections 4/5 |
| P11 | Verified quality and launch handoff | Site is tested and ready to maintain | `AGENTS.md` G3 and S7 |

## Current delivery architecture

D30 selects Astro-generated static HTML for all 12 public content routes by default,
served through Next rewrites. Next remains for the same-origin contact API, response
headers, error handling and a rollback renderer (`PORTFOLIO_STATIC_PILOT=0`). The
static output is generated during `pnpm build`. This implementation preserves the
approved P01-P11 capabilities, design, content and SEO contract; it does not change
user-approved scope. The static default passes the current 12-route browser and
Lighthouse evidence. See `ACCEPTANCE.md`, `QA_REPORT.md`, `PERF_REPORT.md` and
D30 in `plan/DECISIONS.md`.

## Claim publication policy

- Edge Node: exact 5.356 s to 0.973 s, 50 latency requests, public benchmark source;
  preserve source precision in pages, FAQ, metadata, schema and `llms.txt`.
- LedgerBridge: 103,049 records, 5.114 s median (n=5), with environment/context;
  sealed benchmark consistency is not real-world accuracy.
- GhostCursor: README-reported 27/30 intent accuracy, bounded execution and test
  counts. Counts are repository reports, not fresh runs by UIBuilder.
- Cited Researcher: 152 s to 26 s remains pending-source and hidden; public
  architecture/README evidence may be described without that timing claim.
- NeuroUX: omit the mixed extrapolated text baseline; approximate video timing
  remains hardware-specific, with sample-size limits explicit.
- StudyOS: use contributor wording, no invented performance/hackathon outcome;
  live-demo status/link requires an observed uptime check.
- BusinessHQ and private repositories remain excluded until usable owner-approved
  public material exists. Dehurdle attribution is authorized by the current
  owner-supplied resume; LinkedIn, residence and hiring availability remain omitted
  until confirmed. Resume-provided email is confirmed.

## Constraints and non-goals

Keep the approved hybrid design, exact precision and restrained motion: no section
scroll reveals, one retract signature with reduced-motion fallback, token colors,
Archivo and literal-code-only Martian Mono. Use owner diagrams/content; no reference
assets or generic stock imagery. No marketing-site auth/database. Free personal
hosting is the target; custom domain is deferred. The provisional Vercel hostname is
configuration only until a deployment is observed.

Custom-domain purchase, new flagship projects, fabricated benchmark results and
automatically published BusinessOS edits are outside this approved build.
## Current delivery architecture

As of 2026-09-28, D30 selects Astro-generated static HTML for all 12 approved public content routes by default, with Next.js retaining the same-origin contact API, security headers, error handling, and rollback rendering. This is a delivery implementation of the approved product scope; it does not change user-visible capability requirements. See docs/STATE.md, docs/QA_REPORT.md, and plan/DECISIONS.md for current evidence and remaining S7 work.