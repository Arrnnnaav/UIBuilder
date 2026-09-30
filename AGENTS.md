# AGENTS.md — UIBuilder rulebook

UIBuilder is the **harness**: multi-agent pipeline, Brain, tools, templates, evaluation and docs for designing, building and verifying websites. Site source is never here. Each site is its own repo under `D:\UiBuildProj\<slug>`, handed to BusinessOS (`D:\PROJECTS\abc\business-os`) only for approved SEO/AEO/GEO maintenance. If this file and a prompt disagree, this file wins; change rules by editing this file.

Enforcement tags: **[gate]** script/gate blocks it · **[validate]** validator fails it · **[owner]** needs owner approval · **[honor]** trust + review; **[gate+honor]** partly checked, rest is review. Prefer turning `[honor]` rules into checks; delete ones that never matter.

## 0. Where to look
| Doing… | Read |
|---|---|
| Any new session | `docs/AGENT_BOOTSTRAP.md`, `plan/PROGRESS.md`, site `docs/STATE.md` |
| Building a site | `.claude/commands/build.md`, `pipelines/<recipe>/PIPELINE.md` |
| Checking a gate | `node scripts/gate.mjs <slug> <gate>`, §3–4 below |
| Picking tools/skills | `brain/tools.json`, `docs/TOOL_AND_SKILL_ROUTING.md` |
| Model tier / context cost | `brain/agent-budget.json`, `node scripts/context-budget.mjs` |
| Premium bar, immersive media | `brain/playbooks/{taste-core,premium-bar,immersive-playbook}.md`, `node scripts/premium-lint.mjs <slug>`, `node scripts/media-preflight.mjs`, `scripts/media-generate.mjs`, `scripts/media-inbox-check.mjs`, `templates/docs/MEDIA_REQUEST.md`, `docs/MEDIA_PROVIDERS.md` (providers, prices, terms), `docs/OWNER_SETUP.md` (what to set up, fallbacks) |
| Owner decisions, project plan, competitor evidence | `scripts/owner.mjs`, `scripts/resource-plan.mjs` (`docs/RESOURCE_PLAN.json`), `scripts/competitor-audit.mjs`, `templates/docs/DISCOVERY.md` |
| Brain / learning | `docs/BRAIN_ARCHITECTURE.md`, `docs/SELF_IMPROVING_BRAIN.md`, `docs/RESOURCE_LIBRARY.md` |
| Commands/CLI | `docs/COMMANDS.md` |

Tracking: plans in `plan/` (one file per phase); `plan/PROGRESS.md` is the only status board (tick + evidence: command result, URL or commit); `plan/DECISIONS.md` logs every stack/scope/policy change. Don't start a phase before the previous "Done when" is met or PROGRESS records a waiver.

## 1. Core rules
1. **Files are the contract.** Agents read/write `D:\UiBuildProj\<slug>\docs/`; no state via chat. [validate]
2. **Preflight first.** Every new agent/session runs `docs/AGENT_BOOTSTRAP.md` (`node scripts/agent-bootstrap.mjs --task <task> --project <site-path>`); `--install` only for missing approved items. Never auto-install unreviewed/paid services, MCP servers, credentials or write/deploy plugins. Record setup and fallbacks in the handoff (`environment.bootstrap_task`, `skills_checked`, `unavailable_and_fallbacks`; a legacy handoff may carry `environment.waiver` with a reason). [gate]
3. **No production UI before `DESIGN.md` + `WIREFRAMES.md` + G2 pass.** Pre-G2 the design-director may make only standalone visual-review HTML (no app imports, routes, service calls or shipping), paired with a short Markdown. [gate]
4. **Load `frontend-design` before any visual step**. Design agents load `brain/playbooks/taste-core.md` (distilled anti-slop rules, dials, pre-flight) instead of the full `taste-skill`; other skills load per stage from `brain/agent-budget.json`. If missing, use `frontend-ui-engineering` + accessibility skills and record the gap. Frontend, design-director and taste-research handoffs must list `frontend-design` in `environment.skills_used` (or the gap in `unavailable_and_fallbacks`). [gate]
5. **References are mechanisms, not assets.** Take ratios, timing, interaction logic; never copy assets, fonts, copy or code. Handoff `resources_used` holds only Brain ids (not retired; code-type ones need a license); anything else goes in `inputs_used`. The gate checks that much; whether an agent actually copied is a review item. [gate+honor]
6. **Function first, polish second, 3D/media last, but never generic.** Every project needs a bespoke experience thesis and story-led motion. G2 shows ≥2 distinct concepts (HTML + concise Markdown); owner chooses before production UI. Keep it fast, accessible, keyboard/touch operable, reduced-motion safe. [owner]
7. **Tools go through the router.** An agent uses only its `brain/tools.json` tools; if `enabled_if` fails, use the `fallback`. [validate]
8. **Minimal cost.** Free tiers first; check `free_tier_catalog` and live pricing before proposing paid; paid tools stay disabled until the owner enables them. [owner]
9. **Every agent ends with `docs/handoff/<agent>.json`** (`docs/HANDOFF.schema.json`): bootstrap task, skills/tools used, unavailable items + fallbacks. [validate]
10. **Honest reporting.** A gate passes only with command output as evidence. [gate]
11. **Measured improvement.** Each handoff includes a trace via `scripts/improve.mjs` (references/metrics only, no raw client text or secrets). `brain-evaluator` may propose JSON-only routing candidates offline; it cannot change policy, gates or deploys, or promote itself. Promotion needs owner review of exact proposal/eval hashes. `UIBUILDER_LEARNING=0` restores baseline. [owner]

## 2. Agents
Definitions: `.claude/agents/*.md`. Main session = Orchestrator.
| Agent | Owns | Writes |
|---|---|---|
| Orchestrator | intake, state, gates, dispatch | `PRODUCT.md`, `STATE.md`, `BUILD_SPEC.json` |
| product-manager | scope, acceptance, priorities, delivery review; no gate authority | `PRODUCT_REQUIREMENTS.md`, `ACCEPTANCE.md`, `PRIORITIES.md` |
| research | ≤5 references, competitors, client's current site | `INSPIRATION.md`, `REFERENCE_BREAKDOWN.md` |
| taste-research | local video/site mechanisms, rights, storyboards, original interaction briefs | `TASTE_REPORT.md`, `EXPERIENCE_REVIEW.md` |
| ux | flows, IA, wireframes | `USER_FLOW.md`, `IA.md`, `WIREFRAMES.md` |
| design-director | 3 isolated directions → hybrid → design system; visual review | `DESIGN.md`, `MOTION.md`, `tokens.css`, `VISUAL_REVIEW.md` |
| production-auditor | phased production-readiness audit + repairs; no gate/deploy authority | `PRODUCTION_READINESS_REPORT.md`, `LAUNCH_DAY_CHECKLIST.md` |
| frontend | pages, components, `/styleguide` | `app/`, `components/` |
| backend | contact action, email, CMS, env | `lib/`, `app/actions/`, `keystatic.config.ts` |
| growth | SEO/AEO/GEO strategy, data files, audit | `SEO_STRATEGY.md`, `content/seo/*`, `content/schema/*`, `content/faq/*`, `public/llms.txt`, `GROWTH_REPORT.md` |
| link-building | source-backed backlink plan/evidence; no publishing authority | `BACKLINKS.json`, `BACKLINK_PLAN.md`, `BACKLINK_REPORT.md` |
| ship | QA, a11y, security, perf, deploy, launch video | `QA_REPORT.md`, `SECURITY_REPORT.md`, `PERF_REPORT.md` |
| domain-ops | owner-approved hostname, DNS, TLS, redirects, mail-auth checks | `DOMAIN_PLAN.md`, `DOMAIN_REPORT.md` |
| brain-evaluator | offline run diagnosis, candidate eval, monitoring; no gate/promotion authority | `brain/learning/*` reports and proposals |

Design Council: run the three directions as **separate forked agents** with no access to each other; only the critic sees all three.

## 3. Stages and gates
```
S1 Orchestrator + product-manager + growth(strategy) + link-building(plan)
S2 research ‖ taste-research ‖ ux(+growth IA) ‖ backend-base
G1   brief + wireframes — owner approves
S3 design-director A|B|C (forks) → critic → DESIGN.md + DESIGN_REVIEW.md/.html
G2   direction locked — owner compares visual HTML + Markdown, approves exact hashes
S3.5 original local interaction prototype + mobile/reduced-motion proof + paired review
G2.5 experience direction — owner approves exact artifacts
S4 frontend ‖ backend-domain ‖ growth(data files)      (starts after G2.5)
S5 design-director visual review → polish (max 2 loops)
S6 production-auditor → ship ‖ QA/a11y ‖ security ‖ perf ‖ growth audit ‖ link-building audit
G3   Definition of Done (§4) — automatic
G3.5 final local release review — owner approves exact artifacts + named target
S7 ship deploy ‖ domain-ops DNS/TLS ‖ growth live SEO → /connect → launch video → /learn   (after G3 + G3.5)
```
Owner approvals live in `D:\UiBuildProj\<slug>\docs/approvals/` with hashes of exact reviewed artifacts. Agents never infer or write approval; any change to a reviewed file voids it. G2 needs `docs/DESIGN_REVIEW.md` + `.html` (2–3 distinct directions when there's a real choice, one recommended); G2.5 needs `docs/EXPERIENCE_REVIEW.md` + `.html`. Sites created under contract version 2 (`BUILD_SPEC.json`) also need a complete `docs/DISCOVERY.md` and audited competitors at G1 (company and product sites) and a sourced Decision record in DESIGN.md and MOTION.md at G2; older sites are not held to these. Any external preview or deploy needs G3.5 for that named target. Domain purchase and live DNS changes need separate explicit owner approval (`plan/DOMAIN-LAUNCH.md`).

## 4. Definition of Done (G3)
- **Build:** `tsc --noEmit`, `eslint`, `next build` pass; no console/hydration errors.
- **E2E:** Playwright passes every page, nav, contact form (Turnstile test key), 404, error boundary; 390px + 1440px, Chromium + WebKit.
- **A11y:** axe 0 serious/critical; keyboard works; AA contrast; `prefers-reduced-motion` respected.
- **Perf:** Lighthouse ≥ 90 every category, every page; LCP < 2.5s; CLS < 0.1.
- **Security:** `security-review` skill no highs; package audit no highs; Semgrep triaged clean; Gitleaks clean; CSP set; contact route Zod-validated + rate-limited; no secrets client-side.
- **Growth:** every route in `content/seo/routes.json`; valid JSON-LD; `llms.txt`, sitemap, robots present; answer-first FAQ on key pages; valid `seo.manifest.json`; `npm run seo:audit` 0 high.
- **Monitoring:** Sentry test error + PostHog pageview arrive when keys exist; no-op cleanly without keys.
- **Visual:** snapshots committed; no raw colours outside tokens (`npm run lint:tokens`).
- **Audit:** `/audit` report and handoff complete (`/build` runs it in S6; it cannot pass G3/G3.5 or deploy).

## 5. Default stack (a recipe may drop parts)
Next.js App Router · TypeScript · Tailwind v4 · shadcn/ui · Motion · Zod. Hosting: personal sites on Vercel Hobby; commercial on Cloudflare Workers (OpenNext) in a **client-owned** account. CMS: Keystatic (GitHub mode). Contact: server action + Zod + Resend + Turnstile + per-IP rate limit. PostHog (cookieless) + Sentry, optional via env. Fonts: Google Fonts or Fontshare only. Auth: none on marketing sites (SaaS recipe: Clerk, fallback Better Auth). Static-first: keep first-viewport content out of client-only wrappers (mobile LCP).

## 6. SEO contract (lets BusinessOS maintain the site)
SEO data lives in files, never hard-coded: `content/seo/routes.json` (title, description, canonical, robots, OG) · `content/schema/*.json` (JSON-LD) · `content/faq/*.json` (FAQ blocks, feed FAQPage schema) · `public/llms.txt` · `content/seo/crawlers.json` (AI crawler policy). `seo.manifest.json` lists editable paths; BusinessOS may change only those, via an owner-approved PR plus a separate publish approval (spec: BusinessOS `docs/superpowers/specs/2026-09-25-git-site-connector-design.md`).

## 7. Designer Brain (`brain/`)
`resources.json` (rights, provenance, trust, `my_take`) · `patterns/*.json` · `preferences.md` (owner taste) · `builds/<slug>.json` (lineage, scores, feedback) · `domains.json` + `scripts/recommend-resources.mjs` (explainable shortlist; Jev hints are shadow-only after deterministic filtering, no authority) · `learning/` (redacted runs/feedback, diagnosis, router candidates, evals, receipts, rollback) · `playbooks/visual-storytelling.md` (paraphrased mechanisms; personal themes opt-in from the owner, never invent titles/dates/results).
Trust ladder: NEW → REVIEWED → TESTED → APPROVED → TRUSTED (exits: REJECTED, DEPRECATED). Code, skill, dependency and tool resources need APPROVED/TRUSTED plus license/tool checks. Mechanism-only resources (inspiration/research/practice) are usable at any non-retired trust once task words match, unless `use_caution` or a license restriction keeps them in review: the owner keeps those (lightswind, mobbin, open-seo) and an agent that needs one asks the owner for approval, then records it in its handoff `decisions` (D45, D52). `taxonomy.json` maps raw categories so every resource reaches a domain. Owner controls (`brain/owner-controls.json`: boost, pin_for, avoid_for, ban, trust, rights; each change logged in `owner-decisions.jsonl`) are set only by the owner and steer the shortlist; `my_take` text is guidance the agent reads. A passing fixture eval never overrides rights, owner gates or real outcome review.

## 8. Commands
Sites are scaffolded only under `D:\UiBuildProj\<slug>` as independent Git repos: `node scripts/new-project.mjs <pipeline> <slug>` (needs `gh` with `repo` + `workflow` scopes; `UIBUILDER_GITHUB_OWNER`, `UIBUILDER_PROJECTS_ROOT` override defaults). Each site owns its remote, CI/CD, secrets and rulebook; root CI checks the harness only.
`/build <pipeline> <slug>` · `/intake <links>` · `/gate <slug> <G1|G2|G2.5|G3|G3.5>` · `/audit <slug>` · `/backlinks <slug> <init|validate|report>` · `/learn <slug>` · `/improve <status|category>` · `/brag <slug> [product|company]` · `/connect <slug>`.
Utilities (details in `docs/COMMANDS.md`): `runtime.mjs packet|event|status` (host-run task packets; never auto-spawns agents) · `improve.mjs outcomes` · `migrate-site-security.mjs <slug> [--apply]` · `visual-eval.mjs <file>` · `agent-bootstrap.mjs --task <frontend|website|full-site|visual-research|browser|video|review>`.
