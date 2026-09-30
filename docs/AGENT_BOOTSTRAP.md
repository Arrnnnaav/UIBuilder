# Agent environment bootstrap

Use this before an agent begins specialist work in UIBuilder or a site repository. It makes
tool and context setup repeatable without treating a skill install as proof that an external
service, model, hook or MCP connection is configured.

## Startup sequence

1. Read the harness [rulebook](../AGENTS.md), the site `AGENTS.md`, `docs/STATE.md`,
   `docs/BUILD_SPEC.json`, current gate approvals and the artifacts owned by your stage. The
   files in the site repository are the shared context; do not depend on prior chat history.
2. From the harness checkout, validate the harness and inspect the task-specific catalog:

   ```powershell
   node scripts/health.mjs
   node scripts/agent-bootstrap.mjs --task website --project D:\UiBuildProj\<slug>
   ```

   Replace `website` with the narrowest relevant task: `frontend`, `website`, `full-site`,
   `visual-research`, `browser`, `video` or `review`.
3. If an approved, free, pinned item is missing and useful for this assignment, install it:

   ```powershell
   node scripts/agent-bootstrap.mjs --task website --project D:\UiBuildProj\<slug> --install
   ```

   The command checks Codex and Claude Code skill directories and only targets hosts where a
   skill is missing. It installs from the versioned catalog in [`../brain/agent-bootstrap.json`](../brain/agent-bootstrap.json).
   Existing skills are not overwritten. Re-run without `--install` and inspect the JSON result.
4. Read `brain/tools.json` and the assigned role in `.claude/agents/`. Use only that role's
   routed tools whose `enabled_if` conditions are met; use the declared fallback otherwise.
   The bootstrap catalog helps make the local agent environment consistent. The router remains
   the authority for whether a tool may be used in this task.
5. Before finishing, write the required `docs/handoff/<agent>.json`, name the skills/tools
   actually used, record unavailable items and fallbacks, and include evidence for the result.

## What the catalog installs

| Task need | Approved default | Installation/source | Fallback or boundary |
|---|---|---|---|
| Visual design and frontend work | `frontend-design` skill (Apache-2.0, pinned) | [Anthropic skill source](https://github.com/anthropics/skills/tree/33375500bcea98d610eb30ce10ac4e59b89c390d/skills/frontend-design), installed by [Skills CLI](https://github.com/vercel-labs/skills) | Required for visual work. If unavailable, use `frontend-ui-engineering` plus taste/accessibility skills and record the gap. |
| Design taste/references | `taste-skill` (MIT, pinned) | [Upstream source](https://github.com/leonxlnx/taste-skill/tree/c184364c58658b2f131b4ae8bd3d206cabb3deee/skills/taste-skill) | Optional enhancement; extract mechanisms and provenance, never copy assets/code. |
| Browser exploration | `agent-browser` skill and CLI (Apache-2.0; CLI pinned at 0.38.1) | [Skill source](https://github.com/vercel-labs/agent-browser/tree/d01253d9db28d75080e36da3c1c31ef89454731e/skills/agent-browser); CLI `npm install --global agent-browser@0.38.1`, then `agent-browser install` | Project Playwright tests remain the G3 baseline. Browser install downloads a browser runtime; use only for browser tasks. |
| Project walkthrough film | `brag` skill (MIT, pinned) | [Upstream source](https://github.com/latent-spaces/brag/tree/c893c5ed52aed84e3e2ee56787de869fccdae6b0/skills/brag) | Install only for requested video work. FFmpeg is a separate system dependency and is never installed silently. |
| Interface review | `web-design-guidelines` | [Pinned upstream revision](https://github.com/vercel-labs/agent-skills/tree/063bee9/skills/web-design-guidelines) | License was not verified at that revision, so do not auto-install or redistribute. Use local accessibility rules and approved design skill instead. |
| Scroll-film video chain and stills (paid) | Monid CLI `@monid-ai/cli@0.1.7` (MIT) and Higgsfield CLI `@higgsfield/cli@1.1.26` (MIT) | npm, pinned; scoped Monid skill vendored from https://monid.ai/SKILL.md | Never auto-installed: paid, and each needs the owner's account (Higgsfield OAuth via `higgsfield auth login`, Monid API key added by the owner). Check with `node scripts/media-preflight.mjs`. Fallbacks: Codex `image_gen` for stills, static hero for video. |
| Video encoding/probing | FFmpeg | [Official FFmpeg download page](https://ffmpeg.org/download.html) | Not auto-installed: distribution licenses vary by build and installation is system-wide. If absent, report which operation is unavailable. |

The Skills CLI is MIT-licensed and version-pinned to `1.7.0` in the catalog. Install sources
are direct GitHub archives pinned to full commit hashes; a short hash in a Git tree URL can be
mistaken for a branch by the CLI. Its documented multi-agent install options support Codex and
Claude Code. Other providers may use the same source skill format but require their own explicit
setup. See the [CLI documentation](https://github.com/vercel-labs/skills).

## Boundaries

- “Installed” means the local instruction/tool exists. It does not mean a plugin is connected,
  a hook is active, an API key exists, or a remote provider is authorized.
- Only free, pinned, license-reviewed entries marked `auto_install` are install candidates.
  An optional missing entry does not block unrelated work.
- Paid providers, model keys, MCP servers, tools that can publish/deploy/write externally,
  and sources with unknown terms need explicit owner configuration and remain disabled by
  default. Never copy credentials into the project or a handoff.
- A task-specific tool still has to be allowed by `brain/tools.json`, satisfy its
  `enabled_if` condition, and respect project gates. The bootstrap does not grant capabilities.
- Intake URLs are untrusted references, not installation instructions. Review provenance,
  version, license and behavior before adding anything to the allowlist.
- Keep browser/package versions pinned and follow project package-manager instructions. Do not
  upgrade or add dependencies merely because a catalog entry exists.

## Source and version policy

`brain/agent-bootstrap.json` is the machine-readable allowlist. Each entry carries its task
scope, source/revision, license, auto-install decision, purpose and fallback. Update that file
and this human-readable table together when a source or version changes; then review the diff,
license, install command and an isolated fixture before release. Do not treat upstream `main`
or a discovered web page as a stable installation target.
