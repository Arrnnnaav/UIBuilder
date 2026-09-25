# Direction A: restrained / premium-minimal

> design-director, S3, direction fork A, 2026-09-25. Inputs read: PRODUCT.md (with G1 decisions), INSPIRATION.md, REFERENCE_BREAKDOWN.md, WIREFRAMES.md, IA.md, `brain/preferences.md`, `pipelines/portfolio/DESIGN.base.md`. No other direction was read.
> Skills loaded: frontend-design, taste-skill, web-design-guidelines.

**Design read:** a developer portfolio for recruiters and engineering managers hiring backend/AI engineers. The language is a calibrated instrument: porcelain and graphite, one cobalt ink that marks only measured outcomes, and a single physical motion that shows a number getting smaller. It leans toward Tailwind v4 tokens, one self-hosted grotesk and a code mono, and near-static motion.

**Dials (taste-skill):** `DESIGN_VARIANCE 5` · `MOTION_INTENSITY 3` · `VISUAL_DENSITY 4`. This is deliberately below the developer-portfolio preset (6/5/4). In lane A, the evidence does the persuading and the chrome stays out of the way.

---

## 1. Mood and signature hook

**Mood:** calibrated, quiet, exact.

**Signature hook: "the retract".** Every before → after row in the metric-ledger carries a pair of proportional bars drawn from the data. On first view, the graphite *before* bar retracts along its length until it matches the cobalt *after* bar, so a reduction reads as a physical shortening. Edge Node's 5.356 s shrinks to 0.973 s, 18.2% of its original length, in 720 ms. The numbers themselves never move; the value in the HTML is the value, as the wireframe requires. Only the `aria-hidden` bar moves, using `transform: scaleX()` alone.

It shows up in three places, always with the same grammar:
1. The hero specimen row (Edge Node mean latency). It runs once, after first paint.
2. The home "measured results" ledger. Each before/after row retracts when the table enters the viewport, 60 ms apart.
3. Each case study's Result ledger.

Single-value and fact rows have no bars, so they never retract. The hook appears only where a real before and after exist, which makes it an honesty signal as well as an animation.

Why this suits A: all the site's boldness goes into one moment, and that moment *is* the product claim ("fast, auditable, honest about their numbers"). Everything else stays still.

---

## 2. Palette (OKLCH; sRGB hex for reference)

One theme family, cool neutral. There is exactly **one accent**, and it is reserved for *measured outcomes*: the "after" value, the delta, the after-bar, and the focus ring. Links, CTAs and headings are never cobalt. The primary CTA is graphite, which makes blue mean "this is a result" everywhere on the site.

Dark mode follows `prefers-color-scheme`, with no toggle, so each page is locked to one theme.

### Light (default)
| Token | OKLCH | Hex | Role |
|---|---|---|---|
| `--bg` porcelain | `oklch(0.985 0.003 250)` | #f9fafc | page |
| `--surface` | `oklch(0.962 0.004 250)` | #f0f3f5 | ledger header row, tiles, inputs, code chips |
| `--ink` graphite | `oklch(0.21 0.012 255)` | #15191e | text, primary CTA fill |
| `--muted` | `oklch(0.47 0.012 255)` | #565b62 | secondary text, captions, n/method, tags |
| `--rule` | `oklch(0.885 0.006 255)` | #d6d9dd | ledger row separators only (decorative) |
| `--border` | `oklch(0.60 0.01 255)` | #7c8186 | input borders, before-bar outline (UI boundary) |
| `--accent` cobalt | `oklch(0.49 0.165 258)` | #155cbb | after value, delta, after-bar, focus ring |
| `--bar-before` | `oklch(0.83 0.008 255)` | #c4c8cc | before-bar fill (always paired with a 1px `--border` outline) |
| `--error` | `oklch(0.52 0.17 27)` | #b6322d | form errors only (semantic state, not a second accent) |

### Dark (`prefers-color-scheme: dark`)
| Token | OKLCH | Hex |
|---|---|---|
| `--bg` | `oklch(0.185 0.01 255)` | #101317 |
| `--surface` | `oklch(0.225 0.011 255)` | #181c21 |
| `--ink` | `oklch(0.95 0.004 250)` | #eceff1 |
| `--muted` | `oklch(0.74 0.01 255)` | #a7abb1 |
| `--rule` | `oklch(0.32 0.01 255)` | #2f3338 |
| `--border` | `oklch(0.54 0.012 255)` | #6a6f76 |
| `--accent` | `oklch(0.77 0.115 255)` | #81b7fc |
| `--bar-before` | `oklch(0.38 0.01 255)` | #3f4348 |
| `--error` | `oklch(0.74 0.14 27)` | #f6857a |

All values were checked in sRGB gamut. Ratios were computed with the WCAG 2.x relative-luminance formula from the OKLCH→sRGB conversion (script run 2026-09-25).

### Contrast, every text/background pair
| Pair | Light | Dark | Requirement | Pass |
|---|---|---|---|---|
| ink on bg | **16.97:1** | **16.11:1** | 4.5 | yes |
| ink on surface | 15.87:1 | 14.78:1 | 4.5 | yes |
| muted on bg | 6.53:1 | 8.08:1 | 4.5 | yes |
| muted on surface | 6.11:1 | 7.42:1 | 4.5 | yes |
| accent on bg (after value, delta) | 6.13:1 | 9.00:1 | 4.5 | yes |
| accent on surface | 5.73:1 | 8.26:1 | 4.5 | yes |
| bg on ink (primary CTA label, light: porcelain on graphite) | 16.97:1 | 16.11:1 | 4.5 | yes |
| on-accent (bg colour) on accent, reserved for a selected toggle state | 6.13:1 | 9.00:1 | 4.5 | yes |
| error on bg | 5.75:1 | 7.62:1 | 4.5 | yes |
| **Non-text (WCAG 1.4.11)** | | | | |
| border on bg (inputs, before-bar outline) | 3.78:1 | 3.69:1 | 3.0 | yes |
| accent focus ring on bg | 6.13:1 | 9.00:1 | 3.0 | yes |
| accent after-bar on bar-before fill | 3.79:1 | 4.83:1 | 3.0 | yes |
| bar-before fill on bg | 1.62:1 | 1.86:1 | n/a: the fill is decoration; the bar's boundary is carried by its `--border` outline (3.78 / 3.69) | yes |
| rule on bg | 1.35:1 | 1.47:1 | n/a: row separators are decorative; the table semantics carry the structure | yes |

**Palette checks against preferences and taste:** no gradient anywhere, no glow, and no glass. It is not the cream + terracotta default, and it is not near-black + acid accent; the dark mode is cool graphite with a soft cobalt. There are no pure `#000` or `#fff` values.

---

## 3. Typography (2 families)

| Role | Family | Source / licence | Weights | Why |
|---|---|---|---|---|
| Everything (display, UI, body, numerals) | **Switzer** (Indian Type Foundry) | Fontshare, ITF Free Font License (commercial use and self-hosting allowed). Self-hosted via `next/font/local`, variable woff2, Latin subset. | 400, 500, 600 | A neutral Swiss grotesk with calm, even figures. It doesn't read as Inter or Geist. Tabular figures (`tnum`) align the ledger columns. |
| Code only: `127.0.0.1`, `SUBAGENT_CAP = 5`, `qwen3:4b-instruct`, source file names such as `benchmark_report.md` | **Fragment Mono** | Google Fonts, OFL, via `next/font/google` | 400 | Used *only* where the content literally is code or a filename. It is **never** used for labels, eyebrows, tags or numbers, which avoids the "mono micro-label" tell. |

Neither is a reference font; the references use Neue Haas, Gravity, PP Neue Montreal, Plex Mono and Commit Mono.
**Fallback:** if the Switzer build turns out to lack `tnum` (verify with `fontkit` before the critic locks it), swap to **Geist** (Google, OFL, `tnum` confirmed). The scale stays the same.

### Scale: major third, ratio **1.25**, base 17px
Steps: 13.6 · **17** · 21.25 · 26.6 · 33.2 · 41.5 · 51.9 · 64.8 · 81.1 · 101.3

| Token | Desktop (1440) | Mobile (390) | Line-height | Tracking | Weight | Use |
|---|---|---|---|---|---|---|
| `--text-xs` | 13.6px | 13.6px | 1.45 | +0.005em | 400/500 | table header labels, source-type tags, legend (sentence case, never uppercase) |
| `--text-sm` | 15px* | 15px | 1.5 | 0 | 400 | captions, n/method, breadcrumbs |
| `--text-base` | 17px | 17px | 1.6 | 0 | 400 | body; prose max 66ch |
| `--text-lg` | 21.25px | 19px | 1.45 | -0.005em | 400 | ledes, hero subline, H1 descriptor line |
| `--text-xl` | 26.6px | 23px | 1.25 | -0.01em | 500 | H3, work-row titles |
| `--text-2xl` | 33.2px | 27px | 1.15 | -0.015em | 500 | H2 |
| `--text-3xl` | 51.9px | 33px | 1.05 | -0.02em | 500 | hero after-value, page-intro H1 |
| `--text-display` | 81.1px | 42px | 1.0 (1.05 on mobile) | -0.03em | 500 | home H1 "Arnav Khandelwal" |
| `--text-cta` | 101.3px | 48px | 0.95 | -0.035em | 500 | footer "Let's talk" (the only oversize) |

\*15px is an off-scale half step for dense secondary text. It is the only exception.
All steps are fluid with `clamp()` between the 390 and 1440 values, in `rem`, so browser zoom and text resize keep working (WCAG 1.4.4). We don't use noth's `1vw` root.
Every number in the ledgers, rails and tiles uses `font-variant-numeric: tabular-nums` with the real minus sign (U+2212) and the × sign (U+00D7).
Hierarchy comes from size and weight 400/500. 600 is reserved for the before → after pair in the hero.
There is no italic in display type. Italic 400 is used for exactly two things: the verbatim caveat quotes and "n not reported".

---

## 4. Grid and spacing

**Grid:** 12 columns at ≥1024px, 6 columns at 640–1023px, 4 columns below 640px.
| | ≥1024 | 640–1023 | <640 |
|---|---|---|---|
| Columns | 12 | 6 | 4 |
| Gutter | 24px | 20px | 16px |
| Side margin | `clamp(20px, 4.44vw, 64px)` (64 at 1440) | 32px | 20px |
| Max content width | 1312px (1440 − 2×64), centred; wider screens grow the margin only | | |

**Spacing scale (4px base):** 4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96 · 128 · 160.
- Section gap: **160px** desktop, **96px** mobile. This is the airborne/moah rhythm tightened: it sits between their 96 and 192, so the page doesn't run to 13,000px.
- Heading to body: 24px. Body to its related element (table, CTA): 32px.
- Ledger row padding: 20px vertical desktop, 16px mobile.

**Shape lock:** radius **6px** on interactive controls (buttons, inputs, the Turnstile container, work-group tiles, code chips). The ledger table and the evidence figures are **0**, because tables and charts are not cards. There are no shadows. Elevation is never used, because nothing on the site floats except the mobile nav overlay, which sits on a solid `--bg`.

**Hairline discipline:** `--rule` hairlines appear **only between metric-ledger / timeline-ledger rows** (bottom border, never top and bottom). Every other section is separated by whitespace alone, with no decorative rules or crosshairs. This keeps the ledger as the site's one "instrument" surface and stays away from the broadsheet-hairline look.

### Section layout families (home), all different
1. Hero: asymmetric split, cols 1–7 type, cols 9–12 specimen row.
2. Measured results: full-width table.
3. Selected work: full-width index rows, with the preview slot fixed in cols 9–12.
4. More work: a single sentence-line with inline chips.
5. Bio teaser: prose cols 1–6, `<dl>` facts cols 8–12.
6. FAQ: single column cols 1–8, questions and answers stacked (no split header).
7. Footer: oversize CTA, then 3 link columns.

### Case study layout
Header across cols 1–9. Prose in cols 1–7 (about 68ch at 17px). The **meta rail** sits in cols 9–12, `position: sticky; top: 96px`. Ledgers and figures break out to cols 1–12. Mobile: the rail becomes a summary block after the header, with Outcome first (per wireframe).

---

## 5. Hero concept (`hero-oversized-type-split`, per wireframe)

```
1440 ────────────────────────────────────────────────────────────────────────────
 Arnav Khandelwal                                   Work  About  GitHub↗ [Contact]   72px bar
                                                                                    pt 96
 Arnav Khandelwal                                  │  Mean latency, Edge Node
 Backend & AI engineer, MNIT Jaipur                │  5.356 s → 0.973 s
                                                   │  ▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭  (before, retracts)
 I build backends and AI pipelines that are      │  ▬▬▬▬                      (after)
 fast, auditable and honest about their numbers. │  −82%   5.5× faster
                                                   │  n=50 requests, 0 failed
 [ Contact Arnav ]   See the measured work         │  Committed benchmark
                                                   │  benchmark_report.md ↗
 cols 1–7                                           cols 9–12, bottom-aligned to CTA row
```
(The `│` shows the column split only; it is not a drawn rule.)

- **H1**, one element in two parts. "Arnav Khandelwal" is set at `--text-display`, 81px/500/−0.03em, in `--ink`. The descriptor "Backend & AI engineer, MNIT Jaipur" follows as a `<span>` block inside the H1 at `--text-lg`/400 in `--muted`. It is part of the H1 for disambiguation, but visually it is a quiet second line. The H1 is the LCP element and **does not animate**.
- **Subline** (the G1 positioning line): `--text-lg`, `--ink`, max 44ch, 24px below the H1.
- **CTAs:** primary "Contact Arnav" is a 48px-high button, graphite fill with porcelain label (16.97:1), 6px radius, and no arrow glyph. Secondary "See the measured work" → `#work` is a text link in ink with a 1px underline at 0.2em offset. Both sit on one line, 32px below the subline.
- **Specimen row (the offset asset)** is a single-row `<table>` (the `new:metric-ledger` hero variant), bottom-aligned with the CTA row so the eye travels from the claim to the proof:
  - Line 1: "Mean latency, Edge Node" (`--text-sm`/500, `--ink`; it links to `/work/edge-node`). Under it sits the credit "Backend internship, 2026" in `--muted`, plus "at Dehurdle" only with consent.
  - Line 2: the before → after pair at `--text-3xl`. Before "5.356 s" is in `--muted`/400. The → glyph is `aria-hidden`, with a visually hidden "reduced from 5.356 s to 0.973 s". After "0.973 s" is in `--accent`/600. The full-precision data values are shown, not the rounded "5.36 → 0.97" in the wireframe prose, because the ledger shows what the source says.
  - Line 3: the retract bars. They are 8px tall and span the column (about 312px). Before is `--bar-before` with a 1px `--border` outline; after is `--accent` at 18.17% of the width. There is a 4px gap between them. Both are `aria-hidden`.
  - Line 4: the delta "−82%" and "5.5× faster", both computed at build time, in `--accent` at `--text-lg`/500 with tabular numerals.
  - Line 5: "n=50 requests, 0 failed" in `--muted` `--text-sm`, then the source-type tag "Committed benchmark", then the source link `benchmark_report.md` (Fragment Mono, `--text-sm`, underlined, with an external marker ↗ that has a visually hidden label "opens GitHub in a new tab").
- **How the ledger evidence reads.** Top to bottom, the row answers *what* was measured, *how much it changed*, *how big that is* (the bars, then the delta), *how it was measured*, and *where to check it*. That is PlanetScale's "method before number" compressed into one row, with the method line directly under the delta so it can't be missed. Colour carries meaning: blue always means "the measured result". Provenance strength shows in type, not colour: "Committed benchmark" is `--ink`/500, "README" is `--muted`/400, and "Résumé-attested" is `--muted` italic. The legend in the ledger footer spells this out in one line. "n not reported" is printed in `--muted` italic in the n/method cell instead of being left blank.
- **Top padding:** 96px (the taste cap). The whole hero fits in 900px of height at 1440.

**Mobile (390):** a single column in the wireframe order: H1 (42px, the name wraps to 2 lines if needed; descriptor 19px) → subline → CTA (full-width primary, secondary text link below it) → specimen row as a stacked record. The record is: metric name; before → after at 33px; bars across 350px; delta; n/method + tag; then the source link as a full-width 44px row. The H1 through the CTA fit in the first 844px viewport. The specimen starts at or just below the fold. **No hero motion runs on mobile before interaction, except the retract, and only once the specimen is in view.**

---

## 6. Motion language

**Character:** instrument-like. Motion only ever reports a change: a value shrinking, a panel opening, a preview moving to the hovered row. Nothing loops, bounces or springs. Every animation changes `transform` or `opacity` only.

**One house curve:** `--ease-settle: cubic-bezier(0.2, 0, 0, 1)`. It is a fast start and a long, flat settle with no overshoot. Enter and exit use the same curve, with exits at 70% of the duration.
Hover affordances apply only under `@media (hover: hover) and (pointer: fine)`.

| Token | Duration | Use |
|---|---|---|
| `--dur-press` | 120ms | button `:active` `scale(0.98)` |
| `--dur-hover` | 180ms | underline colour, preview crossfade (opacity) |
| `--dur-state` | 240ms | disclosure/`<details>` content (opacity + translateY 4px), preview slot translateY, nav overlay (opacity + translateY 8px), topology toggle crossfade |
| `--dur-reveal` | 480ms | below-fold section reveal: opacity 0→1 + translateY 12px→0, once, at 20% visibility, whole section wrapper only (never per row) |
| `--dur-retract` | **720ms** | the signature: before-bar `scaleX(1 → after/before)` with `transform-origin: left` |
| `--stagger-row` | 60ms | retract stagger between ledger rows (max 6 rows, so ≤ 300ms of total offset) |
| `--stagger-nav` | 30ms | mobile overlay links (under the wireframe's ≤40ms) |

**Signature interaction, specified:**
- The ratio is `after / before`, computed at build time and written as `style="--ratio:0.1817"`. CSS: `.bar-before { transform: scaleX(var(--from,1)); transition: transform var(--dur-retract) var(--ease-settle); } [data-settled] .bar-before { --from: var(--ratio); }`.
- An IntersectionObserver (`threshold: 0.5`, one observer per ledger, disconnected after firing) adds `data-settled`. For the hero it fires on the first `requestAnimationFrame` after hydration, so the move starts after the LCP paint. No scroll listeners.
- **SSR / no-JS state:** the bars render *settled* (`--from: var(--ratio)`), and JS resets them to 1 only if the row is still off-screen at hydration. As a result, no-JS users, crawlers and slow devices always see the correct final proportion. For rows already in view at hydration (the hero), JS sets `--from:1` without transition, then settles on the next frame.
- **Reduced motion:** there is no retract. The bars render settled, and the before-bar keeps its full-length outline as a dashed 1px `--border` ghost behind the after-bar, so the proportion is still visible without movement.

**Work index preview (`work-grid-hover-reveal`, A's calmer variant):** the evidence-figure thumbnail does **not** follow the cursor. It lives in a fixed 4-column slot (cols 9–12, 4:3). On row hover or focus, the slot moves on `translateY` to align with the active row (240ms settle), and the thumbnail crossfades (180ms). Keyboard focus triggers the same behaviour, so it isn't a mouse-only reveal. Under reduced motion the slot stays at the top of the list and swaps its image instantly. On touch, per the wireframe, there is no preview and rows expand inline.

**Explicitly not used in A:** the H1 line stagger (the wireframe allows it, but A keeps the LCP element still), count-up or odometer numerals, Lenis or smooth-scroll hijack, marquees (the footer CTA is static type), parallax, and magnetic buttons.

---

## 7. Component notes the critic may want to keep

- **Metric-ledger table (desktop):** columns are Metric (cols 1–3) · Before (2) · After (2) · Change (2) · n / method (2) · Source (1). Header row on `--surface`, `--text-xs`/500, sentence case. Numerals are right-aligned in their cells so decimals line up. The retract bars sit on a second line inside the Before/After span. The caption uses a period, not a dash: "Measured results. Each one links to its source." (The wireframe's caption contains an em dash, and the taste pre-flight bans em dashes in visible copy.)
- **Evidence-figure SVG charts:** `--ink` axes at 1px and `--muted` tick labels at `--text-xs`. Series are distinguished by fill vs. outline (after = solid `--accent`, before = `--bar-before` fill + `--border` outline), the same grammar as the retract bars, so charts and ledgers read as one system. Captions sit below in `--muted` and name the source file in Fragment Mono.
- **Footer CTA:** "Let's talk" at `--text-cta` in `--ink`, underline on hover (180ms colour change to `--accent` on the underline only). It is the page's one oversize moment in type, and it doesn't move.
- **Chips in "More work":** `--surface` fill, 6px radius, `--text-sm`, no border. They are the only filled small elements on the page.

---

## 8. Risks

| Risk | Area | Mitigation |
|---|---|---|
| Restraint reads as "plain" or templated to a reviewer who wants "$$$$" (preferences) | taste | All boldness sits in the 81px name, the 101px footer CTA and the retract. Asymmetric hero, wide tracking contrast (−0.03em display vs. 0 body), and a strict accent rule. The critic may borrow a stronger layout gesture from another direction without breaking A's colour and motion rules. |
| Cobalt accent could read as "SaaS blue" | taste | Blue never appears on buttons, links, headings or backgrounds, only on measured values and focus. No gradients or glow. |
| Switzer `tnum` support unverified | build | Verify with `fontkit` before lock. The Geist fallback is specified with the same scale. |
| Fontshare fonts can't come through `next/font/google` | build/perf | Self-host 1 variable woff2, Latin subset (target ≤ 45 KB), via `next/font/local` with `adjustFontFallback`, so fallback metrics hold CLS < 0.01. Fragment Mono via `next/font/google`, `display: swap`, `preload: false` (it is never above the fold except the hero source link, where a swap is acceptable). |
| Retract animation vs. LCP / CLS | perf | The H1 is LCP and static. The bars are `transform`-only on fixed-size boxes (0 CLS). The observer is ~0.5 KB, inside one client leaf; the ledger itself stays a Server Component. |
| Bars carry meaning for sighted users while being `aria-hidden` | a11y | The same information is in text: before, after, delta, plus a visually hidden "reduced from X to Y". The bars are strictly supplementary. The non-text contrast of the bar edges is ≥ 3:1 (table above). |
| Row separators at 1.35:1 | a11y | Decorative. Structure comes from `<table>`, `scope` and the caption. Inputs use `--border` (3.78:1), not `--rule`. |
| Colour-only meaning | a11y | Source types are distinguished by text and weight, not colour. Before vs. after is labelled in text as well as colour. The error state has an icon and text, not red alone. |
| Sticky preview slot on hover | a11y | Mirrored on `:focus-visible`. Hidden from the accessibility tree (the row already contains the same information). Disabled on touch and coarse pointers. |
| Focus visibility | a11y | 2px `--accent` outline, 3px offset, on every interactive element: 6.13:1 in light, 9.00:1 in dark. It never gets `outline: none` without a replacement. |
| Dark mode drift | QA | Both schemes are specified above with measured ratios. Visual snapshots should cover both at 390 and 1440. |
| 101px footer CTA overflows at mid widths | layout | Use `clamp(48px, 7vw, 101.3px)` with `white-space: nowrap` on each word (the 2 words may break onto 2 lines, never mid-word). Check at 768 and 1024. |
