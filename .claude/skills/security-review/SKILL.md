---
name: security-review
description: Review a UIBuilder generated site's release security, including contact abuse, CSP, client secrets and the full dependency graph. Use for the G3 security requirement and concrete security reviews.
---

# UIBuilder security review

This is an original project procedure. Review actual source and production behavior;
passing dependency audit or seeing a header alone does not prove release security.
Use only the ship/backend tools allowed by `brain/tools.json`. Retain redacted
command output in project docs; never retain secret values or provider credentials.

## Review the reachable surface

Read the site's actions/routes, input schemas, env/telemetry initializers, CSP and
deployment config. Trace submitted input through validation, challenge verification,
rate limiting and email/storage. Verify Zod rejects malformed and oversized input,
Turnstile fails closed in production, and production cannot accidentally inherit
test keys or contact dry-run mode. Check IP trust against the deployment proxy:
a spoofable forwarded header is not a reliable abuse boundary. Document whether
the limiter survives multiple instances/restarts and what compensates for it.

Inspect generated client assets and public files for private env values. Only
deliberately public analytics/site keys may enter client code. Look for unsafe HTML,
unescaped JSON-LD, user-controlled redirect/URL/fetch targets, email header injection,
and exposed test/debug routes. Prove representative cases with focused tests or
production HTTP checks, using harmless test data.

Check production CSP and other security headers on actual responses. Trace each
allowed origin to a required integration; document any `unsafe-inline` and its
residual risk. Never treat missing production headers as solved by config presence.
Run the complete dependency audit at high severity (including development tools),
not only `--prod`. Verify fixes against advisory primary sources before changing
versions; rerun affected tests/build. Do not suppress findings to make G3 green.

## Grade and retain evidence

Write `docs/SECURITY_REPORT.md` with inspected files, deployment assumptions,
specific executed commands and retained output paths, risk findings and fixes.
Classify findings as critical/high/medium/low/info using exploitability and impact:
credential exposure, reachable injection/auth bypass or consequential production
abuse generally warrant high or critical; bounded hardening gaps need explicit
reasoning rather than an automatic high label. Unverified security requirements
remain unverified, even if no exploit was reproduced.

Recheck fixes and record remaining risks. G3 requires zero high/critical findings,
clean complete high-severity audit, CSP, Zod, rate limiting and no client secrets.
Populate the security portion of `docs/G3_EVIDENCE.json` only after this review;
never invent receipts, commands, grades or successful gate results.
