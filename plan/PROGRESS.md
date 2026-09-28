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
- ✅ Skills/resources from the recovered `/intake` were reviewed and installed; provenance is in `.claude/skills/SOURCES.md`. Design-reading notes are in `docs/DESIGN_READING.md`; brain validates at 92 resources, 16 patterns, 37 tools.
- ✅ S5 browser/visual checks: 48 committed Windows baselines; current full Playwright matrix passes 194 tests with 2 expected desktop-only skips across Chromium/WebKit at 390px/1440px. FAQ page captures refreshed and checked against the full browser matrix.
- ✅ Build, 34 unit tests, lint, token lint, typecheck and runtime SEO audit pass. Fresh full desktop/mobile Lighthouse coverage on 2026-09-28: all desktop routes pass; all 12 mobile routes fail only strict LCP <2500ms (2558–2857ms), recorded in `projects/portfolio/docs/PERF_REPORT.md` and `docs/QA_REPORT.md`.
- 🟡 S6/G3: mobile performance contract is unresolved; current reports and raw three-run summary are saved under `projects/portfolio/docs/`. Do not mark G3 passed.
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
- ✅ Fresh portfolio production build after final growth edits and analytics validation boundary change → exit 0; focused Analytics/layout ESLint → exit 0; runtime `node scripts/seo-audit.mjs http://localhost:3400` → 0 findings, 0 high. Validation still runs on the server; only the explicit public analytics key/host cross to the client.
- 🟡 Mobile home single-run Lighthouse probe: LCP 2307ms, CLS 0, performance 84, accessibility/SEO 100, best practices 96. LCP improved from 2651ms after removing Zod from the shared analytics browser boundary; high total blocking time keeps the performance gate unpassed. Three-run median requested; full route/profile coverage still required.
- 🟡 Three-run mobile home median completed: performance 92, accessibility/SEO 100, best practices 96, LCP 2665ms, CLS 0; exit 1 because LCP still exceeds the strict 2500ms limit. Evidence: `projects/portfolio/docs/evidence/perf-home-median.txt`. Full performance gate remains unpassed; do not infer success from the better single-run LCP.
- 🟡 Full188-test integration run → exit1,121passed,65failed,2desktop-overlay skips. Baseline creation exposed missing PNGs; real blockers found were SVGtitle SSR hydration and mobile keyboard containment. Frontend has reproduced the title bug and is applying localized fixes. `projects/portfolio/docs/QA_REPORT.md` records findings and successful flows; fresh build/rerun remains required.
- ✅ Frontend applied proven SVGtitle single-string fix and explicit Tab/ShiftTab dialog wrapping; added real EvidenceFigure SSR regression test and reverse-tab E2E coverage. Focused ESLint passed. Root corrected stale styleguide-indexing assertion and expanded Vitest discovery to include TSX tests. Fresh unit/build/browser verification is pending; do not mark G3 passed.
- ✅ Expanded unit suite → 31/31 passed, including SVGtitle SSR regression (`docs/evidence/unit-integration.txt`). Fresh full browser verification started in exec session22935; original failure evidence preserved in `docs/evidence/e2e-integration-initial.txt`. G3 remains pending.

- Domain launch checklist reviewed: provider-neutral S7 plan and domain-ops role added. DNS/TLS/mail/Search Console activation remains deferred until G3 and owner hostname/provider selection. Validation: 10 roles, 15 handoffs; 92 resources, 16 patterns, 37 tools.

## Portfolio resume verification — 2026-09-28

- ✅ Fresh source build after reverting performance probes: `NEXT_BUILD_CPUS=2 pnpm build` → exit 0; production output retained at `projects/portfolio/docs/evidence/build-final.txt`.
- ✅ Current verification: `pnpm test` 35/35; `pnpm lint`; `pnpm typecheck`; `pnpm lint:tokens` (46 files); `pnpm validate:content`; `pnpm audit --audit-level high` (no known vulnerabilities).
- ✅ Current full browser matrix: `CI=1 E2E_PORT=3104 pnpm test:e2e -- --reporter=line` → 198 passed, 2 expected desktop-only skips, 0 failures (200 total), Chromium/WebKit at 390px and 1440px; includes crawler policy and contrast checks. `projects/portfolio/docs/evidence/e2e-final.txt`.
- ✅ Explicit AA contrast audit: all 4 browser/viewport profiles, 12 routes × 2 themes each; zero axe contrast violations, min text 6.17:1, min token border 3.63:1. Raw evidence: `projects/portfolio/docs/evidence/contrast-audit-*.json`.
- ✅ Clean production runtime on localhost:3400: SEO audit 0 findings/0 high; CSP/headers pass, `/e2e-error` 404, scan of 33 generated client/public files has 0 credential matches. `projects/portfolio/docs/evidence/security-runtime.txt`.
- 🟡 G3 remains open only on the strict mobile Lighthouse LCP gate: the fresh 2026-09-28 full matrix shows all 12 routes exceed 2500ms (2558–2857ms). Reverted `content-visibility` and font-display experiments did not improve the result; no threshold waiver. Exact command/output: `projects/portfolio/docs/evidence/perf-run-final.txt`; summary: `projects/portfolio/docs/evidence/perf-final-summary.json`.
- ⏸ S7 deploy, live provider receipts, BusinessOS connection, launch video and `/learn` remain downstream of G3; custom domain remains deferred as requested.
- 🟡 Full growth agent review reconfirmed the 12-route sitemap/crawler policy and local SEO audit at 0 findings; its report, handoff and raw audit output are refreshed. A 3-run shared-shell client-boundary probe measured `/about` and `/resume` at 2709ms mobile LCP and left the root Next/React chunk in place, so its source changes were reverted. Evidence: `projects/portfolio/docs/evidence/perf-native-shell-experiment.json` and `perf-lcp-investigation.md`. A broader HTML-first architecture investigation is still needed for A17.
- 🟡 A bounded Astro static HTML pilot rendered existing `/resume` content with no framework runtime scripts. Three mobile Lighthouse runs passed with median LCP 1356ms and all scores 100; 390px/1440px browser checks, 0 axe violations, first-fold comparison, PDF response, and a second test served through Next production with CSP and no Next chunks (median LCP 1355ms) passed. `/contact` remained on Next with its form. This validates one route and the hybrid routing mechanism only; secure API/contact form migration, approved mobile dialog behavior, the other 11 routes, deployment and full G3 evidence remain open. Evidence: `projects/portfolio/docs/evidence/perf-astro-resume-pilot.md`, `.json`, and `perf-astro-next-rewrite-pilot.json`.
- ✅ Pilot dependency/build checks: `pnpm install --frozen-lockfile`; `pnpm typecheck`; `pnpm lint`; `pnpm test` (35/35); `pnpm lint:tokens` (46 files); `pnpm validate:content`; `pnpm audit --audit-level high`; `pnpm build`; `pnpm exec astro build --root astro-pilot`; `node scripts/validate-contracts.mjs` (10 roles, 16 handoffs). ESLint and Git ignore only Astro-generated `.astro/` and `dist/` output. This does not change the pending full G3 status.

- 🟡 Astro/Next hybrid pilot expanded to `/contact` + `/resume`: Astro static build passed; production rewrite served both pages with no Next chunks; mobile Lighthouse (3-run medians) `/contact` LCP 1658ms, `/resume` 1359ms, all categories 100; axe 0 at 390px/1440px; focus trap, form validation, dry-run submit, cross-origin 403 passed. Evidence: `projects/portfolio/docs/evidence/perf-astro-hybrid-contact-resume.md` and `.json`. Shared same-origin contact API has Zod validation, rate limit, Turnstile and Resend service coverage; unit tests 45/45. This is two of the published routes only; G3 and production architecture remain unchanged.
- ✅ Contact regression after API extraction: `CI=1 E2E_PORT=3430 pnpm test:e2e -- --grep "contact form validates then submits" --reporter=line` → 4/4 passed across Chromium/WebKit at desktop/mobile; original Next contact action remains functional.

## 2026-09-28 — UIBuilder portfolio completion checkpoint
- ✅ Default static hybrid builds cleanly with plain `pnpm build`; `pnpm typecheck`, `pnpm lint`, `pnpm test` (46/46), `pnpm lint:tokens` (48 files), `pnpm validate:content`, `pnpm audit --audit-level=high`, `node scripts/validate-contracts.mjs` (10 roles/16 handoffs), and `node scripts/validate-brain.mjs` (97 resources/16 patterns/37 tools) pass.
- ✅ Default Playwright matrix: `CI=1 E2E_PORT=3437 pnpm test:e2e -- --reporter=line` → 202 passed, 2 expected desktop-only skips, 0 failures; Chromium/WebKit at 390px and 1440px across all 12 routes. Evidence: `projects/portfolio/docs/evidence/e2e-static-candidate-current-2026-09-28.txt`.
- ✅ Default Lighthouse matrix: `PERF_RUNS=3 pnpm perf -- http://localhost:3436` → all 24 route/profile rows pass, categories 100; desktop LCP 327–330ms, mobile LCP 1357–1359ms, CLS <0.1. Evidence: `projects/portfolio/docs/evidence/perf-default-static-current-2026-09-28.json` and `PERF_REPORT.md`.
- ✅ Runtime security scan on clean production server: required headers, no test widget, no-Origin contact rejected (403), `/e2e-error` 404, 38 generated client/public text assets with 0 credential-pattern matches. SEO runtime audit has 0 findings; `pnpm audit --audit-level=high` clean. Evidence: `security-runtime-current-2026-09-28.txt`, `seo-audit-current-2026-09-28.txt`.
- ✅ G3 is satisfied for D30’s default static hybrid candidate, as recorded in `projects/portfolio/docs/STATE.md`; this is local verified evidence, not a deployed-site claim.
- ✅ Linux visual baselines and remote CI portability verified: GitHub Actions run `36373755566` passed portfolio/demo/ABizCreator source matrices and generated 48 Linux snapshots (Chromium/WebKit × desktop/mobile × 12 routes); snapshots are committed under `projects/portfolio/e2e/__snapshots__/linux/`. Evidence: `projects/portfolio/docs/evidence/ci-linux-snapshots-current-2026-09-28.txt`.
- ⏸ S7 remains: deploy after G3, verify live URL and production output, optional owner-controlled provider receipts, BusinessOS `/connect`, launch video and `/learn`. Custom domain/DNS remains deferred pending owner selection and approval.
- ✅ Current content/growth recheck: `node docs/final-content-review.mjs` reports 12 public routes, 30 schema files, 11 FAQ files, six projects, 10 verified metrics, one pending metric and no errors; the supplied résumé SHA-256 still matches the published PDF. `pnpm validate:content` and live local `pnpm seo:audit -- http://localhost:3436` pass with 0 findings.
- ✅ BusinessOS connector path audited: local `git-site-connector`, `seo-aeo-geo`, and `site-publish-flow` self-tests pass. Read-only connector health/snapshot succeeds on `experiment/astro-static-lcp-pilot` with root `seo.manifest.json` scoped to `projects/portfolio/`; it read the manifest, route metadata and llms.txt at commit `05a5b0e`. `main` still reports `site.manifest.missing`; the provisional canonical hostname returns 404. No PR or publish writes were made; real `/connect` dogfood awaits owner-approved default-branch integration, protected-preview access and separate approvals. Evidence: `projects/portfolio/docs/evidence/businessos-connector-readonly-current-2026-09-28.txt`.
- ✅ S7 protected preview deployed and checked: Vercel authenticated in owner Hobby scope; `dpl_GZ2Cx1CbLfxbAaZgt6cbRw9SYmnw` is Ready at `https://arnav-khandelwal-portfolio-dz7z8450s-arrnnnaavs-projects.vercel.app`. The first CLI deployment defaulted to target production; its aliases were removed and that deployment was deleted. Current project has no production URL or alias. Live SEO audit via an in-memory bypass → 0 findings; Chromium verified 12/12 routes, mobile layouts/menu, résumé PDF, `/e2e-error` 404, originless contact 403, zero console/network errors. One-run 24-row deployed Lighthouse observation: performance ≥0.92, a11y/best practices 100, LCP 277–352ms desktop and 856–1244ms mobile; overall Lighthouse is non-green because previews are protected/noindex. Evidence: `projects/portfolio/docs/evidence/live-preview-check-2026-09-28.md` and adjacent JSON/screenshots. `https://arnav-khandelwal.vercel.app` still returns 404; canonical reconciliation, public production host, BusinessOS PR/publish dogfood, launch video and owner-rated `/learn` remain open. Custom domain/DNS remains deferred.
- ✅ S7 walkthrough recorded from the protected preview: `projects/portfolio/docs/launch/portfolio-preview-walkthrough.webm` (23.2 seconds; `ffprobe` reads duration and size). Nine public-page scenes completed with zero browser console errors. Temporary Vercel bypass was removed and project protection reports no bypass secret. `/learn` owner rating and feedback remain pending.

## Brain, taste and owner gates — 2026-09-28
- ✅ Added eight specialist domain packs and explainable `scripts/recommend-resources.mjs`; `node scripts/validate-brain.mjs` → 105 resources, 16 patterns, 39 tools, 8 domains. Selector unit test verifies unapproved/unlicensed code stays in review.
- ✅ Added taste-research agent and 16-video sampled-frame report at `projects/portfolio/docs/TASTE_REPORT.md`; `node scripts/validate-contracts.mjs` → 11 roles, 16 existing handoffs. New directions remain proposals because current DESIGN/MOTION rule out scroll reveals and cursor following.
- ✅ Jev key normalized in ignored root `.env`; direct official API synthetic probe returned HTTP 200, model `jev-1.13.0`. Six synthetic eval cases → 6 correct, 0 abstentions, 0 errors; evidence `docs/evidence/jev-shadow-eval-2026-09-28.json`. Jev remains shadow mode pending a representative labeled corpus.
- ✅ Added G2.5/G3.5 artifact-hash owner gates, command and ship instructions. Focused `node --test tests/platform/jev.test.mjs tests/platform/owner-gates.test.mjs tests/platform/resource-selector.test.mjs` → 4 pass, 0 fail. `node scripts/gate.mjs portfolio G2.5` correctly fails: owner visual approval is pending.
- ✅ Reviewed screenshot research catalog and verified selected primary sources; eight new Brain resource entries, with no broad tool installation or source-code copying. Triage: `docs/SCREENSHOT_CATALOG_TRIAGE.md`.
- ⏸ Portfolio experience proposal and exact-target release review need owner assessment. No new external deploy, DNS change or design approval is inferred.
- 🟡 Status correction: `Test-Path projects/portfolio/docs/G3_EVIDENCE.json` → False. Earlier component checks remain documented, but the current formal G3 command cannot pass its evidence validation until this record is built and checked. `projects/portfolio/docs/STATE.md` now labels G3 pending formal recheck; this does not undo the historical protected preview.
- ✅ Owner-requested Agent Browser setup: `npm install -g agent-browser@0.38.1` → exit 0; `agent-browser install` installed Chrome 154.0.8037.57; `agent-browser open file:///D:/PROJECTS/UIBuilder/projects/portfolio/docs/prototypes/evidence-atlas.html` and `agent-browser snapshot -i` returned the page headings, links and regions. Router now enables `agent_browser_cli`, with Playwright fallback and G3 unchanged.
- ✅ Installed the upstream project skill into `.claude/skills/agent-browser/` via the Codex skill-installer helper; retained Apache-2.0 LICENSE and pinned source `d01253d9db28d75080e36da3c1c31ef89454731e` in SOURCES.md. Loaded `agent-browser skills get core` for future named-session use.
- ✅ Original local Evidence Atlas prototype and owner review package created. `node projects/portfolio/scripts/verify-experience.mjs` (from the portfolio directory) → 8/8 Chromium/WebKit × 390/1440 × reduced/normal profiles passed with no overflow or page errors. A mobile overlap found in screenshot review was fixed before the final pass. `projects/portfolio/docs/EXPERIENCE_REVIEW.md` lists three owner choices; G2.5 remains pending explicit choice and approval.
- ✅ Closed the Jev workflow gap: `/build` now calls the deterministic domain resource selector and permits only optional public-text Jev shadow suggestions; growth uses deterministic route/anchor/canonical checks before optional Jev link relevance. Timecoded second-pass observations for four videos are in `projects/portfolio/docs/TASTE_REPORT.md`; temporary source-media contact sheets were removed. `node scripts/validate-brain.mjs` → 107 resources, 16 patterns, 42 tools, 8 domains; `node scripts/validate-contracts.mjs` → 11 roles, 17 handoffs; `node --test tests/platform/*.test.mjs` → 16 pass, 0 fail.
- ✅ Updated the Archify workflow to show specialist brains, Jev shadow hints, Agent Browser, and G2.5/G3.5. `archify validate workflow --quality showcase` → 9/9 checks, 0 errors/warnings; `archify deliver` → HTML SHA-256 f7df5fd666441b4c05a08d1570556920c565534161bad46483a04aaa75d02e42; `archify visual-check` → browser containment pass at 1440×900 through 2048×1320; dark screenshot reviewed.
- ✅ Harness learning loop implemented: `scripts/improve.mjs` records redacted evidence-linked runs/feedback, diagnoses fixed failure categories, creates hash-bound JSON router proposals, evaluates baseline/candidate on target/regression/decline cases, requires exact owner approval for promotion, supports rollback and monitoring. `brain-evaluator` is offline with no gate authority. `node scripts/validate-brain.mjs` → 107 resources, 16 patterns, 43 tools, 9 domains, 2 router configs; `node scripts/validate-contracts.mjs` → 12 roles, 17 handoffs; `node --test tests/platform/*.test.mjs` → 18 pass, 0 fail. Real learning store: 0 runs, 0 feedback; active router-v1 unchanged. Nine curated selector fixtures: baseline 8/9, candidate 9/9, 0 fixture regressions, $0 API cost; this is instrumentation, not proven real-world improvement. See `docs/SELF_IMPROVING_BRAIN.md` and D36.
- ✅ Updated the Archify pipeline artifact for offline brain-evaluator and owner-reviewed router promotion. `archify validate` and `deliver --quality showcase` → 9/9 artifact checks, 0 composition errors/warnings, SHA-256 ec51754008d9dccc4488b426fbcfd87676809e8ccfa7e5769a2a78ec277e4aa9. The generated 1440×900 dark screenshot was inspected; the subsequent visual-check process emitted a pass receipt but did not exit cleanly and was interrupted, so its browser acceptance is not claimed.
- ✅ Prepared public harness snapshot per D37: `/projects/` ignored and 650 previously tracked project paths removed from the Git index while local folders remain. README now describes the Brain, gates, improvement loop and local-only sites. Removed root site-only CI; a clean `git checkout-index` export with no `projects/` passes `validate-brain` (107 resources/16 patterns/43 tools/9 domains/2 configs), `validate-contracts` (12 roles/0 public handoffs) and all 18 platform tests. Publication commit/push evidence follows.
- ✅ Public harness published to `Arrnnnaav/UIBuilder` main at `45ab09804d45bb7f083480b45c8cf3decffaf219` as one squashed commit. `git ls-tree -r --name-only origin/main projects` → 0 paths; local `projects/portfolio` remains present. GitHub Platform contracts run `36422598625` → success: https://github.com/Arrnnnaav/UIBuilder/actions/runs/36422598625. Older Git history still contains prior project snapshots.
- ✅ UIBuilder remains site-free: `Get-ChildItem projects -Force` → 0 entries. Updated harness published as `9c157341a125483bca98510dc1f84bc5b330b88c`; GitHub Platform CI run `36468503452` passed: https://github.com/Arrnnnaav/UIBuilder/actions/runs/36468503452. All three sites are under `D:\UiBuildProj` with clean local `main` repos and commits (`portfolio` 546 files, `demo` 91, `abizcreator` 98); private GitHub remotes exist. Pushes are pending because GitHub rejected `.github/workflows/ci.yml` without OAuth `workflow` scope; after `gh auth refresh -h github.com -s workflow`, push the existing local commits to start site CI. One pre-move portfolio copy is retained at `D:\UiBuildProj-transfer-backup-20260929\portfolio` for recovery.
