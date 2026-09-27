# Performance report — demo starter

Status: G3 performance gate not passed. Full three-run route/profile matrix completed 2026-09-27 against the clean build.

| Route | Profile | Performance | SEO | LCP | CLS | Result |
|---|---|---:|---:|---:|---:|---|
| `/` | Desktop | 100 | 100 | 455ms | 0 | Pass |
| `/contact` | Desktop | 100 | 100 | 444ms | 0 | Pass |
| `/styleguide` | Desktop | 100 | 100 | 565ms | 0 | Pass |
| `/` | Mobile | 94 | 100 | 1838ms | 0 | Pass |
| `/contact` | Mobile | 95 | 100 | 1678ms | 0 | Pass |
| `/styleguide` | Mobile | 95 | 100 | 2549ms | 0 | Fail: LCP must be <2500ms |

All accessibility and best-practices scores were 100 and 96 respectively; all agentic-browsing scores were 100. Summary output: `docs/evidence/perf-g3-summary.json`.

The script now includes noindex routes in G3 performance coverage and uses the strict LCP boundary (`>=2500ms` fails). The styleguide is indexable and allowed in robots.txt per the owner’s policy. Further work: trace and reduce styleguide mobile LCP by at least 50ms, then rerun the full gate; do not tune the threshold or throttling.
