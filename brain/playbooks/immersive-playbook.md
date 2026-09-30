# Immersive playbook

How to build scroll-scrubbed film, 3D and story sequences that feel expensive without breaking speed or access. Load it only when the approved experience thesis needs one of these patterns. Order stays: function first, polish second, 3D and media last. Rules from `taste-core.md` apply; the scroll-world template's per-section eyebrow, tag pills and hint text yield to them (eyebrow limit, no pills, no scroll cues). Score the result with `premium-bar.md`.

## Choose the pattern from the thesis
| The story needs | Pattern | Cost | Main risk |
|---|---|---|---|
| A journey through places or steps, camera moving | Scroll-scrubbed film | Paid media plus about 1 to 2 MB of video per scene | weight, seams, phone seek cost |
| Chapters that pin and hand over | Sticky stack or horizontal pan | Free (GSAP) | scroll feel, pin bugs |
| Depth and a hero object | 3D or WebGL scene | Free (Three) plus dev time | bundle size, GPU cost |
| Gentle reveals tied to reading | CSS scroll-driven or Motion `whileInView` | Free | browser support |
| A shareable proof of the work | Launch film (`/brag`, ffmpeg) | Free to paid | claims not matching the product |
If nothing here serves the thesis, ship none of it. Motion must be motivated (hierarchy, story, feedback, state).

## 1. Scroll-scrubbed film (scroll-world skill)
Mechanism: pre-rendered video whose `currentTime` follows scroll position. The camera really moves; scroll only drives time. Structure: N scene stills, N dive clips into each scene, N-1 connector clips joining consecutive scenes. Seams must be frame-identical: a connector starts on the last rendered frame of one dive and ends on the first rendered frame of the next, extracted from the rendered videos, never the stills. A visible pop at a seam is the most common failure.
Pipeline: run `node scripts/media-preflight.mjs`, interview (subject, brand kit, art direction, camera style, sections, mobile yes or no), stills, dive clips, boundary frames, connectors, encode, wire `references/scrub-engine.js` (vanilla, mounts into a container, honors `prefers-reduced-motion`, keeps the still as a live poster until the clip paints, chooses mobile clips on phones).
Billing and credentials: stills render through Higgsfield (`gpt_image_2`) or Codex `image_gen` billed to a ChatGPT login; the video chain defaults to Monid (Seedance 2.0, per-clip USD) with Higgsfield credits as fallback. The skill's own estimate is about $27 for a 6-scene 1080p chain and about $11 at 720p; re-check live pricing. A native 9:16 mobile chain roughly doubles spend, so ask before generating it. **State the estimate and get owner approval before every paid batch**; generations take minutes each, so run them detached and poll.
Encode (skill defaults): desktop `libx264 -crf 20 -g 8 -keyint_min 8 -sc_threshold 0 -movflags +faststart`, no audio; mobile 720p `-crf 23 -g 4`. Tight keyframes matter because seek cost is frames decoded from the nearest keyframe.
UIBuilder budgets (proposals, tune per project): first paint never waits on video (poster image is the LCP element, preloaded, not wrapped in a reveal); videos load after first paint and only for the nearest scenes; mobile total under about 12 MB for the visible chain; provide a still-sequence fallback if video fails.
Static equivalent (required): each scene's still plus its copy as a normal vertical section list, used under reduced motion, on load failure and for no-JS.
Ledger (required): `docs/MEDIA_LEDGER.md` with each asset, generator, model, prompt hash, date, license terms and cost. Generated footage never stands in for real product footage or real results.

## 1b. Manual studio requests (Google Flow and similar)
When a clip should come from a free studio, never just ask the owner to "make a clip". Write a request card from `templates/docs/MEDIA_REQUEST.md` into `docs/media/requests/<id>.md` (worked example: `docs/examples/MEDIA_REQUEST.example.md`) with the exact steps, model, credits, aspect ratio, copy-paste prompt, attached frames and the filename to save as. Generate the start and end frames first (Codex `image_gen` or a design export). When the owner replies "card <id> done", run `node scripts/media-inbox-check.mjs` with the card's values, then log the clip in `MEDIA_LEDGER.md`. A failed check is reported with the numbers; a re-roll is the owner's call because it uses their credits. Free-studio output is previz unless the studio's terms are read and allow the use.

## 2. Sticky stack and horizontal pan
Use GSAP ScrollTrigger only for real pin and scrub work; use Motion `whileInView` for simple reveals. Sticky stack: every card except the last pins with `start: "top top"`, `pin: true`, `pinSpacing: false`, and the previous card scales and fades from the next card's trigger. Horizontal pan: pin the wrapper at `top top`, scrub the inner track for `trackWidth - viewport` with `scrub: 1` and `invalidateOnRefresh`. Isolate GSAP in its own `'use client'` leaf with `gsap.context` cleanup and never mix it with Motion in one tree. Keep native vertical scrolling: do not hijack it without a visible progress cue and an escape (NN/g warns against non-standard scrolling; horizontal scroll is the riskiest).

## 3. CSS scroll-driven and reveals
`animation-timeline: view()` or `scroll()` for progressive enhancement, gated with `@supports` and `prefers-reduced-motion: no-preference`; fall back to static or Motion `whileInView` (`once: true`, spring or ease-out cubic-bezier(.16,1,.3,1)). Never add a scroll listener.

## 4. 3D and WebGL
Lazy-load Three.js after first paint in its own client leaf; cap device pixel ratio near 2; pause the render loop offscreen and on tab hide; provide a poster image as the LCP element and as the reduced-motion and no-WebGL fallback; keep continuous input in refs or motion values, not React state; dispose geometries, materials and textures on unmount. Playful 3D portfolios and scroll-camera pieces in the Brain are mechanism studies only.

## 5. Story sequences
Separate scene, content and timeline (the sticky-grid studies do this): the scene is the pinned visual, the content is text blocks, the timeline maps scroll ranges to states. Write the arc first in `MOTION.md`: for each beat, what the visitor understands and what changes on screen. Use 4 to 7 beats. Each beat needs a static state that stands alone. One signature moment carries the memory; the rest supports it.

## 6. Launch film
`/brag` and the router's ffmpeg tools produce a short walkthrough from the approved build. It shows only what the product actually does, records its sources, and never publishes by itself.

## Universal rules
- Every pattern ships with a static equivalent, keyboard and touch operation, a reduced-motion version that still tells the story, and a mobile decision made explicitly.
- Budgets come from G3 (LCP under 2.5s, CLS under 0.1, INP under 200ms); the hero is never wrapped in a reveal.
- Prototype first (G2.5): a local prototype with mobile and reduced-motion proof before production code.
- No copying: study mechanisms from references (Brain ids below), redraw everything, never reuse their assets, code, copy or fonts.

## Brain sources (ids in `brain/resources.json`)
Scroll film and tooling: `scroll-world`, `lenis` (smooth scroll, off by default), `motion`, `motion-primitives`, `componentry`, `fancy-components` (check per-component terms). Scroll and story studies: `codrops-sticky-grid-scroll-2026`, `codrops-sticky-grid-scroll-study`, `codrops-scroll-driven-css-2024`, `nngroup-nonstandard-scrolling-guidance`, `lusion-studio-storytelling-study`, `locomotive-studio-portfolio`, `owner-visual-story-clips-20260929`. 3D and interaction: `bruno-simon`, `threejs-paris`, `k95`, `yelm-watch`, `sondaven`. Craft and performance: `webdev-animation-rendering-guide`, `emil-practical-animation-tips`, `rauno-invisible-interaction-details`, `apple-human-interface-motion`. Query with `node scripts/recommend-resources.mjs immersive <task words>`.
