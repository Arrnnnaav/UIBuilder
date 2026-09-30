# Vendored skills (provenance)

| Folder | Source | Commit | License |
|---|---|---|---|
| web-design-guidelines | github.com/vercel-labs/agent-skills/skills/web-design-guidelines | 063bee9 | no repository license found; local only, excluded from public Git |
| taste-skill | github.com/leonxlnx/taste-skill/skills/taste-skill | c184364 | MIT |
| stitch-design-taste | github.com/leonxlnx/taste-skill/skills/stitch-skill | c184364 | MIT |
| redesign-existing-projects | github.com/leonxlnx/taste-skill/skills/redesign-skill | c184364 | MIT |
| website-to-code | github.com/AVIVASHISHTA29/website-to-code (SKILL.md only) | 76c10a2 | none stated; local only, excluded from public Git |
| frontend-design | github.com/anthropics/skills/skills/frontend-design | 3337550 | see upstream LICENSE.txt |
| antislop, antislop-ui, antislop-copywriting, antislop-human, antislop-layoutmobile, antislop-code | github.com/miqdadbadjuber/anti-slop/skills | 339e364 | MIT |
| improve-ui, fixing-accessibility, fixing-metadata, fixing-motion-performance | github.com/ibelick/ui-skills/skills | fd0889b | MIT |
| scroll-world | github.com/oso95/scroll-world/skills/scroll-world | 71cc36d | MIT |
| agent-browser | github.com/vercel-labs/agent-browser/skills/agent-browser | d01253d9db28d75080e36da3c1c31ef89454731e | Apache-2.0; LICENSE retained |

| brag | github.com/latent-spaces/brag/skills/brag | c893c5ed52aed84e3e2ee56787de869fccdae6b0 | MIT; available to install for video tasks from `brain/agent-bootstrap.json` |

| monid | https://monid.ai/SKILL.md v0.1.7, fetched 2026-09-30 (original sha256 0479b9b591c32081a8d96efd80fb6efb1b34efdfd3fb7a73153965a6e83a3979) | n/a (hosted file) | no skill license stated (CLI `@monid-ai/cli` is MIT); local only, excluded from public Git. Edited for UIBuilder: removed the proactive-run trigger and the self-overwrite step, pinned setup, added router and cost rules. |

The harness bootstrap catalog pins approved free skills and tools and distinguishes an installed
instruction from a configured plugin, hook, credential or service. See `docs/AGENT_BOOTSTRAP.md`.

MIT LICENSE notices are retained in each redistributed MIT skill folder from the
recorded pinned upstream revision. frontend-design retains upstream LICENSE.txt.
Original `security-review` is authored for UIBuilder and uses the root Apache-2.0
license; it is not a vendored third-party skill.

The 2026-09-26 additions were installed with the Codex skill-installer helper into this project.
They are available to Claude Code in a new session. Availability does not enable paid tools:
scroll-world requires separately enabled media services and is deferred under AGENTS.md's
function-first order.
