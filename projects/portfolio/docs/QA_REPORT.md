# Portfolio QA — integration findings

Status: partial; G3 is not passed. Updated 2026-09-27.

## Full browser run

Command: `node node_modules/@playwright/test/cli.js test --workers=2 --update-snapshots=missing`, with `NEXT_BUILD_CPUS=2`.
Initial run output: `docs/evidence/e2e-integration-initial.txt`. Fresh verification writes `docs/evidence/e2e-integration.txt`.

The production test build uses Turnstile's test keys, CONTACT_DRY_RUN and the deliberately throwing /e2e-error route. Never deploy this test build. Rebuild with clean production settings before production checks and publication.

Result: exit 1, 121 passed, 65 failed, 2 skipped, 6.2 minutes. The two skips are the mobile overlay test on desktop profiles, where no overlay exists. Coverage is Chromium and WebKit at 390px and 1440px across all 12 public routes and recovery flows.

## Findings and actions

- SVG title hydration: home/work/Edge Node/styleguide exposed React #418. Frontend traced empty server-rendered SVG titles to multiple JSX text expressions and reproduced the issue with react-dom/server. Single-string titles and a regression test are being applied. Browser verification is required after rebuilding.
- Mobile focus containment: repeated Tab escapes the native dialog's DOM focus cycle. Frontend is applying explicit endpoint wrapping and adding reverse-tab coverage; preserve native Escape and focus restoration. Both mobile engines require a rerun.
- Visual baselines: first creation pass reported missing snapshots. 47 PNGs were written; all 48 expected route/profile baselines need review and successful comparison before commitment. The missing WebKit baseline requires diagnosis, not a fabricated image.
- Contact validation/submission, primary navigation, skip-to-main focus, 404 recovery, intentional error-boundary recovery, source precision/pending-claim exclusions, reduced-motion final state, résumé download, security headers and SEO-file checks have successful results in this run. They must remain green after the fixes.
- Axe serious/critical checks across the public route/profile matrix passed in this run. This does not resolve the independent keyboard containment failure.

## Fix verification

Both SVG titles now use single strings. The dialog wraps forward/reverse Tab explicitly, preserving Escape and focus restoration. Focused ESLint passed; the expanded unit suite passed 31/31 including the actual-component SVG SSR regression. The old indexing assertion now matches the owner's indexable styleguide policy while still excluding /e2e-error. Fresh browser verification is running; the initial failures above are not treated as resolved until that run passes.

## Release boundary

Runtime SEO audit on the prior clean production build returned 0 findings. The home mobile performance median still fails strict LCP (2665ms), despite category score 92 and CLS 0. Full route/profile Lighthouse coverage, updated command evidence, monitoring verification, reviewed/committed visual baselines and G3 execution remain required.

## Final integrated browser verification

`E2E_SKIP_BUILD=1 NEXT_BUILD_CPUS=2 node node_modules/@playwright/test/cli.js test --workers=2 --update-snapshots=none` completed **186 passed, 2 expected desktop overlay skips, 0 failures** (1.5 minutes). Actual output: `docs/evidence/e2e-final.txt`. The test build included Cloudflare's always-pass test keys, dry-run delivery and the intentional error fixture; the external widget and real test-key validation were used without network stubs. The previously failing keyboard and screenshot cases pass across both engines. Earlier sandbox network failures remain retained separately and are not suppressed by assertions.

All 48 baselines were inspected and accepted in `docs/evidence/snapshot-review.json`, rechecked by byte hash and committed as `d462a96`. Visual comparisons pass without generating or replacing baselines. A clean production build and performance/security runtime verification remain necessary for G3 and deployment.

Subsequent observer batching preserves two-frame release and cleanup, explicitly
enforces the 50% visibility boundary and avoids startup geometry reads. Expanded
unit verification is 34/34; the clean production build and current runtime
security/SEO checks pass. The full browser pass above predates this observer
change and must be rerun for final G3. Strict performance still fails LCP (2710ms).

## Browser verification after hydration fix

Full run completed with 184 passed, 2 failed and 2 expected desktop overlay skips (8.4 minutes), exit 1. Retained output: `docs/evidence/e2e-after-hydration-fix.txt`. All route metadata/console checks and all 48 serious/critical axe checks passed. The single-string SVG title fix resolves the observed hydration failures across both engines.

Remaining failures were WebKit desktop styleguide stable screenshot capture exceeding the 5000ms assertion deadline and WebKit mobile menu Tab containment. A live probe confirmed WebKit's native Tab sequence skips modal links and moves from the close button to the body; endpoint wrapping alone cannot contain that sequence. Navigation now explicitly moves every forward/reverse Tab through the visible modal controls. Screenshot capture allows 20000ms while retaining the existing pixel comparison threshold. Fresh full verification is running; these changes are not yet recorded as a pass.

G3 source fingerprint now also binds runtime instrumentation and Vitest/PostCSS/workspace configs. `node --test tests/platform/g3-evidence.test.mjs` passed 6/6, including additions and edits invalidating evidence. Reviewed baseline evidence currently covers 47 actual images; the missing desktop styleguide still needs capture and inspection.
