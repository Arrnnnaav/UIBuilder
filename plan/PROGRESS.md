# PROGRESS — status board

Legend: ✅ done · 🟡 in progress · ⬜ todo · ⛔ blocked (reason)

## M0 — Setup
- ✅ Spec conflict fixed. R7 was added to `business-os/docs/superpowers/specs/2026-09-09-unified-platform-design.md` (D4 note plus "not building" notes), and a new `2026-09-25-git-site-connector-design.md` was written. → DECISIONS D8
- ✅ `AGENTS.md` rulebook; `CLAUDE.md` = `@AGENTS.md`
- ✅ `plan/` phase files, PROGRESS, DECISIONS
- ✅ `git init` UIBuilder
- ✅ Caveman statusLine added to `~/.claude/settings.json`. A backup is at `settings.json.bak-uibuilder`. It takes effect after restart.
- ✅ `.mcp.json` with Context7. Playwright comes from the plugin.
- ✅ Skills vendored in `.claude/skills/`: web-design-guidelines, taste-skill, stitch-design-taste, redesign-existing-projects, website-to-code. Provenance is in `SOURCES.md`. brag is already a user plugin.
- ⛔ GitHub MCP: auth header error. The user must re-authenticate via `/mcp`. Fallback: `gh` CLI 2.92.0.
- ✅ Toolchain:
  - present: node v24.14.1, pnpm 12.4.2, npm 11.12.1, git 2.49, gh 2.92
  - missing: vercel CLI and wrangler, to be installed in M4/M7 when deploying

## M1 — Skeleton + brain ✅
- ✅ Directories plus 12 doc templates and `HANDOFF.schema.json` in `templates/docs/`
- ✅ `brain/tools.json`: 26 tools. Paid tools (minimax_h3, higgsfield_mcp, heygen, figma_mcp, ai_citation_tracking) are registered but disabled via `enabled_if`
- ✅ `brain/resources.json`: 67 entries from links.docx, each with usage_mode, trust and provenance
- ✅ 11 patterns in `brain/patterns/`, with provenance linked to resources. Also `preferences.md`, 3 schemas, and `brain/seo-rules/aeo-geo.json` (copied from BusinessOS)
- ✅ `node scripts/validate-brain.mjs` → "✓ brain valid — 67 resources, 11 patterns, 26 tools"

## M2 — marketing-starter ✅ (2026-09-25)
- ✅ Scaffold: Next 16.3.6, React 19.2, Tailwind 4, Motion 13, Zod 4. Includes `tokens.css`, `/styleguide`, `lint:tokens`
- ✅ SEO contract:
  - data files: `routes.json`, `crawlers.json`, `schema/*`, `faq/*`, `llms.txt`, `seo.manifest.json`
  - code: `lib/seo.ts`, `<JsonLd>`, `<Faq>` (FAQPage schema)
  - routes: sitemap, robots, OG image
  - scripts: generated content index (safe on Workers), `validate:content` (runs before build), `seo:audit` (same rule codes as BusinessOS)
- ✅ Contact form: server action + Zod + honeypot + Turnstile (fails closed) + per-IP rate limit + Resend. Every key is optional
- ✅ Security headers and a static CSP (no nonce, so pages stay static). Optional PostHog (cookieless) and Sentry
- ✅ Tests:
  - vitest: 12/12
  - Playwright: 64/64 (Chromium + WebKit × 390/1440 — every page, axe, snapshots, nav, skip link, contact, 404, error boundary, headers, SEO files)
  - `seo:audit`: 0 high (2 low `missing-sameas-entities`, expected with placeholder content)
  - `pnpm perf`: every category ≥ 0.9; mobile LCP 2462ms on /, 1745ms on /contact
- ✅ Fresh copy in scratch: install, typecheck, lint, lint:tokens, unit and e2e all green, after fixing the /contact snapshot baseline (the Turnstile widget is now masked)
- ✅ CI (`.github/workflows/ci.yml`), `.env.example`, README
- Notes:
  - On Windows, `lhci` fails on a chrome-launcher EPERM when cleaning its temp dir, so `pnpm perf` (Playwright + Lighthouse) is used locally. lhci stays in Linux CI.
  - The box is memory-bound (~2GB free), so builds use `NEXT_BUILD_CPUS=2`. One WebKit crash was environmental: it passed 3/3 when run alone.
  - Lesson → brain: never wrap first-viewport content in Reveal. It pushed mobile LCP to 3.9s.
  - Visual baselines are per-OS; CI seeds the Linux ones.

## M3 — Agents + recipes 🟡
- ✅ 7 agent definitions in `.claude/agents/`: research, ux, design-director (modes direction:A/B/C, critic, review), frontend, backend, growth, ship. Frontmatter parses, and Claude Code registered all 7 as agent types.
- ✅ 5 commands in `.claude/commands/`: build, gate, intake, learn, connect. Claude Code registered them as skills. `/connect` matches the real `POST /api/sites` shape.
- ✅ Recipes `pipelines/portfolio` and `pipelines/company-site`, each with PIPELINE, PAGES, DESIGN.base, QA, PROMPTS and stack.json.
- ✅ `scripts/new-project.mjs`: copies the starter without build or test artefacts, seeds docs and BUILD_SPEC, runs git init, and refuses to overwrite. Tested with `demo`.
- ✅ `scripts/gate.mjs`:
  - G1 and G2 flag missing or template-only artefacts and unvalidated handoffs (verified: demo G1 fails 10/10, as expected).
  - G3 runs the full DoD.
- 🟡 G3 diagnostic on the untouched starter (`demo`), current 2026-09-27: typecheck, lint, tokens, content, 14 unit tests, high-severity audit, production build, runtime SEO (0 high), 64/64 browser tests and committed snapshot equality pass. Fixed the starter perf runner to cover every route (including noindex) and use strict `<2500ms`; made the starter styleguide indexable and removed its robots disallow per owner choice. Lighthouse now passes 5/6 route/profile combinations; `/styleguide` mobile median LCP is 2549ms, and evidence-review record is still incomplete. Full result and known gaps: `projects/demo/docs/QA_REPORT.md`, `PERF_REPORT.md`, and `docs/evidence/g3-demo-run.txt`. Do not mark G3 passed.
- Fixes found by running G3:
  - The Node 24 on Windows libuv assertion when calling `process.exit` inside fetch: the probe now runs in-process.
  - Snapshot seeding needs a seed pass, then a verify pass.
  - Audit gates only prod deps (clean). Dev tooling has 2 unpatchable extract-zip highs via lighthouse and puppeteer; they are reported but never ship. `tmp` is overridden to ≥ 0.2.6.

## M4 — Portfolio 🟡
- ✅ Product/research/UX/design stages complete; G1 and G2 approvals recorded. Six public case studies are sourced from the résumé and commit-pinned GitHub evidence.
- ✅ S4 implementation complete: home, work, six case studies, about, contact, résumé, indexable styleguide, 30 schema files, 11 FAQ files, sitemap/robots/llms.txt, contact action and data-driven SEO manifest.
- ✅ Skills/resources from the recovered `/intake` were reviewed and installed; provenance is in `.claude/skills/SOURCES.md`. Design-reading notes are in `docs/DESIGN_READING.md`; brain validates at 92 resources, 16 patterns, 36 tools.
- ✅ S5 browser/visual checks: 48 committed Windows baselines reviewed; current full Playwright matrix passes 190 tests with 2 expected desktop-only skips across Chromium/WebKit at 390px/1440px.
- ✅ Build, 34 unit tests, lint, token lint, typecheck and runtime SEO audit pass. Full desktop/mobile Lighthouse coverage completed: all desktop routes pass; all 12 mobile routes fail only strict LCP <2500ms (2556–2859ms), recorded in `projects/portfolio/docs/PERF_REPORT.md` and `docs/QA_REPORT.md`.
- 🟡 S6/G3: mobile performance contract is unresolved; 2026-09-27 current reports and raw summary are saved under `projects/portfolio/docs/`. Do not mark G3 passed.
- ✅ License owner choice Apache-2.0 with explicit patent terms; license and third-party notices committed.
- ✅ Push to `https://github.com/Arrnnnaav/UIBuilder.git`: commit `0e9cc98`; Platform contracts and Site source quality both pass, including portfolio/demo/ABizCreator.
- ⬜ S7 deployment, production monitoring receipts and real BusinessOS `/connect` dogfood remain. Deployment also awaits a chosen production hostname to replace provisional canonical URLs.

## M5 — BusinessOS connector ✅ (2026-09-25)
- ✅ Added `core/integrations/site-connector.mjs`, `integrations/git-site/connector.mjs`, `core/seo/aeo-geo.mjs` (10 codes), `plugins/seo/site-fix-service.mjs`, and a fake-github fixture
- ✅ Updated:
  - the auditor (adds aeoGeoFindings)
  - `opportunity-engine` (`discoverFromAudit`)
  - validators (5 payload types)
  - policy (`site.*`, 2 hard-denies, kill switch)
  - experiment lifecycle
  - server routes
- ✅ Evidence: `BUSINESSOS_DATA_ROOT=<tmp> npm test` → exit 0. All 33 selftests pass, including git-site-connector, seo-aeo-geo and site-publish-flow. Before the change: 30/30.
- Deviations (see DECISIONS D11): extra proposal/refresh/request-publish/verify routes; rollback allowed while the kill switch is on; verification stays PUBLISHED until the deploy is live.

## M6 — Dashboard + dogfood 🟡
- ✅ Dashboard UI (BusinessOS):
  - Website connection form on the Connections page (token field is a password input, cleared after submit, never echoed; health shows push permission and manifest paths)
  - SeoWorkspace tabs for SEO, AEO and GEO: site audit → findings grouped by page → "Propose fix" editor prefilled from the repo file → proposal
  - NeedsYou git-site cards: per-file diff, validator results, lifecycle stepper, Approve → PR, preview, Request publish → Approve and publish → verify, rollback
  - 2 new read-only routes: `/api/sites/health` and `/api/sites/file` (manifest-gated)
- ✅ Evidence (checked independently):
  - `npm test` → exit 0, 33/33
  - `npm run build:dashboard` → built, exit 0
  - The agent ran the whole flow in a browser against fake GitHub: connect → audit → propose → approve PR → preview → publish → verify → rollback (revert PR #2); the token never appeared in the page or the log
- Gaps:
  - no React UI tests (the repo has no harness)
  - the 390px layout hasn't been viewed
  - SEO-category findings (invalid-jsonld, stale sitemap) aren't proposable yet, since the backend creates only AEO/GEO opportunities
  - after a publish is rejected, only rollback is possible
- ⛔ Dogfood (a real merged `bos/*` PR) is blocked on M4 (portfolio live) and on the user's GitHub PAT

## M7 — ABizCreator 🟡 (started early by user direction: frontend-only, D14/D15)
- ✅ `projects/abizcreator` converted to a frontend-only static export:
  - contact channels instead of a form
  - `_headers` for the CSP
  - `serve-static` with br/gzip
  - a postbuild fix for the Windows export segment bug
  - `wrangler.jsonc`
- ✅ Evidence:
  - typecheck, lint and lint:tokens clean; unit tests 5/5
  - e2e 60/60 (twice)
  - seo:audit 0 high
  - perf (median of 3): mobile / 0.93 with LCP 2413ms, /contact 0.94 with LCP 2111ms; desktop 1.0
- ✅ S2 research:
  - CLIENT_SITE: 13 URLs, only 5 real pages; 12 services with no descriptions; 8 client logos; SEO has 0 h1s and no schema
  - COMPETITORS, INSPIRATION (moah, noth, airborne, poch, tagsen), REFERENCE_BREAKDOWN
  - research handoff
- ✅ `docs/PRODUCT.md` draft, with 10 client questions
- 🟡 Running: growth S1 strategy. Next: ux, then G1 (owner/client approval).

## Supplemental research — model routing (2026-09-26)
- ✅ Reviewed JEV at `38da6b84ea01241bfc41fbddc0928d0f40a703f0` and compared native selection, Claude Code Router, OpenRouter Auto, LiteLLM and RouteLLM against official documentation.
- ✅ Local isolated verification: `node --test --test-reporter=spec 'test/**/*.test.mjs'` → 64 passed, 1 Windows permission test skipped, 0 failed; `npm audit --audit-level=high` → 0 vulnerabilities. Outputs: `docs/evidence/jev-router-*.txt`.
- Recommendation and limitations: `docs/MODEL_ROUTER_REVIEW.md`; no router enabled, no CLI account configuration changed. Portfolio gates remain pending as recorded above.

## Portfolio visual acceptance and gstack review (2026-09-27)

- Git publication completed to `Arrnnnaav/UIBuilder`: `d7df6d2` portfolio implementation/evidence, then `8316a5d` ESM content-review lint fix and narrower footer payload. GitHub Platform contracts and Site source quality both pass at `8316a5d`; all three site matrix jobs pass. URLs: https://github.com/Arrnnnaav/UIBuilder/actions/runs/36279673147 and https://github.com/Arrnnnaav/UIBuilder/actions/runs/36279673134.
- Narrow footer payload improves home/mobile median to performance97, all othercategories100, LCP2557ms, CLS0 (stillfailsstrict2500ms). Self-prefetch/nativeanchor change measures2559ms, not a demonstratedLCPgain. A server/client boundary improvement is being evaluated; G3/S7 remain pending. Full192-test browser matrix will include native work-anchor keyboard coverage after current source changes settle.

- ✅ Final current-source production build: `pnpm build` → exit 0; `pnpm test` → 34/34; `pnpm lint`, `pnpm lint:tokens` (46 files) and `pnpm typecheck` → exit 0; runtime `pnpm seo:audit` against the production server → 0 findings / 0 high.
- ✅ Correctly configured final Playwright matrix: `pnpm test:e2e` → 190 passed, 2 expected desktop menu skips, 0 failures; 192 tests across Chromium/WebKit and 390px/1440px. Includes the keyboard-operated in-page work anchor. Evidence: `projects/portfolio/docs/evidence/e2e-final.txt`.
- 🟡 Clean-production full 12-route × desktop/mobile Lighthouse matrix completed (3-run medians): all desktop routes pass; mobile routes all meet scores/CLS but miss LCP <2500ms at 2561–2768ms. Evidence: `projects/portfolio/docs/evidence/perf-final-summary.json` and `PERF_REPORT.md`. No E2E-only key or active error fixture was present in the measured artifact.
- ✅ Current portfolio changes pushed at `0e9cc98`; Platform contracts and Site source quality pass, including all three site matrix jobs. Live deployment and BusinessOS dogfood remain pending.

- Final network-enabled browser comparison completed: 186 passed / 2 expected desktop skips / 0 failures, 1.5 minutes, `projects/portfolio/docs/evidence/e2e-final.txt`. All48 reviewed baseline hashes verified and committed in `d462a96`; owner license/notices committed in `fe011b6`; current-evidence gates and CI build isolation committed in `e9ea705`. These commits are local; publication remains pending.
- Clean production build/security runtime/SEO checks pass, SEO0findings and /e2e-error404. Fresh mobilehome median still fails LCP2708ms despite performance96 and othercategories100. Font-subset experiment reduced fontbytes roughlyhalf but LCP2703ms; reverted rather than weakening typography. Observer startup now batches DOMwrites and uses asynchronous intersection visibility; full unit suite34/34. Clean rebuild handle62055 replaces the stopped experimental artifact; re-measurement remains required.

- Browser continuation: full post-hydration run finished 184 passed / 2 failed / 2 expected skips, exit 1. Hydration and all 48 axe checks pass. Live Chromium/WebKit probe reproduced WebKit native Tab skipping modal links; explicit full Tab cycling applied. Long styleguide screenshot receives 20s capture budget with unchanged comparison tolerance. Fresh full run is live as exec session24234; do not restart while live.
- G3 fingerprint strengthened to cover instrumentation entry points and Vitest/PostCSS/workspace configuration; targeted gate tests pass 6/6. CI no longer seeds missing visual baselines automatically and separates production SEO/performance artifacts from browser test artifacts; five YAML workflows parse successfully.
- ✅ Design-director inspected all 24 refreshed portfolio captures: loop 1 caption/source-label/filename fixes verified; 24/24 HTTP 200, no overflow or console errors. `projects/portfolio/docs/VISUAL_REVIEW.md` and design-director handoff record static visual acceptance. Interaction, accessibility, performance and committed regression baselines remain ship work.
- ✅ gstack source review pinned at `2a113ae7e623f590095bcaaa0cc581c9a10a6632`: `docs/GSTACK_REVIEW.md` records compatibility, setup/privacy boundaries and selective integration plan. Added REVIEWED/research_only brain entry; not installed or enabled.
- ✅ `node scripts/validate-brain.mjs` → 92 resources, 16 patterns, 36 tools valid.
- ✅ Fresh portfolio production build after final growth edits and analytics validation boundary change → exit 0; focused Analytics/layout ESLint → exit 0; runtime `node scripts/seo-audit.mjs http://localhost:3400` → 0 findings, 0 high. Validation still runs on the server; only the explicit public analytics key/host cross to the client.
- 🟡 Mobile home single-run Lighthouse probe: LCP 2307ms, CLS 0, performance 84, accessibility/SEO 100, best practices 96. LCP improved from 2651ms after removing Zod from the shared analytics browser boundary; high total blocking time keeps the performance gate unpassed. Three-run median requested; full route/profile coverage still required.
- 🟡 Three-run mobile home median completed: performance 92, accessibility/SEO 100, best practices 96, LCP 2665ms, CLS 0; exit 1 because LCP still exceeds the strict 2500ms limit. Evidence: `projects/portfolio/docs/evidence/perf-home-median.txt`. Full performance gate remains unpassed; do not infer success from the better single-run LCP.
- 🟡 Full188-test integration run → exit1,121passed,65failed,2desktop-overlay skips. Baseline creation exposed missing PNGs; real blockers found were SVGtitle SSR hydration and mobile keyboard containment. Frontend has reproduced the title bug and is applying localized fixes. `projects/portfolio/docs/QA_REPORT.md` records findings and successful flows; fresh build/rerun remains required.
- ✅ Frontend applied proven SVGtitle single-string fix and explicit Tab/ShiftTab dialog wrapping; added real EvidenceFigure SSR regression test and reverse-tab E2E coverage. Focused ESLint passed. Root corrected stale styleguide-indexing assertion and expanded Vitest discovery to include TSX tests. Fresh unit/build/browser verification is pending; do not mark G3 passed.
- ✅ Expanded unit suite → 31/31 passed, including SVGtitle SSR regression (`docs/evidence/unit-integration.txt`). Fresh full browser verification started in exec session22935; original failure evidence preserved in `docs/evidence/e2e-integration-initial.txt`. G3 remains pending.
