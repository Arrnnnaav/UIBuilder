# Harness command surfaces

UIBuilder has three command surfaces:

| Surface | Where it works | Example | Purpose |
|---|---|---|---|
| Claude Code slash command | `.claude/commands/` in a Claude Code session | `/brag portfolio product` | Orchestrates the agent workflow and writes project handoffs |
| Installed skill | Global agent skill directory | `Use the brag skill on D:\UiBuildProj\portfolio` | Supplies specialist instructions and assets to an agent |
| Harness CLI | Any terminal with Node.js | `node scripts/brag.mjs portfolio product` | Deterministic preflight and package generation, independent of chat UI |

The Codex chat command menu does not automatically expose repository-local Claude Code commands. In Codex, use the natural-language skill invocation or the equivalent harness CLI.

## `/brag` and `scripts/brag.mjs`

Both surfaces enforce the same safety boundary:

- The external site must exist under `UIBUILDER_PROJECTS_ROOT` (default `D:\UiBuildProj`).
- Current G3 reports and `docs/G3_EVIDENCE.json` must exist.
- The command writes only `docs/launch/` in the external site repository.
- It never changes application source, deploys, publishes, or grants G3.5 approval.
- Existing launch files are protected unless `--force` is explicitly supplied.

Use the CLI to check without writing:

```sh
node scripts/brag.mjs portfolio product --check
```

Generate the review package:

```sh
node scripts/brag.mjs portfolio product
node scripts/brag.mjs client-site company
```

## Harness health

Run this before dispatching a new pipeline:

```sh
node scripts/health.mjs
node scripts/health.mjs --json
```

Health checks validate required files, agent and command definitions, Brain contracts and the external projects root. It does not run a site build and does not mutate a project.

## `/backlinks` and `scripts/backlinks.mjs`

Backlink work is tracked per external project in `docs/BACKLINKS.json`. The record stores target
qualification sources, outreach/publishing/submission states, verified referring-page evidence and
Search Console export metadata. It has separate owner approvals for outreach, publishing and launch
submissions. The CLI only initializes, validates and reports; it never sends or publishes.
