# WIREFRAMES — abizcreator

> ux agent, S2, 2026-09-25. Sections are listed top to bottom for each IA route. Each section gives the **pattern** (brain id, or `new:<name>` defined in §B), its **content** needs, and its **mobile** behaviour (390px).
> Structure and behaviour only; design-director decides the visuals in S3. Frontend-only static mode (D14): no forms anywhere.

## A. Rules that apply to every page

- **Perf budget:** the brain has only one `medium` pattern, `hero-interactive-object`, and it is **not used** (it is `bad_for` low-end mobile audiences, and the client's audience is mobile-first SMBs). No page has a `medium` pattern, so the "one medium per page, never in the first mobile viewport" rule is met trivially.
- **Motion:** `motion-scroll-reveal-restrained` applies only to sections that start below the first viewport at **every** breakpoint. The hero, breadcrumb, H1 and first CTA are visible at first paint with no opacity-0 start (brain lesson: this pushed mobile LCP from 2.46s to 3.9s). Everything is reduced-motion safe.
- **Mobile LCP element:** the H1 text on every page. Hero images on mobile sit below the text with reserved aspect ratio, loaded eagerly only if they are in the first viewport at 1440.
- **Degrade gracefully (proof slots):** every proof section reads a content file with a per-item `approved: true` flag. **An unapproved or empty slot is not rendered at all**: no empty grids, no "coming soon" placeholders, and no layout gap. The sections around it close up. Each proof section below states its fallback.
- **FAQ:** `faq-answer-first` on `/` and on all 7 service pages (key pages). Questions come verbatim from SEO_STRATEGY §Answer-engine questions. "Ask" items (price, turnaround, minimums) explain what the price depends on and end with a WhatsApp link. No numbers are invented. Accordion uses the grid-rows 0fr→1fr mechanism; **answers are in the HTML and open by default without JS** (crawlers and AEO extract them).
- **Global chrome** (listed as the first and last rows of each route and not re-described): `nav-minimal-overlay` + `new:services-disclosure-menu` at the top; `footer-big-cta` + `new:wa-dock` at the bottom.

## B. New patterns introduced (candidates for `brain/patterns` after `/learn`)

| id | Mechanism (one line) | perf_cost |
|---|---|---|
| `new:wa-dock` | Mobile-only (<768px) fixed bottom dock, WhatsApp (page-aware prefill, ~2/3 width) + Call (~1/3), ≥48px targets + safe-area inset; body reserves matching bottom padding in CSS; in SSR HTML from first paint; show/hide by transform/opacity only; hides when the footer CTA or the page contact block is in view or the menu is open. | none |
| `new:services-disclosure-menu` | The header "Services" item opens a panel (button with `aria-expanded`, Esc closes, focus returns) listing the 7 services in 3 labelled groups plus "All services"; on mobile the same list is the first block in the overlay menu. | none |
| `new:breadcrumb` | Text trail Home › Section › Page above the H1; the last item is not a link; it feeds BreadcrumbList JSON-LD from the same data. | none |
| `new:promise-strip` | 3 short tiles (title + one-line qualifier) directly under the hero, tagsen risk-reversal mechanism; only owner-confirmed claims. | none |
| `new:one-roof-chain` | A 4-step chain showing one business moving through logo → cards/letterhead → posts/ads → website, each step linking to its service page; this is the differentiator made visible and extractable. | none |
| `new:process-3-steps` | Numbered 3-step strip: Message us on WhatsApp → approve the design proof → collect at the studio or receive delivery (the delivery step appears only once Q10 is confirmed). | none |
| `new:work-caption-grid` | Image-first grid of work cards, each with a reserved-ratio image and a one-line Pentagram-style caption "<deliverable> for <sector/client>" + service tag; the whole card is one link. | low |
| `new:logo-strip-permissioned` | A row of approved client logos with real `alt` text; static wrap by default, optional 40s linear marquee only under `prefers-reduced-motion: no-preference` and only at ≥1024px; **hidden unless at least 4 logos are approved**. | low |
| `new:review-quotes` | Up to 3 approved reviews: quote, name, the service mentioned, and a source link (Google/Justdial); static, no autoplay; hidden if none are approved. | none |
| `new:visit-studio` | Walk-in block: exact NAP string, landmark line ("Vaishali Tower-1, Nursery Circle"), hours (once confirmed), Directions + WhatsApp "I'd like to visit"; no map iframe (a link only, for perf). | none |
| `new:quote-checklist` | "What to send us for a quote" as a short list (item, quantity, size/paper, finish, deadline) followed by the WhatsApp link whose prefill contains the same labels with blanks. | none |
| `new:spec-list` | Print-trade vocabulary as labelled rows (sizes, paper/GSM, finishes, sides, extras); rows render only for owner-confirmed values. | none |
| `new:related-services` | 2 sibling service links along the SEO cross-sell paths, each with a descriptive anchor and a one-line reason. | none |
| `new:also-covered-index` | Compact list of the old-site service titles, each linked to the page (and anchor) that now covers it. | none |
| `new:contact-channels` | The 4 channel cards from `components/contact/ContactChannels.tsx`: WhatsApp (primary), Call, Email, Directions; each shows the value (number, email, address) as text as well as the link. | none |
| `new:cta-band` | One sentence + WhatsApp primary + Call secondary, placed before the footer on pages without a `visit-studio` block. | none |
| `new:empty-state-samples` | When `/work` has no approved items: a statement that samples are shown in person or on request, WhatsApp "Send me samples of <service>" + Directions. | none |
| `new:compare-table` | A 2–3 column comparison as a real `<table>` (e.g. NFC vs digital vs printed card; offset vs digital print); horizontal scroll inside its own container on mobile, never the page. | none |
| `new:prose-doc` | Long-form text layout with a readable measure, an H1, dated "last updated", and in-page H2 anchors. | none |
| `new:work-filter` | A row of service tag buttons ("All" + services that have items) that hide non-matching work cards client-side; every item stays in the HTML; `?service=<slug>` preselects a tag (used by service-page "See all" links); canonical stays `/work`; without JS all items show. | none |
| `new:team-rows` | Name + role rows with an optional real photo; no stock imagery; rendered only when the owner approves showing people. | none |
| `new:post-list` | Blog post rows: title, one-line summary, author, date, the one service it relates to. | none |

## C. Routes

## /
1. **Header** — `nav-minimal-overlay` + `new:services-disclosure-menu`. Content: logo, Services, Work, Contact, WhatsApp pill (general prefill), tel at ≥1024px. Mobile: logo + WhatsApp icon + menu button; overlay per IA.
2. **Hero** — `hero-proof-first`. Content: H1 stating the outcome and carrying the AEO line "Print, digital and design under one roof in Vaishali Nagar, Jaipur" (final copy in S4); a subline ≤60ch naming the physical + digital range (visiting cards, NFC cards, social media, ads, websites); proof chips (fallback order if proof is missing: 1. Justdial rating chip only with the owner's OK and a link; 2. "Walk-in studio at Nursery Circle"; 3. "Print · Digital · Design"; the logo row is **not** in the hero, it is section 7); CTAs: WhatsApp (primary), "See our work" (secondary → /work); a real work visual (a stack of printed cards/NFC card photo from the owner's originals) sitting at the fold edge. Fallback visual: a typographic composition of the three words, no stock imagery. Mobile: H1 → subline → chips (wrap to 2 lines max) → WhatsApp full-width → secondary text link; the visual goes below the fold; the H1 is the LCP; no entrance animation.
3. **Promises** — `new:promise-strip`. Content: 3 owner-confirmed claims. Default set if nothing else is confirmed (all verifiable today): "Design and print in one place", "Walk in at Nursery Circle, Vaishali Nagar", "Quotes on WhatsApp". Swap in turnaround/reprint promises only once the owner confirms (Q8). Mobile: 3 stacked compact rows, not cards.
4. **Services** — `services-numbered-list` (grouped, poch mechanism). Content: eyebrow; one-sentence promise; 3 groups (Print 01–03, Digital 04–05, Design & build 06–07), each with a one-line stance; each service has a number, name (descriptive anchor to its page), one outcome sentence and 3 deliverables; ends with the fallback prompt "Not sure which service? Tell us what you're making" → WhatsApp. Mobile: groups stack; each row is a full-width link; the expand-in-place behaviour is desktop-only; on mobile the row goes straight to the page.
5. **One roof** — `new:one-roof-chain`. Content: heading (the differentiator); 4 steps, each with a label, one line and a link to /services/logo-branding, /services/visiting-card-printing (and offset), /services/social-media-marketing (and ads), /services/website-development. Mobile: a vertical numbered list.
6. **Selected work** — `new:work-caption-grid` (3 items). Content: the 3 strongest approved items → /work/[slug]; a "See all work" link → /work. Fallback: if fewer than 3 are approved, show the approved ones; if 0, the section is replaced by one line "See samples at the studio or ask on WhatsApp" with both links. Mobile: a single column, first image lazy.
7. **Clients** — `new:logo-strip-permissioned`. Content: approved logos (of the 8 identified: Govt of Rajasthan, LIC, Tata Hitachi, Eicher, Raymond, Healthians, Ensol, Shubhashish Geeta) with alt text = company name; eyebrow "Trusted by" wording decided in S4. Fallback: hidden if fewer than 4 are approved. Mobile: a 2-column static grid (no marquee).
8. **Reviews** — `new:review-quotes`. Content: up to 3 approved reviews (Amit Sharma, Mukul, Chhaya Yadav) with source links; no stock avatars (initials or none). Fallback: hidden; if only the Justdial rating is approved, a single line "Rated on Justdial" with a link. Mobile: stacked; no carousel.
9. **How it works** — `new:process-3-steps`. Content: 3 steps (see §B). Mobile: vertical.
10. **Visit** — `new:visit-studio`. Content: NAP exact string, landmark, hours (hidden until confirmed), Directions, WhatsApp "I'd like to visit", link to /contact. Mobile: address as text, 2 full-width buttons. This block counts as "page contact block" for hiding the dock.
11. **FAQ** — `faq-answer-first`. Content: home FAQ 1–6 from SEO_STRATEGY (Q5 hours and Q6 delivery appear only once answered; otherwise they are omitted, not shown as TODO). Mobile: accordion, all answers present in the HTML.
12. **Footer** — `footer-big-cta`; **Dock** — `new:wa-dock`.
Motion: `motion-scroll-reveal-restrained` on sections 4–11 only.

## /services
1. **Header** — `nav-minimal-overlay` + `new:services-disclosure-menu`.
2. **Breadcrumb** — `new:breadcrumb` (Home › Services).
3. **Intro** — `hero-oversized-type-split` (no stagger: text visible at first paint). Content: H1 "Printing, digital marketing and design services in Jaipur" (final copy in S4); 40–60 word answer-first paragraph naming the 7 services and Vaishali Nagar; WhatsApp CTA; the offset asset = a real multi-product photo (cards + letterhead + phone showing a post), fallback typographic. Mobile: asset dropped below the CTA or omitted.
4. **All services** — `services-numbered-list` (grouped). Content: same data as home §4, but each service gets 3 deliverables + a "for whom" line; the fallback prompt → WhatsApp. Mobile: full-width rows.
5. **One roof** — `new:one-roof-chain`. Content: same data as home, shorter lead. Mobile: vertical list.
6. **Also covered** — `new:also-covered-index`. Content: the 12 old titles → their parent page/anchor (IA §Service grouping). Mobile: a 1-column list.
7. **How it works** — `new:process-3-steps`.
8. **Clients** — `new:logo-strip-permissioned` (same data and fallback as home).
9. **CTA** — `new:cta-band` (general prefill).
10. **Footer** — `footer-big-cta`; **Dock** — `new:wa-dock`.
No FAQ block here (it would duplicate the home and service FAQPage content).

## /services/visiting-card-printing
1. **Header** — `nav-minimal-overlay` + `new:services-disclosure-menu`.
2. **Breadcrumb** — `new:breadcrumb` (Home › Services › Visiting card printing).
3. **Hero** — `hero-oversized-type-split` (no stagger). Content: H1 "Visiting card printing in Vaishali Nagar, Jaipur"; 40–60 word answer (design + print, walk-in at Nursery Circle, quote on WhatsApp); WhatsApp (service prefill) + Call; offset asset = a real visiting-card photo from the owner's originals, fallback typographic. Mobile: H1 → answer → WhatsApp full-width → Call text link → image below.
4. **Quote checklist** — `new:quote-checklist`. Content: quantity, size, paper/GSM, finish, one- or two-sided, design needed or ready, needed by. Mobile: a compact list + full-width WhatsApp.
5. **Papers & finishes** — `new:spec-list`. Content: only confirmed options (matte, gloss, textured, spot UV… per owner), sizes; "visiting card" wording throughout. Fallback: if nothing is confirmed, show only "Bring a card you like, or see paper samples at the studio" + Directions. Mobile: stacked label/value rows.
6. **Design or bring your own** — `new:spec-list` (2-row variant: "we design it" → link to /services/logo-branding; "you send a file" → accepted formats). Content: owner confirms file formats. Mobile: 2 stacked rows.
7. **Samples** — `new:work-caption-grid` (2–3 items tagged visiting-card-printing) + "See all" → /work?service=visiting-card-printing. Fallback: one line "See samples at the studio or ask on WhatsApp". Mobile: single column.
8. **How it works** — `new:process-3-steps` (proof step: "see a proof before the full run", only if Q6 of the card FAQ is confirmed; otherwise generic).
9. **Reviews** — `new:review-quotes` filtered to reviews that mention visiting cards (Amit Sharma, Mukul). Fallback: hidden.
10. **FAQ** — `faq-answer-first`. Content: visiting-card Q1–6 (Q2 cost and Q3 speed are "ask" items with a WhatsApp link); one question phrased in Hinglish-leaning English per SEO_STRATEGY. Mobile: accordion.
11. **Related** — `new:related-services` → /services/nfc-business-cards, /services/logo-branding.
12. **Visit** — `new:visit-studio`.
13. **Footer** — `footer-big-cta`; **Dock** — `new:wa-dock`.
Motion: reveals on sections 5–12.

## /services/offset-printing
1. **Header** — `nav-minimal-overlay` + `new:services-disclosure-menu`.
2. **Breadcrumb** — `new:breadcrumb` (Home › Services › Offset printing).
3. **Hero** — `hero-oversized-type-split` (no stagger). Content: H1 "Offset printing in Jaipur" (+ Vaishali Nagar in the answer); 40–60 word answer listing what is printed; WhatsApp (service prefill) + Call; asset = real letterhead/brochure photo, fallback typographic. Mobile: as visiting cards §3.
4. **What we print** — `services-numbered-list` (as a numbered deliverables list without expansion). Content: letterheads, brochures, flyers, calendars, bill books, envelopes (owner confirms; wedding cards and screen printing appear only if the owner confirms they are real services). Each item has a one-line use case. Mobile: full-width rows.
5. **Quote checklist** — `new:quote-checklist`. Content: item, quantity, size, paper, colours, finishing, needed by.
6. **Offset or digital?** — `new:compare-table`. Content: a factual explainer (when each suits a quantity), with no invented numbers. Mobile: the table scrolls inside its container.
7. **Brand consistency** — `new:one-roof-chain` (short variant, 3 steps: logo → stationery → brochure) linking to /services/logo-branding. Mobile: vertical.
8. **Samples** — `new:work-caption-grid` (tagged offset-printing). Fallback: the one-line studio/WhatsApp message.
9. **How it works** — `new:process-3-steps`.
10. **FAQ** — `faq-answer-first`. Content: offset Q1–4 (Q3 minimum order is an "ask" item).
11. **Related** — `new:related-services` → /services/logo-branding, /services/visiting-card-printing.
12. **Visit** — `new:visit-studio`.
13. **Footer** — `footer-big-cta`; **Dock** — `new:wa-dock`.

## /services/nfc-business-cards
1. **Header** — `nav-minimal-overlay` + `new:services-disclosure-menu`.
2. **Breadcrumb** — `new:breadcrumb` (Home › Services › NFC business cards).
3. **Hero** — `hero-oversized-type-split` (no stagger). Content: H1 "NFC business cards in Jaipur"; 40–60 word answer (tap to share, QR fallback, printed and set up locally); WhatsApp (service prefill) + Call; asset = a real NFC card photo, fallback typographic. Mobile: as §3 above. No interactive "tap" demo (it would be a medium-cost object in the first viewport).
4. **How it works** — `new:process-3-steps` (variant: tap → the phone opens the profile → save the contact; the QR fallback noted). Content: 3 short steps, factual. Mobile: vertical.
5. **NFC vs digital vs printed** — `new:compare-table`. Content: answers FAQ Q5; columns only for products the owner sells. Mobile: contained horizontal scroll.
6. **What you get** — `new:spec-list`. Content: card material options, profile contents, whether details can be updated (only if confirmed). Fallback: rows hidden until confirmed.
7. **Quote checklist** — `new:quote-checklist`. Content: quantity, material, design needed, profile details ready, needed by.
8. **Samples** — `new:work-caption-grid` (tagged nfc-business-cards). Fallback: the one-line studio/WhatsApp message ("try one at the studio").
9. **FAQ** — `faq-answer-first`. Content: NFC Q1–5 (Q4 cost is an "ask" item).
10. **Related** — `new:related-services` → /services/visiting-card-printing, /services/logo-branding.
11. **Visit** — `new:visit-studio`.
12. **Footer** — `footer-big-cta`; **Dock** — `new:wa-dock`.

## /services/social-media-marketing
1. **Header** — `nav-minimal-overlay` + `new:services-disclosure-menu`.
2. **Breadcrumb** — `new:breadcrumb` (Home › Services › Social media marketing).
3. **Hero** — `hero-oversized-type-split` (no stagger). Content: H1 "Social media marketing for Jaipur businesses" (Vaishali Nagar in the answer); 40–60 word answer (management for local shops, plus matching print); WhatsApp (service prefill) + Call; asset = real post designs from the owner (the hero must not claim "social-media-only specialists"), fallback typographic. Mobile: as above.
4. **What's included** — `services-numbered-list` (numbered scope list, no expansion). Content: owner-defined scope (planning, post design, posting, reporting…), platforms (Instagram, Facebook, LinkedIn). Mobile: rows.
5. **Post + print** — `new:one-roof-chain` (short variant: campaign post → matching flyer/standee → ads) — the answer to FAQ Q4 made visual. Links to /services/offset-printing and /services/google-facebook-ads.
6. **Samples** — `new:work-caption-grid` (tagged social-media-marketing: post grids from the owner). Fallback: "Ask on WhatsApp for recent posts we've made".
7. **How it works** — `new:process-3-steps` (variant: brief on WhatsApp → monthly plan approved → posts go live).
8. **FAQ** — `faq-answer-first`. Content: social Q1–4 (Q3 monthly cost is an "ask" item).
9. **Related** — `new:related-services` → /services/google-facebook-ads, /services/website-development.
10. **CTA** — `new:cta-band`.
11. **Footer** — `footer-big-cta`; **Dock** — `new:wa-dock`.

## /services/google-facebook-ads
1. **Header** — `nav-minimal-overlay` + `new:services-disclosure-menu`.
2. **Breadcrumb** — `new:breadcrumb` (Home › Services › Google & Facebook ads).
3. **Hero** — `hero-oversized-type-split` (no stagger). Content: H1 "Google Ads and Facebook ads in Jaipur"; 40–60 word answer; WhatsApp (service prefill) + Call; asset: none required (a typographic composition). Mobile: text-only hero, which keeps LCP text-based.
4. **Google or Meta?** — `new:compare-table`. Content: an explainer for a local shop (search intent vs discovery); answers FAQ Q1. Mobile: contained scroll.
5. **What we handle** — `services-numbered-list` (numbered scope, no expansion). Content: set-up, creatives, targeting, reporting (owner confirms); a note that ad spend and management fee are separate.
6. **Bulk WhatsApp / SMS** — `new:spec-list` (section). Content: only if the owner confirms DLT-registered templates and opt-in (FAQ Q3); otherwise the section is omitted entirely.
7. **How it works** — `new:process-3-steps` (brief → campaign set-up approved → live + reports).
8. **FAQ** — `faq-answer-first`. Content: ads Q1–3 (Q2 budget is an "ask" item, no figures).
9. **Related** — `new:related-services` → /services/social-media-marketing, /services/website-development.
10. **CTA** — `new:cta-band`.
11. **Footer** — `footer-big-cta`; **Dock** — `new:wa-dock`.
No samples section (ad results need owner data and permission); add one later via the same `new:work-caption-grid` if the owner supplies it.

## /services/website-development
1. **Header** — `nav-minimal-overlay` + `new:services-disclosure-menu`.
2. **Breadcrumb** — `new:breadcrumb` (Home › Services › Website development).
3. **Hero** — `hero-oversized-type-split` (no stagger). Content: H1 "Website development in Jaipur" (Vaishali Nagar in the answer); 40–60 word answer (business sites and e-commerce, mobile-ready, findable on Google); WhatsApp (service prefill) + Call; asset = real site screenshots from the owner, fallback typographic. Mobile: as above.
4. **What we build** — `services-numbered-list` (numbered, no expansion). Content: business websites, e-commerce stores, landing pages (owner confirms); each with a one-line fit ("for a shop that wants orders on WhatsApp").
5. **Mobile apps** — `new:spec-list` (section). Content: whether and what kind (FAQ Q3); omitted if the owner drops the service.
6. **Works on mobile and Google** — `new:spec-list`. Content: factual checklist (mobile-friendly, fast, basic on-page SEO) — answers FAQ Q4; only claims the owner delivers.
7. **Samples** — `new:work-caption-grid` (tagged website-development). Fallback: the one-line WhatsApp message.
8. **How it works** — `new:process-3-steps` (brief → design approved → site live).
9. **FAQ** — `faq-answer-first`. Content: web Q1–4 (Q2 cost is an "ask" item).
10. **Related** — `new:related-services` → /services/social-media-marketing, /services/logo-branding.
11. **CTA** — `new:cta-band`.
12. **Footer** — `footer-big-cta`; **Dock** — `new:wa-dock`.

## /services/logo-branding
1. **Header** — `nav-minimal-overlay` + `new:services-disclosure-menu`.
2. **Breadcrumb** — `new:breadcrumb` (Home › Services › Logo & branding).
3. **Hero** — `hero-oversized-type-split` (no stagger). Content: H1 "Logo design and branding in Jaipur"; 40–60 word answer (logo → stationery → print, in one place); WhatsApp (service prefill) + Call; asset = a real logo from the Logo Design / 3D mockup PDFs (owner originals), fallback typographic. Mobile: as above.
4. **What you get** — `new:spec-list`. Content: files/formats, number of concepts, revisions — owner confirms; unconfirmed rows hidden (FAQ Q1).
5. **From logo to print** — `new:one-roof-chain` (short variant: logo → visiting cards/letterhead → signage/social) linking to /services/visiting-card-printing, /services/offset-printing. Answers FAQ Q2.
6. **Samples** — `new:work-caption-grid` (tagged logo-branding). Fallback: the one-line studio/WhatsApp message.
7. **Reviews** — `new:review-quotes` filtered to reviews that mention logos (Mukul, Chhaya Yadav). Fallback: hidden.
8. **How it works** — `new:process-3-steps` (brief → concepts and revisions → final files + print).
9. **FAQ** — `faq-answer-first`. Content: logo Q1–3 (Q3 timing is an "ask" item).
10. **Related** — `new:related-services` → /services/visiting-card-printing, /services/offset-printing.
11. **Visit** — `new:visit-studio`.
12. **Footer** — `footer-big-cta`; **Dock** — `new:wa-dock`.

## /work
1. **Header** — `nav-minimal-overlay` + `new:services-disclosure-menu`.
2. **Breadcrumb** — `new:breadcrumb` (Home › Work).
3. **Intro** — `hero-oversized-type-split` (no stagger, no asset). Content: H1 (e.g. "Print and design work from our Jaipur studio"); a 1–2 sentence lead that says these are real client pieces. Mobile: text only.
4. **Filter** — `new:work-filter`. Content: the service tags that have at least one item, plus "All". Only shown when there are 4+ items. Mobile: a single horizontally scrollable row of tags inside its own container.
5. **Grid** — `new:work-caption-grid` (all approved items). Content per item: 1+ approved images, caption "<deliverable> for <sector/client>", service tag. Mobile: single column; images lazy after the first.
   Fallback — `new:empty-state-samples` replaces sections 4–5 when 0 items are approved.
6. **Clients** — `new:logo-strip-permissioned` (same data and fallback as home).
7. **CTA** — `new:cta-band` (work prefill: "want something similar").
8. **Footer** — `footer-big-cta`; **Dock** — `new:wa-dock`.
Deviation from PAGES.md default: `work-grid-hover-reveal` is **not used**. Its full-width text rows hide the product until hover, and it is `good_for` portfolio/studio, not company-site; a print buyer needs to see the cards immediately, and touch is the majority device.

## /work/[slug]
1. **Header** — `nav-minimal-overlay` + `new:services-disclosure-menu`.
2. **Breadcrumb** — `new:breadcrumb` (Home › Work › <item>).
3. **Case study** — `case-study-sticky-meta`. Content: H1 = the caption ("Visiting cards for a Jaipur dental clinic"); meta rail: deliverable, service (link to its page: "Made with our visiting card printing"), sector, client (only with permission), year (if known), paper/finish (print items, if known). Main column: the brief (1–2 sentences), what we made, image gallery (reserved aspect ratios, lazy beyond the first), outcome (only if the owner gives one). Fallbacks: no story text → caption-only layout (meta + gallery, no Brief/Outcome headings); no approved images → the item is not generated at all and is absent from /work and the sitemap. Mobile: the rail becomes a compact meta list under the H1 (not sticky); the gallery stacks.
4. **Next step** — `new:cta-band` (work-item prefill: "something like <title>").
5. **Pager** — part of `case-study-sticky-meta` (next/previous work) + "All work" → /work. Mobile: 2 full-width links.
6. **Footer** — `footer-big-cta`; **Dock** — `new:wa-dock`.
Seed items: from the /downloads PDFs (business cards portfolio, logo design, 3D logo mockups, portfolio) once the owner supplies originals; slug rule in IA.md.

## /about
1. **Header** — `nav-minimal-overlay` + `new:services-disclosure-menu`.
2. **Breadcrumb** — `new:breadcrumb` (Home › About).
3. **Intro** — `hero-oversized-type-split` (no stagger). Content: H1 "About ABizCreator"; an answer-first paragraph: a print, digital and design studio in Vaishali Nagar, Jaipur; years in business **only once the owner confirms one founding year** (until then no year appears anywhere); asset = a real photo of the shop/studio, fallback none. Mobile: text first, photo below.
4. **Story** — `new:prose-doc` (short variant). Content: how the shop started and grew from print into digital (owner interview; S4 copy). Replaces the old "social-media-only specialists" claim.
5. **What we do** — `services-numbered-list` (compact, links only). Content: the 7 services in 3 groups.
6. **Why us** — `new:promise-strip` (variant: 3 honest reasons). Content: one roof for print and digital; a walk-in studio you can visit; real samples you can hold. Only owner-confirmed claims.
7. **Team** — `new:team-rows`. Content: only if the owner wants the team shown (Q6): name, role, optional real photo (e.g. Aditya). Fallback: omitted. Mobile: stacked rows.
8. **Clients** — `new:logo-strip-permissioned`. Fallback: hidden.
9. **Visit** — `new:visit-studio`.
10. **Footer** — `footer-big-cta`; **Dock** — `new:wa-dock`.
Motion: `motion-scroll-reveal-restrained` on sections 4–9 (the PAGES.md default for /about).

## /contact
1. **Header** — `nav-minimal-overlay` + `new:services-disclosure-menu`.
2. **Breadcrumb** — `new:breadcrumb` (Home › Contact).
3. **Intro** — `hero-oversized-type-split` (no stagger, no asset). Content: H1 "Contact ABizCreator, Vaishali Nagar, Jaipur"; one answer-first sentence: fastest reply is WhatsApp; walk in at the address below. Mobile: text only.
4. **Channels** — `new:contact-channels` (replaces `contact-inline-form`, which D14 rules out). Content: WhatsApp +91-9024282878 (contact prefill), Call (same number, `tel:`), Email abizcreator@gmail.com (`mailto:` with subject "Enquiry from abizcreator.com"), Directions (Maps link). Each value is also plain text so it can be copied. Mobile: 4 full-width stacked cards, WhatsApp first; this block counts as the "page contact block", so the dock hides while it is in view.
5. **Address & hours** — `new:visit-studio` (full variant). Content: the canonical NAP string exactly as in SEO_STRATEGY; the landmark; hours (hidden until confirmed; never "TODO"); walk-ins note (only once Q2 is confirmed). No map iframe.
6. **What to send** — `new:quote-checklist` (general variant). Content: what you need, quantity, deadline, reference images.
7. **Socials** — part of `new:contact-channels` (secondary row). Content: Facebook, Instagram, LinkedIn, Justdial (official profiles only; the duplicate FB page is left out).
8. **Browse** — `new:related-services` (variant: all 7 as a compact list → service pages).
9. **Footer** — `footer-big-cta`; **Dock** — `new:wa-dock`.
No FAQPage on /contact (location/hours questions live in the home FAQ; avoids duplicates).

## /privacy
Conditional: exists only if a PostHog key is set.
1. **Header** — `nav-minimal-overlay` + `new:services-disclosure-menu`.
2. **Breadcrumb** — `new:breadcrumb` (Home › Privacy).
3. **Policy** — `new:prose-doc`. Content: what cookieless analytics records, what WhatsApp/tel/mailto links do (the site sends nothing itself), contact for questions, last-updated date. Mobile: single column.
4. **Next** — `new:cta-band` (links: /contact, /).
5. **Footer** — `footer-big-cta`; **Dock** — `new:wa-dock`.

## /blog
Optional: only if the owner revives the blog (PRODUCT Q9). Otherwise not built and `/blog/` returns 410.
1. **Header** — `nav-minimal-overlay` + `new:services-disclosure-menu`.
2. **Breadcrumb** — `new:breadcrumb` (Home › Blog).
3. **Intro** — `hero-oversized-type-split` (no stagger, no asset). Content: H1 + one line on what the guides cover.
4. **Posts** — `new:post-list`. Content: posts from Keystatic/static content files, each with a named author. Mobile: stacked rows.
5. **CTA** — `new:cta-band`.
6. **Footer** — `footer-big-cta`; **Dock** — `new:wa-dock`.

## /blog/[slug]
Optional: same condition as /blog.
1. **Header** — `nav-minimal-overlay` + `new:services-disclosure-menu`.
2. **Breadcrumb** — `new:breadcrumb` (Home › Blog › <post>).
3. **Article** — `new:prose-doc`. Content: H1, author (Person), published/modified dates, an answer-first opening paragraph, body with H2s; exactly one money-page link in the body. Mobile: single column.
4. **Service link** — `new:related-services` (single item: the post's money page).
5. **CTA** — `new:cta-band` (blog prefill).
6. **Related posts** — `new:post-list` (2 items). Fallback: hidden if there are fewer than 2 other posts.
7. **Footer** — `footer-big-cta`; **Dock** — `new:wa-dock`.

## /404
1. **Header** — `nav-minimal-overlay` + `new:services-disclosure-menu`.
2. **Message** — `hero-oversized-type-split` (no stagger, no asset). Content: H1 "Page not found" + one line that the page may have moved in the new site. Mobile: text only.
3. **Recovery** — `services-numbered-list` (compact, links only): the 7 services; plus /work and /contact links.
4. **CTA** — `new:cta-band` (general prefill: "I was looking for…").
5. **Footer** — `footer-big-cta`; **Dock** — `new:wa-dock`.
noindex.
