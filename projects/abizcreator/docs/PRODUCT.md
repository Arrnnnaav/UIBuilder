# PRODUCT — abizcreator

> Draft by the Orchestrator on 2026-09-25, from `docs/CLIENT_SITE.md`, `docs/COMPETITORS.md` and the research handoff. Items marked ⚠ need owner or client confirmation before G1 (see §Open questions). Decisions D14 (frontend-only) and D15 (WordPress stays as staging and the BusinessOS connection) apply.

- **Type:** company-site. Built from scratch, frontend only, as a static export on Cloudflare Workers.
- **Client:** ABizCreator, a print, digital and design studio in Vaishali Nagar, Jaipur, Rajasthan.
- **One line (draft):** "Print, digital and design for Jaipur businesses, from visiting cards to campaigns, under one roof." ⚠ The lead service is unconfirmed.
- **Audience:**
  - *Primary:* local Jaipur SMBs, shops and professionals who need print (visiting cards, offset, branding), plus social media and ads.
  - *Secondary:* corporate and government buyers (per the logo strip) who need collateral, NFC cards and campaigns.
- **Job to be done:** a visitor quickly sees that ABizCreator does their job (print, digital or design), trusts them (real work, clients, reviews, a walk-in address), and messages them on WhatsApp.
- **Primary conversion:** a WhatsApp chat with a prefilled message naming the page or service. Secondary: a call, an email, or directions to the shop.
- **Pages (starting point; ux decides the final IA):**
  - `/` and `/services`
  - `/services/[slug]`: print, social media, ads, websites/e-commerce, design/branding, and cards (NFC/digital). ⚠ The client picks the order.
  - `/work` and `/work/[slug]`: real samples from the /downloads PDFs.
  - `/about`, `/contact`
  - `/blog`: only if revived ⚠
  - `/privacy`: if analytics is on
- **Content inventory:**
  - Services: 12 titles, with **no descriptions**. The copy has to be written and then confirmed by the client.
  - Testimonials: 3 (need permission).
  - Client logos: 8. They are third-party marks and need permission.
  - Portfolio PDFs: business cards, logos, 3D mockups, portfolio.
  - Contact: address, phone/WhatsApp +91-9024282878, abizcreator@gmail.com, and social links.
  - **Missing:** hours, prices or turnaround times, real project photos, founding year (2001 and "15 years" conflict), a vector logo.
- **Tone (3 words, draft):** local, dependable, crafted. ⚠
- **Differentiator to carry into the design:** one shop that handles both the physical (print, cards, NFC) and the digital (social, ads, web), shown through real, tangible work and a walk-in studio. Local rivals rarely have a credible site, so a fast, clear, honest one stands out.
- **Must avoid:**
  - theme-demo filler
  - the claim that they are "social-media only specialists", which contradicts the offer
  - stock people photos
  - generic agency gradients
  - anything in `brain/preferences.md` → Avoid
- **Constraints:**
  - $0 hosting (Cloudflare Workers static assets, client-owned account).
  - No backend: contact is by link only.
  - Content lives as git data files so BusinessOS can edit it by PR.
  - WordPress stays up as staging until cutover.
  - At launch, redirect the old URLs: 301s for `/about/`, `/services/`, `/contact/`, `/downloads/`, and 410s for the demo `/portfolio/*`, `/project/`, `/my-account/`, `/author/admin/`.
- **Success metrics:**
  - G3 green (with the D14 waiver: no form, so no form e2e).
  - Mobile LCP under 2.5s.
  - 0 high findings in the SEO audit.
  - WhatsApp click-through tracked (PostHog, if a key is set).
  - Indexed for "printing Jaipur", "visiting card printing Vaishali Nagar" and similar queries.

## Open questions (for the client, via the owner, at G1)
1. Which service leads, and which 3–5 get their own pages first?
2. Confirm the phone and WhatsApp number, the email (or move to a domain email), the hours, and whether walk-ins are welcome.
3. Founding year: 2001, or a later year?
4. Which client logos and testimonials may be shown publicly? What is the Google rating and review count?
5. Real work samples as originals, with permission. Any short case studies?
6. Who is Aditya? Should the team appear on the site?
7. Keep or evolve the brand (cyan/blue wordmark)? Is a vector logo available?
8. Can "starting from" prices or turnaround times be published?
9. Keep the Downloads page? Revive the blog?
10. Service area: Jaipur, Rajasthan, or pan-India shipping?

## G1 status (2026-09-25)
- Lead service: **Print first** (owner decision). Order is Print → Digital → Design & build.
- G1 is **not yet approved**. ABizCreator waits for the client's answers (open questions above) before S3 design.
- **Quote form (D19):** a secondary contact path via Formboost (static POST, free tier) next to the WhatsApp CTA. Built in S4. The CSP `form-action` must allow the Formboost endpoint.
