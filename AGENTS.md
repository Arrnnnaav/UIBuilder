# AGENTS.md — UIBuilder rulebook

UIBuilder is the harness repository: it contains the multi-agent pipeline, Brain, tools,
templates, evaluation and documentation used to design, build and verify websites. Site source
does not live in this repository. All generated sites live in separate repositories under
`D:\UiBuildProj`, one GitHub repository per site. Each site is handed to BusinessOS
(`D:\PROJECTS\abc\business-os`) only for approved SEO/AEO/GEO maintenance. Every agent, human
or AI, follows this file. If this file and a prompt disagree, this file wins; to change the
rules, edit this file.

## 0. How work is tracked
- Plans live in `plan/`, one file per phase (`plan/M0-setup.md` … `plan/M8-later.md`).
- `plan/PROGRESS.md` is the single status board. After finishing a task, tick it and add
  evidence: a command and its result, a URL, or a commit.
- `plan/DECISIONS.md` records every decision that changes stack, scope or policy.
- Don't start a phase until the previous phase's "Done when" is met, or PROGRESS.md records the waiver.

## 1. Core rules
1. **Files are the contract.** Agents read and write files in `D:\UiBuildProj\<slug>\docs/`. No state passes through chat.
2. **No UI code before `DESIGN.md` and `WIREFRAMES.md` exist and gate G2 has passed.**
3. **Load the `frontend-design` skill before any visual step.** Also use `web-design-guidelines` and `taste-skill` when they're installed.
4. **References are mechanisms, not assets.** Take layout ratios, timing and interaction logic. Never copy another site's assets, fonts, copy or code.
5. **Order: function first, polish second, 3D and media last.**
6. **Tools go through the router.** An agent uses only the tools listed for it in `brain/tools.json`. A tool whose `enabled_if` isn't met is not used; use its `fallback`.
7. **Minimal cost.** Default to free tiers. Before proposing any paid service, check the free-for-dev catalog (`brain/tools.json` → `free_tier_catalog`) and verify the provider's live pricing. Paid tools stay registered but disabled until the user enables them.
8. **Every agent finishes by writing `docs/handoff/<agent>.json`** (schema in `templates/docs/HANDOFF.schema.json`).
9. **Honest reporting.** Mark a gate passed only with command output as evidence.
10. **Measured improvement.** Each specialist handoff includes a run trace recorded through `scripts/improve.mjs`; traces contain references and metrics, not raw client text or secrets. `/learn` stores feedback and failure categories. Offline `brain-evaluator` may propose and evaluate JSON-only routing candidates, but cannot rewrite policy, promote itself, change gates, or deploy. Owner review of exact proposal/evaluation hashes is required for promotion; `UIBUILDER_LEARNING=0` restores the baseline selector.

## 2. Agents
Definitions are in `.claude/agents/*.md`. The main session is the Orchestrator.

| Agent | Owns | Writes |
|---|---|---|
| Orchestrator (main) | intake, state, gates, dispatch | `PRODUCT.md`, `STATE.md`, `BUILD_SPEC.json` |
| product-manager | capability scope, acceptance, priorities and delivery review; no gate authority | `PRODUCT_REQUIREMENTS.md`, `ACCEPTANCE.md`, `PRIORITIES.md` |
| research | references (≤5), competitors, the client's current site | `INSPIRATION.md`, `REFERENCE_BREAKDOWN.md` |
| taste-research | local video/site visual mechanisms, rights, timecoded storyboards, original interaction briefs | `TASTE_REPORT.md`, `EXPERIENCE_REVIEW.md` |
| ux | flows, IA, wireframes | `USER_FLOW.md`, `IA.md`, `WIREFRAMES.md` |
| design-director | 3 isolated directions → hybrid → design system; visual review | `DESIGN.md`, `MOTION.md`, `tokens.css`, `VISUAL_REVIEW.md` |
| frontend | pages, components, `/styleguide` | `app/`, `components/` |
| backend | contact action, email, CMS, env | `lib/`, `app/actions/`, `keystatic.config.ts` |
| growth | SEO/AEO/GEO strategy, SEO data files, audit | `SEO_STRATEGY.md`, `content/seo/*`, `content/schema/*`, `content/faq/*`, `public/llms.txt`, `GROWTH_REPORT.md` |
| link-building | source-backed backlinks, editorial targets, launch submissions and Search Console evidence; no publishing authority | `BACKLINKS.json`, `BACKLINK_PLAN.md`, `BACKLINK_REPORT.md`, `backlinks/*` |
| ship | QA, a11y, security, perf, deploy, launch video | `QA_REPORT.md`, `SECURITY_REPORT.md`, `PERF_REPORT.md` |
| domain-ops | owner-approved hostname, DNS, TLS, redirects, mail-auth and post-launch verification | `DOMAIN_PLAN.md`, `DOMAIN_REPORT.md` |
| brain-evaluator | offline run diagnosis, candidate evaluation and monitoring; no gate or promotion authority | `brain/learning/diagnosis.json`, proposals and evaluation reports |

Design Council rule: run the three directions as **separate forked agents**, each with no
access to the others. Only the critic sees all three.

## 3. Stages and gates
```
S1 Orchestrator + product-manager + growth(strategy) + link-building(plan) → PRODUCT.md, PRODUCT_REQUIREMENTS.md, ACCEPTANCE.md, PRIORITIES.md, SEO_STRATEGY.md, BACKLINK_PLAN.md
S2 ‖ research ‖ taste-research ‖ ux(+growth IA) ‖ backend-base
G1 brief + wireframes            — user approves
S3 design-director: A | B | C (forks) → critic → DESIGN.md
G2 design direction locked       — user approves
S3.5 original local interaction prototype + mobile/reduced-motion proof
G2.5 experience direction        — user reviews and approves exact artifacts
S4 ‖ frontend ‖ backend-domain ‖ growth(data files)
S5 design-director visual review → polish (max 2 loops)
S6 ship ‖ QA/a11y ‖ security ‖ perf ‖ growth audit ‖ link-building audit
G3 Definition of Done            — automatic
G3.5 final local release review   — user approves exact reviewed artifacts and target
S7 ship deploy ‖ domain-ops DNS/TLS ‖ growth live SEO checks → /connect (BusinessOS) → launch video → /learn
```
S4 starts after G2.5; S7 starts after G3 and G3.5. G2.5/G3.5 approvals live in `D:\UiBuildProj\<slug>\docs/approvals/` with hashes of the exact reviewed artifacts; agents cannot infer or write owner approval from silence. Any external preview or production deployment requires G3.5 for its named target. Domain purchases and live DNS changes require separate explicit owner approval; see `plan/DOMAIN-LAUNCH.md`.

## 4. Definition of Done (G3)
- **Build:** `tsc --noEmit`, `eslint` and `next build` pass. No console or hydration errors.
- **E2E:** Playwright passes on every page, nav, the contact form (Turnstile test key), 404 and the error boundary. Run at 390px and 1440px, in Chromium and WebKit.
- **Accessibility:** axe finds 0 serious/critical issues. Keyboard navigation works, contrast is AA, `prefers-reduced-motion` is respected.
- **Performance:** Lighthouse ≥ 90 in every category on every page. LCP < 2.5s, CLS < 0.1.
- **Security:** the `security-review` skill finds no high issues and `npm audit --audit-level=high` is clean. CSP is set, the contact route uses Zod and is rate-limited, and no secrets reach the client.
- **Growth:**
  - every route is in `content/seo/routes.json`
  - JSON-LD is valid
  - `llms.txt`, sitemap and robots are present
  - key pages have answer-first FAQ blocks
  - `seo.manifest.json` is valid
  - `npm run seo:audit` finds 0 high issues
- **Monitoring:** a Sentry test error arrives and a PostHog pageview is recorded, when keys exist. Without keys, both must no-op cleanly.
- **Visual:** visual snapshots are committed and no raw colours appear outside the tokens (`npm run lint:tokens`).

## 5. Default stack (the golden stack; a recipe may drop parts)
- **App:** Next.js App Router, TypeScript, Tailwind v4, shadcn/ui, Motion, Zod.
- **Hosting:** personal/non-commercial sites on Vercel Hobby. Commercial clients on Cloudflare Workers (OpenNext) in a **client-owned** account.
- **CMS:** Keystatic in GitHub mode for blogs and case studies.
- **Contact:** a server action with Zod, Resend, Cloudflare Turnstile and a per-IP rate limit.
- **Analytics and errors:** PostHog in cookieless mode, Sentry. Both are optional and switch on via env.
- **Fonts:** Google Fonts or Fontshare only.
- **Auth:** none on marketing sites. The SaaS recipe uses Clerk, with Better Auth as the $0 fallback.

## 6. SEO contract (lets BusinessOS maintain the site)
SEO data lives in data files and is never hard-coded:
- `content/seo/routes.json`: per-route title, description, canonical, robots and OG
- `content/schema/*.json`: JSON-LD
- `content/faq/*.json`: FAQ blocks, which also feed the FAQPage schema
- `public/llms.txt`
- `content/seo/crawlers.json`: AI crawler policy

`seo.manifest.json` declares the editable paths. BusinessOS may change only those paths, through
an owner-approved PR followed by a separate owner approval to publish. See the BusinessOS spec
`docs/superpowers/specs/2026-09-25-git-site-connector-design.md`.

## 7. Designer Brain (`brain/`)
- `resources.json` holds each resource's category, usage_mode, best_for, trust and provenance.
- `patterns/*.json` holds patterns with provenance, scored per `project_type`.
- `preferences.md` records the user's taste: what they approved and what they rejected.
- `builds/<slug>.json` records the pipeline, resources and patterns used, the **lineage** (which source produced each section), scores and feedback.
- `domains.json` maps each stage to specialist agents, outputs and resource categories. `scripts/recommend-resources.mjs` gives an explainable shortlist and a separate review queue. Jev may add shadow-mode semantic hints after deterministic filtering; it has no gate, rights or deployment authority.
- `learning/` stores redacted run and feedback records, failure diagnosis, versioned resource-router candidates, separate eval cases, promotion receipts and rollback versions. `brain-evaluator` analyzes it offline. A passing fixture eval never overrides source rights, owner gates or real outcome review; see `docs/SELF_IMPROVING_BRAIN.md`.
- The trust ladder is NEW → REVIEWED → TESTED → APPROVED → TRUSTED, with REJECTED and DEPRECATED as exits. Only APPROVED and TRUSTED resources are used by default.

## 8. Commands
Projects must be scaffolded under `D:\UiBuildProj\<slug>` and initialized as independent Git
repositories. The root command `node scripts/new-project.mjs <pipeline> <slug>` creates the
external folder, commits the starter, and creates/pushes a private GitHub repository by default.
GitHub CLI (`gh`) must be authenticated with `repo` and `workflow` scopes; run
`gh auth refresh -h github.com -s workflow` if CI workflow pushes are rejected.
`UIBUILDER_GITHUB_OWNER` selects the owner account.
`UIBUILDER_PROJECTS_ROOT` may override the folder for another machine. Each project owns its GitHub remote, CI/CD workflows, deployment settings,
secrets and site-specific rulebook; site CI runs from that project repository. Do not put site
source, site CI, or site deployments inside the UIBuilder repository. Root CI checks the harness
only. Use `/build <pipeline> <slug>` to work on the external project repository.

- `/build <pipeline> <slug>` runs a full pipeline.
- `/intake <links>` adds resources to the brain.
- `/gate <slug> <G1|G2|G2.5|G3|G3.5>` checks a gate.
- `/learn <slug>` writes build memory.
- `/improve <status|category>` diagnoses verified failures and evaluates bounded Brain candidates offline.
- `/brag <slug> [product|company]` prepares a source-backed promotional launch package; it does not bypass gates or deploy.
- `/connect <slug>` hands the site to BusinessOS.
- `/backlinks <slug> <init|validate|report>` manages source-backed backlink records without publishing.
