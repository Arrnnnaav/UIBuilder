# Portfolio domain plan

Status: deferred. The owner requested that domain work wait. Do not select or purchase a hostname, connect DNS, or configure mail until G3 passes and the owner explicitly selects the provider and approves the exact changes.

## Current facts

- The site metadata uses the provisional origin `https://arnav-khandelwal.vercel.app`.
- This origin is not evidence that a production deployment exists.
- There is no selected custom hostname, registrar, DNS account, sending domain, or connected Search Console account in the project evidence.
- The current production build has no E2E keys/error fixture; local SEO audit reports zero findings. G3 remains open because mobile LCP exceeds 2.5 seconds.

## Activation sequence

Follow [`plan/DOMAIN-LAUNCH.md`](../../../plan/DOMAIN-LAUNCH.md) after G3. The owner selects a hostname and provider; ship deploys; domain-ops documents and validates provider-issued records, TLS and canonical redirects after explicit change approval; growth checks live SEO endpoints. Email authentication and Webmaster Tools are conditional on owner-selected services/account access.

## Portfolio-specific launch checks

- Replace the provisional origin consistently in site configuration, route canonicals/OG URLs, schema entity IDs, sitemap, robots, `llms.txt` and resume references.
- Confirm apex or `www` as the single canonical hostname. Do not create `app` for this portfolio.
- Test every public canonical route, PDF content type, redirect, TLS and sitemap on the live deployment.
- Submit the sitemap only after Search Console domain verification. Record submission separately from actual indexing.
- Configure mail authentication only if a sender provider is selected; preserve unrelated MX records and stage DMARC based on observed sender alignment.

No live domain changes have been made.
