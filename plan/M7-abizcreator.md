# M7 — ABizCreator company site (first client)

## Steps
1. The research agent studies https://abizcreator.com/ (Playwright + tavily-extract): what they sell, who they sell to, their tone, and their current SEO state. BusinessOS already names ABizCreator as a pilot, so check whether the current site is WordPress.
2. Confirm the services, audience and assets with the user or client, and who owns the domain and accounts.
3. Run S1–S7 with `pipelines/company-site`, plus a blog and case studies (Keystatic).
4. Deploy to Cloudflare Workers in the client-owned account, with Workers Builds previews.
5. Connect to the client's BusinessOS tenant and ship the first approved fix.

## Pre-research (2026-09-25, `tvly extract` + page generator tags)
- **Stack today:** WordPress 6.7.9, Elementor 4.1.3, Phlox Pro theme. This matches the BusinessOS pilot note (WordPress staging connector).
- **Positioning:** "Print | Digital | Design". Hero reads "Let us work on your next project!" (generic, with no outcome).
- **Services listed:**
  - Print media
  - Ecommerce development
  - Website design
  - Mobile app development
  - Social media management
  - Facebook ads
  - Digital marketing
  - Google ads
- **Proof:** 3 testimonials (Amit Sharma, Mukul, Chhaya Yadav) and a client logo strip of 5 images. "Reasons to hire us" says they are specialists in social media, passionate, and strategists.
- **Issues:**
  - Demo attachment filenames are still in use.
  - The copy is inconsistent: "Four your Business", and a "social media only" claim sits next to 8 listed services.
  - There is no case study, blog, FAQ or schema. This is likely, but needs a full audit in S2.
- **Decision needed with the client:**
  - Migrate from WordPress to the git-based UIBuilder site. This is the plan, and it enables the BusinessOS git-site loop.
  - Or keep WordPress and use the existing WordPress staging connector.
  - Also: which services lead. The copy suggests social media is the core.

## Done when
- G3 is green and the site is live on the client's domain.
- The first dashboard fix is published and verified.
- `brain/builds/abizcreator.json` is written.
