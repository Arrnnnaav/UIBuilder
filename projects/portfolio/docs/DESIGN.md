# DESIGN — portfolio
> Law for every agent. If something isn't here, don't invent it; update this file first.
> design-director (critic), S3, 2026-09-25. Inputs: `docs/directions/A.md`, `B.md`, `C.md`, PRODUCT.md (G1 decisions), WIREFRAMES.md, IA.md, `brain/preferences.md`, `pipelines/portfolio/DESIGN.base.md`. Skills: frontend-design, taste-skill, web-design-guidelines.
> Lineage tags: **[A]** restrained, **[B]** instrument panel, **[C]** technical report, **[critic]** new in the merge. Every decision below carries one.

## Direction
- **Hybrid of:** A's calibrated restraint (grid, 17px major-third scale, hero split, accent-marks-results rule) + B's type system (Archivo with its width axis: *wide means who, condensed means how much*) and 2px machined shape + C's report grammar (booktabs tables, three-zone case study with sidenotes, citation markers, highlighter-yellow mark).
- **Critic notes (what was kept, cut and why):**
  - **Design read:** a developer portfolio for recruiters and engineering managers hiring backend/AI engineers, in a *measured-evidence* language (a lab report that happens to be well art-directed). It uses Tailwind v4 tokens, one variable grotesk with a width axis, a code mono used only for literal code, and near-static motion. Dials: `DESIGN_VARIANCE 6 · MOTION_INTENSITY 3 · VISUAL_DENSITY 4`.
  - **Type for skimmers.** A recruiter scans a name, a claim and a number in about 5 seconds. A grotesk reads faster at a glance than a serif, and a serif display on pale paper is the editorial-AI cliché that C itself flagged. So C's Newsreader is **cut** and C's report structure is kept, set in sans. B's Archivo beats A's Switzer: it is on Google Fonts (via `next/font/google`, no self-hosting), it has verified `tnum`, and its width axis gives the identity a voice without a second family. A's calmer 17px / 1.25 scale is kept, because B's 1.333 display jumps (176px numerals) fight the "calm, precise" tone.
  - **One primary hook, one secondary.** All three directions independently proposed the same load moment: a bar contracting from the *before* length to the *after* length (A "retract", B "drop", C "Table 1 after-bar"). That convergence makes it the **primary**. B's "to scale" numerals encode the same ratio a second time, only work on 2 of 6 rows, and put a 176px numeral in the LCP race, so they are **cut** (they compete with the retract). B's "Probe" is a third interaction with its own JS island and is **cut** (DESIGN.base allows one signature). C's citation markers with the highlighter sweep are the **secondary**, because they *are* the "auditable" claim and cost no JS. The two share one grammar: the yellow mark always means "this number is sourced", and the retract ends by laying that mark on the result.
  - **Colour.** A's cobalt reads as SaaS blue in isolation, even with A's strict rule, so it is **cut**. B and C both chose yellow. It is kept as a *highlighter mark* (C), only ever a fill behind ink text, never text or a button. A's rule survives in yellow form: at rest, the mark sits only on the page's headline measured result. B's yellow plates and full-bleed yellow footer are **cut** (a "construction/warning" risk, and they dilute the mark's meaning).
  - **Flagged conflicts resolved:**
    - The em-dash caption becomes **"Measured results. Each one links to its source."**
    - The contact intent has **one label, "Contact Arnav"**, in the nav, the hero and the footer big CTA on every page, including case pages (this replaces the wireframe's "Let's talk" and the case-aware variant). On `/contact` the footer CTA is "See the work" (a different intent).
    - The work-index preview **docks** in a fixed right-hand slot and slides on Y only (all three directions agree). There is no cursor-follow.
    - **Scroll reveals: none.** Sections render static. The only viewport-triggered motion on the site is the retract, which reports a real change. This overrides the wireframe's optional `motion-scroll-reveal-restrained`. `components/motion/Reveal.tsx` must not be used on content sections.
    - **Precision: full source precision, everywhere.** Edge Node is **5.356 s → 0.973 s** in the hero, the ledgers, the figures, the prose, FAQ answers, meta descriptions, OG images and llms.txt. A visitor can search the source file for the exact string. Derived values are computed at build time and rounded by rule: percent to an integer (−82%), ratio to 1 decimal (5.5×). The rounded "5.36 s → 0.97 s" in SEO_STRATEGY §titles/llms and WIREFRAMES §/ and §/work/edge-node is superseded.
- **Mood (3 words):** calibrated, cited, exact.
- **Signature hook (the one memorable thing):** **"The retract, then the mark."** In every before → after row, the solid ink *after* bar starts at the full length of the hatched *before* bar and contracts to its true proportion. On the hero it goes from 5.356 s to 0.973 s, 18.17% of the length, in 720 ms. Then a yellow highlighter mark sweeps in behind the *after* value. The reduction is shown physically, then marked as the verified result. The numbers never move. **Secondary: "checked against source."** Every measured value on a case page carries a citation marker `[n]`. Hovering or focusing the value, its marker, its sidenote or its ledger row sweeps the same mark behind all of them at once (CSS `:has()`, no JS). [primary: A+B+C convergent, end-mark: critic; secondary: C]

## Color (tokens in app/styles/tokens.css)
One cool neutral family (blue-grey paper, blue-black ink; not cream, not near-black + acid) and **one accent: the highlighter mark**. There is no gradient, glow, glass or shadow. Two schemes follow `prefers-color-scheme` with no toggle; the light scheme is canonical (OG image, screenshots). [neutrals: A/B/C consensus; yellow: B+C; mark-only usage: C; accent-means-result: A]

| Token | Light (oklch → hex) | Dark (oklch → hex) | Role |
|---|---|---|---|
| `--color-bg` | `oklch(0.975 0.004 247)` #f5f7f9 | `oklch(0.185 0.012 262)` #101318 | page |
| `--color-surface` | `oklch(0.945 0.006 247)` #eaedf1 | `oklch(0.225 0.013 262)` #181c22 | input fill, code spans, `<details>` bodies, table header row on mobile records |
| `--color-fg` | `oklch(0.21 0.02 262)` #131822 | `oklch(0.95 0.005 247)` #eceff2 | text, numbers, primary button fill, booktabs rules, *after* bar, focus ring |
| `--color-muted` | `oklch(0.45 0.018 262)` #505660 | `oklch(0.75 0.012 255)` #a9aeb6 | secondary text, captions, *before* values, n/method, hatch of the *before* bar |
| `--color-border` | `oklch(0.58 0.014 262)` #767b83 | `oklch(0.56 0.012 262)` #71757c | input borders, *before*-bar outline (UI boundaries, non-text ≥ 3:1) |
| `--color-rule` | `oklch(0.86 0.007 255)` #ced1d6 | `oklch(0.34 0.012 262)` #35383e | decorative hairlines only (work-index row separators, chart gridlines) |
| `--color-accent` | `oklch(0.91 0.16 100)` #fae353 | `oklch(0.87 0.16 100)` #edd643 | **the mark**: a fill behind text only |
| `--color-accent-fg` | = fg #131822 | = bg #101318 | text on the mark |
| `--color-danger` | `oklch(0.5 0.19 27)` #b7191c | `oklch(0.72 0.16 27)` #f9786c | form errors only (semantic state, not an accent) |
| `--color-success` | `oklch(0.46 0.1 155)` #1b683e | `oklch(0.76 0.12 155)` #6dc88f | the form success line only |

**Where the mark (yellow) may appear, and nowhere else:**
1. At rest, behind **one** value per page: the headline result (the hero *after* value on `/`, and the Result headline row's *after*/value on each case page). `/work`, `/about` and `/contact` have none at rest.
2. On hover, `:focus-visible` or `:target` of a citable value or its twins (marker, sidenote, ledger row, Sources entry).
3. `::selection`.

It never appears as text colour, a button fill, a border, an icon colour or a section background.

**Contrast (WCAG 2.x relative luminance, computed from the OKLCH values by an OKLab → linear-sRGB script, 2026-09-25; all values in sRGB gamut):**

| Pair | Light | Dark | Needs | Result |
|---|---|---|---|---|
| fg on bg | **16.50:1** | **16.12:1** | 4.5 | pass (AAA) |
| fg on surface | **15.10:1** | **14.79:1** | 4.5 | pass (AAA) |
| muted on bg | **6.92:1** | **8.38:1** | 4.5 | pass |
| muted on surface | **6.34:1** | **7.69:1** | 4.5 | pass |
| accent-fg on accent (marked text) | **13.67:1** | **12.68:1** | 4.5 | pass (AAA) |
| muted on accent (marked caption) | **5.74:1** | n/a: use accent-fg | 4.5 | pass (light) |
| bg on fg (primary button label) | **16.50:1** | **16.12:1** | 4.5 | pass |
| danger on bg | **6.16:1** | **7.02:1** | 4.5 | pass |
| danger on surface (error inside input area) | **5.64:1** | **6.44:1** | 4.5 | pass |
| success on bg | **6.31:1** | **9.12:1** | 4.5 | pass |
| *Non-text (1.4.11)*: border on bg (inputs, before-bar outline) | **3.99:1** | **4.01:1** | 3.0 | pass |
| border on surface (input on filled field) | **3.65:1** | **3.68:1** | 3.0 | pass |
| focus ring (fg) on bg | **16.50:1** | **16.12:1** | 3.0 | pass |
| rule on bg | 1.42:1 | 1.59:1 | none | decorative only; never the sole boundary of a control or a state |
| accent on bg (mark edge) | 1.21:1 | 12.68:1 | none | the mark is supplementary; state is also carried by a 2px fg underline or focus ring |

**Banned pairings:** accent as text on bg (1.21:1); muted text on accent in dark (1.51:1); rule as a control boundary.

## Typography (families, scale, weights; Google Fonts/Fontshare only)
**Two families**, both SIL OFL 1.1 on Google Fonts, both loaded through `next/font/google`. Licences were verified in `google/fonts` `ofl/archivo/OFL.txt` and `ofl/martianmono/OFL.txt`. Neither is a reference's font (the references use Neue Haas, Gravity, PP Neue Montreal, Plex Mono and Commit Mono).

| Role | Family | Load | Verified in the font file (GSUB/cmap parse, 2026-09-25) |
|---|---|---|---|
| Everything: display, UI, body, **all numerals** | **Archivo** (Omnibus-Type) [B] | `Archivo({ subsets: ["latin"], axes: ["wdth"], display: "swap", variable: "--font-sans-family" })`, variable wght 100–900 and wdth 62–125, preloaded | `tnum`, `pnum`, `lnum`, `zero`, `case`, `frac`, `sups` present. Glyphs → − × ≈ é ’ ₹ present. **↗ is absent.** |
| Literal code only: `127.0.0.1`, `SUBAGENT_CAP = 5`, `qwen3:4b-instruct`, filenames such as `benchmark_report.md` | **Martian Mono** (Evil Martians) [B+C family, A's usage rule] | `Martian_Mono({ subsets: ["latin"], weight: "400", display: "swap", preload: false, variable: "--font-mono-family" })` | Monospaced, so figures are tabular by construction. → − × ≈ present, **↗ absent**. |

**Rules**
- **Width is the system [B]:** *wide means who, condensed means how much.* Set it with `font-stretch`. Verified in the 2026-09-25 build: the emitted `@font-face` declares `font-stretch: 62% 125%`, and the preloaded latin woff2 is 90 KB.
  - **Wide `font-stretch: 112%`**, weight 700: the home H1 name, case-study titles in the work index, the footer CTA.
  - **Normal 100%**, weight 400/500/600: reading, UI, nav, buttons, small numerals.
  - **Narrow `font-stretch: 75%`**, weight 600, `tabular-nums`: numerals at `--text-2xl` and above (hero before/after, ledger values on desktop). Narrow is never used below `--text-2xl`.
  - B's wdth 125 / 800 and wdth 62 are too extreme for "calm" and overflow at 390; they are clamped to 112 and 75. [critic]
- **Mono never labels anything [A].** It is not used for eyebrows, tags, n/method, deltas, nav or buttons. Numbers are Archivo with `font-variant-numeric: tabular-nums lining-nums`. Use the real minus U+2212, the × U+00D7 and a no-break space between value and unit (`5.356 s`).
- **No italic is loaded or used** [critic: saves a file, and C's italics came with the serif]. The quiet voice is `--color-muted` roman. Verbatim caveats sit in typographic quotes “…” in muted.
- **No uppercase, no letter-spaced labels, no eyebrows** [A/B/C consensus]. Captions and headers are sentence case.
- **No emphasised word inside a headline**, and no second family inside a line.
- **The external-link marker is the Phosphor `ArrowUpRight` icon**, never the ↗ glyph (neither font has it). Install `@phosphor-icons/react` and use weight "regular" at 0.875em, `aria-hidden`, with sr-only text "(opens in a new tab)". This is the only icon family.

**Scale: major third, ratio 1.25, base 17px [A].** Fluid `clamp()` between 390 and 1440, in rem (zoom-safe; no `1vw` root).

| Token | 390 | 1440 | Line-height | Tracking | Weight / width | Use |
|---|---|---|---|---|---|---|
| `--text-xs` | 13.6px | 13.6px | 1.45 | +0.005em | 400–500 / 100% | table headers, legend, source-type tag, chart ticks |
| `--text-sm` | 15px | 15px | 1.5 | 0 | 400–500 / 100% | captions, n/method, breadcrumbs, sidenotes, helper text (the one off-scale half step) |
| `--text-base` | 17px | 17px | 1.6 | 0 | 400 / 100% | body; prose `max-width: 66ch` |
| `--text-lg` | 19px | 21.25px | 1.45 | −0.005em | 400–500 / 100% | ledes, hero subline, H1 descriptor, deltas |
| `--text-xl` | 23px | 26.56px | 1.25 | −0.01em | 500 / 100% | H3, FAQ questions, work-index titles on mobile |
| `--text-2xl` | 27px | 33.2px | 1.15 | −0.015em | 600 / 100% (titles 112%) | H2, work-index titles |
| `--text-3xl` | 33px | 51.9px | 1.05 | −0.02em | 600 / 75% for numerals; 600 / 100% for page-intro H1 | hero before → after, page-intro H1, case H1 |
| `--text-display` | 48px | 92px | 1.0 | −0.03em | 700 / 112% | home H1 name only |
| `--text-cta` | 42px | 128px | 0.95 | −0.035em | 700 / 112% | footer "Contact Arnav" only |

- The H1 descriptor span ("Backend & AI engineer, MNIT Jaipur") is `--text-lg`, weight 400, 100%, `--color-muted`, `display: block`, 12px below the name, inside the same `<h1>`. [A/B/C consensus]
- `text-wrap: balance` on H1–H3, `text-wrap: pretty` on body.
- Overflow check: the name at 112% / 700 / 48px must fit in 350px (390 minus 2 × 20). If "Khandelwal" overflows at 360px, drop to 100% width below 400px; don't shrink the size.

## Spacing + grid
- **Grid [A/B]:**

  | | ≥ 1024 | 640–1023 | < 640 |
  |---|---|---|---|
  | Columns | 12 | 8 | 4 |
  | Gutter | 24px | 20px | 16px |
  | Side margin | `clamp(20px, 4.44vw, 64px)` (64 at 1440) | same | 20px |
  | Max content width | 1312px, centred; wider screens grow the margin only | | |
- **Spacing scale (4px base) [A/C]:** 4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96 · 128.
- **Rhythm:**
  - Home section gap: **128px** desktop / **80px** mobile [B/C]. A's 160 is too long a page.
  - H2 to body: 24px. Body to its table, figure or CTA: 32px.
  - Table/figure block margin: 48px above, 32px below.
  - Paragraph gap: 16px.
- **Nav:** 64px tall, one line at ≥ 1024. Hero top padding: 64px desktop / 32px mobile (within the 96px cap).
- **Home layout families (all different) [A, with C/B parts]:**
  1. **Hero:** asymmetric split. Type in cols 1–7 and the specimen in cols 9–12, bottom-aligned to the CTA row.
  2. **Measured results:** a full-width booktabs table.
  3. **Selected work (`#work`):** full-width index rows in cols 1–8, with the docked preview slot in cols 9–12.
  4. **More work:** one sentence in cols 1–8, with the six group names as inline underlined links [B]. Not chips: they would add a second radius.
  5. **Bio teaser:** prose in cols 1–6, and the fact `<dl>` in cols 8–12.
  6. **FAQ:** a single column in cols 1–8, questions and answers stacked, no split header.
  7. **Footer:** the oversized CTA, then 3 link columns.
- **Case study: three zones at ≥ 1280 [C].**
  - Front-matter rail in cols 1–3: the `<dl>` of Role, Dates, Stack, Outcome, Repo and Author, with `position: sticky; top: 96px`.
  - Text column in cols 4–9 (about 66ch): prose, tables, figures.
  - Margin in cols 10–12: sidenotes, top-aligned to the line holding their `[n]`.
  - Tables and figures may break out to cols 4–12; their notes then drop below as a numbered note list.
  - 768–1279: the rail sits above the text as a two-column `<dl>`, and each sidenote renders after its paragraph as a `<p class="note">` in `--text-sm` muted.
  - < 768: single column. The rail is a summary block after the header, Outcome first. The `[n]` links point to the end-of-case **Sources** list, and each entry has a "Back to text" link.
- **/work "More work" [C]:** an appendix-style two-column definition list at ≥ 1024 (group name and dates as `<dt>`; summary, repo count, repo links and the headline number with its qualifier as `<dd>`). There is no card chrome. Below 768 it uses `<details>` per the wireframe.
- **/about [C]:** the timeline uses the booktabs table grammar (date | role/event | what happened | proof link). The skills evidence map is a two-column back-of-book index ("FastAPI: Edge Node, Cited Researcher, NeuroUX").

## Radius, borders, elevation
- **Radius [B]:** **2px** on every interactive control: buttons, inputs, textarea, the Turnstile wrapper, the menu button, the topology toggle, `<summary>` focus boxes and code spans. **0** on data surfaces: tables, figures, images and the docked preview. There are no pills, no 12px cards and no third value.
- **Rules [C booktabs]:** every data table uses exactly three horizontal rules in `--color-fg`: a **1.5px top rule**, a **0.75px rule under the header row** and a **1.5px bottom rule**. Rows get no borders; row padding is 12px and row groups are 20px apart. There are no vertical rules.
- **Hairlines [A]:** `--color-rule` 1px appears only as the bottom border between work-index rows and as chart gridlines. Sections are separated by white space alone. There are no decorative rules or crosshairs.
- **Elevation: none.** There are no shadows anywhere. The mobile nav overlay is a solid `--color-bg` layer. The z-index scale is: skip-link 100, nav overlay 50, sticky nav 40, sticky rail 1.
- **Retract bars [C pattern + A outline]:** each bar is 8px tall with a 4px gap between the two.
  - The *before* bar is a 45° hatch (`repeating-linear-gradient(135deg, var(--color-muted) 0 1px, transparent 1px 5px)`) with a 1px `--color-border` outline, at 100% width.
  - The *after* bar is solid `--color-fg`, at `ratio × 100%`.
  - The two differ by pattern, not colour. There is no background track.
  - Both are `aria-hidden`.

## Components (buttons, links, cards, inputs, nav)
- **Primary button [A/B/C consensus]:**
  - `--color-fg` fill, `--color-bg` label (16.50:1), Archivo 500 `--text-base` at 100% width.
  - Height 48px, horizontal padding 24px, 2px radius. No arrow glyph, and the label stays on one line.
  - Hover (fine pointers): the label gains a 1px underline at a 0.2em offset.
  - `:active`: `scale(0.98)`, 120ms.
  - Disabled: opacity 0.55 and `cursor: not-allowed`. While submitting, the label is "Sending…".
  - **Labels:** "Contact Arnav" (the contact intent, everywhere) and "Send message" (form submit).
- **Text link:**
  - `--color-fg` with an underline of 1px thickness at a 0.2em offset. On hover and focus the thickness goes to 2px (a colour-free change).
  - External links carry the Phosphor `ArrowUpRight` icon plus sr-only "(opens in a new tab)".
  - Secondary hero link: "See the measured work" → `#work`.
- **Metric ledger (`new:metric-ledger`) [C table + A column logic]:**
  - A real `<table>` with a `<caption>` above it in `--text-sm`/500. Home caption: **"Measured results. Each one links to its source."**
  - Case captions are numbered "Table 1.", "Table 2." (a real sequence in a report).
  - Columns: Metric (link to case on home) · Before · After · Change · n / method · Source.
  - Numerals are right-aligned with `tabular-nums`. *Before* is muted 400; *after* is fg 600.
  - The retract bar pair sits on its own line under Before/After for rows with both values.
  - Single-value rows have no bars. Fact rows set their text in the value columns at `--text-base`, so a fact never impersonates a measurement.
  - "n not reported" is printed literally in muted.
  - Caveats go on their own line under the row, in muted, in quotes.
  - The source-type tag is text only ("Committed benchmark" fg 500, "README" muted 400), with a one-line legend in the table foot.
  - `pending-source` rows render nothing.
  - Row hover/focus-within: the mark sweeps behind that row's *after* value.
  - Mobile: a stacked record per wireframe. The source link is a full-width 48px row.
- **Hero specimen:** a one-row ledger. See Imagery and Responsive for placement. The metric name links to `/work/edge-node`, and the source link is separate (no nested links, no row-wide click).
- **Citation marker `[n]` [C]:**
  - A real `<a href="#source-n">` in `--text-xs` 500 fg, raised with `vertical-align: super`. Its accessible name is "Source n: benchmark_report.md, committed benchmark".
  - The hit area is at least 24 × 24px via a transparent `::after`, and 44 × 44 on `(pointer: coarse)`.
  - Sidenotes are real DOM after their paragraph, never `aria-hidden`.
  - The twin highlight is scoped to `.case` and `.ledger` containers (not `body`) to keep `:has()` recalculation cheap.
- **Work index (`work-grid-hover-reveal`) [A/B/C consensus on dock]:**
  - Six rows in ring order, each separated by a `--color-rule` bottom border, with 24px vertical padding.
  - Each row has: the title at `--text-2xl` 600 / 112% (a link to the case); the descriptor in muted `--text-base`; ≤ 3 tags as plain muted text separated by commas; month/year; and the headline value, right-aligned and tabular.
  - The **docked preview** is fixed in cols 9–12 at 4:3 with 0 radius. It slides on `translateY` to the active row (hover or focus-within) and crossfades its image. It is `aria-hidden` and appears only on `(hover: hover) and (pointer: fine)`.
  - Touch: an inline disclosure per wireframe.
  - There are no dot leaders (a menu look in sans) [critic].
- **Inputs:**
  - The label sits above in `--text-sm` 500 fg. Height 48px (textarea 160px min), `--color-surface` fill, 1px `--color-border` (3.65:1 on surface), 2px radius, 12px padding.
  - Placeholder is muted and never used as the label.
  - Helper text is `--text-sm` muted.
  - Errors: below the field, danger text with the Phosphor `WarningCircle` icon, plus `aria-invalid` and `aria-describedby`.
  - Focus: a 2px fg outline at a 2px offset.
  - Use the correct `type`, `autocomplete` and `inputmode`. Values are kept on error.
- **Nav (`nav-minimal-overlay`) [A/B]:**
  - 64px tall. The wordmark "Arnav Khandelwal" is Archivo 600 / 112% at `--text-base`, linking to `/`. Links (Work, About, GitHub with `rel="me"` and the external icon) are 400 `--text-base`, with `aria-current="page"` shown as a 2px fg underline.
  - The CTA is a compact primary button, "Contact Arnav", 40px tall inside a 44px hit area.
  - < 1024: the wordmark, the "Contact Arnav" CTA at `--text-sm`, and a "Menu" text button (48px target).
  - The overlay is a solid bg layer with links at `--text-2xl`. It has a focus trap, closes on Esc and returns focus to the Menu button.
- **Footer (`footer-big-cta`) [A/C, label critic]:**
  - "Contact Arnav" at `--text-cta` 700 / 112% fg, linking to `/contact`. Its underline is a 3px fg bar that scales in from the left on hover and focus [C].
  - On `/contact` the same slot reads "See the work" → `/work`.
  - Then 3 columns (Site, Case studies, Profiles with `rel="me"`), plus the line "Numbers on this site link to their sources", linking to `/#evidence`.
  - No marquee, no locale strip until confirmed, no version string.
- **Focus (global):** `outline: 2px solid var(--color-fg); outline-offset: 3px` on every interactive element. It is never removed without a replacement. The mark is never the only focus signal [C].
- **Breadcrumb:** `--text-sm` muted. Items are separated by a "/" in a muted `aria-hidden` span, and the last item is fg with `aria-current="page"`.
- **Cards:** none. Grouping uses space, booktabs or the definition list.

## Imagery
- **No stock, no headshot, no generated people, no fake UI screenshots.** A headshot slot exists on `/about` only if the owner supplies one: 4:5, explicit dimensions, 0 radius, no filter. [PRODUCT + A/B/C]
- **Evidence figures (`new:evidence-figure`) [A/B/C consensus grammar]:**
  - Server-rendered inline SVG built from `content/evidence/*.json`.
  - Axes are 1px fg; ticks and labels are Archivo `--text-xs` muted and tabular; gridlines are `--color-rule`.
  - Series differ **by pattern, not colour**: *after* or primary is solid fg, *before* or secondary is the hatch with a `--color-border` outline, and a third series (if ever needed) is a 1px dashed outline. No second hue.
  - Direct labels sit on the marks, not in legends. Log scales are stated on the axis and in the caption.
  - The `<figcaption>` goes below in `--text-sm` muted and names its source file in Martian Mono.
  - Each figure has a "Show data" `<details>` table.
- **Supplied and rendered media** (owner screenshots, `demo_dashboard.html` capture, NeuroUX `demo.mp4`):
  - AVIF/WebP with explicit width and height and a fixed aspect-ratio box (CLS 0).
  - 0 radius, with a 1px `--color-rule` frame only when the image edge would otherwise dissolve into the page.
  - Video uses a poster, `preload="none"`, click-to-play and a 48px play control.
  - No overlays, pills or captions on the image; the caption goes below.
- **Docked work preview:** the case's evidence figure, rendered as a static thumbnail, lazy-loaded and prefetched on hover intent.
- **OG image (`app/opengraph-image.tsx`):**
  - bg #f5f7f9, fg #131822, muted #505660.
  - One mark bar #fae353 behind the headline result line "5.356 s → 0.973 s mean latency".
  - No gradient.

## States (empty, loading, error)
- **Empty:**
  - The StudyOS ledger caption reads "No quantitative metrics were published for this project." and the fact rows follow.
  - A ledger whose rows are all `pending-source` does not render; its section H2 is omitted with it.
  - An unverified profile is not rendered. [wireframe + C]
- **Loading:**
  - Pages are SSR, so there are no skeletons on content.
  - Contact submit: the button is disabled with the label "Sending…", and the fields stay editable-looking but are `readonly` during the request.
  - Turnstile reserves a 65px-tall box to avoid shift.
  - The video shows its poster until clicked.
- **Error:**
  - Form, per field: a danger line under the field with the icon; focus moves to the first invalid field.
  - Form, server or rate limit: an inline block above the submit button, "Your message wasn't sent. Try again in a minute, or use the links beside the form.", and the direct channels gain the static mark on their label.
  - 404: H1 "This page doesn't exist", one sentence, then the recovery list (Home, Work, six cases, Contact) as ≥ 44px rows.
  - Error boundary: H1 "Something broke on this page", then "Retry" (a primary button, the only non-contact primary), Home and Contact.
- **Success (form):**
  - The form is replaced inline by "Message sent. Arnav will reply by email." in fg, with a success-colour Phosphor `CheckCircle` icon.
  - Next steps follow: "See the work" and GitHub.
  - Focus moves to the confirmation heading.

## Responsive rules (390 / 768 / 1440)
- **390:**
  - 4 columns, 20px margins, single column everywhere.
  - Hero order: H1 (48px name, 19px descriptor) → subline (19px) → full-width "Contact Arnav" button → "See the measured work" link → specimen as a stacked record (metric; `5.356 s → 0.973 s` at 33px narrow; bars at full width; "−82%  5.5× faster"; n/method and tag; source link as a 48px row). H1 through the CTA fit in 844px.
  - Ledgers become stacked records. The case rail is a summary block with Outcome first.
  - Sidenotes are replaced by `[n]` → Sources.
  - Figures switch to vertical orientation per the wireframe.
  - Section gap is 80px. Tap targets are ≥ 44px. No horizontal scroll anywhere.
- **768:**
  - 8 columns, margins about 34px (4.44vw).
  - The hero is still stacked, with the specimen at cols 1–6.
  - Ledgers render as a table if they fit at `--text-sm` with ≥ 12px cell padding; otherwise they stay stacked records.
  - The case rail becomes a two-column `<dl>` above the text, and notes are inline after their paragraphs.
  - The work index has no preview (the dock needs ≥ 1024).
- **1440:**
  - 12 columns, 64px margins, 1312px content.
  - Hero split: cols 1–7 type (name 92px), cols 9–12 specimen (numerals 51.9px narrow).
  - Docked preview in cols 9–12. The case study uses the three zones.
  - Section gap is 128px.
  - Beyond 1440 the margins grow; the content does not.

## Anti-patterns for this project
- Any number that animates its value (count-up, odometer, scramble). Only the aria-hidden bars move.
- Yellow as text, button fill, border, section background or plate. No more than one resting mark per page.
- A second accent hue, including green/red deltas, coloured tags or coloured chart series.
- Serif display type; italics; uppercase or letter-spaced labels; eyebrows; `01 / 02` numbering except the case Approach beats, which are a real sequence.
- Mono for labels, tags, deltas or n/method (literal code and filenames only).
- Scroll reveals, fade-up sections, parallax, marquees, magnetic buttons, custom cursors, cursor-following previews, smooth-scroll hijacks.
- Cards, shadows, glass, glow, gradients (the hatch pattern is the only `repeating-linear-gradient`, and it is a data encoding).
- To-scale numeral heights, the Probe cursor, yellow plates (cut, see Direction notes).
- The em dash or en dash in any visible string. Use periods, commas or colons.
- Two labels for the contact intent. It is always "Contact Arnav" (the wireframe's "Let's talk" and the case-aware CTA are superseded).
- Rounded Edge Node figures (5.36 s / 0.97 s). Always use 5.356 s → 0.973 s.
- Middle-dot chains as meta separators (a line break or a comma instead); decorative status dots; scroll cues; version strings; skill bars; the headshot-with-gradient hero.
- Raw colour values outside `app/styles/tokens.css` (`pnpm lint:tokens`).
