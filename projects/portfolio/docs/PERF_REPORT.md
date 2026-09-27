# Portfolio performance report

Status: G3 performance requirement not met. Full clean production matrix completed 2026-09-27.

## Full route coverage

Command: `PERF_RUNS=3 pnpm perf -- http://localhost:3400`.
Result: exit 1 only because mobile LCP exceeds the strict 2500ms limit. Complete route/profile medians are retained in `docs/evidence/perf-final-summary.json`.

- Desktop: 12/12 routes pass. Performance/accessibility/best-practices/SEO/agentic-browsing ≥98; LCP 525–601ms; CLS 0.
- Mobile: 0/12 routes pass the full performance gate. Category scores: performance 94–97, accessibility/best-practices/SEO/agentic-browsing 100, CLS 0. LCP range 2561–2768ms.
- Every category meets the 90-point requirement. LCP is the sole measured performance blocker. Do not alter Lighthouse throttling or thresholds.

Mobile medians by route:

| Route | Performance | LCP | CLS |
|---|---:|---:|---:|
| `/` | 95 | 2719ms | 0 |
| `/work` | 97 | 2570ms | 0 |
| `/work/edge-node` | 96 | 2724ms | 0 |
| `/work/cited-researcher` | 96 | 2721ms | 0 |
| `/work/ledgerbridge` | 96 | 2718ms | 0 |
| `/work/ghostcursor` | 96 | 2718ms | 0 |
| `/work/neuroux` | 96 | 2619ms | 0 |
| `/work/studyos` | 97 | 2624ms | 0 |
| `/about` | 97 | 2571ms | 0 |
| `/contact` | 97 | 2589ms | 0 |
| `/resume` | 97 | 2561ms | 0 |
| `/styleguide` | 94 | 2768ms | 0 |

## Prior measured experiments

Removing Zod from the shared analytics client boundary, batching observer DOM writes, narrowing serialized footer props and separating the static footer from its route-aware CTA were each implemented and verified for their own goals. Home/mobile medians after successive rounds ranged from 2557 to 2710ms; the latest complete run confirms that LCP still fails across all mobile routes. Disabling root prefetch/native same-page anchor did not show a reliable LCP gain. An isolated font-subset experiment halved the font transfer but left LCP at 2703ms, so it was reverted to preserve approved typography.

Lighthouse's earlier local trace identifies the hero H1 as the home LCP element, with 166ms element render delay; one trace estimates ~29KiB of unused JavaScript and ~154ms render-blocking CSS. The current full run used a clean production build, with no E2E Turnstile key and the error fixture returning 404. These are clues, not proven single-cause fixes. Desktop and real-browser visual checks pass. Further changes should be based on tracing the shared mobile render path and remeasured across all routes.

No deployed real-user measurements exist. Production field behavior, configured monitoring receipts, and deployment remain unverified.
