# M3 — Agents, commands, recipes

**Goal:** make the pipeline runnable with `/build`.

## Tasks
1. `.claude/agents/`: research, ux, design-director, frontend, backend, growth, production-auditor, ship. Each has frontmatter (name, description, tools allowlist that matches `brain/tools.json`), the inputs it reads, the outputs it writes, and the handoff rules.
2. `.claude/commands/`: `build.md`, `audit.md`, `intake.md`, `gate.md`, `learn.md`, `connect.md`.
3. `pipelines/portfolio/` and `pipelines/company-site/`: PIPELINE.md (stages, which agents run), PAGES.md, DESIGN.base.md (constraints, not a look), QA.md, PROMPTS.md, stack.json.
4. `scripts/gate.mjs`: checks each gate's artifacts, exact G2/G2.5/G3.5 owner approvals and handoffs, and for G3 runs the DoD commands in the project.
5. `scripts/new-project.mjs <pipeline> <slug>`: copies marketing-starter to `D:\UiBuildProj\<slug>`, initializes its Git repository and private GitHub remote, and creates `docs/` from Markdown/HTML templates.

## Done when
- `node scripts/new-project.mjs portfolio demo` creates a separate project and private GitHub repository (requires authenticated `gh`).
- `node scripts/gate.mjs demo G1` reports which artifacts are missing.
- The agent files parse (valid frontmatter).
- New project scaffold contains paired visual-review files; G2/G2.5 reject missing/stale hash approvals. Production audit report/handoff are present before G3.
