# UIBuilder Control Room

## Decision

UIBuilder will build a native, read-only Control Room around its own traces, handoffs, gates and project files. The first external reference is [Lattice](https://github.com/DahunHan/lattice), which is MIT licensed and demonstrates project-file scanning, workflow topology and React Flow visualization. Its implementation is not imported; only the interaction mechanisms are studied.

The other candidates serve different purposes:

| Project | Decision | Reason |
|---|---|---|
| `ajsahni/agents-office` | Do not add | Its PolyForm Noncommercial terms prohibit bundling it into another agent system or paid product. Visual research only. |
| `samwang0723/agent-office` | Do not add as runtime | Strong live pixel-office view, but it requires Claude Code teammates/TMUX and observes a different event model. |
| `morbidsteve/agent-orchestra` | Study, not adopt | MIT and live WebSocket dashboard, but it owns a separate FastAPI/React/Claude SDK runtime. |
| `KuaaMU/omnihive` | Study, not adopt | MIT and supports Claude, Codex and OpenCode, but it is a separate Tauri orchestrator. |
| `DahunHan/lattice` | **Selected reference** | MIT, read-only project-file workflow visualization and low conflict with UIBuilder orchestration. |
| `tlangridge/agent-swarm` | Study later | Local multi-CLI control plane with PTY and WebSocket management; runtime replacement. |
| `Smilkoski/agent-swarm-dashboard` | Study later | Mission dashboard tied to CrewAI, Django, Redis and Groq. |
| `pintarkristian/agent-orchestration-dashboard` | Study later | Useful SSE/event-bus pattern, but owns a separate OpenRouter workflow. |

## Target architecture

```text
UIBuilder agents and scripts
        │
        ├── redacted run traces
        ├── handoffs and artifact hashes
        ├── STATE.md and gate receipts
        └── tool status and failure categories
                    │
             Control Room adapter
                    │
        ┌───────────┼───────────┐
        │           │           │
    topology    timeline     evidence
    and roles   and events   and gates
        │           │           │
        └────── read-only UI ─┘
                    │
          explicit approval actions
          routed back to files/CLI
```

The dashboard must not become a second source of truth. It reads project files and trace records. Approval buttons write the same JSON approval records and invoke the same gate scripts; they never mark a gate passed from UI state alone.

## First Control Room slice

1. Normalize `scripts/improve.mjs` run records, handoffs and `STATE.md` into a versioned JSON stream.
2. Render the pipeline graph by stage, agent, status, duration and artifact links.
3. Render a live timeline from file changes or a local Server-Sent Events process.
4. Show the current gate, exact evidence paths, hashes and blockers.
5. Add safe read-only actions first: open artifact, rerun check, refresh trace.
6. Add approval actions only after file writes, hashes and owner identity are tested.

## Non-goals for the first slice

- No new model runtime.
- No autonomous agent spawning from the dashboard.
- No direct production deployment.
- No bypass of G1, G2, G2.5, G3 or G3.5.
- No copying of another project's visual assets, code or branding.
