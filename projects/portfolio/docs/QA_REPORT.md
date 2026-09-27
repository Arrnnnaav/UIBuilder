# Portfolio QA report

Status: current browser and clean-production security checks pass; G3 remains pending on mobile Lighthouse LCP. Production no-provider contact fallback is covered by a production-mode action test. Updated 2026-09-28.

## Production build and local runtime

- `pnpm build` → exit 0 on the clean production configuration. Build output: `docs/evidence/build-final.txt`.
- `SEO_AUDIT_URL=http://localhost:3400 pnpm seo:audit` → 0 findings, 0 high.
- The normal build does not contain E2E-only Turnstile keys or the intentional error route. Playwright builds a separate test artifact; do not deploy that artifact.

## Browser matrix

Command: `$env:CI='1'; $env:E2E_PORT='3104'; pnpm test:e2e -- --reporter=line` (Playwright production test build, two workers).
Result: exit 0; 198 passed, 2 expected desktop-only mobile-menu skips; zero failures (200 total). Coverage: Chromium and WebKit at 390px and 1440px; all 12 public routes; metadata, console errors, axe, committed visual snapshots, keyboard navigation, mobile dialog focus, contact validation/submission, 404, error boundary, security headers, exact PDF MIME/signature, all 11 FAQ visible/schema pairs, sitemap/canonical parity, exact configured robots policy and `llms.txt`. The measured-work in-page anchor passes keyboard activation. Full retained summary: `docs/evidence/e2e-final.txt`.

No serious or critical axe findings were reported. Desktop menu focus-containment is intentionally skipped where the mobile dialog is not available.

### Explicit AA contrast audit

Command: `$env:CI='1'; $env:E2E_SKIP_BUILD='1'; $env:E2E_PORT='3104'; $env:CONTRAST_EVIDENCE='1'; pnpm test:e2e -- e2e/contrast.spec.ts --reporter=line --retries=0`.
Result: exit 0; four browser/viewport profiles passed. Each checked 12 public routes in light and dark color schemes (96 route/theme/profile cases). Axe reported zero text-contrast violations. Computed design-token pairs passed at ≥4.5:1 for text and ≥3:1 for borders; the minimum text ratio was 6.17:1 and the minimum border ratio was 3.63:1. Raw per-case results are in `docs/evidence/contrast-audit-*.json`.

Axe retains incomplete results where it cannot infer backgrounds behind CSS pseudo-element highlights or within SVG chart graphics; it also flags one decorative, aria-hidden arrow as non-text. The verified token pairs cover highlighted text and chart labels, and the arrow conveys no information. These incomplete nodes are preserved in the JSON evidence instead of being reported as passing axe checks.

## Lighthouse matrix

`PERF_RUNS=3 pnpm perf -- http://localhost:3400` covered all 12 public routes in desktop and mobile profiles. Results: `docs/evidence/perf-final-summary.json`.

- Desktop: all 12 routes pass; every category score is at least 98; LCP 525–598ms; CLS 0.
- Mobile: all 12 routes pass accessibility, best-practices, SEO, agentic-browsing and CLS (0). Performance is 0.96–0.97. Every route misses the strict LCP <2500ms threshold: LCP 2558–2857ms in the fresh 2026-09-28 clean run.
- Therefore the performance contract and G3 are not passed. Keep the current Lighthouse settings and threshold unchanged. The largest impact is shared across mobile pages; investigate the common rendering/font/CSS path before page-specific polish.

## Other checks

- `pnpm test` → 35/35 passed, including the production no-provider contact regression in `tests/unit/contact-production.test.ts`; isolated rerun `node node_modules/vitest/vitest.mjs run tests/unit/contact-production.test.ts` → 1/1 passed, retained in `docs/evidence/contact-production-test.txt`.
- `pnpm lint`, `pnpm lint:tokens` (46 files), `pnpm typecheck` → exit 0.
- Runtime SEO audit on the clean production server → 0 findings / 0 high (`SEO_AUDIT_URL=http://localhost:3400 pnpm seo:audit`).
- Earlier clean production rebuild on 2026-09-28 (`NEXT_BUILD_CPUS=2 pnpm build`) → exit 0. SEO audit on localhost:3401 → 0 findings / 0 high; robots, sitemap and `llms.txt` returned 200 and `/e2e-error` returned 404.
- Rebuilt clean production candidate after reverting LCP probes (`NEXT_BUILD_CPUS=2 pnpm build`) → exit 0; current runtime on port 3400 returns 0 findings / 0 high. The focused robots test passed 4/4 browser profiles, and the current clean-production runtime/client scan passed all checks (33 client/public files, zero credential matches); see `docs/evidence/security-runtime.txt`.
- GitHub Site source quality and Platform contracts workflows pass on commit `0e9cc98` for portfolio, demo and ABizCreator.

The E2E-only test keys/error fixture were absent from the clean production build: `/contact` included no Turnstile key/script and `/e2e-error` returned 404. The browser form test used official Turnstile test keys and `CONTACT_DRY_RUN`; the separate production-mode unit test verifies that missing Resend configuration returns an error with the confirmed direct-email fallback and never constructs the provider client. Real delivery, deployment, and BusinessOS dogfood remain S7 work. Live telemetry receipts are required only for telemetry keys actually enabled for release; the no-key no-op behavior is verified. The current clean-production security/client scan passes, so G3 remains pending on mobile LCP alone. See STATE.md.
