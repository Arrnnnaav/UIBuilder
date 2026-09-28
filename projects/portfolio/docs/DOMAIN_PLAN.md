# Portfolio domain plan

Status: partial — G3 passed on 2026-09-28, but S7 deployment/domain verification has not occurred. The owner has deferred custom-hostname and DNS/provider work. Do not select or purchase a hostname, connect DNS, or configure mail until the owner explicitly selects the provider and approves the exact changes.

## Current facts

- Site metadata uses the provisional origin `https://arnav-khandelwal.vercel.app`.
- That hostname currently returns HTTP 404. It is not evidence of a live production deployment.
- Vercel CLI is not authenticated in the current environment. Deployment and account-level verification cannot proceed until the owner authenticates the CLI in the intended Vercel account.
- No custom hostname, registrar, DNS account, sending domain, or connected Search Console account is selected in the project evidence.
- G3 passed on 2026-09-28 against all 12 static routes. Local build, SEO, security, and performance evidence is recorded in the project reports; that evidence does not establish a live deployment.
- No production deployment or live DNS changes have occurred.

## Activation sequence

Follow [`plan/DOMAIN-LAUNCH.md`](../../../plan/DOMAIN-LAUNCH.md) after the owner authorizes S7. First, the owner must authenticate the Vercel CLI in the intended account and authorize deployment. Ship owns deployment; domain-ops does not deploy. The owner then selects a hostname and provider. Domain-ops documents provider-issued records and presents the exact DNS diff, expected propagation, verification steps, and rollback for approval before any live change. After approval and deployment, verify DNS, ownership, TLS, redirects, and live SEO endpoints; hand live SEO checks to growth. Email authentication and Webmaster Tools are conditional on owner-selected services and account access.

## Portfolio-specific launch checks

- Replace the provisional origin consistently in site configuration, route canonicals/OG URLs, schema entity IDs, sitemap, robots, `llms.txt`, and résumé references.
- Confirm apex or `www` as the single canonical hostname. Do not create `app` for this portfolio.
- Test every public canonical route, PDF content type, redirects, TLS, and sitemap on the live deployment.
- Submit the sitemap only after Search Console domain verification. Record submission separately from actual indexing.
- Configure mail authentication only if a sender provider is selected; preserve unrelated MX records and stage DMARC based on observed sender alignment.

No production deployment or live domain changes have been made. The Vercel CLI authentication requirement and provisional hostname 404 are current S7 blockers; custom-domain work remains owner-deferred.
