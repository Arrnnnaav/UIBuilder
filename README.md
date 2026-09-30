# UIBuilder

UIBuilder is the harness for building, reviewing and shipping high-quality websites with a controlled team of specialist agents. It is the **pipeline and brain repository**. Site source, site CI and deployment configuration live in independent repositories under `D:\UiBuildProj\<slug>`.

## What the harness does

```text
brief → research → UX → design council → owner review
      → interaction review → implementation → QA/security/perf/growth
      → release review → deploy/domain checks → learn/improve
```

The Orchestrator owns state and dispatch. Specialist agents own bounded artifacts. Files are the contract, so a paused session can be resumed without relying on chat history.

## Repository map

| Path | Purpose |
|---|---|
| [`AGENTS.md`](AGENTS.md) | Rulebook, stages, gates, agent ownership and quality contract |
| [`docs/AGENT_BOOTSTRAP.md`](docs/AGENT_BOOTSTRAP.md) | Fresh-agent context/preflight sequence, pinned skill/tool sources and installation boundaries |
| `.claude/agents/` | Specialist agent contracts |
| `.claude/commands/` | `/build`, `/audit`, `/intake`, `/gate`, `/learn`, `/improve`, `/connect` and `/brag` |
| `brain/` | Resources, patterns, preferences, tool router, lineage and learning records |
| `pipelines/` | Website recipes and stack-specific rules |
| `templates/` | Project starters, document contracts and approval schemas |
| `scripts/` | Scaffolding, recommendation, gate, validation and improvement CLIs |
| `tests/platform/` | Harness-level tests |
| `docs/` | Architecture, routing, licensing, gates and self-improvement guidance |
| `plan/` | Milestones, decisions and the single progress board |

## Agents

The main session is the Orchestrator. It dispatches:

- `product-manager`: scope, acceptance and priorities
- `research`: references, competitors and client evidence
- `taste-research`: visual mechanisms, rights and interaction studies
- `ux`: flows, information architecture and wireframes
- `design-director`: isolated design directions, critique, system and visual review
- `production-auditor`: phased cross-stack audit, verified low-risk repairs, readiness report and launch checklist; no gate/deploy authority
- `frontend`: pages and components
- `backend`: contact, CMS and server integrations
- `growth`: SEO, AEO, GEO, structured data and FAQs
- `link-building`: source-backed backlink planning, editorial/launch tracking and Search Console evidence
- `ship`: QA, accessibility, security, performance and deployment
- `domain-ops`: owner-approved DNS, TLS, redirects and post-launch checks
- `brain-evaluator`: offline diagnosis and bounded routing experiments

Every specialist writes named project artifacts and a JSON handoff. The handoff cites evidence and never grants a gate by itself.

## Gates

- **G1:** owner approves the brief and wireframes.
- **G2:** owner compares a standalone visual HTML with its concise Markdown decision sheet and approves exact hashes.
- **G2.5:** owner approves paired local prototype HTML/Markdown, mobile proof and reduced-motion behavior.
- **G3:** automated definition of done: build, browser tests, accessibility, security, performance and growth checks.
- **G3.5:** owner approves the exact final local artifacts and named external target.

No external preview or production deployment is allowed before G3.5. Domain purchases and DNS changes require a separate explicit approval.

The shared `/audit <slug>` workflow uses the canonical phased production-readiness prompt under `templates/prompts/`, copied into each site's `docs/prompts/`. It records the real stack and baseline, works through generated-code, UI/mobile, routes/states, SEO, accessibility, media/performance, backend, security, AI, maintainability, tests and release configuration, and creates a project report plus launch-day checklist. It cannot replace G3/G3.5.

Security and AI review adapters are cataloged in [`docs/TOOL_AND_SKILL_ROUTING.md`](docs/TOOL_AND_SKILL_ROUTING.md). The harness and future-site starter CI now run pinned, tokenless Semgrep Community Edition and Gitleaks CLI container scans, alongside deterministic project checks and the package-manager audit. CodeRabbit, PR-Agent, Kodus, CodeQL, SonarQube Scanner, OSV-Scanner, TruffleHog, Nuclei and Strix remain optional routes, not connected services. Active security testing requires an authorized local/staging target.

Existing site repositories can preview an additive security setup with `node scripts/migrate-site-security.mjs <slug>` and apply it with `--apply`; the utility refuses to overwrite any workflow or scanner files. The original Apache-2.0 Semgrep rules have positive and safe-negative fixture probes in CI. Harness CI skips vendored skill reference files and scans the harness's own code; project CI scans the project's site source. These rules are small guardrails, not comprehensive SAST coverage.

For provider-neutral dispatch, `node scripts/runtime.mjs packet <pipeline> <slug> <stage> <agent>` emits a bounded task packet. Claude Code, Codex or another host runs it and records lifecycle events; UIBuilder does not spawn unattended workers. `node scripts/improve.mjs outcomes [slug]` exposes measured telemetry coverage and verified feedback without treating missing metrics as zero or claiming causality.

The `product-site` pipeline targets product marketing and launch sites (not application functionality). Its owner-reviewed visual scorecard records story, distinction, motion and usability separately from automated gates; `node scripts/visual-eval.mjs <project>/docs/VISUAL_OUTCOME.json` checks completeness and evidence references but cannot approve a gate.

## Fresh-agent bootstrap

Before specialist work, use the task-aware checker from either the harness or a scaffolded site:

```powershell
node scripts/agent-bootstrap.mjs --task website --project .
node scripts/agent-bootstrap.mjs --task website --project . --install
```

Use the narrowest task and install only missing pinned entries. The free, license-reviewed
allowlist and fallbacks are in `brain/agent-bootstrap.json` (copied into each site's `docs/`).
Unknown-license/paid services, MCP servers, credentials and external write/deploy plugins remain
manual and disabled. `brain/tools.json` remains the authority for per-agent tool permissions.

## The Brain

The Brain is a controlled knowledge and routing layer, not an unbounded self-editing model.

- `brain/resources.json` stores sourced resources with rights, provenance, trust and usage metadata.
- Resource-specific owner guidance lives in each `my_take` field. Export/edit/import the spreadsheet-friendly column with `node scripts/resource-notes.mjs export` and `node scripts/resource-notes.mjs import`; see [`docs/RESOURCE_LIBRARY.md`](docs/RESOURCE_LIBRARY.md).
- `brain/patterns/` stores reusable design and implementation mechanisms.
- `brain/tools.json` defines agent allowlists, preconditions, fallbacks and cost controls.
- `brain/preferences.md` stores verified owner taste and rejected patterns.
- `brain/playbooks/visual-storytelling.md` stores paraphrased narrative mechanisms; user-specific themes remain opt-in and project source lineage remains project-local.
- `brain/builds/` stores project lineage, scores and feedback.
- `brain/learning/` stores redacted traces, failure categories, proposals, evaluations and rollback versions.

The default trust ladder is `NEW → REVIEWED → TESTED → APPROVED → TRUSTED`. Only `APPROVED` and `TRUSTED` resources are used by default. Jev can provide shadow-mode semantic hints after deterministic filtering; it cannot pass gates, bypass rights checks or deploy.

The improvement loop is:

```text
trace → feedback/objective checks → failure category
      → bounded proposal → baseline/candidate evaluation
      → exact owner review → promote or reject → monitor/rollback
```

Run it with:

```sh
node scripts/improve.mjs diagnose
node scripts/improve.mjs monitor
node scripts/improve.mjs evaluate brain/learning/candidates/router-v2-token-match.json brain/learning/evals/resource-routing-v1.json
```

`UIBUILDER_LEARNING=0` restores the baseline selector. See [`docs/SELF_IMPROVING_BRAIN.md`](docs/SELF_IMPROVING_BRAIN.md).

## Cost, quality and media controls

- **Context and model budget:** `brain/agent-budget.json` sets each agent's model tier, stage-based skill loading and startup-token cap. `node scripts/context-budget.mjs` and `node scripts/validate-agents.mjs` enforce it (also in `health.mjs`).
- **Resources:** every Brain resource maps to a domain through `brain/taxonomy.json`. Mechanism-only resources are usable once task words match; code, skill and tool resources need approval, a license and an enabled tool. `brain/tool-enable.json` is the owner switch for manually enabled tools.
- **Premium bar:** `brain/playbooks/taste-core.md` (rules and pre-flight), `premium-bar.md` (seven-dimension scorecard) and `immersive-playbook.md` (scroll film, 3D, story sequences). `node scripts/premium-lint.mjs <slug>` checks the mechanical bans on a site.
- **Paid media:** `node scripts/media-generate.mjs` renders clips through Runway Dev or the Gemini API. It is a dry run by default and needs an explicit approval at or above the estimate. `node scripts/media-preflight.mjs` reports what is ready, `node scripts/media-inbox-check.mjs` verifies clips made by hand in a free studio, and `templates/docs/MEDIA_REQUEST.md` is the step-by-step card the owner follows. Providers, prices and terms: [`docs/MEDIA_PROVIDERS.md`](docs/MEDIA_PROVIDERS.md); setup and fallbacks: [`docs/OWNER_SETUP.md`](docs/OWNER_SETUP.md).

## Product promotion with `/brag`

`/brag <slug> [product|company]` prepares a promotional package for a shipped product or company site. It reads approved project evidence and writes reviewable files under the external site repository:

- `docs/launch/BRAG_BRIEF.md` — audience, promise, proof and campaign angle
- `docs/launch/PROMO_COPY.md` — hero, feature, social and email variants
- `docs/launch/LAUNCH_SCRIPT.md` — short promotional video/storyboard script
- `docs/launch/SHOT_LIST.md` — product-led scenes and required captures
- `docs/launch/BRAG_HANDOFF.json` — sources, evidence, rights and open approvals

The command can use the `brag` tool for a launch video, poster or share copy when available. It does not invent product claims, copy reference assets, change the website or deploy. A promotional landing page is a normal product scope change and must pass G1/G2/G2.5/G3/G3.5.

## Create an independent site repository

```sh
node scripts/new-project.mjs portfolio my-site
node scripts/new-project.mjs company-site client-site
```

The command creates `D:\UiBuildProj\<slug>`, initializes its Git repository, commits the starter and creates/pushes a private GitHub repository using the authenticated `gh` account. Set `UIBUILDER_GITHUB_OWNER` to choose the owner or `UIBUILDER_PROJECTS_ROOT` to change the parent folder. Do not put site source, site CI or site deployments in this repository.

## Core commands

| Command | Purpose |
|---|---|
| `/build <pipeline> <slug>` | Run or resume the gated website pipeline |
| `/audit <slug>` | Run the phased production-readiness audit and repair workflow |
| `/intake <links>` | Add researched resources to the Brain |
| `/gate <slug> <G1\|G2\|G2.5\|G3\|G3.5>` | Check a gate using current evidence |
| `/learn <slug>` | Record lineage, outcomes and owner feedback |
| `/improve <status\|category>` | Diagnose and evaluate bounded Brain changes |
| `/brag <slug> [product\|company]` | Prepare a promotional launch package |
| `/connect <slug>` | Hand an approved site to BusinessOS |
| `/backlinks <slug> <init\|validate\|report>` | Maintain a source-backed backlink plan and quality report without publishing |

Additional harness utilities: `node scripts/runtime.mjs ...`, `node scripts/improve.mjs outcomes [slug]`, `node scripts/migrate-site-security.mjs <slug> [--apply]`, and `node scripts/visual-eval.mjs <project>/docs/VISUAL_OUTCOME.json`.

## Validate the harness

Requires Node.js 24 for parity with GitHub Actions:

```sh
node scripts/validate-brain.mjs
node scripts/validate-contracts.mjs
node --test tests/platform/*.test.mjs
```

Backlink records are project-local. Initialize them after scaffolding with
`node scripts/backlinks.mjs init <slug>`; validate with `node scripts/backlinks.mjs validate <slug>`
and generate `docs/BACKLINK_REPORT.md` with `node scripts/backlinks.mjs report <slug>`. The harness
never sends outreach, publishes articles, submits launch listings or claims ranking impact.

The root CI validates this harness only. Each site repository owns its own CI/CD workflow and deployment settings. See [`docs/COMMANDS.md`](docs/COMMANDS.md) for the difference between Claude Code commands, installed skills and the CLI surface.

## License

Original UIBuilder pipeline code and documentation are Apache-2.0. Vendored skills retain their upstream licenses; see [`docs/LICENSING.md`](docs/LICENSING.md) and [`.claude/skills/SOURCES.md`](.claude/skills/SOURCES.md).
