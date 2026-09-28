# Portfolio performance report

Status: the default static hybrid candidate passes the full G3 performance contract. The retained Next-rendered fallback still misses mobile LCP. Measurements are three-run Lighthouse medians with the committed thresholds unchanged.

## Current clean production candidate: static HTML with Next API

Command: `$env:PERF_RUNS='3'; pnpm perf -- http://localhost:3436` against a clean build with Astro static pages and Next rewrites enabled; no test keys or dry-run flags.
Result: exit 0; all 24 route/profile combinations pass. Full output and JSON: `docs/evidence/perf-astro-static-current-2026-09-28.txt` and `docs/evidence/perf-default-static-current-2026-09-28.json`.

- Desktop: 12/12 routes pass; all categories score 100; LCP 327–330ms; CLS 0–0.026.
- Mobile: 12/12 routes pass; all categories score 100; LCP 1357–1359ms; CLS 0.001–0.035.
- Compared with Next rendering, mobile LCP improves by about 1.2–1.5 seconds on every route. The contact page keeps its same-origin Next API, validation, rate limit and optional Turnstile/Resend configuration.

Mobile medians by route on the current candidate:

| Route | Performance | LCP | CLS |
|---|---:|---:|---:|
| `/` | 100 | 1358ms | 0.001 |
| `/work` | 100 | 1357ms | 0.001 |
| `/work/edge-node` | 100 | 1356ms | 0.001 |
| `/work/cited-researcher` | 100 | 1358ms | 0.001 |
| `/work/ledgerbridge` | 100 | 1358ms | 0.002 |
| `/work/ghostcursor` | 100 | 1358ms | 0.001 |
| `/work/neuroux` | 100 | 1358ms | 0.002 |
| `/work/studyos` | 100 | 1358ms | 0.002 |
| `/about` | 100 | 1359ms | 0.001 |
| `/contact` | 100 | 1356ms | 0.001 |
| `/resume` | 100 | 1357ms | 0.002 |
| `/styleguide` | 100 | 1358ms | 0.001 |

## Authenticated deployed preview observation

One Lighthouse run per route/device profile was collected from the protected
Vercel preview on 2026-09-28. Performance scores were 0.92–1.00 desktop and
0.94–1.00 mobile; accessibility and best-practices were 1.00. LCP measured
277–352ms desktop and 856–1,244ms mobile; CLS was ≤0.026 desktop and ≤0.035
mobile. The 24-row output is `docs/evidence/live-preview-lighthouse-one-run-2026-09-28.json`.

The full preview Lighthouse command exited non-zero because Vercel adds
`X-Robots-Tag: noindex` to previews and protects direct requests. Lighthouse's
SEO score was 0.58 and agentic-browsing 0.50–0.67; the page-level live SEO
audit, run with a temporary bypass header, found zero issues. These preview-only
crawlability results are not evidence about a future public production host.
The preview is deliberately protected while the owner defers a stable public
hostname. See `docs/evidence/live-preview-check-2026-09-28.md`.

## Next-rendered fallback comparison

The clean Next-rendered fallback matrix remains useful for comparison. It passes desktop but misses the strict mobile LCP requirement on all routes; it is no longer the default candidate. Results: `docs/evidence/perf-current-summary-2026-09-28.json` and `docs/evidence/perf-current-2026-09-28.txt`.

- Desktop: 12/12 routes pass; LCP 521–604ms; CLS 0.
- Mobile: 0/12 routes pass; performance 96–97, LCP 2555–2858ms; CLS 0.

## Prior measured experiments

Removing Zod from the shared analytics client boundary, batching observer DOM writes, narrowing serialized footer props and separating the static footer from its route-aware CTA were each implemented and verified for their own goals. Home/mobile medians after successive rounds ranged from 2557 to 2710ms; the latest complete run confirms that LCP still fails across all mobile routes. Disabling root prefetch/native same-page anchor did not show a reliable LCP gain. An isolated font-subset experiment halved the font transfer but left LCP at 2703ms, so it was reverted to preserve approved typography.

Lighthouse's earlier local trace identifies the hero H1 as the home LCP element, with 166ms element render delay; one trace estimates ~29KiB of unused JavaScript and ~154ms render-blocking CSS. The current full run used a clean production build, with no E2E Turnstile key and the error fixture returning 404. These are clues, not proven single-cause fixes. Desktop and real-browser visual checks pass. Further changes should be based on tracing the shared mobile render path and remeasured across all routes.

The 2026-09-28 trace review found observed LCP around 171ms for the home page, but simulated LCP at 2706ms; Lighthouse's simulated value is about 1.8 seconds after FCP across routes even though raw text element render delay is 120–220ms. A temporary Next.js experimental `inlineCss` build was tested on mobile `/`, `/work`, `/work/edge-node` and `/styleguide`: medians were 2682, 2679, 2706 and 2724ms respectively, and none passed. Raw results: `docs/evidence/perf-inline-css-experiment.json`. Results were inconsistent versus the baseline; the experimental config was reverted. Compare observed and simulated traces before making another speculative CSS change.

The final investigation is in `docs/evidence/perf-lcp-investigation.md`. Three-run tests of `content-visibility:auto` and Archivo `font-display: optional` did not lower the representative route medians. Blocking the shared React/Next chunk made three sampled templates fall below 2500ms but caused client runtime errors, so it is diagnostic only and was not accepted. No source change from those probes remains.

A 2026-09-28 native-shell probe moved the shared nav and footer behavior to server markup plus a deferred vanilla script and omitted analytics when no key was set. Its 3-run mobile medians were 2709ms for `/about` and `/resume`; the shared 232KB raw Next/React root chunk remained in the HTML. Keyboard, fallback, route-state and hydration checks passed, but the Lighthouse sample showed no gain, so the implementation was reverted. Details: `docs/evidence/perf-native-shell-experiment.json` and `docs/evidence/perf-lcp-investigation.md`.

A bounded Astro 7 static HTML pilot for `/resume` emitted the existing page content and SEO metadata without Next/React runtime scripts. Its three mobile Lighthouse runs had a 1356ms median LCP, 0.002 CLS, and scores of 100 in performance, accessibility, best practices, and SEO. Playwright and axe confirmed the page and PDF at 390px and 1440px; a first-fold screenshot comparison matched the fresh production Next build. This is architecture evidence for one route only: it does not meet G3's full route, contact action, navigation, security-header, or deployment requirements. The prototype's mobile `<details>` navigation also does not yet reproduce the approved dialog interaction. Evidence and scope: `docs/evidence/perf-astro-resume-pilot.md` and `docs/evidence/perf-astro-resume-pilot.json`.

The same pilot was temporarily hosted from the portfolio's Next production server by copying the generated HTML and hashed assets to `public/` and using a `beforeFiles` rewrite for `/resume`. The route returned CSP headers, loaded CSS, emitted no Next chunk scripts, and measured 1355ms median mobile LCP. `/contact` continued to use the existing Next page and form with its client runtime. The test config and copied output were removed; the repo does not yet automate this packaging. This validates the hybrid hosting mechanism for one route, not the full architecture. Evidence: `docs/evidence/perf-astro-next-rewrite-pilot.json`.

No deployed real-user measurements exist. Production field behavior, configured monitoring receipts, and deployment remain unverified.
