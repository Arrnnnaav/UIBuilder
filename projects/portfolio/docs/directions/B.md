# Direction B: bold / expressive / interactive

> design-director, S3 fork B, 2026-09-25. Inputs: PRODUCT.md (with G1 decisions), INSPIRATION.md, REFERENCE_BREAKDOWN.md, WIREFRAMES.md, IA.md, brain/preferences.md, pipelines/portfolio/DESIGN.base.md. No other direction was read.
> Skills loaded: frontend-design, taste-skill, web-design-guidelines.

**Design read:** a developer portfolio for recruiters and engineering managers, in a bold **instrument-panel** language borrowed from electrical test equipment (multimeter plates, scope cursors, calibrated scales), leaning toward Tailwind v4, a single variable grotesk with a width axis, inline SVG and one small vanilla client island.

**Dials:** DESIGN_VARIANCE 8 · MOTION_INTENSITY 6 · VISUAL_DENSITY 4. Motion stays at 6, not 8+, because preferences ask for "subtle, fast, physics-based" motion and reject decorative animation. Direction B spends its boldness on type scale, colour blocking and one interaction.

**Why this lane fits the brief:** Arnav studies Electrical Engineering, and his differentiator is measured evidence. Test instruments are the one visual world where precise numbers are also loud: a yellow multimeter body, a huge condensed readout, a cursor that snaps to a sample. That gives B a bold identity drawn from the subject, not from dev-portfolio chrome (no terminal windows, no green-on-black, no gradient hero).

---

## 1. Mood and signature hook

**Mood:** calibrated, loud, exact.

**Signature hook: "To scale."** Every before→after number is set with its **cap height proportional to its value**. On the hero plate, "5.36 s" is set at 176px and "0.97 s" at 32px (176 × 0.973/5.356 = 32.0). The size drop *is* the result: a visitor sees the 5.5× improvement before reading a digit. The typography is the chart, it is static and server-rendered, and it follows the wireframe rule that numbers never animate.

- The rule is exact and published in the caption: "Numeral heights are to scale."
- **Floor:** if the scaled size would fall below 16px, it clamps to 16px and the caption switches to "Not to scale: the after value is shown at minimum readable size." (Honesty over drama.)
- Used on the hero plate, on the Result headline row of each case study, and on the home ledger's "after" column (the home ledger uses a smaller base, see §5).
- Rows without a before value (single-value and fact rows) are set at a fixed size and never pretend to be to scale.

**Signature interaction: "Probe."** An oscilloscope-style measurement cursor on evidence figures (§6). It lazy-loads after LCP and **snaps only to real, sourced data marks. It never reads between the points.**

---

## 2. Palette (oklch, light scheme is primary)

A cool, instrument-grey paper, a blue-black ink, and **one** accent: instrument yellow, used as a *surface* (plates, the active probe readout, the footer CTA block), never as text on paper.

| Token | oklch | ≈ hex | Role |
|---|---|---|---|
| `--paper` | `oklch(0.972 0.004 247)` | #f4f6f8 | page background |
| `--paper-2` | `oklch(0.935 0.006 247)` | #e6eaed | raised rows, open disclosures, input fill |
| `--ink` | `oklch(0.205 0.022 262)` | #121721 | primary text, primary button fill |
| `--ink-2` | `oklch(0.43 0.02 262)` | #4a505b | secondary text, "before" values, meta on yellow |
| `--ink-3` | `oklch(0.505 0.016 262)` | #60656e | tertiary meta, input borders (never on yellow) |
| `--rule` | `oklch(0.84 0.008 262)` | #c8cbd0 | hairlines only (decorative, non-text) |
| `--signal` | `oklch(0.87 0.175 96)` | #f7d21a | the one accent: plates, "after" bars, probe readout, footer CTA |
| `--danger` | `oklch(0.5 0.19 27)` | #b7191c | form errors only (semantic state, not an accent) |

**Contrast (WCAG 2.x, computed from the oklch values; script in the director's scratchpad, sRGB-clipped):**

| Text / foreground | Background | Ratio | Allowed use |
|---|---|---|---|
| ink | paper | **16.53:1** | all text |
| ink | paper-2 | **14.81:1** | all text |
| ink-2 | paper | **7.48:1** | all text |
| ink-2 | paper-2 | **6.70:1** | all text |
| ink-3 | paper | **5.42:1** | body and meta |
| ink-3 | paper-2 | **4.85:1** | body and meta |
| ink | signal | **12.13:1** | all text on plates |
| ink-2 | signal | **5.49:1** | meta text on plates |
| ink-3 | signal | 3.97:1 | **banned** (fails 4.5 for small text) |
| paper | ink | **16.53:1** | primary button label |
| signal | ink | **12.13:1** | yellow marks on ink (focus ring halo, probe line on dark) |
| danger | paper | **6.11:1** | error text |
| ink-3 (input border) | paper | **5.42:1** | non-text UI ≥3:1 passes |
| signal | paper | 1.36:1 | **banned** for text, icons or sole-indicator UI; a signal plate on paper is always outlined in 1px ink |
| rule | paper | 1.51:1 | decorative only; never the only boundary of a control |

**Dark scheme (via `prefers-color-scheme: dark`; the yellow stays identical, so the brand survives):**

| Token | oklch | ≈ hex |
|---|---|---|
| `--paper` | `oklch(0.185 0.014 262)` | #0f1319 |
| `--paper-2` | `oklch(0.235 0.016 262)` | #1a1e26 |
| `--ink` | `oklch(0.95 0.006 247)` | #ebeff2 |
| `--ink-2` | `oklch(0.76 0.012 262)` | #adb1b9 |
| `--ink-3` | `oklch(0.66 0.012 262)` | #8e929a |
| `--rule` | `oklch(0.34 0.015 262)` | #343840 |
| `--signal` | `oklch(0.87 0.175 96)` | #f7d21a |
| `--danger` | `oklch(0.72 0.16 27)` | #f9786c |
| `--on-signal` | `oklch(0.185 0.014 262)` | text on yellow in dark mode |

| Pair (dark) | Ratio |
|---|---|
| ink on paper | **16.12:1** |
| ink on paper-2 | **14.42:1** |
| ink-2 on paper | **8.68:1** |
| ink-2 on paper-2 | **7.77:1** |
| ink-3 on paper | **5.99:1** |
| ink-3 on paper-2 | **5.36:1** |
| on-signal on signal | **12.61:1** |
| signal on paper (plate edge, probe line) | **12.61:1** |
| danger on paper | **7.02:1** |
| rule on paper | 1.59:1 (decorative only) |

**Palette rules:**
- One accent, locked. No second hue anywhere, including tags, charts and status. Chart series differ by **fill vs outline vs dash pattern** (samwho mechanism), never by a second colour.
- No gradients, glows, shadows or glass. Elevation is expressed by a 1px ink outline or a paper-2 fill.
- "Before" values are always ink-2 and outlined; "after" values are always ink on or beside a signal fill. The colour grammar is the before/after grammar, site-wide.

---

## 3. Type

**Two families, both OFL on Google Fonts, both variable, self-hosted via `next/font/google`:**

1. **Archivo** (wght 100–900, **wdth 62–125**): everything that is words or display numerals.
2. **Martian Mono** (wght 100–800, wdth 75–112.5): data cells only: n/method, deltas, source filenames, config values like `SUBAGENT_CAP = 5`. It is never used for uppercase eyebrows or nav.

**The width axis is the system.** One family, three widths, each with a job:

| Width | Setting | Used for |
|---|---|---|
| **Expanded** | `wdth 125`, wght 800 | identity: the hero name, case-study titles in the work list, the footer CTA |
| **Normal** | `wdth 100`, wght 400/500/600 | reading: body, ledes, nav, buttons, FAQ |
| **Condensed** | `wdth 62`, wght 700, `tabular-nums` | measurement: every large numeral (to-scale values, ledger "after" column) |

Rule of thumb for implementers: *wide means who, condensed means how much.*

**Scale:** perfect fourth, **ratio 1.333**, base 16px, with two named display breaks above the scale.

| Step | px (desktop) | px (390) | Line-height | Tracking | Use |
|---|---|---|---|---|---|
| −1 | 12 | 12 | 1.4 | +0.01em | Martian Mono data cells, table captions' legend |
| 0 | 16 | 16 | 1.6 | 0 | small body, footer columns, form help |
| 1 | 21.33 | 18 | 1.55 | 0 | body copy, case-study prose, ledes (max 68ch) |
| 2 | 28.43 | 24 | 1.25 | −0.01em | H3, FAQ questions, descriptor span in the H1 |
| 3 | 37.9 | 30 | 1.15 | −0.015em | H2 |
| 4 | 50.52 | 36 | 1.05 | −0.02em | page-intro H1, ledger "after" base |
| 5 | 67.34 | 40 | 1.0 | −0.025em | work-list titles (expanded) |
| 6 | 89.76 | 48 | 0.95 | −0.03em | case-study H1 name segment |
| Display A | `clamp(56px, 7.4vw, 112px)` | 56 | 0.92 | −0.035em | hero name (expanded, 800) |
| Display B | `clamp(96px, 12.2vw, 176px)` | 96 | 0.85 | −0.04em | to-scale "before" numeral (condensed, 700) |
| Footer | `clamp(64px, 14vw, 216px)` | 64 | 0.9 | −0.04em | footer CTA (expanded, 850) |

- Minimum rendered text is 12px, and only in Martian Mono data cells; body never goes below 16px.
- Sizes are in `rem` with `clamp()`, so browser zoom and text resize work (no noth-style `html{font-size:1vw}` lock, which risks WCAG 1.4.4).
- Emphasis inside a line uses weight within Archivo, never a second family and never italics in display.
- No uppercase tracked eyebrows. Section headings stand alone. Where a section needs a label, the wireframe's plain `<caption>` or H2 does the job.

---

## 4. Grid and spacing

- **12 columns** from 1024px; **8 columns** 640–1023px; **4 columns** below 640px.
- Gutters: 24px (desktop), 20px (tablet), 16px (mobile).
- Side margins: `clamp(20px, 4.4vw, 64px)` (20px at 390, 64px at 1440). Max content width 1600px, centred.
- **Spacing scale (8-based):** 4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96 · 128 · 192.
- Section rhythm: 128px between home sections at desktop, 80px at 390. Case-study body blocks 96px / 64px.
- **Asymmetry rule:** content columns never centre. Reading columns start at column 1 or column 5 and run 7 or 8 columns wide; the right edge is where plates and figures live. Plates may **bleed to the right viewport edge** (they break the margin, never the left one), which is B's compositional signature.
- **Radius:** 2px on every surface and control (plates, buttons, inputs, tiles, the probe readout). One value, no pills, no 12px cards. It reads as machined metal, not SaaS.
- **Borders:** 1px ink for anything interactive or any signal plate; 1px rule hairline only between ledger rows (bottom border only, never top and bottom).
- Nav height: 64px desktop, 56px mobile. Single line at 1024px and up.
- Tap targets ≥ 44px; ledger source links on mobile are full-width 48px rows.

---

## 5. Hero concept (per WIREFRAMES `/` §2, `hero-oversized-type-split`)

```
1440                                                              │ bleed →
┌──────────────────────────────────────────────┬──────────────────┴──────────┐
│ nav: Arnav Khandelwal     Work  About  GitHub↗          [ Contact Arnav ]  │
├──────────────────────────────────────────────┬─────────────────────────────┤
│  ARNAV                    (Display A, wdth   │ ┌ signal plate, 1px ink ───── │
│  KHANDELWAL                125, 800; set in  │ │ Mean latency. Edge Node,    │
│  Backend & AI engineer,    sentence case,    │ │ backend internship 2026     │
│  MNIT Jaipur     (step 2, part of the H1)    │ │                             │
│                                              │ │ 5.36 s          (176px,     │
│  I build backends and AI pipelines that are  │ │                 ink-2,      │
│  fast, auditable and honest about their      │ │                 condensed)  │
│  numbers.                        (step 1)    │ │ → 0.97 s  (32px, ink, 700)  │
│                                              │ │ ▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇ before    │
│  [ Contact Arnav ]  See the measured work    │ │ ▇▇▇ after (to-scale bars)   │
│                                              │ │ −82%  5.5× faster   (mono)  │
│  cols 1–7                                    │ │ n=50, 0 failed · committed  │
│                                              │ │ benchmark                   │
│                                              │ │ Source: benchmark_report.md↗│
│                                              │ │ Numeral heights are to scale│
│                                              │ └ cols 8–12 + right bleed ─── │
└──────────────────────────────────────────────┴─────────────────────────────┘
```

(The name is shown in capitals above only for sketch legibility; it is set in sentence case, "Arnav Khandelwal".)

- **Left, cols 1–7:** H1 = name (Display A, Archivo wdth 125 / 800, two lines) + descriptor span "Backend & AI engineer, MNIT Jaipur" (step 2, wdth 100 / 500, ink-2) inside the same `<h1>`. Subline is the G1 positioning line at step 1, max 44ch. CTAs: primary "Contact Arnav" (ink fill, paper label, 2px radius, 48px tall) and the quiet secondary "See the measured work" as an underlined text link. Hero top padding 64px at 1440, well under the 96px cap.
- **Right, cols 8–12, bleeding to the viewport edge:** the **signal plate**, which *is* the wireframe's single `new:metric-ledger` row. It is a real one-row `<table>` with a `<caption>` so the semantics match the full ledger.
  - Line 1 (step 0, ink-2): "Mean latency. Edge Node, backend internship 2026" (Dehurdle added only with consent). The metric name links to `/work/edge-node`.
  - Line 2: **before** "5.36 s" at Display B, condensed 700, ink-2, with a visually hidden "reduced from".
  - Line 3: **after** "0.97 s" at the to-scale size (32px at desktop, 17.4px at 390 where Display B is 96px), condensed 700, ink, preceded by a "→" glyph that is `aria-hidden` and backed by visually hidden "to".
  - Line 4: two to-scale CSS bars, `aria-hidden`: before = 1px ink outline, full plate width; after = ink fill at 18.17% width. Widths come from the data ratio at build time.
  - Line 5 (Martian Mono, step −1, ink): "−82%  5.5× faster" (computed at build, never typed).
  - Line 6 (Martian Mono, step −1, ink-2): "n=50, 0 failed" and the source-type tag "committed benchmark".
  - Line 7: the source link "Source: benchmark_report.md" with the external marker, a separate focusable target, opening in a new tab. No nested links, no row-wide click.
  - Footer line (step −1, ink-2): "Numeral heights are to scale."
- **How the evidence reads:** in under a second the eye gets *big grey number → small black number*, the delta, then n and the source. The order on the plate follows PlanetScale's "conditions before claim" in miniature: what was measured, the result, how many samples, where it came from. Nothing on the plate is decoration; every mark maps to `content/evidence/edge-node.json`.
- **Mobile (390):** H1 (56px, two lines) → descriptor → subline → full-width "Contact Arnav" button (the secondary link sits under it) → the plate, full-bleed to both edges with 20px inner padding, stacked per the wireframe's record layout: metric, before (96px) → after (17.4px), delta, n/method + tag, then the source link as a 48px full-width row. H1 through CTA fits in the first 844px viewport; the plate starts just below it. No media, no reveal.
- **LCP:** the H1 text. It paints from SSR HTML with no opacity or transform start; fonts use `display: swap` with `adjustFontFallback`. Display B is also text, so whichever wins LCP is text.

### Home ledger (`/` §3) in this direction
- A full-width `<table>`, not cards. Columns at desktop: metric (cols 1–3, step 1 link to the case), before (cols 4–5, condensed, ink-2), after (cols 6–8, condensed, **to scale against a per-row base of 50.52px (step 4)** with the 16px floor), delta (col 9, mono), n / method (cols 10–11, mono, ink-2, "n not reported" shown literally), source (col 12, link + tag).
- Rows without a before value render the after at the step-4 base and are marked "single value", not scaled.
- Row separator: a 1px rule bottom border. The row under the pointer or focus gets a paper-2 fill (180ms).
- Caption: "Measured results. Each one links to its source." (The wireframe's em-dash is replaced with a period to meet the copy rules.)
- Legend footer: the three source types, one line each, step 0.
- Mobile: the wireframe's stacked record, with the after value scaled against a 48px base.

### Rest of the page, briefly (so the critic can judge the whole system)
- **Selected work (`#work`):** six full-width rows with the title in Archivo expanded at step 5. The hover preview is **docked, not cursor-following**: it lives in cols 9–12, and on row hover/focus it translates vertically to align with that row (240ms, house curve). This keeps the page to one signature interaction and avoids a second novelty. Touch: inline disclosure as wireframed.
- **More-work teaser:** one sentence with the six group names inline as underlined text links, not pill chips (pills would bring a second radius).
- **Bio teaser:** prose in cols 1–7; the fact `<dl>` in cols 9–12 on paper-2.
- **FAQ:** H3 at step 2, answer at step 1, always expanded, reading column cols 1–8.
- **Footer:** a signal block that bleeds to both viewport edges (the only full-bleed yellow on the page, bookending the hero plate). The CTA is set in Archivo expanded at the Footer size, ink on signal (12.13:1). Columns below it on paper.
  - **Copy flag for the critic:** the wireframe pairs a hero "Contact Arnav" with a footer "Let's talk". The taste rules ban two labels for one intent, so B uses **"Contact Arnav"** in the nav, hero and footer. On `/contact` the footer becomes "See the work", as wireframed.

### Case-study header in this direction
- H1 at step 6 (name segment, expanded) + the descriptor at step 3 inside the same H1. The Result section opens with the case's headline row set to scale on a signal plate that bleeds right, the same component as the hero.

---

## 6. Motion language

**House curve (one, site-wide):** `cubic-bezier(0.2, 0, 0, 1)`, a fast-start, long-settle curve with no overshoot. No springs with bounce anywhere (preferences: no bouncing). Colour changes use `linear` at 120ms.

| Token | Duration | Use |
|---|---|---|
| `--dur-snap` | 120ms | probe snap between marks, colour/fill changes |
| `--dur-ui` | 180ms | hover and focus fills, button press (`scale(0.98)`), link underline `scaleX` |
| `--dur-move` | 240ms | docked work preview sliding between rows, nav overlay links (40ms stagger) |
| `--dur-panel` | 320ms | nav overlay open/close (translateY), disclosures (opacity + translateY 8px on the content; height snaps) |
| `--dur-reveal` | 480ms | below-the-fold section reveals: opacity 0→1 + translateY 16px→0, 40ms row stagger, once |
| `--dur-drop` | 900ms | the one load moment (below) |

- Animate **transform and opacity only.** Height changes on disclosures are instant; only the content inside fades and moves.
- Reveals run only on sections that can never sit in the first viewport, and only under a `.js` class set before paint, so no-JS and crawlers see everything.

**The one orchestrated load moment: "the drop."** After fonts are ready, the hero plate's *after* bar (aria-hidden) starts at the before bar's length and settles to its real 18.17% width over 900ms on the house curve, 150ms after first paint. It shows the fix happening once. The numerals never move and never change value; the bar is decorative and the true values are already on screen. It runs once per session (sessionStorage flag).

**Signature interaction: "Probe"**
- **Where:** every `new:evidence-figure` in `diagram` state (latency bar pairs and distribution strip on Edge Node, the 30-cell and 60-run grids on GhostCursor, the 77-cell grid on LedgerBridge, the log-scale pairs on NeuroUX) and the hero plate's two bars.
- **What it does:** moving a pointer over a figure shows a 1px vertical ink line (signal on dark) that **snaps to the nearest real data mark**, never to a pixel in between. A small readout plate (signal fill, ink text, 2px radius, 1px ink outline) sits at the top of the line and shows that mark's value, n/method and source tag, e.g. "P95 1.080 s. n=50. committed benchmark". On grids, the probe snaps cell to cell and reads "Case 14 of 30: correct". It never interpolates, never estimates, and never shows a value that isn't in `content/evidence/<slug>.json`.
- **Keyboard:** the figure is a focusable `role="group"` with `aria-roledescription="interactive chart"` and a label. ←/→ steps marks, Home/End jump to first/last, Esc blurs. The readout mirrors to a visually hidden `aria-live="polite"` region, debounced to 250ms.
- **Touch:** tap a mark to pin the probe; tap outside to clear. No hover dependency.
- **Motion:** the line and readout move with `transform: translateX()` at 120ms on the house curve. Reduced motion: they jump instantly.
- **Loading (after LCP, never blocking it):**
  - The SSR figure is complete without JS: direct labels on marks, the `<title>`/`<desc>`, and the "Show data" `<details>` table from the wireframe.
  - A ~4 KB (gzip target) vanilla TypeScript island, no Motion/GSAP/D3. It is imported with `next/dynamic` (`ssr: false`) and mounted only when an `IntersectionObserver` (rootMargin 200px) sees a figure **and** `requestIdleCallback` has fired after the `load` event.
  - The hero plate's probe mounts on first `pointerenter`/`focusin` of the plate, so no probe code is in the critical path of the first viewport.
  - Pointer positions are written to CSS custom properties via `requestAnimationFrame`; no React state per frame.
- **Why it's the right signature:** it is the site's argument turned into a gesture. Reading a value off an instrument is exact, and the probe refuses to show anything the source doesn't contain.

**Reduced motion (`prefers-reduced-motion: reduce`):** the drop is skipped (bars render at final width); reveals are off (content visible); overlay, disclosures and docked preview switch instantly; the probe still works but jumps without transition; `scroll-behavior: smooth` applies only under `no-preference`.

---

## 7. Risks

**Performance**
- *Two variable fonts with a width axis* are larger than static cuts. Mitigation: subset Latin only, preload Archivo only (Martian Mono is below the fold except for the plate's small lines, which may swap), and request just the axis ranges used (Archivo wdth 62–125 / wght 400–850; Martian Mono wght 400–600, default width). Budget: ≤ 110 KB fonts total, measured at S5.
- *Display B at 176px* can become the LCP element instead of the H1. It's text, so that's fine for LCP timing, but a font swap at that size causes a visible reflow. Mitigation: `adjustFontFallback`, `size-adjust` metrics on the fallback, and fixed plate dimensions so CLS stays under 0.1.
- *The drop* runs during the load window. It is transform-only on a single aria-hidden element, but check it on a throttled Moto G profile; if it costs TBT, cut it before the probe.
- *The probe island* must stay under 5 KB gzipped and must not pull in Motion. If the frontend wants Motion for the overlay and preview, that bundle is route-shared, so keep it out of the first viewport's critical path.

**Accessibility**
- *To-scale numerals* could shrink an after value below legible size; the 16px floor plus the "not to scale" caption handles it. The value is also in real text at a readable size in the table's accessible name.
- *Yellow* is unusable as text on paper (1.36:1). The contract: yellow is only ever a fill behind ink text, or a line on dark. Lint for `color: var(--signal)` on light surfaces.
- *Width-axis extremes*: wdth 62 condensed digits at small sizes hurt legibility. Condensed is only allowed at step 4 and above; below that, numerals use normal width with `tabular-nums`.
- *Expanded name at 390px*: "Khandelwal" at wdth 125 / 56px is about 380px wide. If it overflows at 360px, drop to wdth 112 below 400px rather than shrinking the size.
- *Probe*: must not trap focus, must announce politely, and must never be the only way to get a value (the table and labels are always there).
- *Docked preview* is `aria-hidden` and decorative; the row itself carries the link and all text.
- *Dark mode* flips to near-black with a yellow accent, which drifts toward the "dark + one bright accent" AI default. It's only the system-preference variant; the light theme is canonical and is what the OG image and screenshots use.

**Brand and taste**
- A big yellow plate can read as "construction / warning" rather than "instrument". Mitigation: the plate always carries data, never a slogan, and there are exactly two yellow areas per page (the hero or Result plate, and the footer), plus probe readouts on interaction.
- Loud type plus colour blocking pushes against "calm". B deliberately spends boldness on scale and one colour and keeps motion quiet; the critic may want A's calmer body type with B's plate and probe.
- Proportional type only works for before/after pairs; six of the home rows are single-value or fact rows. The hero and the Edge Node and NeuroUX case headers carry the effect; elsewhere the system has to hold up on typography alone.

## Pre-flight (taste-skill §14, applied to this direction)
- One accent, one radius (2px), one theme per scheme, one marquee (none), zero em-dashes in proposed copy, no eyebrows, no scroll cues, no locale strip until the owner confirms, no decorative dots, no fake numbers (every numeral comes from `content/evidence/*`), no skill bars, no cursor replacement (the probe is scoped to figures and keeps the system cursor).
