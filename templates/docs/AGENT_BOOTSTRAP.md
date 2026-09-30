# Agent environment setup

Every fresh agent/session reads this project's `AGENTS.md`, `docs/STATE.md`,
`docs/BUILD_SPEC.json`, current approvals and stage artifacts before work. The site repository
contains shared context so work can resume without chat history.

From the UIBuilder harness checkout, check the task-specific skills and tools:

```powershell
node scripts/agent-bootstrap.mjs --task website --project .
```

Use the narrowest task (`frontend`, `website`, `full-site`, `visual-research`, `browser`,
`video` or `review`). Install missing approved entries only when useful:

```powershell
node scripts/agent-bootstrap.mjs --task website --project . --install
```

The pinned catalog in `docs/AGENT_BOOTSTRAP.json` lists sources, versions, licenses and
fallbacks. Re-run without `--install` to verify. Optional missing items do not block work.
Unknown-license and paid services, provider keys, MCP servers, publishing/deployment plugins,
and system-wide FFmpeg installs are not installed automatically. A skill being present does
not prove its plugin, hook, browser, model or API connection is configured.

Follow the harness `AGENTS.md` gates and `brain/tools.json` routing. Report unavailable tools
and fallbacks in the agent handoff; do not use a tool merely because it is installed.
