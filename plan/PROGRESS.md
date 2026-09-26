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
- 🟡 G3 on the untouched starter (`demo`):
  - pass: typecheck, lint, tokens, content, unit, prod audit, build, server, seo:audit (0 high)
  - fail: perf and e2e, while the M6 agent was building at the same time. That meant browser crashes, and mobile LCP 3.3s against 2.46s when the machine was idle. The same code passed alone.
  - fix: perf is now the median of 3 runs. G3 is re-run once the machine is idle.
  - ⛔ 2026-09-25: Claude Code stopped the idle re-run because system memory ran low. Needs a re-run when memory allows: `node scripts/gate.mjs demo G3`.
- Fixes found by running G3:
  - The Node 24 on Windows libuv assertion when calling `process.exit` inside fetch: the probe now runs in-process.
  - Snapshot seeding needs a seed pass, then a verify pass.
  - Audit gates only prod deps (clean). Dev tooling has 2 unpatchable extract-zip highs via lighthouse and puppeteer; they are reported but never ship. `tmp` is overridden to ≥ 0.2.6.

## M4 — Portfolio 🟡
- ✅ Platform follow-up, 2026-09-26: default scaffolding keeps projects in the
  root repository; `--standalone` is explicit. `node --test tests/platform/*.test.mjs`
  → 4/4 pass; `node scripts/validate-contracts.mjs` → 9 roles/9 handoffs valid;
  `node scripts/validate-brain.mjs` → 86 resources/12 patterns/36 tools valid.
  Root CI and product-manager role/templates are added. Remote CI results and
  full site G3 remain unverified; repository LICENSE awaits owner selection.
- 🟡 Current S4 working tree: sourced portfolio content, route metadata, schemas,
  FAQs and growth handoff are drafted; frontend integration is in progress.
  These changes have not passed production runtime SEO or full G3 checks.
- ✅ S1 content:
  - `docs/CONTENT_SOURCE.md`, built from `ArnavResume.pdf` plus a read-only pass over 26 public GitHub repos
  - 6 flagships: Edge Node, Cited Researcher, LedgerBridge, GhostCursor, NeuroUX, StudyOS
  - every number is sourced; 3 résumé numbers are flagged as unsourced
- ✅ `docs/PRODUCT.md` draft, with 10 open questions for G1
- ✅ 2026-09-26 status audit: `node scripts/gate.mjs portfolio G1` → passed 10/10;
  `node scripts/gate.mjs portfolio G2` → passed 8/8. G1 and G2 owner approvals are
  recorded in `projects/portfolio/docs/STATE.md`. S1/S2/S3 files and handoffs exist.
- 🟡 S4 remains incomplete after the Claude API 429 shown in the 2026-09-26 screenshot.
  `app/page.tsx` is still the starter placeholder; `content/site.json`,
  `content/seo/routes.json`, schema, FAQ and `public/llms.txt` still contain
  `Site Name` / `example.com`. No `/work` or `/about` routes exist yet.
  The S4 content-data agent has no handoff. S5/S6/G3/S7 remain pending.
- ✅ Screenshot /intake recovered: 12 links were reviewed and added to
  `brain/resources.json` (the anti-slop URL was corrected to
  `miqdadbadjuber/anti-slop`). `node scripts/validate-brain.mjs` → valid,
  86 resources, 12 patterns, 36 tools. Project-local frontend-design,
  anti-slop, UI Skills review skills and scroll-world were installed;
  provenance is in `.claude/skills/SOURCES.md`. None is a new production
  dependency or an enabled paid service.
- ✅ Portfolio starter health check, 2026-09-26: `pnpm typecheck` exit 0;
  `pnpm lint` exit 0; `pnpm lint:tokens` exit 0 (26 files);
  `pnpm test` exit 0 (12/12). `pnpm seo:audit` returned exit 2 because
  no site server was running at localhost:3000; rerun it against a built,
  started site during S6. These passes cover the starter, not the S4 site.
- ✅ Git publication, 2026-09-26: root `.gitignore` excludes local credentials,
  dependencies, build output, browser logs, and two vendored skills without
  redistribution terms; `.env.example` is explicitly included. The three
  zero-commit nested `.git` directories were preserved in ignored
  `.git-metadata-backup/` so project source is committed as ordinary files.
  Initial commit `968cb80` contains 459 files; `git push -u origin main`
  succeeded to `https://github.com/Arrnnnaav/UIBuilder.git`.

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
