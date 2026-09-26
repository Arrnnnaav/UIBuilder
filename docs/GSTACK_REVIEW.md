# gstack fit review

Reviewed 2026-09-27 at `garrytan/gstack` commit `2a113ae7e623f590095bcaaa0cc581c9a10a6632`, VERSION `1.91.1.0`. The isolated checkout is `.tool-cache/gstack-review`. No setup script, browser daemon, hooks, account bridge or skill has been activated. This is source inspection, not runtime qualification.

## Recommendation

Yes: use selected gstack workflows as additional reviewers within UIBuilder. Its product questioning, engineering-plan review, code review and exploratory browser QA are useful. Preserve UIBuilder's own agents, files, tools router and G1/G2/G3 authority. Full automatic installation is not the first integration step.

gstack is a workflow/skill toolkit, distinct from JEV's model router. Its [MIT license](https://github.com/garrytan/gstack/blob/2a113ae7e623f590095bcaaa0cc581c9a10a6632/LICENSE) permits reuse with the required notice. Free software still consumes the chosen AI account's usage. Cross-provider reviews can consume a second account; source configuration defaults `codex_reviews` to enabled and gstack-owned Codex invocations default to Astra unless overridden. There is no demonstrated UIBuilder savings claim.

## Recommended mapping

| gstack workflow | UIBuilder owner/stage | Output and authority |
| --- | --- | --- |
| office-hours / plan-ceo-review | product-manager, S1 or a new feature | Advisory questions and scope critique feeding PRODUCT_REQUIREMENTS, ACCEPTANCE and PRIORITIES; no gate approval |
| plan-eng-review | orchestrator + backend/frontend before S4 | Implementation and risk review after the approved brief; no redesign of owner-approved scope |
| review | ship before G3 and before publication | Evidence-backed diff findings feeding SECURITY_REPORT and QA_REPORT; current commands still verify fixes |
| qa-only | ship during S6 | Exploratory repros and screenshots feeding QA_REPORT; Playwright Chromium/WebKit at both required sizes remains mandatory |
| investigate | assigned implementation owner | Root-cause investigation with measured evidence and a handoff |
| retro | orchestrator after launch | Findings feed /learn and brain/builds; UIBuilder's file state remains canonical |

Defer ship, land-and-deploy, autoplan, cookie import, remote pairing and automatic updates. Shipping workflows can merge a base branch, create release/version changes, push and create PRs. UIBuilder already owns that sequence and BusinessOS requires separate owner approvals for PR and publishing.

## Compatibility findings

- Official [setup guidance](https://github.com/garrytan/gstack#other-ai-agents) includes a Codex host and generated `gstack-*` skills. Windows is supported through Git Bash and Node for browser launching. Local tools verified: Bun 1.3.14, Node 24.14.1, Git and `C:/Program Files/Git/bin/bash.exe` present. The PATH `bash.exe` points at Windows' WSL launcher; use the Git Bash executable deliberately.
- Copying just a few SKILL.md files would be incomplete. Generated skills depend on preamble helpers, configuration, state and browser commands. Generate the correct host package and review its helper dependencies before making it available.
- Root CLAUDE.md currently delegates to AGENTS.md. Upstream's quick-start recommendation to route all browsing through gstack would conflict with UIBuilder's deterministic tool router. Do not apply that instruction verbatim.
- Existing approved DESIGN.md/WIREFRAMES.md/G2 remain binding. Design workflows may provide advisory critique, but cannot independently replace the approved design direction or start another design council.
- A health score or exploratory QA pass does not establish G3: build, E2E browser/device coverage, axe, Lighthouse, SEO, monitoring, security and committed snapshots require their own evidence.
- gstack's GBrain integration is a separate service and is not UIBuilder's `brain/` JSON registry. No new memory backend is needed for initial use.

## Source-level setup and privacy review

Inspected [setup](https://github.com/garrytan/gstack/blob/2a113ae7e623f590095bcaaa0cc581c9a10a6632/setup), [configuration defaults](https://github.com/garrytan/gstack/blob/2a113ae7e623f590095bcaaa0cc581c9a10a6632/bin/gstack-config), generated planning/review/QA/release skill instructions, telemetry sync and browser server entry points.

- Setup installs dependencies/builds helpers and browser tooling, registers skills and can modify global Claude settings with hooks. The timeline Stop hook defaults on; `--no-timeline-stop-hook` exists. Plan-tuning hooks have separate controls. Native CSO security tooling has additional build prerequisites; its absence must be reported as not assessed, not clean.
- Telemetry defaults off in the inspected config, auto-upgrade defaults false, update-check defaults true, and proactive skill invocation defaults true. Team installation introduces session-start update behavior. An initial integration should explicitly keep telemetry and auto-updates off and use deliberate invocation.
- Optional cookie import and browser attachment involve authenticated browser sessions. Remote pairing and account-review wrappers create additional trust boundaries. Their usefulness does not require enabling them for public portfolio QA.
- The source includes egress receipts and a consent-gated telemetry sender. Receipts are an audit trail, not a firewall or proof of complete data isolation. AI providers still receive the content used for their reviews.
- Its large runtime includes Playwright, ngrok and model/transformer libraries. Do not treat every component as required for an initial advisory planning review. Release provenance, pinned dependencies and actual Windows smoke tests remain necessary before trusting the runtime.

## Concrete integration plan

1. Pin the reviewed revision and preserve MIT notices. Keep runtime in a dedicated location outside site source, with a clean rollback path. Install only the intended host rather than auto-detecting every installed agent.
2. Generate namespaced `gstack-*` skills. Avoid collisions with UIBuilder's /build, /gate, /learn, /connect and existing ship/review definitions.
3. Register any browser or external-review capability in `brain/tools.json` with explicit agent ownership, enable conditions and existing Playwright/local-review fallbacks. Keep cross-account review disabled until intentionally enabled.
4. Add small UIBuilder adapters that invoke selected workflows, write findings into the project docs and finish with HANDOFF.schema.json. Retain the existing approval and release sequence.
5. Smoke-test one planning review against the portfolio brief, one diff review and one qa-only run on localhost. Verify Windows commands, outputs, telemetry settings, hooks and account use. Adopt only the parts that produce useful findings without weakening gates.

Status: added to the brain as REVIEWED / research_only. Full setup and runtime use remain unverified. This records a useful candidate without claiming installation or approval.
