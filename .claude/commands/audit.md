---
description: Run the phased production-readiness audit and repair workflow — /audit <slug>
argument-hint: <slug>
---

Invoke `.claude/agents/production-auditor.md` for `D:\UiBuildProj\$ARGUMENTS`, using the copied `docs/prompts/PRODUCTION_READINESS_AUDIT.md` as the project-local procedure; its source of truth is `templates/prompts/PRODUCTION_READINESS_AUDIT.md` in the harness.

1. Confirm the project folder exists and read its `AGENTS.md` before any audit command.
2. Record the starting git status and the Phase 0 baseline before editing. Do not discard or overwrite existing work.
3. Complete audit phases in order; run the phase's relevant verification after every phase. Delegate specialist-owned work through the project files/agent handoffs and verify the result after it returns.
4. Use only tool-router-enabled checks, actual project scripts, and safe local fixtures. No deploy, publish, merge, real customer submission, DNS mutation or secret display.
5. Update `docs/PRODUCTION_READINESS_REPORT.md`, `docs/LAUNCH_DAY_CHECKLIST.md`, `docs/STATE.md`, the agent handoff and a redacted `scripts/improve.mjs` run trace.
6. Report exact commands/results, open issues and whether separate G3/G3.5 gates pass. Never infer gate approval from the audit.
