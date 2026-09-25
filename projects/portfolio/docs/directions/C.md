# Direction C: "The Technical Report"

> design-director, S3 Design Council, fork C (editorial / studio / typographic). Written 2026-09-25 in isolation: directions A and B were not read.
> Inputs: PRODUCT.md (with the G1 decisions), INSPIRATION.md, REFERENCE_BREAKDOWN.md, WIREFRAMES.md, IA.md, brain/preferences.md, pipelines/portfolio/DESIGN.base.md.
> Skills loaded: frontend-design, taste-skill, web-design-guidelines.

**Design read:** a developer portfolio for recruiters and engineering managers, written as a published engineering report. Claims are typeset like findings in a journal paper, with tables, figures and citations, and every number resolves to a source file.

**Dials (taste-skill):** DESIGN_VARIANCE 6, MOTION_INTENSITY 3, VISUAL_DENSITY 5. The variance is held back because a report is asymmetric by convention (margin apparatus) rather than by effect. Motion is deliberately low: print does not move, so the few moments that do move carry meaning.

---

## 1. Mood and signature hook

**Mood:** cited, typeset, unhurried.

**Signature hook: "every number is a citation."** Every measured value on the site is set in the monospace figure face and followed by a superscript citation marker `[n]`. The marker resolves to a numbered **Sources** entry: the file, n, the method and the source type. On desktop the entry sits in the right-hand margin as a sidenote aligned to its line, in the Tufte manner. When you hover or focus a cited number, a **highlighter mark** sweeps behind the number and, at the same moment, behind its sidenote and its row in the ledger table. The page acts out a reviewer checking a claim against its source.

It fits the brief for three reasons:
- It is the PRODUCT differentiator ("every claim has a source") turned into the page's grammar rather than a badge.
- It echoes the owner's own Cited Multi-Agent Researcher, which returns `[N]`-cited answers. The site behaves the way his work does.
- It needs no media, no WebGL and no JS for the static state. The link, the sidenote and the `:target` style all work as plain HTML and CSS.

This is the only signature interaction on the site, per DESIGN.base.

---

## 2. Palette (oklch)

The stock is a **cool, blue-grey white paper** (deliberately not cream) with a **blue-black technical-pen ink** and a single chromatic accent, **highlighter yellow**. The yellow is only ever a *background mark* behind ink text, never text itself and never a button fill. Deltas are not coloured green or red: the report stays monochrome, and the numbers speak for themselves.

### Light scheme (default)
| Token | oklch | ≈ hex | Role |
|---|---|---|---|
| `--paper` | `oklch(0.975 0.004 240)` | `#f4f7f9` | page background |
| `--paper-sunk` | `oklch(0.945 0.006 240)` | `#e9edf0` | code spans, `<details>` bodies, form input fill |
| `--ink` | `oklch(0.22 0.02 255)` | `#141b24` | body, headings, numbers, primary button fill, booktabs rules |
| `--ink-2` | `oklch(0.46 0.015 255)` | `#535961` | secondary text, captions, axis labels, input borders |
| `--ink-3` | `oklch(0.53 0.012 255)` | `#676c73` | tertiary metadata. **Permitted on `--paper` only** |
| `--rule` | `oklch(0.80 0.008 250)` | `#babec3` | figure gridlines and decorative hairlines only (not a state or boundary indicator) |
| `--mark` | `oklch(0.92 0.17 105)` | `#f6ea4d` | highlighter: citation hover/focus, `:target`, `::selection` |

### Dark scheme ("reading lamp"; follows `prefers-color-scheme`, with no toggle in V1)
| Token | oklch | ≈ hex |
|---|---|---|
| `--paper` | `oklch(0.19 0.012 255)` | `#101419` |
| `--paper-sunk` | `oklch(0.235 0.013 255)` | `#1a1e24` |
| `--ink` | `oklch(0.93 0.006 240)` | `#e4e8eb` |
| `--ink-2` | `oklch(0.74 0.012 245)` | `#a5acb2` |
| `--ink-3` | `oklch(0.64 0.012 245)` | `#868d93` |
| `--rule` | `oklch(0.40 0.012 250)` | `#43484e` |
| `--mark` | `oklch(0.86 0.16 100)` | `#ead33f` |
| `--mark-ink` | `oklch(0.19 0.012 255)` | text colour on `--mark` in dark (flips to paper-dark) |

### Contrast ratios (WCAG 2.x, computed from the oklch values above via OKLab → linear sRGB)
| Text / foreground | Background | Ratio | Use | Verdict |
|---|---|---|---|---|
| ink | paper | **16.11:1** | body, headings, numbers | AAA |
| ink-2 | paper | **6.63:1** | captions, secondary | AA |
| ink-3 | paper | **4.91:1** | tertiary meta | AA |
| ink | paper-sunk | **14.75:1** | code, inputs | AAA |
| ink-2 | paper-sunk | **6.07:1** | helper text in inputs | AA |
| ink-3 | paper-sunk | 4.49:1 | **not allowed** (below 4.5) | fail, so banned by rule |
| ink | mark | **13.85:1** | highlighted number/sidenote | AAA |
| ink-2 | mark | **5.70:1** | highlighted caption text | AA |
| paper | ink | **16.11:1** | primary button label | AAA |
| ink-2 (non-text) | paper | **6.63:1** | input borders, chart axes (≥3:1 needed) | pass |
| ink-2 | rule | 3.81:1 | never set as text; listed for completeness | n/a |
| rule (non-text) | paper | 1.74:1 | gridlines only, **decorative** | n/a (not a state indicator) |
| mark (non-text) | paper | 1.16:1 | highlight is **supplementary**; state is also carried by a 2px ink underline/focus ring | n/a |
| *dark* ink | paper | **15.04:1** | body | AAA |
| *dark* ink-2 | paper | **8.02:1** | secondary | AAA |
| *dark* ink-3 | paper | **5.50:1** | tertiary | AA |
| *dark* ink | paper-sunk | **13.57:1** | code, inputs | AAA |
| *dark* ink-2 | paper-sunk | **7.24:1** | helper | AAA |
| *dark* ink-3 | paper-sunk | **4.96:1** | tertiary in sunk | AA |
| *dark* mark-ink | mark | **12.16:1** | highlighted text | AAA |
| *dark* paper | ink | **15.04:1** | primary button label | AAA |
| *dark* rule (non-text) | paper | 2.01:1 | decorative gridlines | n/a |

**Focus ring:** `outline: 2px solid var(--ink); outline-offset: 3px`, which is 16.11:1 (light) and 15.04:1 (dark) against paper. The highlighter is never the only focus signal.

---

## 3. Type (2 families, both free and licence-safe)

| Role | Family | Source / licence | Axes used | Why |
|---|---|---|---|---|
| Text + display | **Newsreader** (Production Type) | Google Fonts, OFL | `opsz` 6–72, `wght` 400/500/600, roman + italic | A serif drawn for on-screen reading that has a real optical-size axis. At `opsz 72` the display cut is tight and sharp; at `opsz 16` the text cut is sturdy. It reads as a *publication*, not a landing page, which is the one justification the taste-skill accepts for a serif. It is neither Fraunces nor Instrument Serif. |
| Figures + code | **Martian Mono** (Evil Martians) | Google Fonts, OFL | `wght` 400/600, `wdth` 87.5 (narrowed) | Engineered, slightly wide geometry; the `wdth` axis lets the large ledger numerals sit narrow and dense. Used **only** for numbers, units, code terms and filenames: it is the "data" voice. No reference uses it (noth's Plex Mono and elu's Commit Mono are excluded). |

**Rules**
- Mono is never used for eyebrows, nav, buttons or section labels. There are no uppercase tracked labels anywhere; labels are sentence case in Newsreader italic.
- Numerals in mono are always `font-variant-numeric: tabular-nums slashed-zero`, so ledger columns align on the decimal.
- There are no emphasised words inside headlines (no single italic word, no colour accent).
- Italic is kept for *captions* ("Table 1.", "Fig. 2.") and the H1 descriptor. It is never used for emphasis inside display type.

**Scale.** Desktop uses a **perfect fourth (1.333)** on an 18px base. Mobile uses a **minor third (1.2)** on a 17px base, and `clamp()` interpolates between 390px and 1440px.

| Step | Mobile (390) | Desktop (1440) | Use | Leading | Tracking |
|---|---|---|---|---|---|
| −2 | 12px | 12px | sidenote source-type, legal | 1.4 | 0 |
| −1 | 14px | 14px | captions, table body text, sidenotes | 1.45 | 0 |
| 0 | 17px | 18px | body (Newsreader `opsz` auto) | 1.6 | 0 |
| 1 | 20.4px | 24px | abstract/subline, lede, H3 | 1.4 | −0.005em |
| 2 | 24.5px | 32px | H2, work-index titles | 1.2 | −0.01em |
| 3 | 29.4px | 42.6px | case-study H1 | 1.1 | −0.015em |
| 4 | 35.3px | 56.8px | hero ledger numerals (Martian Mono 400, `wdth 87.5`) | 1.0 | −0.02em |
| 5 | 42.3px | 75.8px | home H1 (Newsreader 500, `opsz 72`) | 1.02 | −0.022em |
| XL | 15vw | 11vw (max 168px) | footer "Let's talk" | 0.95 | −0.03em |

- Measure: body `max-width: 64ch`; ledes `44ch`; sidenotes `28ch`.
- Font loading: `next/font/google`, `display: swap`, `subsets: ['latin', 'latin-ext']` (for "é" in résumé). Preload Newsreader roman only; italic and Martian Mono load on use. Use `adjustFontFallback` with Georgia and ui-monospace metrics so CLS stays under 0.01.

---

## 4. Grid and spacing

**Page frame (desktop ≥1280):** 12 columns, `max-width: 1440px`, **80px** side margins, **24px** gutter. The column width is about 84.7px at 1440. This takes airborne's 12/80 mechanism; the gutter is my own.

**The report page has three zones.** This is the core layout idea, used on case studies and reused (in reduced form) everywhere else.
```
| cols 1-3          | cols 4-9                     | cols 10-12        |
| front matter      | text column (64ch)           | margin apparatus  |
| (meta rail, sticky)| H2, prose, tables, figures  | sidenotes [n]     |
```
- **Front matter** (cols 1–3): the `case-study-sticky-meta` rail as a `<dl>`: Role, Dates, Stack, Outcome, Repo, Author. It is sticky at `top: 96px`.
- **Text** (cols 4–9, about 628px): prose, Table n, Fig. n. Tables and figures may **break out right** to span cols 4–12 when they need the width. The sidenotes for that block then fall below it as a numbered note list.
- **Margin** (cols 10–12): sidenotes, top-aligned to the line holding the citation marker (CSS `float`/grid-row placement with no JS measurement).

**Tablet (768–1279):** 8 columns, 40px margins, 20px gutter. The margin collapses: sidenotes become inline notes that expand below their paragraph (`<details>` style), and the front matter moves above the text as a two-column `<dl>`.

**Mobile (<768):** 4 columns, **20px** margins, 16px gutter, single column. Citation markers link to the numbered **Sources** list at the end of the case; each source has a "Back to text" link. The front matter becomes the compact summary block after the header, with Outcome first (per the wireframe).

**Spacing scale (4px base):** 4, 8, 12, 16, 24, 32, 48, 64, 96, 128.
- Paragraph gap: 16px. H2 top: 64px (mobile 48px).
- Table/figure block margin: 48px above, 32px below.
- Section gap on home: **128px** desktop / **80px** mobile.
- Nav height: 64px.
- Hero top padding: 64px desktop / 32px mobile (within the pt-24 cap).

**Shape:** radius **0** everywhere, including buttons, inputs, tiles and figures. It is one rule with no exceptions, because it is paper.

**Rules (booktabs, not broadsheet):** tables use exactly three horizontal rules: a 1.5px ink top rule, a 0.75px ink rule under the header, and a 1.5px ink bottom rule. Rows get no borders; spacing separates them (12px row padding, 20px between row groups). There are no decorative hairlines between page sections: sections separate by white space. The "newspaper hairlines everywhere" cluster is explicitly avoided.

---

## 5. Hero concept (per `/` wireframe §2, `hero-oversized-type-split`)

The hero is set as **the title page of a report**: title, author line, abstract, and one headline result shown as a table with a figure drawn to scale.

```
DESKTOP 1440 (first viewport, 900px tall)
+--------------------------------------------------------------------------------+
| Arnav Khandelwal                       Work   About   GitHub ↗    [Contact]    |  nav 64
+--------------------------------------------------------------------------------+
|                                                                                |
|  Arnav Khandelwal                                  (cols 1-7)                  |  H1 step 5, 75.8px
|  Backend & AI engineer, MNIT Jaipur                                            |  same H1, italic, step 2
|                                                                                |
|  I build backends and AI pipelines that are fast,                              |  abstract, step 1,
|  auditable and honest about their numbers.                                     |  44ch, ink-2
|                                                                                |
|  [ Contact Arnav ]   See the measured work                                     |
|                                                                                |
|                              +-----------------------------------------------+ |
|                              | Table 1. Edge Node, mean request latency.     | |  cols 7-12, caption
|                              |===============================================| |  1.5px rule
|                              | before        after          change          | |  header, 0.75 rule
|                              |-----------------------------------------------| |
|                              | 5.36 s   →    0.97 s[1]      −82%  (5.5×)    | |  mono step 4
|                              | ████████████████████████████████  (hatched)   | |  before bar, 100%
|                              | ██████                          (solid ink)   | |  after bar, 18.2%
|                              |===============================================| |  1.5px rule
|                              | n=50 requests, 0 failed. Committed benchmark. | |  step −1, ink-2
|                              | [1] benchmark_report.md ↗   Backend internship, 2026 |
|                              +-----------------------------------------------+ |
+--------------------------------------------------------------------------------+
```

- **Left block (cols 1–7):** the H1 is two lines. "Arnav Khandelwal" is in Newsreader 500 at `opsz 72`. The descriptor "Backend & AI engineer, MNIT Jaipur" sits **inside the same `<h1>`** in italic at step 2, in ink-2 (a byline, the way a paper sets its author affiliation). Below it comes the positioning line as the abstract, then the CTAs. The primary CTA is "Contact Arnav": an ink-fill rectangle with a paper label (16.11:1), 48px tall, 20px horizontal padding. The secondary, "See the measured work", is a plain underlined text link to `#work`. That is 4 text elements in total, so the taste-skill hero cap is met.
- **Right block (cols 7–12, offset 96px down so it overlaps the abstract baseline):** the **single `metric-ledger` row** as **Table 1**, the literal first table of the report.
  - The numerals are Martian Mono at step 4. "5.36 s" is in ink-2 weight 400, and "0.97 s" is in ink weight 600. The `→` carries visually hidden text: "reduced from 5.36 seconds to 0.97 seconds".
  - The delta "−82% (5.5×)" is computed at build time from 5.356 and 0.973, never typed.
  - Two **proportional CSS bars** are drawn from the data ratio: before at 100% as a 45° hatch (`repeating-linear-gradient` in ink-2), after at 18.17% as solid ink. They are `aria-hidden`. The difference is shown **by pattern, not colour** (the samwho mechanism).
  - The table foot carries n/method, the source-type ("Committed benchmark", in italic) and citation [1] → `benchmark_report.md`, which opens in a new tab with a visible ↗ marker. It also carries the credit line "Backend internship, 2026" (plus "at Dehurdle" only with consent).
  - Two separate targets, per the wireframe: the caption's "Edge Node" links to `/work/edge-node`, and [1]/source links to GitHub. There are no nested links and no row-wide handlers.
- **Mobile (390):** the order is H1 (42.3px, which wraps "Arnav / Khandelwal" onto 2 lines at most) → descriptor → abstract (20.4px) → CTA (full width, 48px) → Table 1 as a **stacked record**:
  - line 1: "Mean latency, Edge Node"
  - line 2: "5.36 s → 0.97 s" at 35.3px
  - line 3: "−82%" with bars under it at full column width
  - line 4: "n=50, 0 failed. Committed benchmark."
  - line 5: source link as a full-width 44px row

  The H1, abstract and CTA sit inside 844px; the record starts at about 560px and may run just below the fold. That is permitted by the wireframe.
- **LCP:** the H1 text. There is no image in the first viewport, and nothing starts at `opacity: 0`.

### How the metric-ledger reads (home §3 and every case "Result")
It is typeset as a **journal results table**, caption above per convention:

> *Table 2. Measured results, one per project. Each value links to its source.*

(This replaces the wireframe caption "Measured results — each links to its source", which contains an em-dash that the taste-skill bans.)

| Project (link) | Metric | Before | After / value | Change | n, method | Source [n] |
|---|---|---|---|---|---|---|
| Edge Node | P95 latency | | 1.080 s | | n=50 | [2] `benchmark_report.md` |
| LedgerBridge | Median run, 103,049 records | | 5.114 s | ≈20.1k rec/s | n=5 | [3] README |
| GhostCursor | Raw intent accuracy | | 27/30 | 90% | 0 unauthorized plans | [4] README |
| NeuroUX | Video inference | 50 min | ~80 s | computed | *n not reported* | [5] README |
| Cited Researcher | Tests and eval (fact row) | | 33 unit tests; LLM judge on 10 queries | | | [6] README |
| StudyOS | Deploy gate (fact row) | | Deploys to AWS ECS via OIDC + CI; blocked on failed test, typecheck or build | | | [7] README |

Row grammar:
- **Numbers** are mono tabular and right-aligned on the decimal.
- **Qualitative fact rows** are set in Newsreader text across the value columns, so a fact never impersonates a measurement.
- **"n not reported"** is set in italic ink-2, exactly as text. The missing value is shown as honestly as a present one.
- **Caveats** sit on their own line under the row, indented to the metric column, in italic and quoted verbatim, e.g. *"specification consistency, not real-world accuracy."*
- **Source types** are one italic word after the citation (*committed benchmark*, *README*, *résumé-attested*). A table footnote gives the one-line legend.
- `résumé-attested` rows are hidden per the G1 decision; they are kept in data as `pending-source` and render nothing.
- The optional before/after CSS bar sits in the Change column as a 64px micro-bar pair: hatched against solid, with no background track.

---

## 6. Other signature layouts (for the critic to mine)

- **Selected work as a table of contents** (`work-grid-hover-reveal`, `id="work"`): six rows in ring order. Each row sets the title (step 2, Newsreader 500), the descriptor in italic, **dot leaders** (CSS `radial-gradient` background on the flex-grow gap, `aria-hidden`), and then the headline value (mono) and month/year flush right. The sequence is real: this *is* the contents of the report, in ring order, so it carries no 01/02 numbering. **Preview (deviation from the wireframe, flagged for the critic):** instead of following the cursor, the case's `evidence-figure` **docks in the right margin (cols 10–12)** and slides only on the Y axis to align with the hovered or focused row. It is calmer and fits a report, and it also works on keyboard focus. Touch uses the wireframe's inline disclosure.
- **Case study:** three-zone report page (§4). Problem, Approach and Result are H2s. The Approach beats 01/02/03 stay numbered because they are a genuine sequence. Figures are "Fig. 1, Fig. 2", and prose cites them ("see Fig. 1"); tables are "Table 1..n". The case ends with a numbered **Sources** list that doubles as the H2 "Links" section of the wireframe.
- **More work** (`/work#more-work`): an **appendix**, "Appendix A. Further public work". The six groups are set as a two-column definition list, with no card chrome: each group name has its date range in italic and a repo count. The one headline number keeps its source's own qualifier in quotes. DocCluster's owner screenshot is the only image. Mobile uses `<details>` per the wireframe.
- **About:** the timeline-ledger uses the same booktabs table grammar (date | role | what happened | proof link). The skills-evidence-map is a two-column index, "FastAPI: Edge Node, Cited Researcher, NeuroUX", styled like a back-of-book index.
- **Footer:** the oversized "Let's talk" in Newsreader 400 at 11vw. Its underline is a 3px ink bar that scales in from the left on hover and focus. The confirmed email is set as plain text beside it once confirmed (the meinhard mechanism). The line "Numbers on this site link to their sources" links to home FAQ Q5 `#evidence`. There is no marquee.
- **404:** "Page not found." Then one sentence, and the recovery links as a small contents list with dot leaders, the same device as the work index.

---

## 7. Motion language

Print does not move, so motion here is **mark-making**: the reader's attention is shown, not decorated. Only `transform` and `opacity` are animated. There are no scroll reveals, since nothing on a printed page fades in (this is stricter than the wireframe's allowance for below-fold reveals). There is no bounce, no spring overshoot and no count-up.

| Token | Value | Use |
|---|---|---|
| `--ease-mark` | `cubic-bezier(0.65, 0, 0.2, 1)` | the house curve: a quick, even pen stroke |
| `--ease-out` | `cubic-bezier(0.2, 0, 0, 1)` | UI state (menu, disclosure, preview dock) |
| `--dur-flick` | 120ms | colour/underline swaps, button press |
| `--dur-mark` | 240ms | highlighter sweep |
| `--dur-ui` | 300ms | nav overlay, `<details>` open, margin preview dock |
| `--dur-draw` | 900ms | hero bar contraction (once per page load) |

1. **Signature: the highlighter sweep.** A `::before` on each citable element (the number, its sidenote, its ledger row) has `background: var(--mark)`, `transform: scaleX(0)` and `transform-origin: left`. On `:hover`, `:focus-visible`, `:target`, or when a linked twin is active (via `:has()`, e.g. `.case:has([data-cite="3"]:hover) [data-cite="3"]`), it goes to `scaleX(1)` over 240ms `--ease-mark`. The mark sits 0.15em below the x-height top and is slightly skewed (`skewX(-4deg)`) like a real highlighter pass, with no rounded ends. It needs no JS. The `:has()` twin-linking degrades gracefully: without it, only the hovered element marks.
2. **One orchestrated load moment: Table 1's after-bar.** On first paint (CSS `@keyframes`, no JS), the solid "after" bar starts at `scaleX(1)`, the width of "before", and contracts to its true 18.17% in 900ms `--ease-mark` after a 200ms delay. This is the one moment that tells the story (5.36 s shrinking to 0.97 s). The numbers are static text from the first paint and never animate.
3. **Margin preview dock** (work index): the figure `translateY`s to the active row in 300ms `--ease-out`, and cross-fades (opacity 0→1, 180ms) when the case changes. There is no cursor following and no spring.
4. **Nav overlay (mobile):** the panel translates from `translateY(-8px)` with opacity 0→1 in 300ms. The links stagger at 40ms each (the wireframe cap), with a focus trap and close on Esc.
5. **Press:** buttons use `translateY(1px)` on `:active`, 120ms.
6. **Footer CTA underline:** `scaleX(0→1)` from the left, 300ms `--ease-mark`.

**Reduced motion (`prefers-reduced-motion: reduce`):**
- The highlighter appears instantly with no transition, and the state is kept.
- The after-bar renders at its final 18.17% with no keyframes.
- The preview dock jumps without transition.
- The overlay and stagger are instant.
- `scroll-behavior: smooth` is enabled only under `no-preference`.

**Reduced transparency / forced colours:** the mark becomes `Mark`/`MarkText` system colours under `forced-colors: active`. The hatched bar falls back to a `CanvasText` border outline.

---

## 8. Risks

**Aesthetic**
- **The editorial-serif cliché.** A serif display on pale paper is a known AI-default cluster. It is mitigated in three ways: the paper is cool blue-grey (`#f4f7f9`) rather than cream; there is no terracotta or clay; and the accent is a highlighter *mark*, not a text colour. The critic should still weigh whether Newsreader for the H1 is too "journal" for recruiters, and a grotesk H1 over Newsreader body could be borrowed from another direction. The serif is justified only because the whole site is framed as a publication. Remove the report framing and the serif loses its reason.
- **Density/dryness.** A report can read as cold or academic. Counter-measures: large H1, generous 128px section gaps, one moving moment, and plain-language copy ("I build…"). If it still reads as dry, the critic should graft another direction's signature interaction onto the work index, not add decoration.
- **"Mono for data labels" tell.** Martian Mono is kept to *values only* (numbers, units, code, filenames) and never used for labels. The front-end must be policed on this by `lint:tokens` or review.

**Performance**
- Two variable families: Newsreader roman (`opsz`+`wght`) is about 70–90 KB woff2 in latin; the italic is about the same; Martian Mono (`wght`+`wdth`) is about 60–80 KB. Preload **only** Newsreader roman. Italic and mono use `display: swap` with metric-matched fallbacks. LCP (the H1) depends only on the preloaded file. Subset to latin + latin-ext, and drop Cyrillic/Vietnamese.
- Dot leaders are a CSS background (no DOM dots). Bars and hatches are CSS gradients. Sidenotes need no JS. The only client JS in this direction is the margin-preview dock (a small leaf using IntersectionObserver/pointer events and motion values, with no `useState` per pointer move) and the nav overlay.
- `:has()` twin-highlighting is scoped to `.case` and `.ledger` containers to keep style recalculation cheap. It is not applied at `body` level.

**Accessibility**
- **Citation markers are small.** `[n]` at 12px is below target size, so each gets a transparent `::after` hit area of at least 24×24px (WCAG 2.2 SC 2.5.8), and 44×44px on touch via `@media (pointer: coarse)`. Each is a real link with an accessible name: `aria-label="Source 3: benchmark_report.md, committed benchmark"`.
- **Sidenotes** are real DOM content placed after their paragraph, so reading order is paragraph → note. They must not be `aria-hidden`. Screen readers get the note text once, not twice (the marker's `aria-describedby` is not used).
- **Colour-independence:** highlight state is always paired with the 2px ink focus ring or an underline, since mark vs paper is 1.16:1. Before/after is encoded by hatch vs solid, and deltas carry a sign and text.
- **Tables:** real `<table>` with `<caption>`, `scope` and the visually hidden arrow text. On mobile they reflow to stacked records with inline labels, not horizontal scroll (per the wireframe).
- **Glyph coverage:** verify that Newsreader and Martian Mono contain `→` (U+2192), `−` (U+2212), `×` (U+00D7), `≈` and `↗` before locking. If a glyph is missing, set that character in the other family, never a system-font fallback mid-line.
- **Text resize (WCAG 1.4.4):** there is no `1vw` root (the noth watch-out). Only the footer's XL step uses `vw`, clamped with a rem minimum, so 200% zoom still scales it.
- **Italic legibility:** Newsreader italic at 14px captions has been fine at `opsz` auto, but it must be tested at 390px on Windows ClearType before lock.

---

## 9. Lineage (for the handoff)
| Decision | Source |
|---|---|
| 12-col / 80px frame, results as rows with rules | airborne-studio (mechanism) |
| Rem scale discipline, a mono only for data, one grotesk-or-serif plus one mono | noth (mechanism) |
| One house curve; a large numeral with an sr-only real value | elu-dev (mechanism; the odometer was rejected because numbers never animate) |
| Method before number, chart titles carry conditions, a plain takeaway | planetscale-benchmarks |
| Plain-text email plus one oversized closing contact target, no marquee | meinhard-taxer (partial) |
| Series by dash/hatch pattern, 64ch prose, legend tokens in prose | samwho-dev (alternate) |
| Booktabs tables, Tufte sidenotes, citation markers, highlighter mark, figures to scale | new in Direction C |
