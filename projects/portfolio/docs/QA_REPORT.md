# Portfolio QA report

Status: current browser/runtime checks pass; G3 remains pending on the mobile Lighthouse LCP contract and remaining security/accessibility evidence. Updated 2026-09-28.

## Production build and local runtime

- `pnpm build` → exit 0 on the clean production configuration. Build output: `docs/evidence/build-final.txt`.
- `SEO_AUDIT_URL=http://localhost:3400 pnpm seo:audit` → 0 findings, 0 high.
- The normal build does not contain E2E-only Turnstile keys or the intentional error route. Playwright builds a separate test artifact; do not deploy that artifact.

## Browser matrix

Command: `CI=1 E2E_PORT=3104 pnpm test:e2e` (configured production test build, two workers; `CI=1` ensures a fresh server).
Result: exit 0; 194 passed, 2 expected desktop-only mobile-menu skips; zero failures. Coverage: Chromium and WebKit at 390px and 1440px; all 12 public routes; metadata, console errors, axe, committed visual snapshots, keyboard navigation, mobile dialog focus, contact validation/submission, 404, error boundary, security headers, exact PDF MIME/signature, all 11 FAQ visible/schema pairs, sitemap/canonical parity, robots and `llms.txt`. The measured-work in-page anchor passes keyboard activation. Full retained summary: `docs/evidence/e2e-final.txt`.

No serious or critical axe findings were reported. Desktop menu focus-containment is intentionally skipped where the mobile dialog is not available.

## Lighthouse matrix

`PERF_RUNS=3 pnpm perf -- http://localhost:3400` covered all 12 public routes in desktop and mobile profiles. Results: `docs/evidence/perf-final-summary.json`.

- Desktop: all 12 routes pass; every category score is at least 98; LCP 525–598ms; CLS 0.
- Mobile: all 12 routes pass accessibility, best-practices, SEO, agentic-browsing and CLS (0). Performance is 0.96–0.97. Every route misses the strict LCP <2500ms threshold: LCP 2555–2857ms.
- Therefore the performance contract and G3 are not passed. Keep the current Lighthouse settings and threshold unchanged. The largest impact is shared across mobile pages; investigate the common rendering/font/CSS path before page-specific polish.

## Other checks

- `pnpm test` → 34/34 passed.
- `pnpm lint`, `pnpm lint:tokens` (46 files), `pnpm typecheck` → exit 0.
- Runtime SEO audit on the clean production server → 0 findings / 0 high (`SEO_AUDIT_URL=http://localhost:3400 pnpm seo:audit`).
- Fresh production rebuild 2026-09-28 (`NEXT_BUILD_CPUS=2 pnpm build`) → exit 0. `node scripts/seo-audit.mjs http://localhost:3401` → 0 findings / 0 high; robots, sitemap and `llms.txt` returned 200 and `/e2e-error` returned 404.
- GitHub Site source quality and Platform contracts workflows pass on commit `0e9cc98` for portfolio, demo and ABizCreator.

The E2E-only test keys/error fixture were absent from the clean production build: `/contact` included no Turnstile key/script and `/e2e-error` returned 404. The form test used the official Turnstile test keys and `CONTACT_DRY_RUN`; real sender delivery, deployment, monitoring receipts, and BusinessOS dogfood remain unverified; see STATE.md.
