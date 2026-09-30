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

## Fresh agent setup

Every new agent/session reads the site rulebook and state, then checks task-relevant local tools:

```sh
node scripts/agent-bootstrap.mjs --task website --project .
node scripts/agent-bootstrap.mjs --task website --project . --install
```

Choose `frontend`, `website`, `full-site`, `visual-research`, `browser`, `video` or `review`.
The site starter copies this script plus `docs/AGENT_BOOTSTRAP.json` and its instructions. The
bootstrap reports installed/missing items, sources, licenses and fallbacks. `--install` applies
only to missing task-relevant allowlist entries marked for automatic installation. See
[`AGENT_BOOTSTRAP.md`](AGENT_BOOTSTRAP.md).

## Cost, budget and quality checks

```sh
node scripts/context-budget.mjs        # startup tokens per agent and mode versus caps
node scripts/validate-agents.mjs       # model tiers and frontmatter tools versus the router
node scripts/premium-lint.mjs <slug>   # mechanical taste-core bans on a site (advisory)
node scripts/recommend-resources.mjs <domain> <task words>   # explainable Brain shortlist
```

All are read-only. `brain/agent-budget.json` is the single source for tiers and caps; a new agent needs a file with `model:`, a budget entry, router entries and an `AGENTS.md` row.

## Media generation

```sh
node scripts/media-preflight.mjs                 # what is installed, logged in and keyed (no secrets printed)
node scripts/media-generate.mjs --provider runway --model veo3.1_fast --first a.png --last b.png \
  --prompt "..." --seconds 4 --ratio 1280:720 --out clip.mp4          # dry run, prints the estimate
node scripts/media-generate.mjs ... --run --approve-credits 40         # spends; over 100 credits needs --owner-approved-over-cap
node scripts/media-inbox-check.mjs clip.mp4 --first a.png --last b.png --seconds 4 --ratio 16:9   # verify a returned clip
```

Keys come from the environment or the ignored root `.env`. Runway is live-tested; Gemini is built from Google's official request shapes but not yet run live. Manual studio clips (Google Flow and similar) use a request card from `templates/docs/MEDIA_REQUEST.md`. See [`MEDIA_PROVIDERS.md`](MEDIA_PROVIDERS.md) and [`OWNER_SETUP.md`](OWNER_SETUP.md).

## `/backlinks` and `scripts/backlinks.mjs`

Backlink work is tracked per external project in `docs/BACKLINKS.json`. The record stores target
qualification sources, outreach/publishing/submission states, verified referring-page evidence and
Search Console export metadata. It has separate owner approvals for outreach, publishing and launch
submissions. The CLI only initializes, validates and reports; it never sends or publishes.
