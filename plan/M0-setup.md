# M0 — Setup

**Goal:** fix the spec conflict and get the rulebook and tooling ready before anything else is built.

## Tasks
1. Amend the BusinessOS spec: R7 in `2026-09-09-unified-platform-design.md` (D4 note, "not building" notes) plus the new `2026-09-25-git-site-connector-design.md`.
2. Write `AGENTS.md` as the rulebook and make `CLAUDE.md` a one-line `@AGENTS.md` import.
3. Add the `plan/` phase files, `PROGRESS.md` and `DECISIONS.md`.
4. `git init` UIBuilder.
5. Enable the caveman statusline in `~/.claude/settings.json`.
6. Add the Context7 MCP to `.mcp.json`. Playwright is already available through the plugin.
7. GitHub MCP: the current token fails with "Authorization header is badly formatted". The user must re-authenticate (`/mcp` → github). Meanwhile, use the `gh` CLI.
8. Skills: vendor `web-design-guidelines` (vercel-labs/agent-skills), `taste-skill` (leonxlnx) and `website-to-code` (AVIVASHISHTA29) into `.claude/skills/`. Install `brag` with `npx skills add https://github.com/latent-spaces/brag --skill brag`.
9. Toolchain check: node ≥ 22, pnpm, git, gh, vercel CLI, wrangler.

## Done when
- The spec files are amended and logged as D8.
- The statusline shows the caveman badge after restart.
- `.mcp.json` is valid and the skills folder is populated, or failures are recorded in PROGRESS.
- The toolchain versions are recorded in PROGRESS.
