# USER FLOW — abizcreator

> ux agent, S2, 2026-09-25. Inputs: PRODUCT.md, SEO_STRATEGY.md (intent map, FAQ list, internal-link plan, redirect map), CLIENT_SITE.md, COMPETITORS.md, INSPIRATION.md, REFERENCE_BREAKDOWN.md, pipelines/company-site/PAGES.md + PIPELINE.md, brain/patterns/*.json, brain/preferences.md.
> Mode: frontend-only static export (DECISIONS D14). There are **no forms**. Every conversion is a link: WhatsApp (`wa.me`), `tel:`, `mailto:` or a Google Maps directions link, all rendered by `components/contact/ContactChannels.tsx` from `content/site.json.contact`.
> Structure and behaviour only. No colour, font or styling decisions.

## Conversion model

| Rank | Channel | Link | When a visitor uses it |
|---|---|---|---|
| 1 (primary) | WhatsApp chat, prefilled per page | `https://wa.me/919024282878?text=<encoded message>` | the default action on every page |
| 2 | Call | `tel:+919024282878` | urgent jobs; older or corporate buyers |
| 3 | Email | `mailto:abizcreator@gmail.com?subject=<page-aware subject>` | corporate/government procurement that needs a paper trail |
| 4 | Directions (walk-in) | Google Maps link `https://maps.app.goo.gl/iuW4YzeVBoVAAnC76` | buyers who want to see paper, finishes and samples in person |

Every channel click fires one analytics event, `contact_click { channel, route, service? }`, **only if** a PostHog key is set. Without a key it is a no-op.

### Page-aware WhatsApp prefill (tagsen mechanism, our own wording)
The message is built at build time from the route's data, so it needs no client JS and works in the static HTML. Text is drafted here; growth/frontend put the final strings in content data so BusinessOS can edit them.

| Page type | Prefilled message (draft) |
|---|---|
| `/`, `/about`, `/services`, `/404`, `/privacy` | "Hi ABizCreator, I found you on your website. I need help with: " |
| `/services/<slug>` | "Hi ABizCreator, I'd like a quote for **<service name>**. Item/quantity: … Needed by: …" (it mirrors the "How do I get a quote?" FAQ answer: item, quantity, deadline) |
| `/work` | "Hi ABizCreator, I saw your work samples and want something similar. I need: " |
| `/work/<slug>` | "Hi ABizCreator, I saw **<work title>** on your website and want something like it." |
| `/contact` | "Hi ABizCreator, I'd like to visit / get a quote. " |
| `/blog/<slug>` (optional) | "Hi ABizCreator, I read **<post title>** and have a question: " |

Rules: the message never contains personal data; it is plain text, URL-encoded; the page name comes from the same data source as the `<title>` so they cannot drift.

### Persistent WhatsApp CTA (mobile thumb zone): `new:wa-dock`
- **Below 768px:** a fixed bottom dock with two targets: **WhatsApp** (primary, about two-thirds of the width) and **Call** (one-third). Each target is at least 48px tall, and the dock adds `env(safe-area-inset-bottom)`.
- **It must not cover content:** the page reserves bottom padding equal to the dock height through CSS at the same breakpoint. The last line of the footer is always reachable above the dock.
- **It must not cause CLS:** the dock is in the server-rendered HTML from first paint and is never injected after hydration. Show and hide use `transform`/`opacity` only; `display`, `height` and layout properties are never toggled.
- **It hides when redundant:** when the footer's big CTA or the page's own contact block is in view (IntersectionObserver), and while the overlay menu is open. It never hides on scroll direction, because a dock that jumps is worse than one that stays.
- **At 768px and above** there is no floating button. The sticky header carries a WhatsApp pill and a `tel:` number, so no FAB overlaps content at desktop widths.
- Under reduced motion, show and hide are instant.

## Primary journey (visitor → WhatsApp)
Most entries are **search → service page** on mobile, not the home page (the SERP analysis puts print pages as the realistic organic win).

```
Google "visiting card printing Vaishali Nagar"          (or Maps / Justdial / Instagram bio → home)
  → /services/visiting-card-printing
      1. H1 + 40–60 word answer confirms: yes, here, in Vaishali Nagar          [first viewport]
      2. WhatsApp CTA in the hero + the mobile dock is already visible          [first viewport]
      3. scroll: what to send for a quote → paper/finish spec → real samples → how it works (3 steps)
      4. FAQ answers the price/turnaround doubt with "depends on…, ask us" → WhatsApp link inside the answer
  → taps WhatsApp (dock or in-page)
  → WhatsApp opens with "I'd like a quote for visiting card printing. Item/quantity: … Needed by: …"
  = CONVERSION (owner sees which service the lead came from)
```

Fallback branches on the same journey:
- **Wants to see the real thing:** "Visit the studio" block → Directions link → walk-in (offline conversion).
- **Not convinced by one sample:** "See more work" → `/work?service=visiting-card-printing` (filtered) → `/work/<slug>` → "Want something like this?" WhatsApp.
- **Needs something adjacent:** related services (visiting cards → NFC cards, logo & branding) → the same page pattern → WhatsApp.

## Secondary journeys

### S1. Brand or directory visitor (navigational: "abizcreator", Justdial, Instagram bio)
`/` → hero H1 "print, digital and design under one roof in Vaishali Nagar, Jaipur" + proof chips → grouped services list → picks a service → service page → WhatsApp. Short path: `/` hero WhatsApp CTA directly.

### S2. "One roof" buyer (a shop owner who needs cards **and** Instagram **and** a site)
`/` → "One brief, print and digital" block → `/services` (all 7 in 3 groups) → a service page → the cross-sell link (for example social media → Google/Facebook ads → website) → WhatsApp with "I need help with: " (general prefill, since the need spans services).

### S3. Corporate / government procurement
`/` → client logo strip (if permitted) → `/work` → `/work/<slug>` (named client only with permission) → `/about` (years in business, once confirmed; studio; team) → `/contact` → **email** (paper trail) or call.

### S4. Walk-in visitor ("printing shop near Nursery Circle", "ABizCreator address")
`/contact` (or the footer NAP on any page) → exact address, landmark, hours (once confirmed) → **Directions** → visits. Secondary action on the same page: WhatsApp "I'd like to visit".

### S5. Not sure what they need
Any page → services list fallback prompt "Not sure which service? Tell us what you are making" (poch mechanism) → WhatsApp general prefill.

### S6. Old-URL visitor (redirect map in SEO_STRATEGY)
`/downloads/` or an old PDF URL → 301 → `/work` → samples → WhatsApp. Demo URLs (`/portfolio/*`, `/project/`) → 410, or the custom 404 if 410 is not implemented → `/404` links to the 7 services, work and WhatsApp.

### S7. Reader (only if the blog is revived; owner decides, PRODUCT Q9)
Search "NFC vs QR visiting cards" → `/blog/<slug>` → the one money-page link in the post (`/services/nfc-business-cards`) → WhatsApp.

## Dead-end check
Every page needs a next step. Global elements on every page: the header (Services, Work, Contact + WhatsApp CTA), the mobile dock (WhatsApp + Call), and the footer (big WhatsApp CTA, NAP, 7 service links, tel/mailto, socials).

| Route | In-content next step(s), besides the global elements | Status |
|---|---|---|
| / | service rows → 7 service pages; work cards → /work/<slug>; visit block → /contact + directions; FAQ quote answer → WhatsApp | ✅ |
| /services | numbered list → 7 service pages; fallback prompt → WhatsApp | ✅ |
| /services/visiting-card-printing | hero WhatsApp; samples → /work; related → nfc-business-cards, logo-branding; visit → /contact | ✅ |
| /services/offset-printing | hero WhatsApp; samples; related → logo-branding, visiting-card-printing; visit → /contact | ✅ |
| /services/nfc-business-cards | hero WhatsApp; samples; related → visiting-card-printing, logo-branding; visit → /contact | ✅ |
| /services/social-media-marketing | hero WhatsApp; samples; related → google-facebook-ads, website-development; CTA band → /contact | ✅ |
| /services/google-facebook-ads | hero WhatsApp; related → social-media-marketing, website-development; CTA band → /contact | ✅ |
| /services/website-development | hero WhatsApp; samples; related → social-media-marketing, logo-branding; CTA band → /contact | ✅ |
| /services/logo-branding | hero WhatsApp; samples; related → visiting-card-printing, offset-printing; visit → /contact | ✅ |
| /work | cards → /work/<slug>; empty state → WhatsApp "ask for samples" + directions; CTA band | ✅ (including the empty state) |
| /work/[slug] | service link ("made with our <service>"); next/prev work; WhatsApp "something like this" | ✅ |
| /about | services list → service pages; /work; visit block → /contact | ✅ |
| /contact | WhatsApp, Call, Email, Directions; links back to /services | ✅ |
| /privacy (conditional) | link to /contact and / | ✅ |
| /blog (optional) | post cards → /blog/<slug>; services link | ✅ |
| /blog/[slug] (optional) | one money-page link + WhatsApp CTA + related posts | ✅ |
| /404 | 7 service links, /work, /contact, WhatsApp | ✅ |

**Result: no dead ends.** Two conditional risks:
1. `/work` with zero approved samples. This is handled by the empty state (`new:empty-state-samples`), which still converts through WhatsApp and directions.
2. A service page with no samples. The samples section is replaced by the "see samples at the studio or ask on WhatsApp" line; the page never shows an empty grid.
