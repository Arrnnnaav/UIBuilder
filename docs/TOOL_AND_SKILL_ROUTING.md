# Tool, skill and hook routing (2026-09-28)

The project has **12 roles** (11 `.claude/agents/*.md` files plus the Orchestrator), **19 project skill folders**, **43 tool-router entries**, and **9 Brain domains**. The owner also has 12 globally enabled Claude plugins, including `frontend-design`, `playwright`, `github`, `vercel`, `greptile`, `brag`, `superpowers`, `claude-mem` and `typesafe`; these are user-environment capabilities, not project-owned guarantees. Global Claude settings include a `PostToolUse` hook. Project `.claude/settings.local.json` enables one MCP server and does not add a project hook. The globally installed TypeSafe skill is available to Codex; Jev's project adapter uses the same API key contract.

## Choosing a tool

The Orchestrator starts from the current stage and responsible agent in `brain/domains.json`. The agent reads the site's brief, owner taste, locked design and current state. `scripts/recommend-resources.mjs` ranks matching resources while separating ready entries from trust, rights or availability review. The tool router checks that the agent may use the tool and its `enabled_if` condition holds. An unavailable tool uses its recorded fallback; no website screenshot or model suggestion overrides the file contract or owner gates.

| Need | First choice | When to use a specialist option | Boundary |
|---|---|---|---|
| Research a live site or interaction | Agent Browser for navigation/accessibility snapshot; Playwright for computed styles and measurements | Agent Reach only for public social/video retrieval after its CLI is installed and source quality is checked | Record URLs and measured behavior; never copy the site |
| Learn from local video | `ffprobe`/`ffmpeg` sampling plus taste-research storyboard | Agent Browser to verify an identified live source, if one exists | Clips alone do not prove rights or responsive behavior |
| Build an avatar or character | Original SVG/CSS or licensed original illustration after owner G2.5 choice | OpenHuman/avatar labs are NEW research candidates; HeyGen and generative video remain disabled/paid | Choose by narrative purpose and mobile/perf budget, never novelty alone |
| Build motion | CSS transform/opacity and existing Motion dependency | Anime.js, scroll-world, Componentry or Motion Primitives only after design fit, license, accessibility and bundle review | No copied gallery code/assets; reduced-motion and touch fallbacks required |
| Find UI patterns | Existing portfolio components and brain-approved sources | Mobbin and 21st.dev for mechanism study; Fancy/Componentry/Motion Primitives are review candidates | Individual gallery authors, assets and dependencies may have different rights; Lightswind is inspiration only |
| Audit SEO/internal links | Route manifest, crawler, anchor and link graph checks | Jev may rank public candidate link relevance in shadow mode; OpenSEO is a research candidate | Jev cannot invent links or publish data changes; BusinessOS needs owner-approved PR and publish |
| Review changes | ESLint, tests, Playwright, security skill and `pnpm audit` | OpenCodeReview is a comparison candidate for a representative PR | AI review does not replace G3 or exploit validation |
| Prepare launch video | Local browser capture and `brag` workflow | OpenMontage is a research reference; paid media stays disabled | G3/G3.5 before new external deployment; domain changes separate |
| Improve the Brain | `learning_cli` records redacted run/feedback references, then `brain-evaluator` analyzes failures offline | A versioned JSON router candidate is tested on the same target, regression and decline cases | Owner reviews exact proposal/eval hashes before promotion; `UIBUILDER_LEARNING=0` restores baseline |

## Jev's place

Jev handles narrow semantic judgments over public text and returns typed probabilities. The adapter currently supports advisory task routing and internal-link relevance. It has a live key in an ignored root `.env`, a six-case synthetic smoke test, and no authority to dispatch, edit SEO, approve rights, waive tests or deploy. See [Jev research](JEV_RESEARCH.md). The official TypeSafe skill is loaded for implementation guidance; live docs remain the source of truth.

## Add a new resource safely

`/intake <url>` verifies the primary source, license and maintainer state, assigns `usage_mode`, `best_for`, trust and provenance, and records mechanisms without copying assets. NEW/REVIEWED candidates are visible in the selector's review queue. A real project use with tests and owner feedback can advance trust. `/learn` records whether the pattern worked; failed or restricted resources can be rejected/deprecated. Adding a tool to the router does not install or enable paid infrastructure.
