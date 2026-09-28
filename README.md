# UIBuilder

UIBuilder is a file-driven, multi-agent harness for designing, building, testing and shipping websites. It keeps briefs, design decisions, tool permissions, test evidence and owner approvals in files so a build can be reviewed and resumed. The rules are in [AGENTS.md](AGENTS.md), and the status board is [plan/PROGRESS.md](plan/PROGRESS.md).

## What is in this repository

| Path | Purpose |
|---|---|
| `brain/` | Curated resources and patterns, specialist domains, tool router, preferences, build lineage and the measured improvement loop |
| `.claude/` | Specialist agent definitions, slash commands and redistributable project skills |
| `pipelines/` | Website recipes and stack choices |
| `templates/` | Site starter and project document contracts |
| `scripts/` and `tests/platform/` | Scaffolding, routing, gates, validation, evaluation and rollback checks |
| `plan/` and `docs/` | Decisions, progress, architecture, research and operating guides |

**Site folders in `projects/` are local-only and ignored by the root repository.** A new project created by `node scripts/new-project.mjs portfolio my-site` stays on your machine. Use `--standalone` when preparing a separate site repository, then move that site outside this checkout before publishing it. Previously published UIBuilder commits contained project folders; removing them from the current tree does not erase Git history.

## Pipeline and approval gates

The Orchestrator assigns work to product, research, taste, UX, design, engineering, growth, quality and domain specialists. Agents write named project documents and handoff records. G1 approves scope and wireframes; G2 locks design; G2.5 approves a local interaction prototype before UI implementation; G3 requires automated quality evidence; G3.5 approves the exact final local build and external target before any new preview or production deployment. Domain and BusinessOS publish changes have separate owner approvals. See the [Brain architecture](docs/BRAIN_ARCHITECTURE.md) and [interactive pipeline diagram](docs/architecture/uibuilder-pipeline.html).

The Brain recommends resources through deterministic trust, rights, relevance and availability checks. TypeSafe Jev may provide a shadow-mode suggestion for ambiguous public-text routing or link relevance; it cannot pass a gate or select a restricted resource. Agent Browser is available for exploratory browser inspection; Playwright remains the cross-browser release test runner. See [tool and skill routing](docs/TOOL_AND_SKILL_ROUTING.md).

## Measured improvement

`/learn` records owner feedback and build lineage. The offline `/improve` flow records redacted run traces, groups verified failures, evaluates versioned resource-router candidates on the same target, regression and decline cases, and requires exact owner review before promotion. `UIBUILDER_LEARNING=0` forces the baseline router. The active version is still `router-v1`; curated fixtures are not proof of real-world improvement. See the [operating guide](docs/SELF_IMPROVING_BRAIN.md).

```sh
node scripts/improve.mjs diagnose
node scripts/improve.mjs monitor
node scripts/improve.mjs evaluate brain/learning/candidates/router-v2-token-match.json brain/learning/evals/resource-routing-v1.json
```

## Validate the harness

Requires Node.js 24 for parity with GitHub Actions. These commands do not need a site folder or paid service:

```sh
node scripts/validate-brain.mjs
node scripts/validate-contracts.mjs
node --test tests/platform/*.test.mjs
```

To check a local site, enter its `projects/<slug>/` folder and use its own package scripts. The root CI validates the harness; site CI belongs in each separately published site repository. Local site evidence referenced by historical plan files is not included in this public harness snapshot.

Original UIBuilder pipeline code and documentation are licensed under [Apache-2.0](LICENSE). Vendored skills retain their upstream licenses; see [licensing scope](docs/LICENSING.md) and [skill sources](.claude/skills/SOURCES.md).
