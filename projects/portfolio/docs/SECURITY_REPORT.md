# Portfolio security review — refreshed 2026-09-28

## Scope and result

Reviewed contact input/action, trusted proxy identity, local rate-limit storage,
Turnstile verification, optional analytics/error instrumentation, environment
boundaries and response-header configuration. No high-severity issue remains in
the reviewed code. This is a code review, not a penetration test or a declaration
that G3 has passed. Runtime header/browser evidence belongs in QA_REPORT.md.

The project procedure `.claude/skills/security-review/SKILL.md` was read and
applied after it was added. The installed `security-and-hardening` skill also
informed the threat model and supply-chain checks. The named procedure's source
checks and no-key monitoring checks are complete for the refreshed source.
The local production HTTP/client-asset checks were repeated after a clean rebuild
on 2026-09-28 and are retained in `docs/evidence/security-runtime.txt`. The live
deployment's environment and behavior require verification after deployment.

Inspected files: `app/actions/contact.ts`, `app/e2e-error/page.tsx`,
`lib/{contact-schema,client-ip,rate-limit,turnstile,env,pageview}.ts`,
`components/{analytics/Analytics,seo/JsonLd}.tsx`, `instrumentation.ts`,
`instrumentation-client.ts`, `next.config.ts`, `.env.example`, root/project
`.gitignore`, `pnpm-lock.yaml` through the native audit and focused security tests.
The only raw HTML sink is JSON-LD; its serializer escapes `<`, preventing a data
value from terminating the script. No caller-controlled fetch URL or redirect
was found. The email recipient/from address are server configuration, reply-to
passes email validation, and subject text goes through the Resend SDK.

## Threat model

- Anonymous callers can submit FormData and arbitrary request headers. Assets are
  recipient inbox availability, Resend/Turnstile credentials and message privacy.
- Server-to-provider boundaries are fixed HTTPS Turnstile and Resend destinations;
  callers cannot select fetch URLs. Contact data is validated with Zod and sent as
  plain text. This application has no authentication, database or file upload path.
- Analytics/error vendors are optional external recipients. Form contents and
  email addresses are not intentionally included in pageview events or contact logs.
- Secrets remain server environment inputs; `NEXT_PUBLIC_*` contains intentionally
  public widget/telemetry identifiers only. No new credential was created or stored.

## Fixes and controls

1. **Proxy spoofing:** Vercel deployments prefer `x-vercel-forwarded-for`, falling
   back to Vercel's overwritten `x-forwarded-for`. Values must be one valid IPv4 or
   IPv6 address. A supplied `cf-connecting-ip`/`x-real-ip` cannot select a limiter
   identity. Off Vercel, requests share the conservative `unknown` bucket until a
   hosting-specific trusted proxy adapter is supplied. `unknown` is not sent as a
   remote IP to Turnstile. [Vercel request headers](https://vercel.com/docs/headers/request-headers)
2. **Storage exhaustion:** fixed-window memory has a hard 10,000-active-key cap.
   Expired entries are reclaimed at capacity; new identities fail closed while
   the cap is full. Active windows are not evicted to reset an existing quota.
   Counters saturate after the block threshold.
3. **Verification:** a configured Turnstile secret requires a nonempty token no
   longer than 2,048 characters. Siteverify receives a five-second abort deadline;
   HTTP errors, invalid JSON, rejected verification and network failures reject
   contact submission. The deadline is this application's policy.
   Missing secrets fail closed in production.
   [Cloudflare server validation](https://developers.cloudflare.com/turnstile/get-started/server-side-validation/)
4. **Input and errors:** Zod bounds name, email and message and rejects the
   honeypot. The unreachable honeypot-success branch was removed. Messages use
   text email and React escaping; provider failures expose a generic fallback.
   Logs exclude message text and email; rate-limit failures occur before external
   verification/email calls. Next server actions retain framework origin checks.
5. **Analytics:** no PostHog key means no SDK initialization/capture. Enabled
   analytics uses memory persistence, no person profiles, no automatic pageviews,
   pageleave, autocapture, exception capture or session recording. Events strip
   URL query/hash details, including referrer/initial URL, and campaign/search
   values before transmission. A memory-only setting does **not** establish a
   consent exemption: the owner must review privacy policy and legal basis before
   enabling a vendor. Sentry remains disabled without its DSNs.
6. **Headers:** config sets CSP, HSTS, nosniff, DENY framing, strict-origin referrer
  policy and restricted permissions. Production excludes `unsafe-eval` and
  restricts form/base/object/frame sources. Runtime verification remains part
  of the browser gate; the local production HTTP inspection below passed.

## Verification

From `projects/portfolio`:

Current integrated unit evidence: `node node_modules/vitest/vitest.mjs run`, exit
0; retained `docs/evidence/unit-integration.txt` reports **7 files / 31 tests
passed**. The actual test definitions were inspected; these include the security,
instrumentation and pageview tests. The old focused 19-test run below is additional
historical evidence, not a substitute for the integrated run.

Refreshed native full dependency audit on 2026-09-27:
`pnpm audit --audit-level high`, exit 0, “No known vulnerabilities found”.
Actual redacted output is retained in `docs/evidence/security-audit.txt` and its
byte hash is bound in the security evidence fragment.

### Monitoring evidence and its limits

- `tests/unit/instrumentation.test.ts` dynamically imports the real server
  initializer with `SENTRY_DSN` blank, calls `register` and `onRequestError`, and
  asserts the SDK mock receives neither initialization nor capture calls. A
  separate test imports real client instrumentation with its public DSN blank and
  verifies no initialization. The configured-server test confirms forwarding to
  the mocked SDK only; it is **not** a live receipt.
- `tests/unit/pageview.test.ts` invokes the real `recordPageview` with an absent
  key and verifies neither initialization nor capture. Configured-client tests
  exercise a mocked SDK, one-time initialization, and URL/referrer redaction.
- The current `Analytics` component returns from its effect before dynamically
  importing PostHog when `analyticsKey` is absent. Server/client Sentry modules
  likewise return before the dynamic import when their respective DSNs are absent.
  Provider SDK effects cannot execute through those missing-key branches.
- Hash-bound source/test/output records are assembled in
  `docs/evidence/security-review.json` for Orchestrator integration into G3's
  evidence document. No `eventId`, `receivedAt` or provider receipt is fabricated.
  When keys are configured, a real provider receipt must replace `mode: noop`.

```text
pnpm test tests/unit/security.test.ts tests/unit/instrumentation.test.ts tests/unit/pageview.test.ts
Test Files 3 passed (3); Tests 19 passed (19)

pnpm exec tsc --noEmit
exit 0

pnpm exec eslint lib/client-ip.ts lib/rate-limit.ts lib/turnstile.ts lib/pageview.ts app/actions/contact.ts components/analytics/Analytics.tsx tests/unit/security.test.ts tests/unit/instrumentation.test.ts tests/unit/pageview.test.ts instrumentation-client.ts
exit 0

pnpm audit --audit-level high
No known vulnerabilities found; exit 0
```

In the earlier clean production build (`docs/evidence/build.txt` at that time, exit 0), executed
`node .tool-cache/security-runtime.mjs` against `http://localhost:3400`, exit 0.
Retained output: `docs/evidence/security-runtime.txt`.

```text
PASS Production home returns HTTP 200
PASS Production CSP restricts default/object/frame sources and excludes unsafe-eval
PASS Production x-content-type-options matches expected policy
PASS Production x-frame-options matches expected policy
PASS Production referrer-policy matches expected policy
PASS Production HSTS present
PASS Production permissions policy present
PASS Clean production error-test route returns HTTP 404
PASS Generated client/public scan: 33 files; 0 credential matches (no values retained)
```

The scan covers `.next/static` and `public`, looking for private-key blocks and
recognized GitHub/live-payment/cloud-access credential signatures, and comparing
any configured private environment values without printing them. Private values
were absent in this environment. Pattern matching cannot prove arbitrary secrets
are absent; the inspected environment boundary and zero-key build supplement it.

The first audit attempt was blocked by sandbox socket permissions (OS 10013).
The approved network rerun succeeded. The native pnpm audit includes development
dependencies against this project's pnpm lockfile; there is no npm lockfile to
audit instead. Tests exercise spoofed headers, malformed addresses, rotating-key
capacity abuse, token size, HTTP failures and a genuinely stalled request that
aborts. SDK mocks verify missing-key no-op and configured server forwarding; they
do not prove receipt at a live vendor.

## Remaining deployment considerations

- **Medium:** memory quotas apply per warm server instance. They reset on restart
  and do not enforce a deployment-wide allowance across Vercel instances.
  Turnstile provides an independent check, not a shared quota. Before enabling a
  busy public contact endpoint, use a shared-store or edge quota; no paid service
  or new external integration was added in this review.
- **Medium:** static rendering uses CSP `unsafe-inline` for Next bootstrap scripts
  and inline styles. This is weaker than a nonce policy; the existing documented
  static-cache tradeoff remains. No user-controlled raw HTML was introduced.
- Real email delivery requires verified sender/Resend and Turnstile configuration.
  Without production keys, the action rejects and offers the public email address.
  Never deploy `CONTACT_DRY_RUN=1`, `E2E_ERROR_ROUTE=1` or Turnstile test credentials.
- **Release condition:** these flags deliberately work in the production
  E2E build; documentation alone cannot prevent deployment from inheriting them.
  A clean release environment must be proved before deployment. The local clean
  production `/e2e-error` 404, headers and client/public scan passed after the
  current clean rebuild. Repeat them against the deployed build.
- Live Sentry error/PostHog pageview receipts are required only when real keys
  exist; no-key tests do not satisfy that configured-provider branch.
- This app does not retain submitted messages in a database. Once email is enabled,
  the owner must set inbox/provider retention and handle deletion requests there.
