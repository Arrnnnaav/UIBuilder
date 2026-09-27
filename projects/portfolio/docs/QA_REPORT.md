# Portfolio QA report

Status: browser/runtime checks pass; G3 remains pending on the mobile Lighthouse LCP contract and remaining deployment/handoff gates. Updated 2026-09-27.

## Production build and local runtime

- `pnpm build` → exit 0 on the clean production configuration. Build output: `docs/evidence/build-final.txt`.
- `SEO_AUDIT_URL=http://localhost:3400 pnpm seo:audit` → 0 findings, 0 high.
- The normal build does not contain E2E-only Turnstile keys or the intentional error route. Playwright builds a separate test artifact; do not deploy that artifact.

## Browser matrix

Command: `pnpm test:e2e` (configured production test build, two workers).
Result: exit 0; 190 passed, 2 expected desktop-only mobile-menu skips; zero failures. Coverage: Chromium and WebKit at 390px and 1440px; 12 published routes; metadata, console errors, axe, committed visual snapshots, keyboard navigation, mobile dialog focus, contact validation/submission, 404, error boundary, security headers and SEO assets. The new measured-work in-page anchor passes keyboard activation. Full retained summary: `docs/evidence/e2e-final.txt`.

No serious or critical axe findings were reported. Desktop menu focus-containment is intentionally skipped where the mobile dialog is not available.

## Lighthouse matrix

`PERF_RUNS=3 pnpm perf -- http://localhost:3400` covered all 12 public routes in desktop and mobile profiles. Results: `docs/evidence/perf-final-summary.json`.

- Desktop: all 12 routes pass; performance, accessibility, best-practices, SEO and agentic-browsing scores are at least 98; LCP 525–601ms; CLS 0.
- Mobile: all 12 routes pass accessibility, best-practices, SEO, agentic-browsing and CLS (0). Performance is 0.94–0.97. Every route misses the strict LCP <2500ms threshold: LCP 2561–2768ms.
- Therefore the performance contract and G3 are not passed. Keep the current Lighthouse settings and threshold unchanged. The largest impact is shared across mobile pages; investigate the common rendering/font/CSS path before page-specific polish.

## Other checks

- `pnpm test` → 34/34 passed.
- `pnpm lint`, `pnpm lint:tokens` (46 files), `pnpm typecheck` → exit 0.
- Runtime SEO audit on the clean production server → 0 findings / 0 high (`SEO_AUDIT_URL=http://localhost:3400 pnpm seo:audit`).
- GitHub Site source quality and Platform contracts workflows pass on commit `0e9cc98` for portfolio, demo and ABizCreator.

The E2E-only test keys/error fixture were absent from this measured production build: `/contact` included no Turnstile key/script and `/e2e-error` returned 404. Deployment, real provider monitoring receipts, and the BusinessOS dogfood flow have not been verified; see STATE.md.
