# Portfolio performance report

Status: G3 performance requirement not met. Full clean production matrix completed 2026-09-28.

## Full route coverage

Command (PowerShell): `$env:PERF_RUNS='3'; pnpm perf -- http://localhost:3410` (three-run median; clean production build; all public routes and profiles).
Result: exit 1 only because mobile LCP exceeds the strict 2500ms limit. The fresh run finished 2026-09-28 local time (2026-09-27T23:37Z). Complete route/profile medians are retained in `docs/evidence/perf-final-summary.json`; command output is `docs/evidence/perf-run-final.txt`.

- Desktop: 12/12 routes pass. All category scores are at least 0.98; LCP 525–598ms; CLS 0.
- Mobile: 0/12 routes pass the full performance gate. Performance scores are 0.96–0.97; all other category scores are at least 0.98; CLS 0. LCP range 2558–2857ms.
- Every category meets the 90-point requirement. LCP is the sole measured performance blocker. Do not alter Lighthouse throttling or thresholds.

Mobile medians by route:

| Route | Performance | LCP | CLS |
|---|---:|---:|---:|
| `/` | 96 | 2709ms | 0 |
| `/work` | 97 | 2558ms | 0 |
| `/work/edge-node` | 96 | 2707ms | 0 |
| `/work/cited-researcher` | 96 | 2707ms | 0 |
| `/work/ledgerbridge` | 96 | 2706ms | 0 |
| `/work/ghostcursor` | 96 | 2707ms | 0 |
| `/work/neuroux` | 96 | 2707ms | 0 |
| `/work/studyos` | 96 | 2706ms | 0 |
| `/about` | 97 | 2559ms | 0 |
| `/contact` | 97 | 2558ms | 0 |
| `/resume` | 97 | 2558ms | 0 |
| `/styleguide` | 96 | 2857ms | 0 |

## Prior measured experiments

Removing Zod from the shared analytics client boundary, batching observer DOM writes, narrowing serialized footer props and separating the static footer from its route-aware CTA were each implemented and verified for their own goals. Home/mobile medians after successive rounds ranged from 2557 to 2710ms; the latest complete run confirms that LCP still fails across all mobile routes. Disabling root prefetch/native same-page anchor did not show a reliable LCP gain. An isolated font-subset experiment halved the font transfer but left LCP at 2703ms, so it was reverted to preserve approved typography.

Lighthouse's earlier local trace identifies the hero H1 as the home LCP element, with 166ms element render delay; one trace estimates ~29KiB of unused JavaScript and ~154ms render-blocking CSS. The current full run used a clean production build, with no E2E Turnstile key and the error fixture returning 404. These are clues, not proven single-cause fixes. Desktop and real-browser visual checks pass. Further changes should be based on tracing the shared mobile render path and remeasured across all routes.

The 2026-09-28 trace review found observed LCP around 171ms for the home page, but simulated LCP at 2706ms; Lighthouse's simulated value is about 1.8 seconds after FCP across routes even though raw text element render delay is 120–220ms. A temporary Next.js experimental `inlineCss` build was tested on mobile `/`, `/work`, `/work/edge-node` and `/styleguide`: medians were 2682, 2679, 2706 and 2724ms respectively, and none passed. Raw results: `docs/evidence/perf-inline-css-experiment.json`. Results were inconsistent versus the baseline; the experimental config was reverted. Compare observed and simulated traces before making another speculative CSS change.

The final investigation is in `docs/evidence/perf-lcp-investigation.md`. Three-run tests of `content-visibility:auto` and Archivo `font-display: optional` did not lower the representative route medians. Blocking the shared React/Next chunk made three sampled templates fall below 2500ms but caused client runtime errors, so it is diagnostic only and was not accepted. No source change from those probes remains.

No deployed real-user measurements exist. Production field behavior, configured monitoring receipts, and deployment remain unverified.
