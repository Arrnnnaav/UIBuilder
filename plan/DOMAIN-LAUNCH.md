# Domain launch plan

This is a deferred custom-domain workstream. G3 passed on 2026-09-28. Do not buy, connect, or change a domain until the owner selects the hostname/provider and approves the exact changes. The portfolio currently uses a provisional Vercel URL in its canonical metadata; it currently returns HTTP 404 and is not proof of deployment.

## Checklist mapped from `domain_launch_checklist.pdf`

- [ ] Owner selects and owns the registrar, production hostname, canonical host (`apex` or `www`), renewal contact, billing and recovery access; enable MFA.
- [ ] `ship` confirms production hosting and deploy target. `domain-ops` obtains the exact current DNS records from that host; record name/type/value/TTL and rollback before applying.
- [ ] Add only the host-required apex and/or `www` records. Add `app` only if an actual product needs it. Verify authoritative DNS answers and host ownership.
- [ ] Verify certificate issuance, HTTPS, apex/www redirects to one canonical hostname, and no redirect loops or mixed content.
- [ ] Replace provisional origin in canonical, Open Graph, JSON-LD, sitemap, robots and `llms.txt`; run the production SEO audit and inspect representative routes and resume download.
- [ ] Verify Search Console domain ownership and submit the sitemap; record URL inspection results separately from indexing claims. Bing Webmaster Tools is optional.
- [ ] Email DNS is conditional: only if a sender provider is selected. Inventory senders and existing SPF first, use provider-issued DKIM, publish one SPF record per hostname, and stage DMARC from `p=none` with report review before enforcement. Mail subdomains are optional; marketing mail is not required for this portfolio. Preserve existing MX unless inbound mail migration is in scope.
- [ ] Send tests to multiple mailbox providers and review authentication/alignment and spam placement; keep provider reports free of recipient personal data.
- [ ] Record final DNS state, authoritative lookup output, TLS/redirect evidence, verification date and rollback in the site's domain report.
- [ ] After launch, monitor DNS/certificate renewal, uptime, Search Console indexing and mail authentication reports. `ship` owns uptime/performance; `growth` owns search and content checks.

## PDF advice that is conditional or corrected

The PDF's `app` CNAME and two email subdomains are examples, not universal requirements. A portfolio normally needs one canonical web host. DNS targets must come from the selected host. Do not publish a strict DMARC policy before identifying every legitimate sender and checking alignment. Sitemap/search-console and email tests are post-deploy operations, not current G3 completion evidence.

## Current portfolio status

Custom domain deferred by owner. G3 passed and a protected Vercel preview is Ready; there is no active production URL/alias. No stable public hostname, registrar, email sender domain, or Search Console account has been selected. No DNS changes have been made.
