---
description: Check a UIBuilder gate — /gate <slug> <G1|G2|G2.5|G3|G3.5>
argument-hint: <slug> <G1|G2|G2.5|G3|G3.5>
---

Run `node scripts/gate.mjs $ARGUMENTS` and show the result verbatim.

If it fails, list each missing or failing item together with the agent that owns it (see the AGENTS.md §2 table), and propose the next dispatch. Never mark a gate passed without the script's exit code 0.
G2.5 and G3.5 are owner approvals. Never create an approval record based on agent inference, a previous gate, silence, or an automated test. Use the exact reviewed artifact hashes and target in `templates/docs/OWNER_APPROVAL.example.json`; G3.5 uses `release_target` in place of `review_url`.
