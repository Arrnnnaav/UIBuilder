# REFERENCE_BREAKDOWN — abizcreator
Measured 2026-09-25 with Playwright `browser_evaluate` / `getComputedStyle` at a 1440×900 viewport (the page reports `innerWidth` 1441) and at 390×844 where noted. Every value below was read from computed styles or `document.getAnimations()`, not estimated from screenshots. Mechanisms only; no assets, fonts, copy or code are to be reused.

---
## 1. Layout: moah-studio (https://www.moah.studio/) · Framer · `ref-moah-1440.jpg`
**Section rhythm** (top-level full-width blocks, top → bottom, 1440 then 390):
| Block | Height 1440 | Padding 1440 | Padding 390 |
|---|---|---|---|
| Hero (wordmark + one-line positioning) | 910 | 65 0 0 | 65 0 0 |
| Who we are | 1693 | 0 30 | 0 20 |
| Our work | 1170 | 140 30 130 | 0 20 80 |
| Our impact (stats) | 1172 | 150 30 160 | 80 20 |
| What we do | 2467 | 160 30 | 80 20 0 |
| Why us | 1724 | 160 30 80 | 80 20 60 |
| Final CTA / footer | 1191 | 0 30 | 0 20 |
- Page height 10,328px at 1440.
- **Gutter:** 30px desktop, 20px mobile. No max-width container; content runs edge to edge minus the gutter.
- **Section spacing:** 140–160px desktop, 80px mobile. That is a mobile/desktop ratio of about 0.5.
- **Grid:** stats use a CSS grid of `682.8px 682.8px` (2 equal columns across 1366px), col-gap 0, **row-gap 80px**. Flex gaps elsewhere cluster at 10, 16, 20, 32 and 40px, all multiples of 4 or 5.
- **Pattern:** every section starts with an uppercase eyebrow label, then a large statement, then content. The hero wordmark is 220px, lh 165px (0.75), tracking −4.4px (−0.02em). It drops to 105px at 390.
- **Type scale observed:** 14 / 18 / 22 / 28 / 36 / 50 px (ratios 1.29, 1.22, 1.27, 1.29, 1.39, so roughly 1.25–1.3). Weights 400/500. Headings use negative tracking: 50px at −1px, 36px at −0.72px, 28px at −0.28px, so about −0.02em on the large sizes and −0.01em on mid sizes.
- **Radii:** 40px (pills) and 2px. Nothing in between.
- **Relevance:** gives a service-heavy SMB site a calm, repeatable section frame (eyebrow → statement → body) and generous spacing numbers.

## 2. Type / visual language: noth (https://www.noth.in/) · `ref-noth-1440.jpg`
- **Root font-size = 1vw** (14.4072px at a 1441px viewport). All type is rem, so it scales linearly with the viewport.
- **Scale (rem → px at 1441):** 0.75 (10.8) · 0.875 (12.6) · 1.125 (16.2) · 1.5625 (22.5) · 2.5 (36.0) · 5 (72.0). Step ratios 1.17, 1.29, 1.39, 1.6, 2.0, which accelerate toward display sizes.
- **Display:** 72px, weight 500, **lh 1.0**, tracking −0.72px (−0.01em). Big statements are split into 2 short lines.
- **Micro-labels:** 10.8px **uppercase**, tracking +0.324px (+0.03em), in a **monospace** (a mono/grotesk pairing), weights 500/700. Parenthesised section labels such as "( The Studio )".
- **Body:** 16.2px, lh 1.2. Small text 12.6px, lh 1.2.
- **Colour:** text is white (56 nodes), black (10) or grey rgb(142,142,142) (7). Backgrounds are black (13) or white (11). There are no accent colours; contrast carries the page.
- **Transitions:** opacity 0.3s ease (20 nodes), border-color 0.4s ease.
- **Caveat:** 1vw root text becomes tiny on mobile and breaks user zoom expectations. A `clamp()` floor would be needed; that is an implementation note, not a decision.
- **Relevance:** "Print | Digital | Design" is itself a typographic idea. The mono label plus grotesk display pairing suits print-trade vocabulary (GSM, finishes, sizes).

## 3. Motion: airborne-studio (https://airborne.studio) · Tailwind + Lenis · `ref-airborne-1440.jpg`
Found via `document.getAnimations()` and computed transitions across the whole page (13,042px tall):
| Mechanism | Property | Duration | Easing | Notes |
|---|---|---|---|---|
| Scroll reveal (case cards) | opacity, transform | **600ms** | **cubic-bezier(0.22, 1, 0.36, 1)** (easeOutQuint) | keyframe `cs-body-rise-in`: opacity 0→1, **translateY 12px→0** |
| Hover colour / bg / border | color, background-color, border-color | **150ms** | cubic-bezier(0.4, 0, 0.2, 1) | 8 nodes |
| Hover lift / arrows | transform | 300ms | cubic-bezier(0.4,0,0.2,1) or (0,0,0.2,1) | |
| Underline grow | width | 300ms | cubic-bezier(0.4,0,0.2,1) | `.link-underline`, disabled under reduced motion |
| Accordion (pricing programmes) | **grid-template-rows** | **300ms** | cubic-bezier(0,0,0.2,1) | `0fr→1fr` technique; no JS height measuring |
| Menu / panel | opacity, transform, max-height, margin-top | 260 / 220ms | (0.22,1,0.36,1) | |
| Logo marquee | `marquee` keyframes | **40s** | linear, infinite | track 5,754px wide, 2 duplicated children |
| Testimonial autoplay | `testimonial-progress` | **3.5s** | linear | a 45×8px pill bar, `scaleX(0→1)` from `origin-left` |
| Floating button entrance | `fab-pop` | 500ms | (0.22,1,0.36,1) | 120×120 |
| Micro spring on icons | transform | ~167ms | cubic-bezier(0.34, 1.56, 0.64, 1) (overshoot) | SVG only, 8 nodes |
- Smooth scroll: **Lenis** is present. No GSAP or ScrollTrigger on `window`.
- Reduced motion: `motion-reduce:animate-none` and `motion-reduce:transition-none` utilities. The mobile pinned-scroll track is only enabled under `prefers-reduced-motion: no-preference`.
- **Relevance:** a complete, fast motion vocabulary (150 / 300 / 600ms, one ease-out curve) that matches the user's taste of "subtle, fast, no bouncing". The only overshoot is on tiny SVG icons. The marquee maps to a client-logo strip, the progress bar to 3 testimonials, and the grid-rows accordion to FAQ blocks.

## 4. Components: poch-studio (https://poch.studio) · `ref-poch-1440.jpg`
- **Service menu component:** a "services" section 1,235px tall. Content order:
  eyebrow → one-sentence promise → **Group A title + one-line stance + "We do:" + 6 numbered items (➊…➏)** → **Group B, same shape** → **fallback prompt** (two numbered doubts, then "call us") → pill CTA to book a call.
  This fits ABizCreator's Print / Digital / Design split directly: 3 groups × 4–6 items, plus a "not sure? WhatsApp us" fallback.
- **CTA pill:** `border-radius: 100px`, padding **10px 30px**, font-size 12px. Two variants: accent fill and white fill. `transition: all`.
- **Type steps:** 12 / 17 / 25 / 50px (ratios 1.42, 1.47, 2.0), line-height 1.1 on 17 and 25 and 1.0 on 50. Weights 400 / 420 / 650 (variable font).
- **Colour logic:** white (54) and black (38) text, with 50%-alpha variants of both used for secondary text instead of greys. One accent used for CTA and highlight only.
- **Section rhythm:** hero 900; intro block 100px padding; projects 1,240; services 1,235; footer 1,962. Page height 7,221.
- **Transitions:** transform 160ms ease; opacity and transform 160ms ease.

## 5. Conversion / UX: tagsen (https://www.tagsen.in/) · NEW brain resource · `ref-tagsen-1440.jpg`
- **WhatsApp FAB:** `<a>` `position: fixed`, **56×56px, bottom 20px, right 20px**, at both 1440 and 390. The href is `wa.me/<number>?text=` with a **prefilled message that includes the current page's title** ("Hi, I need help with this: <page title>"). On mobile a second 30×30 fixed control (scroll-to-top) sits above it.
- **Sticky nav:** `position: sticky; top: 0`, 55px tall at 1440 and 79px at 390, with product categories.
- **Promise strip (3 tiles):** quantity threshold for bulk rate · delivery window in days · free reprint if the defect is theirs. Each is a short title plus a one-line qualifier. This is risk reversal placed right under the hero.
- **"Order in 3 steps"** strip: select → customise → delivered.
- **Secondary CTAs:** "Request a Quote" pill (radius 80px, 43px tall, 15px label), plus a text-link "Track Order".
- **Taxonomy as proof of expertise:** product names encode paper and finish (450 GSM, velvet soft-touch, spot UV, raised foil, kraft, NFC/QR). For a print shop, that vocabulary reads as expertise.
- **Relevance:** ABizCreator's site is frontend-only, with contact by tel, WhatsApp and mailto. The context-aware WhatsApp link is the highest-leverage conversion mechanism available without a backend.

---
### Cross-reference summary (facts, for design-director)
| Measure | moah | noth | poch | airborne |
|---|---|---|---|---|
| Base body | 18px | 16.2px (1.125rem@1vw) | 17px | 16–20px |
| Display max | 220px | 72px | 50px | 160px |
| Scale ratio | ~1.25–1.3 | accelerating 1.17→2.0 | ~1.45 | mixed |
| Gutter desktop / mobile | 30 / 20 | n/a | n/a | n/a |
| Section padding desktop / mobile | 140–160 / 80 | n/a | 100 | n/a |
| Main easing | n/a | ease | ease | cubic-bezier(0.22,1,0.36,1) |
| Durations | n/a | 300–400ms | 160ms | 150 / 300 / 600ms |
