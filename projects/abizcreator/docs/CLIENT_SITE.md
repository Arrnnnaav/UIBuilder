# CLIENT_SITE — abizcreator
Current site: https://abizcreator.com/ · audited 2026-09-25 by research (S2).
Method: `tvly map` (depth 2), `tvly extract` on 7 pages, `curl` for head/SEO tags and sitemap, and Playwright at 1440px and 390px with `getComputedStyle`.
Screenshots: `docs/research/client-home-1440.png`, `docs/research/client-home-390.png`.

## 1. Business facts (as the site states them)
| Field | Value | Source |
|---|---|---|
| Name | ABizCreator (wordmark "ABizCreator", tagline "Print \| Digital \| Design") | header on every page |
| Location | **Jaipur, Rajasthan, India** (confirmed). B-O, Vaishali Tower-1, Nursery Circle, Vaishali Nagar, Jaipur-21 | /contact, footer |
| Map | https://maps.app.goo.gl/iuW4YzeVBoVAAnC76 | /downloads |
| Phone / WhatsApp | +91-9024282878 (the header "Let's Talk" button goes to `wa.me/919024282878`) | header, footer, /contact |
| Email | abizcreator@gmail.com (Gmail, not a domain address) | footer, /contact |
| Hours | **Not stated anywhere** | none |
| History | About page: "printing solutions firm in Jaipur… in business since 2001… for over 15 years". The two numbers conflict: 2001 would be 25 years. | /about |
| Social | facebook.com/abizcreator · instagram.com/abizcreator · linkedin.com/company/87384536 · WhatsApp share | floating social icons plugin (UltimatelySocial) |
| Third-party listing | Justdial: "Abizcreator, Near Nursery Circle, Vaishali Nagar". Categories: offset printing (visiting cards), digital marketing, advertising | tvly search |
| GST | GST certificate PDF is public on /downloads | /downloads |
| Named person | "Aditya" is named in one testimonial as the team lead or contact | home testimonial |

## 2. Page inventory
| URL | Status | What it is |
|---|---|---|
| `/` | 200 | Home: hero, 8 service tiles, second CTA band, 3 testimonials, "Reasons to hire us", 8 client logos, footer |
| `/about/` | 200 | "Who we are", "Our mission". Text only, very thin |
| `/services/` | 200 | 12 service tiles, **titles only, no descriptions** |
| `/contact/` | 200 | Email, phone, address and a Contact Form 7 form (name, email, subject, message) |
| `/downloads/` | 200 | PDF links: Business Cards portfolio (6.2 MB), Logo Design (2.7 MB), 3D Mockup Logo (1.2 MB), GST Certificate, Portfolio (1.1 MB), and Location |
| `/project/` | 200 | "Recent Project" grid of **6 theme-demo items** (lorem/Kafka placeholder text, "demo-attachment" images). Not linked in nav |
| `/portfolio/*` (6) | 200 | Theme demo posts: "Some new ideas for branding", "Designing a mobile store application" and others. Body is placeholder text |
| `/portfolio-cat/*`, `/portfolio-tag/*`, `/?portfolio-filter=` | 200 | Demo taxonomies |
| `/blog/` | 200 | "Nothing Found". Empty |
| `/my-account/` | 200 | WooCommerce leftover; the "Shopping Basket" string appears in the footer |
| `/author/admin/` | in sitemap | exposes the `admin` username |
| `/?p=84,87,88,109` | 301 | old IDs that redirect to contact, services, about and downloads |

Nav: Home · Services · About · Downloads · Contact, plus a "Let's Talk" WhatsApp button.

## 3. Offer
### Services on Home (8)
Print Media · Ecommerce Development · Website Design · Mobile App Development · Social Media Management · Facebook Ads · Digital Marketing · Google Ads

### Services on /services (12)
Print Media · E-Commerce Development · WhatsApp/SMS (bulk messaging) · Graphic Designing · Facebook Ads · Digital Cards · Digital Marketing · Google Ads · NFC/RFID Cards · Corporate Branding (spelled "Croporate") · Website Development · Mobile App

No page has service descriptions, prices, packages, turnaround times or deliverables. Testimonials and Justdial also mention visiting cards, logo design, graphics design and web development.

**A proposed grouping for the owner to confirm, not a design decision:**
- **Print:** print media (visiting cards, offset printing), corporate branding collateral, NFC/RFID cards
- **Digital:** social media management, Facebook/Meta ads, Google ads, digital marketing, WhatsApp/SMS campaigns, digital cards
- **Design and build:** graphic design, logo design, website design and development, e-commerce, mobile apps

### Audience (inferred)
Local Jaipur SMBs, shops and professionals who need visiting cards, logos and print, plus social and ads. The client logos also show corporate and government buyers (see §4). Testimonials stress price ("very affordable"), speed ("always in the given time frame") and walk-in location ("visit this place at Vaishali Nagar").

## 4. Proof
**Client logos (8).** Every image has an empty `alt` (files `1-150x150.png` … `8-150x150.png`). Identified visually from the screenshot:
Govt of Rajasthan · Ensol · LIC (Life Insurance Corporation of India) · Tata Hitachi · Healthians · Eicher · Shubhashish Geeta · Raymond.
These are third-party trademarks. **Permission to show them is unconfirmed.**

**Testimonials (3), paraphrased. The originals are the client's content; reuse them only with owner confirmation.**
1. **Amit Sharma:** praises the web development service, staff behaviour and visiting-card quality, and recommends the Vaishali Nagar shop for printing.
2. **Mukul:** professional printing in Jaipur, excellent quality, always on time. Covers logo design, print media and visiting cards.
3. **Chhaya Yadav:** the team "and Aditya" are professional and creative, with quality work at an affordable price for logo and graphic design.
These look like Google or Justdial reviews. Source and star ratings are not shown. Avatars are stock or theme images.

**Numbers:** none shown (no project count, years badge, client count or rating).
**"Reasons to hire us" (3):** Specialists, Passionate, Strategists. The copy positions the firm as **social-media-only specialists** ("not jack of all trades… focused only on social media"), which contradicts the 12-service offer and the printing heritage.
**Portfolio:** none on-site. The real work is only in the /downloads PDFs (business cards, logos, portfolio). Those PDFs are the best source of genuine case material; ask the owner for the originals.

## 5. Tone and visual language (current)
- Copy: generic template lines ("Let us work on your next project!", "take your business to the next" with the sentence cut off), with typos ("Four your Business", "emali", "office addres", "everythings", "Croporate"). Informal and sales-y. There is no point of view.
- Visual: Phlox Pro "Averta" theme demo with stock flat-vector illustrations (megaphone and dashboard people). Primary blue `rgb(0,37,219)` is the theme-color and the footer band. Yellow pill CTAs, cyan wordmark `rgb(27,176,206)`, pastel tiles.
- Type: 9 font families load (Rubik body 18px, Quicksand headings, Raleway wordmark, plus Nunito, ABeeZee, Inter, Montserrat and Questrial).
- The footer credits "© 2026 **Averta**" (the theme vendor), not ABizCreator.
- Mobile (390px): one-column stack, **9,627px tall**. The 8 service tiles each take a full screen-width card and there is no horizontal overflow. Phone and email are plain text; there are **0 `tel:` and 0 `mailto:` links** on the page. WhatsApp is the only tap-to-contact.
- Logo asset: `logo.png` is 5,890px wide and 194 KB. Ask the owner for the vector source.

## 6. SEO snapshot
| Page | `<title>` | meta description | h1 count | JSON-LD | OG tags | canonical |
|---|---|---|---|---|---|---|
| / | ABizCreator – Print \| Digital \| Design | auto-excerpt of page text ("Welcome Let us work on…") | **0** | **none** | none | yes |
| /about/ | About – ABizCreator | auto-excerpt | 0 | none | none | yes |
| /services/ | Services – ABizCreator | auto-excerpt (list of service names) | 0 | none | none | yes |
| /contact/ | Contact – ABizCreator | auto-excerpt ("emali : …") | 0 | none | none | yes |
| /downloads/ | Downloads – ABizCreator | auto-excerpt | 0 | none | none | yes |
| /blog/ | Blog – ABizCreator | none | 0 | none | none | **missing** |
| /project/ | Project – ABizCreator | auto-excerpt of demo items | 0 | none | none | yes |
| /portfolio/* | demo titles | **Kafka lorem text** ("when Gregor Samsa woke…") | 0 | none | yes (1) | yes |

- `robots.txt`: standard WP rules (disallows `/wp-admin/`) and points to `/wp-sitemap.xml`.
- Sitemap: WP core sitemap. It indexes demo portfolio posts, demo taxonomies, `/my-account/`, `/blog/` (empty) and `/author/admin/`.
- `llms.txt`: **404**.
- `meta robots`: `max-image-preview:large` only.
- No LocalBusiness/Organization schema, no FAQ, no OG image, and no Google Maps embed.
- Performance hints: home HTML is 141 KB, with 36 external scripts, 38 stylesheets, a Google Fonts CSS call, wp-emoji, Elementor 4.1.3 and 3 console errors on load. TTFB is about 0.38s from here.
- Tracking: no gtag, GTM or Meta pixel found in the home HTML.

## 7. Redirects the new site must keep (for ux/growth)
`/about/`, `/services/`, `/contact/` and `/downloads/` rank today. Keep them or 301 them. Demo URLs (`/portfolio/*`, `/portfolio-cat/*`, `/portfolio-tag/*`, `/project/`, `/my-account/`, `/author/admin/`, `/blog/` if not rebuilt) should return 410 or 301 to a relevant page. The `?p=` IDs already redirect.

## 8. What is missing (content gaps for PRODUCT.md)
Service descriptions · pricing or "starting from" · turnaround times · real portfolio or case studies · hours · a years-in-business number the owner stands by · founder or team (Aditya?) · Google review count and rating · permission for client logos and testimonials · brand assets (vector logo, colours) · a domain email.
