# UIBuilder

UIBuilder is the harness for building, reviewing and shipping high-quality websites with a controlled team of specialist agents. It is the **pipeline and brain repository**. Site source, site CI and deployment configuration live in independent repositories under `D:\UiBuildProj\<slug>`.

## What the harness does

```text
brief Ã¢â€ â€™ research Ã¢â€ â€™ UX Ã¢â€ â€™ design council Ã¢â€ â€™ owner review
      Ã¢â€ â€™ interaction review Ã¢â€ â€™ implementation Ã¢â€ â€™ QA/security/perf/growth
      Ã¢â€ â€™ release review Ã¢â€ â€™ deploy/domain checks Ã¢â€ â€™ learn/improve
```

The Orchestrator owns state and dispatch. Specialist agents own bounded artifacts. Files are the contract, so a paused session can be resumed without relying on chat history.

## Repository map

| Path | Purpose |
|---|---|
| [`AGENTS.md`](AGENTS.md) | Rulebook, stages, gates, agent ownership and quality contract |
| `.claude/agents/` | Specialist agent contracts |
| `.claude/commands/` | `/build`, `/intake`, `/gate`, `/learn`, `/improve`, `/connect` and `/brag` |
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
- **G2:** owner locks one design direction.
- **G2.5:** owner approves the exact local interaction prototype, mobile proof and reduced-motion behavior.
- **G3:** automated definition of done: build, browser tests, accessibility, security, performance and growth checks.
- **G3.5:** owner approves the exact final local artifacts and named external target.

No external preview or production deployment is allowed before G3.5. Domain purchases and DNS changes require a separate explicit approval.

## The Brain

The Brain is a controlled knowledge and routing layer, not an unbounded self-editing model.

- `brain/resources.json` stores sourced resources with rights, provenance, trust and usage metadata.
- `brain/patterns/` stores reusable design and implementation mechanisms.
- `brain/tools.json` defines agent allowlists, preconditions, fallbacks and cost controls.
- `brain/preferences.md` stores verified owner taste and rejected patterns.
- `brain/builds/` stores project lineage, scores and feedback.
- `brain/learning/` stores redacted traces, failure categories, proposals, evaluations and rollback versions.

The default trust ladder is `NEW Ã¢â€ â€™ REVIEWED Ã¢â€ â€™ TESTED Ã¢â€ â€™ APPROVED Ã¢â€ â€™ TRUSTED`. Only `APPROVED` and `TRUSTED` resources are used by default. Jev can provide shadow-mode semantic hints after deterministic filtering; it cannot pass gates, bypass rights checks or deploy.

The improvement loop is:

```text
trace Ã¢â€ â€™ feedback/objective checks Ã¢â€ â€™ failure category
      Ã¢â€ â€™ bounded proposal Ã¢â€ â€™ baseline/candidate evaluation
      Ã¢â€ â€™ exact owner review Ã¢â€ â€™ promote or reject Ã¢â€ â€™ monitor/rollback
```

Run it with:

```sh
node scripts/improve.mjs diagnose
node scripts/improve.mjs monitor
node scripts/improve.mjs evaluate brain/learning/candidates/router-v2-token-match.json brain/learning/evals/resource-routing-v1.json
```

`UIBUILDER_LEARNING=0` restores the baseline selector. See [`docs/SELF_IMPROVING_BRAIN.md`](docs/SELF_IMPROVING_BRAIN.md).

## Product promotion with `/brag`

`/brag <slug> [product|company]` prepares a promotional package for a shipped product or company site. It reads approved project evidence and writes reviewable files under the external site repository:

- `docs/launch/BRAG_BRIEF.md` Ã¢â‚¬â€ audience, promise, proof and campaign angle
- `docs/launch/PROMO_COPY.md` Ã¢â‚¬â€ hero, feature, social and email variants
- `docs/launch/LAUNCH_SCRIPT.md` Ã¢â‚¬â€ short promotional video/storyboard script
- `docs/launch/SHOT_LIST.md` Ã¢â‚¬â€ product-led scenes and required captures
- `docs/launch/BRAG_HANDOFF.json` Ã¢â‚¬â€ sources, evidence, rights and open approvals

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
| `/intake <links>` | Add researched resources to the Brain |
| `/gate <slug> <G1\|G2\|G2.5\|G3\|G3.5>` | Check a gate using current evidence |
| `/learn <slug>` | Record lineage, outcomes and owner feedback |
| `/improve <status\|category>` | Diagnose and evaluate bounded Brain changes |
| `/brag <slug> [product\|company]` | Prepare a promotional launch package |
| `/connect <slug>` | Hand an approved site to BusinessOS |
| `/backlinks <slug> <init\|validate\|report>` | Maintain a source-backed backlink plan and quality report without publishing |

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
