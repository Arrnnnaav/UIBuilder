@AGENTS.md

# CLAUDE.md — how Claude Code works in this repo

AGENTS.md is the rulebook and wins on any conflict. This file adds only Claude Code specifics.

## Role
- Main session = **Orchestrator**: intake, state, gates, dispatch. Do specialist work by dispatching the agents in `.claude/agents/` (Agent tool, `subagent_type` = agent name), not inline.
- Design Council: dispatch directions A/B/C as separate forks, then `design-director` critic. Never show one direction to another.
- Never spawn unattended background workers on the harness's behalf (`scripts/runtime.mjs` only emits packets).

## Session start (every new session)
1. Read `plan/PROGRESS.md` (tail), `plan/DECISIONS.md`, and for a site: `D:\UiBuildProj\<slug>\docs\STATE.md`, `BUILD_SPEC.json`, `docs/approvals/`.
2. Preflight: `node scripts/health.mjs`, then `node scripts/agent-bootstrap.mjs --task <task> --project <site-path>`. Add `--install` only for missing pinned, approved items. Record result in the handoff.
3. Load `frontend-design` before any visual step (plus `taste-skill`, `web-design-guidelines` if present).

## Commands
Harness checks (run before claiming harness work done):
```powershell
node scripts/validate-brain.mjs
node scripts/validate-contracts.mjs
node --test tests/platform/*.test.mjs
node scripts/health.mjs
```
Slash commands (`.claude/commands/`): `/build`, `/audit`, `/intake`, `/gate`, `/learn`, `/improve`, `/connect`, `/brag`, `/backlinks`.
Cost/consistency: `node scripts/context-budget.mjs` (startup tokens per agent vs caps), `node scripts/validate-agents.mjs` (model tiers + frontmatter tools vs router). Single source: `brain/agent-budget.json`. Adding an agent needs: agent file (with `model:`), budget entry, router entries, AGENTS.md §2 row.
Premium bar: `node scripts/premium-lint.mjs <slug>` (mechanical taste checks, advisory), rubric in `brain/playbooks/premium-bar.md`, immersive patterns in `brain/playbooks/immersive-playbook.md`. Before any paid media batch run `node scripts/media-preflight.mjs`, state the cost estimate and get owner approval for that run. Owner switches: `brain/tool-enable.json` (user:enable tools), resource `use_caution` (keeps a resource in review), resource `caveat` (shown in shortlists).
Owner controls and plans: `node scripts/owner.mjs set <id> <boost|pin_for|avoid_for|tags|banned|trust|rights> <value> --reason "..."` (only on the owner's instruction; it refuses trust or rights changes without a reason and rights cautions without `--ack-caution`), `node scripts/resource-plan.mjs init|add|remove|status <slug>` for a site's must-use, prefer and avoid resources, and `node scripts/recommend-resources.mjs <domain> <task words> --tags a,b --project <slug>`. Discovery first for company and product sites: `node scripts/competitor-audit.mjs <slug> --sites <urls> --client <url>`, then `docs/DISCOVERY.md` (tailored questions and suggested additions the owner decides), then the Decision record in DESIGN.md and MOTION.md. Never write owner decisions, approvals or discovery answers on the owner's behalf.
Manual studio clips (Google Flow etc.): never just ask the owner for a clip; write a request card from `templates/docs/MEDIA_REQUEST.md` with exact steps, prompt, frames and save path, then verify the returned file with `node scripts/media-inbox-check.mjs` before using it.
Runway credits (key in ignored root `.env` as `RUNWAYML_API_SECRET`; started at 500 credits = $5 on 2026-09-30, 460 after the adapter test; read free with `GET https://api.dev.runwayml.com/v1/organization` or the Runway MCP `get_credit_balance` for project UIBuilder): generate only through `node scripts/media-generate.mjs` (dry run by default; `--run --approve-credits N`); before any generation state model, seconds and credits, keep each job at or under 100 credits unless the owner approves more, pick the cheapest model that fits (veo3.1_fast no audio 10 credits/s, wan3 480p 5/s, seedance2_mini 16/s with a 64 minimum, images 1 to 4 credits; first/last frames work on seedance2 family and veo3.1 only), re-check the balance after, and log it in `docs/MEDIA_LEDGER.md`. Never print the key.
Learning: `node scripts/improve.mjs <diagnose|monitor|evaluate|outcomes>`; `UIBUILDER_LEARNING=0` = baseline selector.
No root `package.json`; scripts are plain Node 24 `.mjs`. Site repos use pnpm.

## Working rules for me
- Site source never goes in this repo. Sites live in `D:\UiBuildProj\<slug>` (own git repo, CI, remote). Root CI = harness only.
- Tick `plan/PROGRESS.md` with evidence (command + result) after each task; log stack/scope/policy changes in `plan/DECISIONS.md`.
- Gate pass = command output shown. Owner approvals (G1, G2, G2.5, G3.5) are hash-bound files in the site's `docs/approvals/`; never write or infer one.
- No external preview/deploy before G3.5 for that target. No domain purchase or DNS change without separate explicit owner approval.
- Tools only via `brain/tools.json` allowlist per agent; use `fallback` when `enabled_if` unmet. Paid/unreviewed tools, MCP servers, keys, write/deploy plugins: never enable or install silently.
- Free tiers first (check `free_tier_catalog`, verify live pricing before proposing paid).
- Brain edits: keep trust ladder (only APPROVED/TRUSTED used by default). Re-run validators after editing `brain/`. Don't rewrite policy/gates from `brain-evaluator` output; promotion needs owner review of exact hashes.
- Every agent run ends with `docs/handoff/<agent>.json` per `docs/HANDOFF.schema.json` + a trace via `scripts/improve.mjs` (references and metrics only, no raw client text or secrets).
- References are mechanisms, not assets: never copy others' assets, fonts, copy or code.
- Secrets: root `.env` is ignored; never print, commit or copy keys into handoffs.

## Environment notes (Windows 11)
- PowerShell primary; use `;`/`&&` per pwsh 7. Paths with `D:\`. Execution policy has rejected some delete commands; ask before retrying.
- Box is memory-bound: use `NEXT_BUILD_CPUS=2` for site builds; run WebKit tests alone if flaky.
- Playwright visual baselines are per-OS; Linux baselines come from CI.
- Ignored caches (`.tool-cache`, `.playwright-mcp`, `.ruff_cache`) and `.git-metadata-backup` stay; don't delete without asking.
- Caveman output style is active in chat; code, commits and docs are written normally.

## Current state (2026-09-30)
- Harness work is merged into `main` (fast-forward, 9a4c08a, CI green: secret-scan, platform, sast) and pushed to `Arrnnnaav/UIBuilder`: agent bootstrap, slim rulebook with enforced checks, model tiers and context budget, usable Brain (taxonomy, taste core, premium bar), media adapter and request cards. Branch `harness/budget-brain-media` is also on the remote. Site repos (portfolio, demo, abizcreator) were not touched by the merge and keep their own uncommitted work. Ask before pushing or merging anything further. Newer work (owner controls, resource plans, competitor audit, discovery contract, decision records) is on branch `harness/owner-controls-discovery`, committed locally and not pushed.
- Baseline green: health 56 checks, brain 119 resources / 19 patterns / 65 tools / 16 domains / 2 router configs, contracts 14 roles, platform tests 72.
- Live-verified: Runway `veo3.1_fast` first+last frame clip (40 credits; balance 460 left). Not live-tested: Gemini (needs the owner's key and billing). Monid balance about $1. Higgsfield installed but not logged in.
- Owner-pending: rotate the Runway, Monid and Stitch keys that were pasted in chat; Higgsfield login (optional); decide the three cautioned resources per use (lightswind, mobbin, open-seo).
- Learning loop instrumented but data-starved (6 runs, 0 feedback, no token/cost telemetry): don't claim measured improvement.
- Portfolio redesign awaits owner G2 choice; abizcreator is still the starter (placeholder SEO titles `Site Name`); site repos hold their own uncommitted work (waived legacy handoffs, dash fixes in portfolio JSON-LD).
