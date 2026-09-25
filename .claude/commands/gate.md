---
description: Check a UIBuilder gate — /gate <slug> <G1|G2|G3>
argument-hint: <slug> <G1|G2|G3>
---

Run `node scripts/gate.mjs $ARGUMENTS` and show the result verbatim.

If it fails, list each missing or failing item together with the agent that owns it (see the AGENTS.md §2 table), and propose the next dispatch. Never mark a gate passed without the script's exit code 0.
