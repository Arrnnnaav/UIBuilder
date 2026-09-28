# Portfolio QA report

Status: the default static hybrid candidate passes G3's build, browser, SEO, security and Lighthouse checks. Deployment and S7 work are still pending. Updated 2026-09-28.

## Production build and local runtime

- `pnpm build` → exit 0; `prebuild` now generates/packages the 12 Astro static routes before Next builds the API and rewrite layer. Clean build output: `docs/evidence/build-static-candidate-2026-09-28.txt`.
- `node scripts/seo-audit.mjs http://localhost:3436` → 0 findings, 0 high.
- The clean production candidate has no E2E-only Turnstile test widget or `CONTACT_DRY_RUN`. `/e2e-error` returns 404 when its test flag is absent.

## Browser matrix

Command: `$env:CI='1'; $env:E2E_SKIP_BUILD='1'; $env:E2E_PORT='3437'; pnpm test:e2e -- --reporter=line` against the dedicated static candidate test build.
Result: exit 0; 202 passed, 2 expected desktop-only mobile-menu skips; zero failures (204 total). Coverage: Chromium and WebKit at 390px and 1440px; all 12 public routes; no `/_next/` page scripts; metadata, console errors, axe, committed static visual snapshots, keyboard navigation, mobile dialog focus, contact validation/submission through the Next API, 404, error boundary, security headers, exact PDF MIME/signature, all 11 FAQ visible/schema pairs, sitemap/canonical parity, configured robots policy and `llms.txt`, and semantic work-heading order. The measured-work in-page anchor passes keyboard activation. Full retained summary: `docs/evidence/e2e-static-candidate-current-2026-09-28.txt`.

No serious or critical axe findings were reported. Desktop menu focus-containment is intentionally skipped where the mobile dialog is not available.

### Explicit AA contrast audit

Command: `$env:CI='1'; $env:E2E_SKIP_BUILD='1'; $env:E2E_PORT='3104'; $env:CONTRAST_EVIDENCE='1'; pnpm test:e2e -- e2e/contrast.spec.ts --reporter=line --retries=0`.
Result: exit 0; four browser/viewport profiles passed. Each checked 12 public routes in light and dark color schemes (96 route/theme/profile cases). Axe reported zero text-contrast violations. Computed design-token pairs passed at ≥4.5:1 for text and ≥3:1 for borders; the minimum text ratio was 6.17:1 and the minimum border ratio was 3.63:1. Raw per-case results are in `docs/evidence/contrast-audit-*.json`.

Axe retains incomplete results where it cannot infer backgrounds behind CSS pseudo-element highlights or within SVG chart graphics; it also flags one decorative, aria-hidden arrow as non-text. The verified token pairs cover highlighted text and chart labels, and the arrow conveys no information. These incomplete nodes are preserved in the JSON evidence instead of being reported as passing axe checks.

## Lighthouse matrix

`PERF_RUNS=3 pnpm perf -- http://localhost:3436` covered all 12 public routes in desktop and mobile profiles on the clean static hybrid candidate. Results: `docs/evidence/perf-astro-static-current-2026-09-28.json`.

- Desktop: all 12 routes pass; every category score is 100; LCP 327–329ms; CLS 0.
- Mobile: all 12 routes pass; every category score is 100; LCP 1356–1359ms; CLS 0.001–0.002.
- The Next-rendered fallback still misses mobile LCP (2555–2858ms); static HTML is now the default candidate. Lighthouse thresholds and settings are unchanged.

## Other checks

- `pnpm test` → 46/46 passed, including production no-provider contact and missing-Origin regressions.
- `pnpm lint`, `pnpm lint:tokens` (46 files), `pnpm typecheck` → exit 0.
- Runtime SEO audit on the clean production server → 0 findings / 0 high (`SEO_AUDIT_URL=http://localhost:3400 pnpm seo:audit`).
- Earlier clean production rebuild on 2026-09-28 (`NEXT_BUILD_CPUS=2 pnpm build`) → exit 0. SEO audit on localhost:3401 → 0 findings / 0 high; robots, sitemap and `llms.txt` returned 200 and `/e2e-error` returned 404.
- Rebuilt current clean production candidate (`pnpm build`, with static route generation in `prebuild`) → exit 0. The runtime SEO audit returns 0 findings / 0 high. Current headers, no-widget contact page, hidden E2E route, no-Origin API rejection, and generated client/public scan all pass; 38 text assets have zero credential-pattern matches. See `docs/evidence/build-static-candidate-2026-09-28.txt`, `docs/evidence/seo-audit-current-2026-09-28.txt` and `docs/evidence/security-runtime-current-2026-09-28.txt`.
- GitHub Site source quality and Platform contracts workflows pass on commit `0e9cc98` for portfolio, demo and ABizCreator.

The browser form test used official Turnstile test keys and `CONTACT_DRY_RUN`; the clean production build contains neither. The production-mode unit test verifies that missing Resend configuration returns an error with the confirmed direct-email fallback and never constructs the provider client. Real delivery, deployment, and BusinessOS dogfood remain S7 work. Live telemetry receipts are required only for telemetry keys actually enabled for release; the no-key no-op behavior is verified. See STATE.md.
