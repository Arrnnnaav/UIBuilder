# INFORMATION ARCHITECTURE — abizcreator

> ux agent, S2, 2026-09-25. Slugs, primary queries and cross-sell links come from SEO_STRATEGY.md (intent map, internal-linking plan). One primary query per route, so no two pages compete. Canonical form: no trailing slash.
> Status column: **core** = ships at launch; **conditional** = ships only if its condition is met; **optional** = owner decides (PRODUCT Q9).

| Route | Purpose | Primary intent / keyword | Links to | Status |
|---|---|---|---|---|
| / | Say "print, digital and design under one roof in Vaishali Nagar", prove it, route to a service or WhatsApp | printing and digital marketing Jaipur (nav + local commercial); brand "ABizCreator" | 7 service pages (descriptive anchors), /services, 3 strongest /work/[slug], /work, /contact (visit block), WhatsApp, tel | core |
| /services | Hub: all 7 services in 3 groups (Print / Digital / Design & build) plus the other titles from the old site mapped to their parent page | printing and digital services Jaipur (commercial hub) | 7 service pages, /work, /contact, WhatsApp | core |
| /services/visiting-card-printing | Highest-priority money page: visiting card design + printing | visiting card printing Jaipur (+ Vaishali Nagar, business card printing Jaipur) | /services (breadcrumb), /services/nfc-business-cards, /services/logo-branding, 2–3 /work/[slug], /work, /contact, WhatsApp | core |
| /services/offset-printing | Letterheads, brochures, flyers, calendars, bill books (owner confirms the list) | offset printing Jaipur (+ Vaishali Nagar, letterhead/brochure/flyer printing Jaipur) | /services, /services/logo-branding, /services/visiting-card-printing, /work/[slug], /contact, WhatsApp | core |
| /services/nfc-business-cards | NFC and digital cards (tap to share, QR fallback); absorbs "Digital Cards" and "NFC/RFID Cards" | NFC business card Jaipur (+ digital business card Jaipur) | /services, /services/visiting-card-printing, /services/logo-branding, /work/[slug], /contact, WhatsApp | core |
| /services/social-media-marketing | Social media management for local businesses; absorbs "Social Media Management" and "Digital Marketing" | social media marketing agency Jaipur (target the Vaishali Nagar long tail) | /services, /services/google-facebook-ads, /services/website-development, /work/[slug], /contact, WhatsApp | core |
| /services/google-facebook-ads | Google and Meta ads; bulk WhatsApp/SMS as a section (only if DLT/opt-in is confirmed) | Google Ads agency Jaipur (+ Facebook ads Jaipur) | /services, /services/social-media-marketing, /services/website-development, /contact, WhatsApp | core |
| /services/website-development | Business and e-commerce websites; mobile apps as a section | website development company Jaipur (+ website design Vaishali Nagar, e-commerce website Jaipur) | /services, /services/social-media-marketing, /services/logo-branding, /work/[slug], /contact, WhatsApp | core |
| /services/logo-branding | Logo, stationery and corporate identity; absorbs "Graphic Designing" and "Corporate Branding" | logo design Jaipur (+ graphic design company Jaipur, corporate branding Jaipur) | /services, /services/visiting-card-printing, /services/offset-printing, /work/[slug], /contact, WhatsApp | core |
| /work | Real samples from the /downloads PDFs (owner supplies originals), filterable by service; the 301 target of /downloads/ | visiting card design samples Jaipur (investigational) | /work/[slug], the 7 service pages (filter labels link to them), /contact, WhatsApp | core (shows the empty state until samples are approved) |
| /work/[slug] | One project or sample set with a one-line "what we made, for whom" caption | "<deliverable> for <sector> in Jaipur" (per item) | the service used, next/prev /work/[slug], /work, WhatsApp "something like this" | core template; each item is published only when it has ≥1 approved image |
| /about | Who ABizCreator is: one-roof studio, walk-in shop, team (if wanted), years in business (once confirmed) | about ABizCreator (E-E-A-T) | /services, 7 service pages (in the "what we do" list), /work, /contact, WhatsApp | core |
| /contact | NAP (exact canonical string), hours, directions, all 4 channels | ABizCreator Vaishali Nagar address (+ printing shop near Nursery Circle, ABizCreator phone number) | WhatsApp, tel, mailto, Maps directions, /services, socials (sameAs) | core |
| /privacy | Privacy note for cookieless analytics | none (noindex allowed) | /, /contact | conditional: only if a PostHog key is set |
| /blog | Post index | informational AEO topics (see SEO_STRATEGY) | /blog/[slug], /services | optional: owner decides (PRODUCT Q9); if dropped, /blog/ returns 410 |
| /blog/[slug] | One article with a named author | per post (e.g. "NFC vs QR visiting cards") | exactly one money page, /blog, WhatsApp | optional (same condition as /blog) |
| /404 | Not-found recovery (also catches demo URLs if 410 is not implemented) | none (noindex) | 7 service pages, /work, /contact, WhatsApp | core |

## Navigation
- **Header (all pages, sticky):** logo → `/`; **Services** (a disclosure panel listing the 7 in 3 groups, plus "All services" → `/services`); **Work**; **Contact**; a WhatsApp pill CTA (page-aware prefill). At ≥1024px a `tel:` number also shows. **About** lives in the mobile overlay and the footer, not the top bar (the nav pattern allows 3 links; Contact outranks About for local intent).
- **Mobile:** logo, WhatsApp icon-button, menu button → full-screen overlay: the 7 services grouped, then Work, About, Contact, then the Call/WhatsApp/Email/Directions channels. Plus the persistent bottom dock (`new:wa-dock`, see USER_FLOW).
- **Footer (all pages):** big WhatsApp CTA; full NAP (identical to schema); hours (once confirmed); the 7 service links; Work, About, Contact, Privacy (if present); tel / mailto / directions; socials (facebook.com/abizcreator, instagram.com/abizcreator, LinkedIn, Justdial). The copyright names ABizCreator (the old site credits the theme vendor).
- **Breadcrumbs** on every route except `/` and `/404`: Home › Services › <Service>, Home › Work › <Item>, and so on. They feed BreadcrumbList JSON-LD.

## Service grouping and order
Order follows SEO priority (print is the realistic organic win). ⚠ The owner may reorder at G1 (PRODUCT Q1); the slugs stay the same.

| # | Group | Route | Old-site titles it absorbs |
|---|---|---|---|
| 01 | Print | /services/visiting-card-printing | Print Media (visiting cards) |
| 02 | Print | /services/offset-printing | Print Media (offset) |
| 03 | Print | /services/nfc-business-cards | NFC/RFID Cards, Digital Cards |
| 04 | Digital | /services/social-media-marketing | Social Media Management, Digital Marketing |
| 05 | Digital | /services/google-facebook-ads | Google Ads, Facebook Ads, WhatsApp/SMS (section) |
| 06 | Design & build | /services/logo-branding | Graphic Designing, Corporate Branding |
| 07 | Design & build | /services/website-development | Website Development, E-Commerce Development, Mobile App (section) |

All 12 old titles are covered, so no search term from the old /services page is orphaned.

## Work item slugs
Pattern: `<deliverable>-<sector>` in short kebab-case, for example `/work/visiting-cards-dental-clinic` or `/work/logo-letterhead-coaching-institute`. The client is named in the caption only with permission; otherwise use a sector description. Seed candidates come from the /downloads PDFs (business cards portfolio, logo design, 3D logo mockups, portfolio). **Final slugs are set when the owner supplies originals.** A PDF set with no per-project split becomes one collection item per PDF (for example `/work/visiting-card-collection`) rather than being left out.

## Not routes (handled by redirects, SEO_STRATEGY §Redirect map)
`/downloads/` → 301 `/work`; `/about/`, `/services/`, `/contact/` → 301 to the no-slash form; `/?p=84|87|88|109` → 301; `/wp-sitemap*.xml` → 301 `/sitemap.xml`; demo `/portfolio/*`, `/project/`, `/my-account/`, `/author/admin/`, WP feeds → 410 (fall back to `/404` if the 410 Worker is not built); `/blog/` → 410 unless the blog is revived. No locality doorway pages and no Hindi routes at launch (SEO_STRATEGY decisions).
