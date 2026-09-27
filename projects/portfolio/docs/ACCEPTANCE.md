# Portfolio acceptance contract

Evidence reconciliation by product-manager, 2026-09-28 (latest QA evidence reviewed).
This contract follows the
owner-approved G1/G2 scope and supplements `AGENTS.md`; it cannot waive a gate or
change the G3 thresholds. Statuses below reflect retained evidence available on
2026-09-28, rather than artifact existence alone.

Status meanings: **verified** means the named evidence demonstrates the criterion;
**incomplete** means required evidence or behavior is still missing; **blocked**
means work cannot proceed without a stated external decision or access.

## G3 acceptance

| ID / capability | Observable acceptance | Owner | Verification / evidence | Status |
|---|---|---|---|---|
| A01 / P01 | All approved public routes render intended content and navigation reaches them, including six work slugs. | frontend/ship | `docs/QA_REPORT.md`; `docs/evidence/e2e-final.txt` (Chromium/WebKit, 390/1440, all 12 public routes). | **verified** — 194 passed, 2 expected desktop-only skips on 2026-09-28. |
| A02 / P02 | Each case study presents problem, truthful role, approach, sourced result, limitations, links and related studies. | frontend/growth | `docs/GROWTH_REPORT.md`; `docs/VISUAL_REVIEW.md`; `docs/evidence/content-review.json`; source snapshots under `content/evidence/`. | **verified** — six studies; 10 public-source-verified metrics and one pending-source metric; no unsupported Cited Researcher timing is published. |
| A03 / P03 | Only source-backed metrics render; pending-source metrics stay out of page content, FAQs, schema, metadata and `llms.txt`. | growth/ship | `docs/GROWTH_REPORT.md`; `docs/evidence/content-review.json`; `docs/evidence/e2e-final.txt`. | **verified** — content review reports zero errors and confirms the visible-metric filter; the pending metric remains hidden. |
| A04 / P03 | Exact Edge Node precision and approved derivations agree across summaries; LedgerBridge and NeuroUX caveats remain attached. | growth/ship | `docs/GROWTH_REPORT.md`; `docs/evidence/content-review.json`; case source snapshots. | **verified** — reviewed precision and caveats are recorded; metrics remain attributed to public sources, not claimed as rerun here. |
| A05 / P04 | Approved typography, grid and figure meaning work at 390/1440; reduced motion shows final metric state; no raw colors escape tokens. | design-director/ship | `docs/VISUAL_REVIEW.md`; `docs/evidence/snapshot-review.json`; `docs/evidence/e2e-final.txt`; `pnpm lint:tokens` result in `docs/QA_REPORT.md`. | **verified** — 48 reviewed snapshots; reduced-motion browser scenario and token lint are recorded. |
| A06 / P05 | Contact form validates, reports errors accessibly, retains a direct email route, and completes the configured test flow. | backend/ship | `docs/QA_REPORT.md`; `docs/evidence/e2e-final.txt`; contact/security unit tests in `docs/evidence/unit-integration.txt`. | **verified** — browser and unit coverage passes using the configured test flow. |
| A07 / P05 | Under production-mode, non-dry-run settings with no mail provider, the contact action does not report success and returns a clear direct-email fallback; the isolated E2E dry-run success is never mistaken for real delivery. | backend/ship | `tests/unit/contact-production.test.ts`; `docs/evidence/contact-production-test.txt`; `components/contact/ContactForm.tsx`; `docs/evidence/e2e-final.txt`. | **verified** — production-mode test with `CONTACT_DRY_RUN=0`, no Resend key/address and a successful Turnstile stub asserts an error containing the confirmed email and that Resend is never constructed (1/1 passed). The UI exposes action errors as an alert; live sending remains a separate release condition (A22). |
| A08 / P06 | Owner PDF download serves a PDF with correct MIME; HTML résumé agrees with owner facts and the G1 publication rule. | frontend/growth/ship | `docs/evidence/e2e-final.txt` (HTTP 200, PDF MIME and `%PDF-` signature); `docs/evidence/content-review.json` (source checksum); rendered résumé review in `docs/QA_REPORT.md`. | **verified** — fresh full matrix asserts response MIME and PDF signature; source checksum and G1 content review report zero errors. |
| A09 / P07 | Every route has editable, unique metadata/canonical/OG; Person/WebSite identity is coherent; JSON-LD validates. | growth/ship | `docs/GROWTH_REPORT.md`; `docs/evidence/content-review.json`; production `pnpm seo:audit` result in `docs/QA_REPORT.md`. | **verified** — 12 public indexable routes, 30 schema files, zero content-review errors, zero SEO audit findings. |
| A10 / P07 | Answer-first FAQs agree with visible page answers and FAQPage data; sitemap, robots and `llms.txt` are served; only internal test routes are excluded. | growth/ship | `docs/GROWTH_REPORT.md`; `docs/evidence/content-review.json`; `docs/evidence/e2e-final.txt`; `content/seo/routes.json`. | **verified** — full matrix checks all 11 visible FAQ sets against FAQPage JSON-LD, sitemap routes against canonical URLs, robots policy and `llms.txt` route coverage. `/styleguide` is public/indexable; `/e2e-error` is internal/noindex and excluded from index feeds. |
| A11 / P08 | SEO manifest validates and editable paths remain limited to the approved SEO data contract. | growth/orchestrator | `seo.manifest.json`; `docs/evidence/content-review.json`; content validation result in `docs/QA_REPORT.md`. | **verified** — manifest/data consistency is included in the zero-error content review. |
| A12 / P09 | 404 returns HTTP 404 with recovery; error-boundary route renders and retry works; only `/e2e-error` is noindex and omitted from sitemap/crawler feeds. | frontend/ship | `docs/evidence/e2e-final.txt`; `content/seo/routes.json`; `content/seo/crawlers.json`; `docs/GROWTH_REPORT.md`. | **verified** — route/browser and indexing policy evidence recorded. `/styleguide` remains indexable by owner decision. |
| A13 / P10 | Missing Sentry/PostHog keys no-op cleanly; if production keys are configured, verify real provider receipts without sending private contact data. | backend/ship | `docs/SECURITY_REPORT.md`; `docs/evidence/security-review.json`; unit test output in `docs/evidence/unit-integration.txt`. | **verified for no-key behavior** — tests prove no-op. Live receipt is conditional and remains unverified until keys are configured; no receipt is claimed. |
| A14 / P11 | Typecheck, lint, production build and high-severity dependency audit pass. | ship | `docs/QA_REPORT.md`; `docs/evidence/build-final.txt`; `docs/evidence/security-audit.txt`. | **verified** — retained reports record successful commands. |
| A15 / P11 | Every public page, nav, contact, 404 and error flow passes at 390/1440 in Chromium and WebKit, without console/hydration errors. | ship | `docs/QA_REPORT.md`; `docs/evidence/e2e-final.txt`. | **verified** — 198 passed, 2 expected desktop-only skips, zero failures. |
| A16 / P11 | axe reports zero serious/critical issues; keyboard navigation, AA contrast and reduced motion are verified. | ship/design-director | `docs/QA_REPORT.md`; `docs/evidence/e2e-final.txt`; `e2e/contrast.spec.ts`; four `docs/evidence/contrast-audit-*.json` outputs (12 routes × light/dark × Chromium/WebKit × desktop/mobile); `docs/DESIGN.md` contrast matrix matching `app/styles/tokens.css`. | **verified** — axe reports no violations for text contrast; the test also checks calculated token ratios at ≥4.5:1 for text and ≥3:1 for the border. It retains axe's unscored/incomplete pseudo-element and SVG background nodes in the reports for transparency. Keyboard and reduced-motion scenarios pass. |
| A17 / P11 | Lighthouse categories are at least 90 on every public route; LCP is strictly below 2500ms and CLS strictly below 0.1. | ship | `docs/PERF_REPORT.md`; `docs/evidence/perf-final-summary.json`; `docs/evidence/perf-lcp-investigation.md`. | **incomplete** — all desktop routes pass; every mobile route misses LCP at 2555–2857ms. Experiments found no design-preserving fix. Do not change the threshold or throttle settings. |
| A18 / P11 | Security review has no high findings; CSP, Zod validation, rate limiting, secret boundaries and dependency audit are verified against the current clean production candidate. | ship/backend | `docs/SECURITY_REPORT.md`; `docs/evidence/security-review.json`; `docs/evidence/security-audit.txt`; `docs/evidence/security-runtime.txt`. | **verified** — source review, tests and fresh dependency audit report no high issues; the clean production scan after the final build passes all checks, including zero credential matches across 33 client/public files. |

## S7 release and maintenance acceptance

These criteria remain required for the overall launch handoff, but they are **after G3** and must not be used to blur or waive G3 status.

| ID / capability | Observable acceptance | Owner | Verification / evidence | Status |
|---|---|---|---|---|
| A19 / P11 | Actual deployment URL is reachable; canonical, entity, sitemap, robots and PDF URLs match the observed deployment; custom domain remains deferred. | ship/growth | `docs/DEPLOY.md` with live URL and post-deploy endpoint/SEO smoke checks. | **incomplete** — there is no observed deployment; the Vercel hostname remains provisional. |
| A20 / P11 | Launch video is playable and `/learn` memory records the delivered site and measured outcomes. | ship/orchestrator | Launch artifact and schema-valid `brain/builds/portfolio.json`. | **incomplete** — neither delivered-site artifact nor build memory is recorded. |
| A21 / P08 | BusinessOS connection is exercised against the deployed portfolio, with the editable-path boundary, owner-approved PR and separate publish approval demonstrated. | orchestrator/ship | `/connect` report and actual connector/PR evidence. | **incomplete** — the local connector contract exists; real-site dogfood requires a deployed site and owner GitHub PAT/approvals. |
| A22 / P05, P10 | Before enabling real contact delivery or telemetry on the deployed site, configure only owner-controlled production credentials, keep test/dry-run flags out of release, and verify real provider receipts for any telemetry keys that are enabled. If mail delivery is not configured, retain a clear direct-email fallback; if monitoring keys are absent, the tested no-op behavior is acceptable. | backend/ship | Deployed environment review and post-deploy contact/provider smoke evidence in `docs/DEPLOY.md` / `docs/QA_REPORT.md`. | **unavailable until release configuration** — no deployed environment or live provider credentials are evidenced. This is not a G3 blocker; the G3 no-provider behavior test remains A07. |

## Product outcome check

A reviewer unfamiliar with the work reads the home page for 60 seconds and describes
Arnav's role, evidence discipline and contact action. Record the response and friction
in `VISUAL_REVIEW.md`; do not infer conversion or hiring improvements from this small
check. Search ranking, AI citations and hiring outcomes are monitored after launch,
not guaranteed by metadata or a passing build gate.

## Evidence-based current disposition

G1 and G2 are approved. Static content, SEO data, design review, core build and the
current browser matrix have substantial passing evidence. G3 is **not passed**:
mobile LCP fails A17. A18 security checks now pass against the clean local production candidate.
A07 is verified by the production-mode no-provider test; A08 and A10 by the
2026-09-28 browser matrix; A16 by the contrast audit and design evidence. S7 deployment, configured
real delivery/telemetry and BusinessOS/launch work remain separate release tasks;
without configured telemetry keys, live receipts are unavailable and are not a G3
blocker. See `STATE.md`, `QA_REPORT.md`, `PERF_REPORT.md`, `GROWTH_REPORT.md` and
`SECURITY_REPORT.md` for the source reports.
