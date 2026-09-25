# M3 — Agents, commands, recipes

**Goal:** make the pipeline runnable with `/build`.

## Tasks
1. `.claude/agents/`: research, ux, design-director, frontend, backend, growth, ship. Each has frontmatter (name, description, tools allowlist that matches `brain/tools.json`), the inputs it reads, the outputs it writes, and the handoff rules.
2. `.claude/commands/`: `build.md`, `intake.md`, `gate.md`, `learn.md`, `connect.md`.
3. `pipelines/portfolio/` and `pipelines/company-site/`: PIPELINE.md (stages, which agents run), PAGES.md, DESIGN.base.md (constraints, not a look), QA.md, PROMPTS.md, stack.json.
4. `scripts/gate.mjs`: checks that each gate's artifacts exist and are valid, and for G3 runs the DoD commands in the project.
5. `scripts/new-project.mjs <pipeline> <slug>`: copies marketing-starter to `projects/<slug>`, runs git init, and creates `docs/` from the templates.

## Done when
- `node scripts/new-project.mjs portfolio demo` creates a working project.
- `node scripts/gate.mjs demo G1` reports which artifacts are missing.
- The agent files parse (valid frontmatter).
