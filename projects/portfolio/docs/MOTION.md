# MOTION — portfolio
> design-director (critic), 2026-09-25. It follows DESIGN.md. Motion only ever **reports a change**: a value getting smaller, a claim being checked against its source, a panel opening, a preview moving to the row you're on. Nothing loops, bounces, springs or overshoots (preferences: "subtle, fast", "no bouncing"). `MOTION_INTENSITY 3`. Lineage tags: [A] [B] [C] [critic].

- **Easing tokens:**
  - `--ease-settle: cubic-bezier(0.2, 0, 0, 1)`: the house curve, a fast start and a long flat settle with no overshoot. It is used for every state change and the retract. [A = B = C's `--ease-out`]
  - `--ease-mark: cubic-bezier(0.65, 0, 0.2, 1)`: an even pen stroke, used for the highlighter sweep and the footer underline only. [C]
  - `--ease-out`: an alias of `--ease-settle`, kept for starter compatibility.
  - Exits use the same curve as entries, at 70% of the duration. There is no `linear` except colour-free opacity crossfades.
- **Durations:**

  | Token | Value | Use |
  |---|---|---|
  | `--duration-press` | 120ms | button `:active` `scale(0.98)` |
  | `--duration-fast` | 180ms | underline thickness, docked preview image crossfade (opacity) |
  | `--duration-base` | 240ms | disclosures, docked preview `translateY`, highlighter sweep, overlay link |
  | `--duration-panel` | 300ms | mobile nav overlay (opacity + `translateY(-8px → 0)`), footer CTA underline |
  | `--duration-retract` | 720ms | the signature bar contraction |
  | `--stagger-row` | 60ms | retract offset between ledger rows (≤ 6 rows, so ≤ 300ms total) |
  | `--stagger-nav` | 40ms | overlay links (the wireframe cap) |
- **Page enter:** **none.**
  - The H1 is the LCP element on every route. It paints from SSR HTML with no opacity, transform or clip start. The wireframe's hero line stagger is declined [A].
  - There are no route transitions.
  - The only load-time motion is the hero retract (below). It starts on the first `requestAnimationFrame` after hydration, so it can never delay LCP.
- **Scroll reveal:** **none** [C, critic ruling]. Every section renders visible and static; there are no fade-ups, even below the fold. `components/motion/Reveal.tsx` is not used on content (delete it or keep it only for `/styleguide` demos). The one viewport-triggered effect is the retract on ledgers that enter view, because it communicates the result, not the arrival of a section.
- **Hover / press:** apply only under `@media (hover: hover) and (pointer: fine)`, except `:active` and focus, which apply everywhere.
  - **Links:** underline thickness 1px → 2px, 180ms. No colour change.
  - **Primary button:** a 1px label underline on hover; `scale(0.98)` on `:active`, 120ms.
  - **Ledger row hover/focus-within:** the mark sweeps behind that row's *after* value, `scaleX(0 → 1)` with `transform-origin: left`, 240ms `--ease-mark`.
  - **Work index row hover/focus-within:** the docked preview slot moves `translateY` to the row (240ms `--ease-settle`), and the image crossfades on opacity (180ms). Keyboard focus triggers the same behaviour. There is no cursor following [A/B/C consensus].
  - **Footer CTA:** a 3px fg underline bar `scaleX(0 → 1)` from the left, 300ms `--ease-mark` [C].
  - **Mobile nav overlay:** opacity 0 → 1 with `translateY(-8px → 0)` over 300ms. Links stagger at 40ms each. Close uses the reverse at 210ms.
  - **`<details>` disclosures:** the height snaps (never animated). The content fades in with opacity 0 → 1 and `translateY(4px → 0)` over 240ms.
  - **Cited Researcher topology toggle:** crossfade between the two SSR-rendered SVG states (opacity, 240ms). Nodes do not travel.
- **Signature interaction: "the retract, then the mark"** [primary: A + B + C convergent; the end-mark: critic]
  - **Markup:**
    - Each before → after row renders two `aria-hidden` bars: the *before* bar (hatched, 100%) and the *after* bar (solid fg).
    - The server writes `style="--ratio: 0.1817"`, computed at build time as after / before and rounded to 4 decimals.
    - After bar CSS: `transform: scaleX(var(--ratio)); transform-origin: left; transition: transform var(--duration-retract) var(--ease-settle);`.
  - **Server-rendered state is settled:** the bars are at their final proportion in the HTML, so no-JS users, crawlers and slow devices always see the truth.
  - **Arming:**
    - A tiny client leaf (`RetractObserver`, one `IntersectionObserver` per ledger, `threshold: 0.5`, disconnected after firing) finds rows that are *not yet* in view at hydration. It sets `data-armed` on them (`transform: scaleX(1)`, `transition: none`).
    - When a row enters view, the leaf removes `data-armed` on the next frame, and the bar contracts to `--ratio` over 720ms.
    - Rows in a ledger are offset by `calc(var(--i) * 60ms)`.
    - Rows already on screen at hydration (the hero) are armed and released on consecutive frames, so the hero contraction starts after first paint.
    - There are no scroll listeners and no React state per frame.
  - **The mark:** on the page's headline result (the hero *after* value; the case Result headline row), a `::before` highlighter (`background: var(--color-accent)`, `skewX(-4deg)`, inset 0.12em vertically) sweeps `scaleX(0 → 1)` over 240ms `--ease-mark`. It starts 80ms before the retract ends (at 640ms), so the whole moment is about 880ms. Its resting state in SSR HTML is `scaleX(1)`, visible. The arming rule is the same as for the bars.
  - **Once per page view.** It does not re-run on scroll back. The hero runs on every visit; this is deliberately not session-gated, because the moment is the product claim.
  - **Numbers never move.** The value in the HTML is the value.
- **Secondary: "checked against source"** [C]
  - `.case` contains citable elements: the value, its `[n]` marker, its sidenote, its ledger row and its Sources entry, all carrying `data-cite="n"`. Each has a `::before` mark at `scaleX(0)`.
  - **Trigger:** `:hover`, `:focus-visible` or `:target` on any twin, e.g. `.case:has([data-cite="3"]:is(:hover, :focus-visible, :target)) [data-cite="3"]::before { transform: scaleX(1); }`. All twins then sweep together over 240ms `--ease-mark`.
  - The selectors are generated per citation at build time and scoped to `.case` and `.ledger`.
  - The state is also carried by the 2px fg focus ring or underline, so the mark is never the only signal.
  - Without `:has()` support, only the hovered element marks, which is acceptable degradation.
  - No JS.
- **Reduced motion (`prefers-reduced-motion: reduce`): every animation has a static fallback.**
  - Retract: never armed. The bars render settled, and the mark renders at rest, so the proportion and the result are fully visible without movement.
  - Citation sweep: it appears instantly (`transition: none`) and keeps its state.
  - Docked preview: it jumps to the row and swaps its image instantly.
  - Nav overlay, link stagger, disclosures and toggle crossfade: all instant.
  - Button press: no scale.
  - `scroll-behavior: smooth` is set only under `(prefers-reduced-motion: no-preference)`.
  - The global safety net in `globals.css` (0.01ms durations) stays.
  - `forced-colors: active`: the mark becomes `Mark`/`MarkText`, and the hatch becomes a `CanvasText` 1px outline.
- **Budget: no animation blocks LCP. Only transform/opacity are animated.**
  - **Allowed properties:** `transform` (`scaleX`, `translateY`, `scale`) and `opacity` only. Width, height, top, left, colour, background-position and clip-path are never transitioned.
  - **`will-change`:** only on the docked preview slot, and only while the pointer is over the work index.
  - **JS:**
    - `RetractObserver` is a vanilla client leaf under 1 KB gzip, with no Motion import.
    - The nav overlay and docked preview may use CSS transitions driven by data attributes. If Motion is used, it lives only in those client leaves and never loads on routes that don't render them.
    - There is no GSAP and no Lenis.
  - **Verification at S5:** Lighthouse on a throttled mobile profile shows the H1 as LCP, CLS < 0.01, and no long task from the observer.
