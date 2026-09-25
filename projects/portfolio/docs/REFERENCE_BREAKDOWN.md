# REFERENCE_BREAKDOWN — portfolio

Research agent, 2026-09-25.

**How it was measured:**
- Playwright (Chromium) at 1440×900, with a check at 390×844.
- A `browser_evaluate` sweep over `body *` read `getComputedStyle`: font family, size, line-height, weight and tracking, colour, background, grid and flex geometry, transitions and animations. It also read the `:hover` rules in same-origin stylesheets.
- Values are rounded to about 0.1px.

Screenshots are in `docs/research/`. Every reference is **inspiration_only**. Take the mechanism; never the assets, fonts, copy or code.

---

## 1. Layout — `airborne-studio` (https://www.airborne.studio)
Screenshots:
- `research/airborne-1440-hero.png`
- `research/airborne-1440-case-card.png`
- `research/airborne-390.png`

| Property | 1440 | 390 |
|---|---|---|
| Frame | `mx-auto`, `max-width:1760px`, 80px side padding, content 1266px | 24px side padding |
| Grid | 12 columns of 87.13px, 20px column gap; row gaps of 16/32/48px by context | 12 columns, 20px gap (kept) |
| Case card | `<article>` flex, 20px gap; text column 389px (4 columns), media 832px (8 columns); alternates with `row-reverse` | stacks |
| Case text stack | pill tag (11px/600 uppercase, rounded) → H3 56px/61.6/600 → lede 20px/28/500 → outcome row 24px/33.6/500, 24px vertical padding, 0.72px hairline top and bottom | H3 28px/30.8 |
| Vertical rhythm | 96px gap between section blocks; 192px gap between case studies | — |
| Type scale in use | 9 · 11 · 13 · 14 · 16 · 18 · 20 · 24 · 28 · 32 · 40 · 56 · 160 (display, 128 line-height, −3.2px = −2%, uppercase) | display 70.3px/56.25 (about 18vw) |
| Palette (counts) | ink `rgb(25,25,25)` + cream `rgb(251,244,230)` alternate by section; muted `rgb(184,176,161)`; one accent `rgb(64,76,214)` | same |
| Persistent CTA | fixed circular FAB, bottom-right, 120px, entering with `fab-pop` 0.5s `cubic-bezier(0.22,1,0.36,1)` | present |

**Mechanism to reuse:**
- Each project is one 4/8 row: meta and a single outcome line on the left, media on the right, alternating sides.
- Hairlines above and below the outcome make it read as a "result row".

**Watch-outs:**
- Case lists at a 192px gap run long: document height is 13,748px.
- The FAB overlaps content at 390px.

## 2. Type / visual language — `noth` (https://www.noth.in)
Screenshots: `research/noth-1440.png`, `research/noth-390.png`

| Property | Value |
|---|---|
| Root sizing | `html{font-size:calc(0rem + 1vw)}` at ≥992px, so 14.407px at 1440. `html{font-size:1rem}` at ≤991px. |
| Faces | a grotesk (66 text nodes) and a mono for labels (7 nodes). Two families only. |
| Scale (rem → px at 1440) | 0.75→10.8 · 0.875→12.6 · 1.125→16.2 · 1.5625→22.5 · 2.5→36 · 5→72 |
| Step ratios | 1.17 · 1.29 · 1.39 · 1.6 · 2.0: tight at the bottom, big jumps at the top |
| Line-height | display 1.0 (72/72); 36px at 1.1; body 16.2/19.45 (1.2); labels 1.0 |
| Tracking | display −1% (−0.72px at 72px); mono labels uppercase at +3% (0.324px at 10.8px) |
| Weights | 400 and 500 only; 700 on one menu label |
| Section labels | parenthetical "( The Studio )" at 22.5px/500 |
| Grid | 12 columns, gap 14.4px (1vw), side padding 18px (1.25vw); two-up splits at 586/782 (42/58) and 602/803 |
| Palette | black and white only, with grey `rgb(142,142,142)` for secondary text |
| Transitions | `opacity .3s ease` (20 elements); `.btn:hover{border-color:#fff}` with `border-color .4s ease` |
| 390px | display 40px/40; body 18/21.6; mono labels 12px; grid 6 columns with a 52px gap |

**Mechanism to reuse:**
- A viewport-locked rem makes the desktop composition scale proportionally.
- A mono appears only for metadata labels.
- Parenthetical labels mark sections.

**Watch-out:** 1vw type needs a floor. Without one, text gets too small below 992px, which is why noth resets to 16px there. It also needs a check against WCAG 1.4.4 (text resize).

## 3. Motion — `elu-dev` (https://elu.dev)
Screenshots:
- `research/elu-dev-1440-hero.png`
- `research/elu-dev-1440-stats.png`
- `research/elu-dev-390.png`

| Property | Value |
|---|---|
| House easing | `cubic-bezier(0.6, 0, 0.15, 1)`, a strong ease-in-out that is fast in the middle |
| Durations (count) | opacity+translate 300ms (72) · opacity 300ms (36) · opacity+transform 400ms (8) · width 700ms (6) · 650ms layout morph on nav (width, height, padding, radius) |
| Secondary curves | colour and background 250ms `cubic-bezier(0.25,0.1,0.25,1)`; opacity 90ms linear (57, used for text/cursor flicker); 450ms `cubic-bezier(0.4,0,0.3,1)` |
| Entry animations | `rise-in` 600–650ms · `fade-in` 500ms · `stage-in` 560ms · caret `blink` 0.8s `steps(1)` · background `gradient-drift` 13s |
| Odometer numeral | `section[aria-label="… in numbers"]`, then a hairline `<hr>`, then a 3-column grid: a mono label in column 1, and the numeral spanning columns 2–3 |
| Odometer mechanics | Real value in `.sr-only`; visual copy `aria-hidden`. Static digits followed by `.odometer-mask` (`overflow:hidden`, 1.25em × 1.3056em, top −0.15em). Inside are 0–9 digit strips positioned by `style="--position:7.769"` via `translate-y-[calc(0.15em - var(--position)*…)]`. The position is fractional, so the roll is scrubbed continuously by JS. |
| Stat row | `<dl>` 3 × 425.9px columns, 24px gap. `<dt>` mono 12px/15.6 uppercase at +2% (0.24px). `<dd>` grotesk 36px/36 at −1.2px. No borders, no cards. |
| Type pairing | mono (Commit Mono) for labels, buttons and metadata (90 nodes) plus a grotesk for content (67 nodes). Display 48px/48 at −2.5%; hero numeral 180px/180. |
| Reduced motion | 7 `prefers-reduced-motion` rules; `scroll-behavior:smooth` only under `no-preference`; CTA transition set to `none` under `reduce` |
| 390px | numeral 100px; stat `<dd>` 32px; mono labels 10px/13; grid collapses to 1 column (gaps 18–40px); section padding 40/16px |

**Mechanism to reuse:**
- Put a large animated number beside a small mono label.
- Keep an accessible real value (`sr-only`) behind an `aria-hidden` visual.
- Use one easing curve for the whole site.
- A fractional CSS variable drives the digit strips, so the roll can be tied to scroll progress or a timer and frozen under reduced motion.

**Watch-out:** a 180px numeral is only honest when the number is real and sourced. For this portfolio that means values such as 5.356s→0.973s, 103,049 records, 361 tests and 27/30. See CONTENT_SOURCE.md.

## 4. Components — `planetscale-benchmarks` (NEW) (https://planetscale.com/benchmarks/aurora)
Screenshots:
- `research/planetscale-bench-1440.png`
- `research/planetscale-bench-chart-1440.png`
- `research/planetscale-bench-390.png`

| Property | Value |
|---|---|
| Page order | H1 → intro → **Benchmark configuration** (table plus 2 bold-lead bullets) → **TPCC** (data, execution, QPS chart, takeaway, p99 chart, takeaway) → **OLTP** → **Query-path latency** → **Cost** |
| Frame | `main` 1280px, padding 0 96px; content 1088px |
| Type | the whole page is `ui-monospace`, 16px/24 for everything including the H1. Weights: 400 body (78), 500 (14), 600 (20), 700 (16). H2 is 16px/700, underlined, with a 24px bottom margin. |
| Colour | text `rgb(65,65,65)`, strong `#000`, links `rgb(11,110,197)`; series blue and orange; banner `rgb(251,202,0)`; accent button border `rgb(243,88,21)` at 1.44px, 0 radius |
| Config table | 3 rows × 6 columns, left-aligned, cell padding 24px 1px, hairline row rules, bold header, no zebra striping, no background |
| Chart block | `iframe` 1088×435 per chart; 5 charts per page |
| Chart layout | left rail about 20%: stacked sparklines, one per series × condition ("PlanetScale 32conns", "… 64conns"). The selected series is outlined in its own colour and toggled by click. The main plot is about 80%. |
| Chart annotation | the title carries the conditions: "QPS for PlanetScale vs Aurora (TPCC, 500GB)". The y-axis title has units. The x-axis reads "time in seconds". Area fill fades to transparent. |
| Takeaway pattern | the sentence directly under each chart states the instruction plus the result: "Click the graphs in the sidebar to toggle… averaged ~18,000 QPS. Aurora averaged ~12,000 QPS." |
| Motion | almost none: `all .15s cubic-bezier(0.4,0,0.2,1)` on buttons only |
| 390px | padding 0 24px; the table (567px) scrolls inside `overflow-x:auto`; the chart becomes a 328×328 square |

**Mechanism to reuse:**
- Show the method before the number. The order is config → data → execution → chart → one-sentence takeaway → reproduce link.
- Chart titles carry the test conditions.
- A series toggle uses thumbnails instead of a legend.

This maps directly onto `benchmark_report.md` (Edge Node) and the LedgerBridge scale benchmark (n=5).

## 5. Conversion / UX — `meinhard-taxer` (https://meinhardtaxer.com)
Screenshots: `research/meinhard-taxer-1440-header.png`, `research/meinhard-taxer-390-top.png`. The footer marquee could not be captured: it sits in a `.contact.is-covered` reveal under Lenis, so it is measured only.

| Property | Value |
|---|---|
| Header | 3 small columns at the top right ("work", "prints", "contact"). Group labels 10–13px; the email is shown as raw text in the contact column. |
| Contact density | 7 `mailto:` links on the page (header, body, closing marquee, footer) |
| Closing CTA | `a.contact__marquee` → `mailto:`, `overflow:hidden`, height 345.8px. Text 345.77px (24vw) at −17.29px tracking (−5%), 4 repeated spans in a ticker. |
| Secondary path | `.commission-cta__link`, "tell me what it's about" (29px at 390px), links to `/commission/`; hover `opacity:.55` under `@media (hover:hover)` |
| Grid | 12 × 73.4px columns, 25.9px (1.8vw) gap, 129.7px (9vw) side padding |
| Scale | 9 · 10.1 · 12.97 · 16 · 23.8 · 32 · 47.5 · 54.7 · 345.8; body 16/24; dark `rgb(9,9,9)` on `rgb(217,217,217)` |
| Easing | `cubic-bezier(0.19,1,0.22,1)` (expo-out): hint 1.8s, caption opacity 0.3s; hover affordances gated by `(hover:hover)` |
| Page length | 20,380px at 1440; 16,928px at 390 |

**Mechanism to reuse:**
- Show the contact address as plain text in the header.
- End the page with one oversized, single-purpose contact target.
- Offer a second, lower-commitment "tell me what it's about" path for people who prefer a form.

**Watch-outs:**
- A marquee needs a paused state under `prefers-reduced-motion`.
- The link's accessible name must not repeat four times: use `aria-hidden` on the duplicate spans.
- The PRODUCT.md email is still unconfirmed (open question 1).

---

## Alternates measured (not selected; for design-director options)

| Ref | Key numbers | Why not in the five |
|---|---|---|
| `samwho-dev` (NEW), https://samwho.dev/load-balancing/ | Prose column 748px at left 339 (about 80 characters), 18.67px/28; H1 48/57.6; H2 32/38.4. Charts are custom elements (`s-tail-latency-chart` 748×458, a centred 480px plot) with mono axes. Series use solid/dashed/dotted lines. Inline coloured legend tokens appear in the prose. 14 `s-simulation` embeds (748×275). Colours in `oklch`. No transitions. Screenshot: `research/samwho-loadbalancing-1440-chart.png` | Strongest reference for the **case-study body and charts**. It overlaps the Components slot, so it is kept as the alternate or as a second source for case-study pages. |
| `moah-studio` | 30px margins; sections padded 160/100px; 2-up 682.8/682.8 with 80px row gap; scale 12/14/18/22/28/36/50; tracking −1% to −2%; dark `rgb(21,23,25)` with sage `rgb(202,209,184)`; Lenis. Screenshot: `research/moah-studio-1440.png` | Its layout overlaps airborne, which has the stronger case-card mechanism |
| `poch-studio` | 50px margins; 140px section gap; carousels of 320px cards at a 10px gap; scale 12/17/25/50/150; 4 display faces; transitions `transform .16s ease`. Screenshot: `research/poch-studio-1440.png` | Its expressive, playful typography conflicts with "precise, calm, engineered" |
| `k95` | Full-viewport WebGL canvas 1441×900, document height 900 (virtual scroll); UI `transform .35s cubic-bezier(0.4,0,0.2,1)` (44 elements); reveals `.95s cubic-bezier(0.16,1,0.3,1)`. Screenshot: `research/k95-1440.png` | Heavy for LCP < 2.5s and the ≥90 mobile Lighthouse target. Pattern `hero-interactive-object` allows it only when lazy-loaded after LCP. |
| `bruno-simon`, `lexspace`, `brik` | not opened this pass | Out of the slot budget. They are 3D/dark product storytelling; open them only if design-director asks. |

## Cross-reference easing table (all measured)

| Source | Curve | Typical duration | Use |
|---|---|---|---|
| elu-dev | `cubic-bezier(0.6,0,0.15,1)` | 300–400ms (UI), 600–700ms (entry, width) | everything |
| airborne | `cubic-bezier(0.22,1,0.36,1)` | 600ms | scroll reveals |
| airborne / k95 / planetscale | `cubic-bezier(0.4,0,0.2,1)` | 150–350ms | hover and state |
| meinhard-taxer | `cubic-bezier(0.19,1,0.22,1)` | 300ms | hover opacity |
| k95 | `cubic-bezier(0.16,1,0.3,1)` | 950ms | large reveals |
