# Taste core

Distilled from the MIT-licensed `taste-skill` (leonxlnx/taste-skill, commit c184364; vendored in `.claude/skills/taste-skill`), paraphrased and reorganized for UIBuilder. Load this instead of the full skill (about 2k tokens vs 22k). Load the full skill only for a deep audit. It covers landing pages, portfolios and redesigns, not dashboards or dense product UI. `DESIGN.md` and `MOTION.md` outrank everything here once they exist.

## 1. Read the room first
State one line before designing: "Reading this as: <page kind> for <audience>, <vibe> language, leaning <aesthetic or system>." The audience picks the aesthetic, not taste. Accessibility, trust-first and regulated briefs override style. Ask at most one question, only if the read truly forks. Default reflexes to avoid: AI-purple gradients, centered hero over dark mesh, three equal feature cards, glass on everything, looping micro-animations on everything, Inter on slate.

## 2. Three dials (1 to 10)
DESIGN_VARIANCE (symmetry to asymmetry), MOTION_INTENSITY (static to cinematic), VISUAL_DENSITY (gallery to cockpit). State the values and why.
| Brief | Variance | Motion | Density |
|---|---|---|---|
| SaaS landing | 7 | 6 | 4 |
| Agency or creative landing | 9 | 8 | 3 |
| Premium consumer | 7 | 6 | 3 |
| Designer or studio portfolio | 8 | 7 | 3 |
| Developer portfolio | 6 | 5 | 4 |
| Editorial | 6 | 4 | 3 |
| Trust-first or public sector | 3 | 2 | 5 |
Redesign preserve: match the existing dials, motion +1. Overhaul: variance and motion +2. Above variance 4, asymmetric layouts collapse to one column under 768px. **Motion claimed must be motion shown**: above intensity 4 the page really moves (hero entry, scroll reveals, CTA hover physics); if scope cannot deliver it, drop the dial to 3 and ship clean and static.

## 3. Locks (pick once, apply everywhere)
- **Type:** avoid Inter as a default; prefer Geist, Outfit, Satoshi, Cabinet Grotesk or another brand-fit sans. Serif only when the brand names one or the aesthetic is truly editorial, luxury or heritage, with a stated reason; never Fraunces or Instrument Serif by reflex. Emphasize a headline word with italic or bold of the same family, never a second family. Italic words with descenders (y g j p q) need line-height 1.1 or more plus bottom room. Body max 65ch. Headline scale follows word count; a 4-line hero headline is a font-size error.
- **Color:** one accent, saturation under 80 percent, neutrals only otherwise, never pure black or pure white. No automatic purple glow. Beige, cream, brass, clay, oxblood and espresso is the default reach for premium-consumer briefs and is banned unless the brand names it; rotate to cold luxury, forest and bone, black and tan, cobalt and one neutral, terracotta and slate, or monochrome plus one bright accent. Keep the accent identical in every section.
- **Shape:** one radius system (all sharp, all soft 12-16px, or a documented per-element rule).
- **Theme:** one theme per page, no inverted sections mid-page (one deliberate color-block moment is the only exception). Design and test light and dark; honor `prefers-color-scheme`.
- **Icons:** one family (Phosphor, HugeIcons, Radix, Tabler), one stroke width, never hand-drawn paths. No emoji unless the brief is playful.

## 4. Layout law
- Hero fits the first viewport: headline 2 lines max, subtext 20 words and 4 lines max, CTAs visible, top padding at most `pt-24`, at most 4 text elements (eyebrow or none, headline, subtext, 1 primary and at most 1 secondary CTA). No tagline under the CTAs, trust strip, pricing teaser, bullet list or avatar row in the hero. Logo walls sit below it, real SVG marks, logos only, no category labels.
- Nav on one line at desktop, at most 80px tall.
- Centered heroes are avoided at variance above 4 (exception: manifesto or launch where the message is the design). Prefer split, asymmetric, pinned or poster compositions.
- At least 4 layout families across 8 sections; no family twice. Never 3 image-text zigzags in a row. Bento cells equal content count, no empty tile, at least 2 cells with real visual variation.
- Cards only when elevation carries hierarchy; otherwise use space, hairlines or dividers. Tint shadows to the background.
- Eyebrows (small uppercase tracked labels): at most one per 3 sections, hero counts. No section-number eyebrows, no version or BETA labels, no micro-sentences under eyebrows.
- No split header (big left headline, small floating right paragraph); stack headline and body. Long lists (over 5 items) use a better component (grouped columns, card grid, tabs, snap pills, one marquee), never 10 hairline rows.
- Use `min-h-[100dvh]` never `h-screen`; CSS Grid never flex percentage math; declare the under-768px collapse for every multi-column section.

## 5. Imagery and proof
Landing pages are visual products: real imagery, never text-only "minimalism". Order: a router-enabled image or video tool, then owner-provided or licensed assets, then clearly labeled placeholder slots with a list of needed shots. Picsum seeds only in pre-G2 concept HTML. Banned: div-built fake screenshots or dashboards, hand-drawn decorative SVG illustration, tag pills or credit captions laid over photos, decorative photo credits, fake version footers. Hero needs a real visual; text plus gradient blob is a placeholder.

## 6. Copy and content
- Short: section headline 8 words or fewer, sub-paragraph 25 or fewer, plus one visual or one CTA. Quotes 3 lines max with name, role and company.
- One CTA label per intent across nav, hero and footer. Buttons fit one line at desktop (3 words max).
- **No em-dash or en-dash anywhere in visible site copy** (headings, buttons, alt text, captions, quotes); use a period, comma, colon or hyphen.
- No filler verbs (elevate, seamless, unleash, next-gen), no startup-slop names (Acme, Nexus), no "John Doe", no fake-perfect numbers (99.99 percent). Numbers are real, or labeled as sample data. No "Stage 1/2/3" labels, "Quietly trusted by", "Field notes" style poetry, locale or time or weather strips, scroll cues, decorative status dots, hero-bottom keyword strips, rotated vertical text, decorative crosshair lines.
- Copy self-audit before done: re-read every visible string for broken grammar, unclear referents and AI-cute phrasing; replace with a plain sentence when unsure. One copy register per page.
- Forms: label above the field, error below, no placeholder-as-label; buttons, inputs, placeholders, focus rings and helper text all pass AA contrast. Provide loading (shape-matched skeletons), empty and error states, and a pressed state (about `scale(.98)`).

## 7. Motion law
- Every animation must answer one of: hierarchy, story sequence, feedback, state change. "Looks cool" is not an answer. At most one marquee per page.
- Animate `transform` and `opacity` only; sparing `will-change`. Grain or noise only on a fixed, `pointer-events: none` layer.
- Above intensity 3 honor `prefers-reduced-motion`: loops, parallax, scroll-hijack and magnetic physics collapse to static or instant.
- Continuous input (pointer, scroll progress) uses motion values (`useMotionValue`, `useTransform`, `useScroll`), never React state. Banned: `window.addEventListener('scroll')`, `scrollY` in state, rAF loops that touch state. Allowed: Motion `useScroll`, GSAP ScrollTrigger, IntersectionObserver, CSS `animation-timeline`.
- Library split: Motion for UI, state and simple reveals (`whileInView`); GSAP plus ScrollTrigger for pinning and scrubbing; Three.js for canvas or 3D. Never mix GSAP or Three with Motion in one component tree; isolate each in a `'use client'` leaf with `useEffect` cleanup.
- Sticky stack and horizontal pan: `start: "top top"`, `pin: true`; stack scales the previous card from the next card's trigger; pan ends at `+=trackWidth - viewport`, `scrub: 1`, `invalidateOnRefresh`. A trigger at "top center" or "top 80%" fires late and looks broken.
- Springs over linear easing; ease-out cubic-bezier(.16,1,.3,1) for reveals. No custom cursors.

## 8. Performance and access
LCP under 2.5s (hero image priority or preload, never wrapped in a reveal), INP under 200ms, CLS under 0.1. Lazy-load anything below the fold, including Three.js. Fonts through `next/font` or self-hosted `font-display: swap`. z-index only for real layers, scale documented. Check `package.json` before importing any library; give the install command if absent. One design system per project; if the brief maps to an official system, use its package rather than imitating it. Apple "liquid glass" on the web is only an approximation: `backdrop-filter`, inner 1px border, inset highlight, solid fallback under `prefers-reduced-transparency`; label it as such.

## 9. UIBuilder overrides
- Fonts: Google Fonts or Fontshare only. Palette and type come from `DESIGN.md` and `tokens.css`; raw colors outside tokens fail `lint:tokens`.
- A rule above may be broken only with a written reason in `DESIGN.md` (for example a heritage brand that names its serif). Forks push their lane hard but the bans hold; the critic removes any fork idea that breaks one without a reason.
- Media and image tools are used only when the router enables them (`brain/tools.json`, `brain/tool-enable.json`); paid generation needs its key and the owner's approval.
- Never copy a reference's assets, fonts, copy or code; extract mechanisms only.

## 10. Pre-flight (critic and S5 review; any unchecked box is a failing verdict)
1. Design Read line and dial values stated with reasons; system or aesthetic named honestly.
2. Zero em-dashes or en-dashes in visible copy.
3. One theme, one accent, one radius system, one icon family, one type system; both light and dark tested.
4. Every CTA and form text passes AA; no CTA wraps; one label per CTA intent.
5. Hero fits the viewport, at most 4 text elements, no tagline, trust strip or scroll cue; logo wall below with real marks.
6. Eyebrow count is at most ceil(sections / 3); no split headers, no section numbers, no decorative dots.
7. At least 4 layout families in 8 sections; no 3-in-a-row zigzag; bento cell count exact with visual variety; long lists use a proper component.
8. Real imagery, no fake screenshots, no overlay pills, no hand-drawn SVG illustrations.
9. Copy self-audit done; no filler verbs, placeholder names or fake-perfect numbers; quotes 3 lines max.
10. Every animation justified in one sentence; at most one marquee; motion claimed equals motion shown.
11. No scroll listeners; continuous input via motion values; effects have cleanup; reduced motion honored above intensity 3.
12. `min-h-[100dvh]`, grid layout, explicit mobile collapse, nav one line at 80px or less.
13. Loading, empty, error and pressed states exist; cards used only where hierarchy needs them.
14. LCP, INP and CLS plausibly within budget; Lighthouse run before done.
