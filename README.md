# UIBuilder

UIBuilder is a file-driven pipeline for designing, building, testing, and shipping
websites. Its rules and gates are in [AGENTS.md](AGENTS.md); the single status board
is [plan/PROGRESS.md](plan/PROGRESS.md).

## Repository map

- `brain/`: resource registry, design patterns, tool router, and build memory
- `pipelines/`: portfolio and company-site recipes
- `templates/`: marketing starter and document templates
- `scripts/`: project creation, brain validation, and gate checks
- `.claude/`: agent definitions, slash commands, and project skills
- `projects/`: current site source and design records

## Quick checks

```sh
node scripts/validate-brain.mjs
node scripts/validate-contracts.mjs
node --test tests/platform/*.test.mjs
node scripts/gate.mjs portfolio G1
node scripts/gate.mjs portfolio G2
```

To run a site locally, enter its folder, install with `pnpm install`, then run
`pnpm dev`. Each site has its own README and package scripts.

## Current state

The portfolio has passed G1 and G2 and is in S4 implementation. Its pages and
SEO data still need to replace starter placeholders. ABizCreator is waiting at
its client approval gate. See [PROGRESS.md](plan/PROGRESS.md) for evidence and
the remaining work.

This repository includes working project folders so the pipeline and its outputs
can be reviewed together. `node scripts/new-project.mjs portfolio my-site` creates
a clean project without a nested Git repository. Use `--standalone` explicitly
for a separate client or deployment repository, then move it outside this checkout.
Existing projects are never overwritten; private env files and build output are excluded.

Root GitHub Actions validate brain data, agent and handoff contracts, scaffold
behavior, and site source quality. Workflows under `projects/*/.github/` are for
standalone site repositories; GitHub does not execute those from this monorepo.
The source workflow does not prove G3: browser flows, visual review, Lighthouse,
live monitoring and owner approvals still need their own evidence.

The product-manager agent records product capabilities, acceptance criteria,
priorities and risks in three project documents. It reviews delivery before G3;
the Orchestrator retains dispatch/state ownership and the owner approves G1/G2.
See [license decision](docs/LICENSING.md) for the outstanding repository license choice.

Two vendored skills without stated redistribution terms are local-only and
excluded from Git: `website-to-code` and `web-design-guidelines`. Their
upstream sources are listed in [SOURCES.md](.claude/skills/SOURCES.md).
