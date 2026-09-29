# Host-managed agent execution

UIBuilder does not run agent daemons. `brain/runtime.json` declares the supported interactive CLI hosts and the safe `host_managed` default. `node scripts/runtime.mjs packet <pipeline> <slug> <stage> <agent>` produces a JSON work packet with inputs, expected output, and policy boundaries. The user-selected Claude Code/Codex host runs the work and returns a redacted lifecycle event with output references; `event` appends it to the site's `docs/runtime/events.jsonl`, and `status` summarizes task state.

The packet is orchestration metadata, not executable code. Hosts must still follow the site's `AGENTS.md`, tool router, and gate requirements. This design makes tracing and adapters portable while avoiding background process creation, API model spending, and permission bypasses. The event log is project operational metadata; never put raw prompts, client secrets, or private source content in it.
