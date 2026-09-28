# G3 evidence contract

G3 executes source/build/browser/growth/performance checks. It also requires
`D:\UiBuildProj\<slug>\docs/G3_EVIDENCE.json` for review and monitoring evidence that a
successful command alone cannot establish. Missing evidence fails the gate.

Create baselines separately with `pnpm test:e2e --update-snapshots=missing`, inspect
every route at both sizes in Chromium and WebKit, then commit reviewed baselines.
G3 never seeds its own passing baselines. Root monorepo `git ls-tree HEAD` must
contain each expected platform/browser/route PNG.

The JSON contains:

- `sourceFingerprint`: result of `sourceFingerprint(projectPath)` exported by
  `scripts/lib/g3-evidence.mjs`. It hashes source/content/public/tests/scripts and
  build/dependency configs, excluding reports, screenshots and generated output.
- `reports`: keys `QA_REPORT.md`, `GROWTH_REPORT.md`, `SECURITY_REPORT.md`,
  `PERF_REPORT.md`, `VISUAL_REVIEW.md`. Each contains `report` with project-relative
  `path` and byte `sha256`, plus nonempty `commands`.
- Each command has `command`, `exitCode: 0`, and `output: {path, sha256}` pointing
  to the retained actual redacted command output. Review reports explain what
  those commands prove and what remains unverified.
- `security`: `skill: ".claude/skills/security-review/SKILL.md"`, `findings` array
  with explicit `severity` and reasoning. High/critical or ungraded findings fail.
- `monitoring.sentry` and `.posthog`: command records plus `mode: "noop"` when the
  public provider key is absent. With keys, use `mode: "receipt"`, `eventId` and
  `receivedAt` from the actual provider. Output must establish receipt or tested
  no-op behavior; boolean key absence alone is insufficient.
- `snapshots`: reviewed `{path, sha256, reviewer, reviewedAt}` entries for each
  `e2e/__snapshots__/<platform>/<browser>/<route-name>.png`. `/` is `home`, other
  route names use Playwright's sanitized argument (for example `/work/edge-node`
  becomes `work-edge-node`, since underscores are also sanitized). `/e2e-error` is a deliberately
  throwing test route and has behavioral recovery coverage instead of a baseline.

After source changes, rerun applicable checks and reviews before rebinding the
fingerprint. Artifact hashes establish identity; they do not prove the truth of
a review or receipt. The Orchestrator must inspect the retained outputs. Performance
summary coverage includes noindex utility pages and enforces strict LCP/CLS limits.
