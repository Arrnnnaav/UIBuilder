# Portfolio acceptance contract

Evidence reconciliation by product-manager, 2026-09-28 (D30 static hybrid candidate; current-source evidence reviewed). This contract follows owner-approved G1/G2 scope and supplements `AGENTS.md`; it cannot waive a gate or change G3 thresholds.

Status meanings: **verified** means named current evidence demonstrates the criterion; **incomplete** means required behavior or evidence is missing; **unavailable** means evidence depends on a post-G3 release configuration or external access.

## G3 acceptance

| ID / capability | Observable acceptance | Owner | Verification / evidence | Status |
|---|---|---|---|---|
| A01 / P01 | All approved public routes render intended content and navigation reaches them, including six work slugs. | frontend/ship | `docs/QA_REPORT.md`; `docs/evidence/e2e-static-candidate-current-2026-09-28.txt`. | **verified** - default static candidate: 202 passed, 2 expected desktop-only skips; all 12 public routes and navigation paths resolve in Chromium/WebKit at 390/1440. |
| A02 / P02 | Each case study presents problem, truthful role, approach, sourced result, limitations, links and related studies. | frontend/growth | `docs/GROWTH_REPORT.md`; `docs/VISUAL_REVIEW.md`; `docs/evidence/content-review.json`; source snapshots under `content/evidence/`. | **verified** - six studies; ten public-source-verified metrics and one pending-source metric; no unsupported Cited Researcher timing is published. |
| A03 / P03 | Only source-backed metrics render; pending-source metrics stay out of page content, FAQs, schema, metadata and `llms.txt`. | growth/ship | `docs/GROWTH_REPORT.md`; `docs/evidence/content-review.json`; `docs/evidence/e2e-static-candidate-current-2026-09-28.txt`. | **verified** - content review confirms visible-metric filtering and the pending metric remains hidden. |
| A04 / P03 | Exact Edge Node precision and approved derivations agree across summaries; LedgerBridge and NeuroUX caveats remain attached. | growth/ship | `docs/GROWTH_REPORT.md`; `docs/evidence/content-review.json`; case source snapshots. | **verified** - reviewed precision and caveats are recorded and attributed to public sources. |
| A05 / P04 | Approved typography, grid and figure meaning work at 390/1440; reduced motion shows final metric state; no raw colors escape tokens. | design-director/ship | `docs/VISUAL_REVIEW.md`; `docs/evidence/snapshot-review.json`; `docs/evidence/e2e-static-candidate-current-2026-09-28.txt`; `docs/QA_REPORT.md`. | **verified** - visual comparisons, reduced-motion scenario and token lint are recorded. New static Windows baselines are present locally; Linux static baseline/remote CI validation is follow-up work, not a G3 blocker. |
| A06 / P05 | Contact form validates, reports errors accessibly, retains a direct email route, and completes the configured test flow. | backend/ship | `docs/QA_REPORT.md`; `docs/evidence/e2e-static-candidate-current-2026-09-28.txt`; current `pnpm test` (46/46). | **verified** - default static form submits to the shared Next API; browser and unit coverage includes same-origin enforcement, content type/body size, accessible validation, rate limiting and test submission. |
| A07 / P05 | Under production mode, non-dry-run settings with no mail provider, the contact action does not report success and returns a clear direct-email fallback. | backend/ship | `tests/unit/contact-production.test.ts`; `docs/evidence/contact-production-test.txt`; `lib/submit-contact.ts`; `app/actions/contact.ts`; current `pnpm test` (46/46). | **verified** - production-mode test uses `CONTACT_DRY_RUN=0`, no Resend key/address and successful Turnstile verification; it asserts direct-email fallback and no Resend construction. Live delivery is a separate S7 condition (A22). |
| A08 / P06 | Owner PDF download serves a PDF with correct MIME; HTML resume agrees with owner facts and G1 publication rule. | frontend/growth/ship | `docs/evidence/e2e-static-candidate-current-2026-09-28.txt`; `docs/evidence/content-review.json`; `docs/QA_REPORT.md`. | **verified** - browser matrix asserts MIME and PDF signature; source checksum and G1 content review report zero errors. |
| A09 / P07 | Every route has editable, unique metadata/canonical/OG; Person/WebSite identity is coherent; JSON-LD validates. | growth/ship | `docs/GROWTH_REPORT.md`; `docs/evidence/content-review.json`; `docs/evidence/seo-audit-current-2026-09-28.txt`. | **verified** - 12 public indexable routes, 30 schema files, zero content-review errors and zero SEO audit findings. |
| A10 / P07 | Answer-first FAQs agree with visible page answers and FAQPage data; sitemap, robots and `llms.txt` are served; only internal test routes are excluded. | growth/ship | `docs/GROWTH_REPORT.md`; `docs/evidence/content-review.json`; `docs/evidence/e2e-static-candidate-current-2026-09-28.txt`; `content/seo/routes.json`. | **verified** - matrix checks all 11 visible FAQ sets against schema, sitemap/canonical parity, robots and `llms.txt`. `/styleguide` is public/indexable; `/e2e-error` is internal/noindex and excluded. |
| A11 / P08 | SEO manifest validates and editable paths remain limited to approved SEO data contract. | growth/orchestrator | `seo.manifest.json`; `docs/evidence/content-review.json`; `docs/QA_REPORT.md`. | **verified** - manifest/data consistency is included in the zero-error content review. |
| A12 / P09 | 404 returns HTTP 404 with recovery; error-boundary route renders and retry works; only `/e2e-error` is noindex and omitted from sitemap/crawler feeds. | frontend/ship | `docs/evidence/e2e-static-candidate-current-2026-09-28.txt`; `content/seo/routes.json`; `content/seo/crawlers.json`. | **verified** - route and indexing policy checks pass; `/styleguide` remains indexable by owner decision. |
| A13 / P10 | Missing Sentry/PostHog keys no-op cleanly; if production keys are configured, verify real provider receipts without private contact data. | backend/ship | `docs/SECURITY_REPORT.md`; `docs/evidence/security-review.json`; `docs/QA_REPORT.md`. | **verified for no-key behavior** - tests prove no-op. Live receipt is conditional and unavailable until keys are configured; no receipt is claimed. |
| A14 / P11 | Typecheck, lint, production build and high-severity dependency audit pass. | ship | `docs/QA_REPORT.md`; `docs/evidence/build-static-candidate-2026-09-28.txt`; `docs/evidence/security-audit.txt`. | **verified** - typecheck, lint, token lint, content validation, 46 unit tests, default production build and dependency audit pass. |
| A15 / P11 | Every public page, nav, contact, 404 and error flow passes at 390/1440 in Chromium and WebKit without console/hydration errors. | ship | `docs/QA_REPORT.md`; `docs/evidence/e2e-static-candidate-current-2026-09-28.txt`; `e2e/__snapshots__/win32/*-static-pilot/`. | **verified** - default candidate passes 202 checks with 2 expected skips across all profiles; checks confirm no Next page scripts and no console errors. Static Windows snapshots exist in the worktree; Linux baseline/remote CI portability validation is a follow-up, not a G3 blocker. |
| A16 / P11 | axe reports zero serious/critical issues; keyboard navigation, AA contrast and reduced motion are verified. | ship/design-director | `docs/QA_REPORT.md`; `docs/evidence/e2e-static-candidate-current-2026-09-28.txt`; `e2e/contrast.spec.ts`; `docs/evidence/contrast-audit-*.json`; `docs/DESIGN.md`. | **verified** - no serious/critical axe findings; token ratios pass at >=4.5:1 text and >=3:1 borders; keyboard and reduced-motion scenarios pass. Incomplete axe nodes are retained transparently in evidence. |
| A17 / P11 | Lighthouse categories are at least 90 on every public route; LCP <2500ms and CLS <0.1. | ship | `docs/PERF_REPORT.md`; `docs/evidence/perf-astro-static-current-2026-09-28.json`; `.txt`. | **verified** - clean default static candidate passes all 12 desktop/mobile routes; mobile LCP 1356-1359ms, desktop 327-329ms, all categories 100, and every measured CLS <0.1. The Next rollback renderer is not the default. |
| A18 / P11 | Security review has no high findings; CSP, Zod validation, rate limiting, secret boundaries and dependency audit are verified against current clean production candidate. | ship/backend | `docs/SECURITY_REPORT.md`; `docs/evidence/security-review.json`; `docs/evidence/security-audit.txt`; `docs/evidence/security-runtime-current-2026-09-28.txt`; current contact API and unit tests. | **verified** - clean build runtime checks pass, `/contact` has no test widget, `/e2e-error` is 404, no-Origin API request is 403, generated public/client scan finds zero credential patterns, audit reports no known vulnerabilities, and 46 unit tests pass. |

## S7 release and maintenance acceptance

These criteria remain for the overall launch handoff and are downstream of G3.

| ID / capability | Observable acceptance | Owner | Verification / evidence | Status |
|---|---|---|---|---|
| A19 / P11 | Actual deployment URL is reachable; canonical, entity, sitemap, robots and PDF URLs match observed deployment; custom domain remains deferred. | ship/growth | `docs/evidence/live-preview-check-2026-09-28.md` with live URL and post-deploy endpoint/SEO smoke checks. | **incomplete** - protected preview is reachable and its SEO audit passes; canonical/entity URLs still target the provisional hostname, and the preview is noindex. |
| A20 / P11 | Launch video is playable and `/learn` memory records delivered site and measured outcomes. | ship/orchestrator | Launch artifact and schema-valid `brain/builds/portfolio.json`. | **incomplete** - measured build memory exists; launch video and owner rating/qualitative feedback remain pending. |
| A21 / P08 | BusinessOS connection is exercised against deployed portfolio, with editable-path boundary, owner-approved PR and separate publish approval demonstrated. | orchestrator/ship | `/connect` report and actual connector/PR evidence. | **incomplete** - read-only branch health/snapshot is verified; real-site PR/publish flow needs default-branch integration and owner GitHub approvals. |
| A22 / P05, P10 | Before enabling real contact delivery or telemetry on deployed site, configure owner-controlled credentials and verify receipts for enabled providers. If mail is not configured, retain direct-email fallback; absent monitoring keys may use tested no-op behavior. | backend/ship | Deployed environment review and post-deploy smoke evidence in `docs/evidence/live-preview-check-2026-09-28.md` / `docs/QA_REPORT.md`. | **unavailable until release configuration** - the protected preview has no mail/monitoring provider credentials or delivery receipts. Not a G3 blocker; A07 verifies no-provider behavior. |

## Architecture decision

D30 selects Astro-generated static HTML for all 12 public content routes by default,
served through Next rewrites. Next remains responsible for the contact API, response
headers, error handling and rollback rendering (`PORTFOLIO_STATIC_PILOT=0`). Static
output is generated during `pnpm build`. This delivery architecture preserves P01-P11,
the approved content and design; it does not expand product scope.

## Product outcome check

A reviewer unfamiliar with the work reads the home page for 60 seconds and describes
Arnav's role, evidence discipline and contact action. Record response and friction in
`VISUAL_REVIEW.md`; do not infer conversion or hiring improvements from this small
check. Search ranking, AI citations and hiring outcomes are monitored after launch.

## Current disposition

G1 and G2 are approved. Current evidence covers build, 46 unit tests, 202 E2E checks
with 2 expected skips, SEO (zero findings), security, and all-route Lighthouse. G3 is
**satisfied** for the D30 default static hybrid candidate, as recorded in `STATE.md`
and `QA_REPORT.md`. A07, A17 and A18 are verified. Linux static snapshot baseline and
remote CI portability validation remain follow-up work, not G3 blockers. S7 deployment,
owner-controlled provider configuration/receipts, BusinessOS connection, launch video
and `/learn` remain pending; custom domain is deferred.
