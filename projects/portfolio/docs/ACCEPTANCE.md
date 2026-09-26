# Portfolio acceptance contract

Reviewed 2026-09-26 by product-manager. `incomplete` means integrated proof has
not been inspected; it does not imply another agent has stopped implementation.
The matrix supplements the complete AGENTS.md G3 and cannot waive any requirement.

| ID / capability | Observable acceptance | Owner | Verification / evidence | Status |
|---|---|---|---|---|
| A01 / P01 | All approved routes render their intended content and navigation reaches them, including six work slugs | frontend/ship | Production Playwright on every route in content/seo/routes.json; test-results and QA_REPORT.md | incomplete |
| A02 / P02 | Every case has problem, truthful role, approach, result, limitations, source links and relevant related studies | frontend/growth | Review six rendered case pages against CONTENT_SOURCE.md snapshots; QA_REPORT.md | incomplete |
| A03 / P03 | Only verified metrics render; each refers to an existing source; no pending-source timing appears in HTML, FAQ, schema, metadata or llms.txt | growth/ship | pnpm validate:content plus content-policy tests and rendered HTML/source review; GROWTH_REPORT.md | incomplete |
| A04 / P03 | Edge Node exact precision agrees everywhere; derived ratio/delta use approved rounding; LedgerBridge/NeuroUX caveats survive all summaries | growth/ship | Compare evidence JSON to route metadata/FAQ/llms/schema and production page text; GROWTH_REPORT.md | incomplete |
| A05 / P04 | Approved typography/grid/mark meaning work at 390px/1440px; reduced motion produces the final metric state; no raw colors outside tokens | design-director/ship | S5 VISUAL_REVIEW.md; pnpm lint:tokens; committed reviewed snapshots; Playwright motion check | incomplete |
| A06 / P05 | Form validates, focuses invalid field, keeps input on failures, shows busy/success states and offers confirmed mailto fallback | backend/ship | Unit tests for Zod/Turnstile/rate limits and Playwright with Turnstile test keys; QA_REPORT.md | incomplete |
| A07 / P05 | Production form either delivers through configured provider or clearly reports unavailable delivery, never fake success | backend/ship | Env/no-key unit tests and configured delivery evidence in DEPLOY.md/QA_REPORT.md | incomplete |
| A08 / P06 | PDF serves with correct MIME and download link; HTML résumé agrees with owner facts and G1 metric publication rule | frontend/ship | Request PDF, verify source checksum and rendered résumé/download action; QA_REPORT.md | incomplete |
| A09 / P07 | Every route appears in editable SEO data; unique appropriate metadata, canonical and OG; Person/WebSite identity coherent; valid JSON-LD | growth/ship | pnpm validate:content; production pnpm seo:audit <URL>; GROWTH_REPORT.md | incomplete |
| A10 / P07 | Answer-first FAQs match visible page answers and FAQPage data; sitemap/robots/llms.txt served; internal utilities excluded from index feeds | growth/ship | production seo:audit and endpoint/HTML checks; GROWTH_REPORT.md | incomplete |
| A11 / P08 | Manifest validates and editable paths remain limited; BusinessOS PR and separate publish approval are exercised | orchestrator/ship | Manifest validator; /connect report with actual connector/PR verification | incomplete |
| A12 / P09 | 404 returns 404 and useful recovery; error boundary renders and retry is exercised; utilities noindex | frontend/ship | Production Playwright Chromium/WebKit × 390/1440; QA_REPORT.md | incomplete |
| A13 / P10 | Missing Sentry/PostHog keys no-op; configured keys produce observed test error/pageview and contact tracking without private message data | backend/ship | No-key tests; observed provider receipt IDs when keys exist; QA_REPORT.md | incomplete |
| A14 / P11 | typecheck, eslint, production build and full high-level dependency audit pass | ship | pnpm typecheck; pnpm lint; pnpm build; pnpm audit --audit-level high, retained logs | incomplete |
| A15 / P11 | All pages/nav/contact/404/error tested at 390 and 1440 in Chromium and WebKit; no console/hydration errors | ship | pnpm test:e2e with four configured projects; retained test-results and QA_REPORT.md | incomplete |
| A16 / P11 | axe 0 serious/critical, keyboard navigation including menu/form works, AA contrast and reduced motion verified | ship | Automated axe plus focused keyboard/contrast/motion checks and QA_REPORT.md | incomplete |
| A17 / P11 | Lighthouse every category ≥90 on every page; LCP strictly <2500ms and CLS strictly <0.1 | ship | pnpm perf <production URL> covering required route set; PERF_REPORT.md and measured summary | incomplete |
| A18 / P11 | Security-review reports no high issues; CSP, Zod, rate-limit and client secret exclusion verified | ship/backend | SECURITY_REPORT.md plus audit and server/client boundary tests | incomplete |
| A19 / P11 | Actual deployment URL checked; all canonical/entity/PDF URLs match; custom domain left deferred | ship/growth | DEPLOY.md live URL and post-deploy endpoint/SEO smoke checks | incomplete |
| A20 / P11 | Launch video and /learn memory reflect delivered site and measured outcomes | ship/orchestrator | Playback-capable launch artifact; brain/builds/portfolio.json schema-valid memory | incomplete |

## Product review requiring judgment

A reviewer unfamiliar with the work reads home for 60 seconds and describes the
role, evidence discipline and next contact action. Record response and friction
in VISUAL_REVIEW.md; do not report a conversion improvement from this small check.
Indexing for the owner's name is a post-launch observation, not guaranteed by
metadata. Ranking, AI citations and hiring results are monitored outcomes, not
claims that a build gate can prove.

## Current evidence

G1/G2 owner approvals and source publication policy are documented in PRODUCT.md
and DESIGN.md. Source refresh and implementation contract are present. STATE.md
still records S4 interrupted and later stages pending. No integrated G3 run, live
deployment or completed delivery reports were inspected for this review; hence
all delivery acceptance items remain incomplete until exact evidence is supplied.
