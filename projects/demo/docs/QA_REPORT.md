# QA report — demo starter

Status: G3 not passed. This run verifies the starter code and its default routes, not a client-ready site. Updated 2026-09-27.

## Passing checks

`node scripts/gate.mjs demo G3` passed typecheck, ESLint, token lint (26 files), content validation, 14 unit tests, high-severity dependency audit, production build, server startup, SEO audit with 0 high findings, 64/64 Playwright checks across Chromium/WebKit at 390px/1440px, axe checks, visual snapshots and snapshot byte checks.

## Remaining failures

- Full Lighthouse coverage now includes `/`, `/contact`, and the owner-approved indexable `/styleguide` in both profiles. Desktop all pass; mobile home/contact pass, but styleguide LCP is 2549ms against the strict <2500ms contract. Full medians: `docs/evidence/perf-g3-summary.json`.
- Root G3 evidence collection fails because `docs/G3_EVIDENCE.json` has not been completed. Human visual-review metadata and the required reviewed reports/security evidence are also not complete for this untouched starter.
- The SEO audit reports three low-severity `missing-sameas-entities` findings and zero high findings; identity values are intentionally placeholders in this scaffold.

Do not treat the test-key/error-fixture build created by Playwright as a deployable artifact. A later production build must be clean.
