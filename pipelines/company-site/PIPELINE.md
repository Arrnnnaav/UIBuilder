# Pipeline: company-site (per client)

**For:** a commercial client site.
**Host:** Cloudflare Workers via OpenNext, in the **client-owned** account. It costs $0; Workers Paid ($5/mo) is needed only if the free limits are hit.
**Entity:** Organization, or ProfessionalService/LocalBusiness when the client has a physical location.
**CMS:** Keystatic (GitHub mode) for the blog and case studies.

Every client is different. Pages and features come from the client's offer, which the S1/S2 research establishes. This recipe fixes only the structure and the quality bars.

## Required inputs (S1 interview + research of the current site)
- Company name, what they sell (products/services), and who buys it (segments)
- Current site URL. The research agent studies it in S2 and writes `docs/CLIENT_SITE.md`.
- Proof: clients/logos, numbers, testimonials, case studies (with permission)
- Brand assets (logo, colours, fonts), and whether to **keep or evolve** them
- Primary conversion (call, quote, demo, WhatsApp, form) and the contact email
- Locations and service areas (for LocalBusiness)
- Who owns the domain and the Cloudflare, GitHub, Resend and PostHog accounts. Ideally, the client does.

## Stages
Standard `AGENTS.md` flow, with these specifics:
- **research:** audit the client's current site, study 3–5 competitors, and use a Search Console export if the client provides one.
- **ux:** derive the IA from the services, with one page per service so each targets its own search intent.
- **backend:** Keystatic collections `posts` and `case-studies`, routes `/blog/[slug]` and `/work/[slug]`, and the Cloudflare OpenNext config.
- **growth:**
  - schema: Organization, Service, FAQPage, Article (with author) and BreadcrumbList
  - answer-first FAQs on every service page
  - an llms.txt that covers the services
- **ship:** deploy to the client's account, then run `/connect` to the client's BusinessOS tenant.

## Definition of Done
`AGENTS.md` §4, plus:
- every service page has its own title, description, FAQ and CTA
- the blog index and every post pass the audit, with Article schema and an author on each post

## Frontend-only static mode (DECISIONS D14; reference: `projects/abizcreator`)
Use this mode when a client starts without a backend:
- `next.config.ts` sets `output: "export"` and `images.unoptimized`. Headers move to `public/_headers`, which Cloudflare applies.
- Remove the contact server action, Turnstile, Resend, rate limiting and Sentry. Contact goes through `components/contact/ContactChannels.tsx` (WhatsApp, tel, mailto), driven by `content/site.json.contact`.
- Metadata routes (sitemap, robots, OG) need `export const dynamic = "force-static"`.
- `scripts/serve-static.mjs` serves `out/` for local runs, with `_headers`, clean URLs, a 404 page and br/gzip compression like Cloudflare.
- `scripts/fix-export-segments.mjs` runs as postbuild. It works around Next 16 on Windows writing `__next.<seg>/…` directories where the client requests dotted filenames.
- `wrangler.jsonc` uses Workers static assets (`./out`) and costs $0.
- G3 waiver: no contact-form e2e. It is replaced by a contact-channels test.
