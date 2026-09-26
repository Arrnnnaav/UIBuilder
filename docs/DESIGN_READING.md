# Design reading and reference intake

Reviewed 2026-09-26 by the research role. Five core references below are reading
and inspiration resources, not installed tools. Author/publisher pages were
opened through the web tool. `REVIEWED` means source checked; it does not mean
tested, approved for a build, or visually validated in a browser.

The portfolio's approved DESIGN.md and MOTION.md remain the implementation
contract. These findings supply options for future analysis and S5 critique.
No images, fonts, prose, code or complete compositions were copied.

## 1. Rauno Freiberg: Invisible Details of Interaction Design

[Author essay](https://rauno.me/craft/interaction-design), July 2023.
Brain ID: `rauno-invisible-interaction-details`.

Published mechanisms: interruption preserves a user's control; movement can
communicate spatial relationships; repetitive interactions benefit from less
animation. The essay examines gestures and contrasts novelty with frequency.

Portfolio application (our inference): keep navigation immediate, make optional
diagram exploration interruptible, and place feedback at its source. Evaluate
whether motion explains a relationship before adding it. These are interaction
criteria, not proof that an arbitrary spring curve works.

Limitations: the essay is observational, largely about native interfaces; its
examples do not establish browser accessibility. Our constraint: keyboard
actions remain immediate and reduced motion retains all feedback without travel.

## 2. Emil Kowalski: 7 Practical Animation Tips

[Author article](https://emilkowal.ski/ui/7-practical-animation-tips).
Brain ID: `emil-practical-animation-tips`.

Published mechanisms: immediate action feedback, restrained scale changes,
trigger-aware transform origins and easing selected for entering UI. The author
offers sub-300ms UI motion as a heuristic and warns about repeated flourishes.

Portfolio application (our inference): a press state or contact success state can
acknowledge intent without delaying the action. Compare onset, endpoint and
interruption at normal speed; retain the approved timings. Do not turn a
heuristic into an automatic pass threshold.

Cost/limits: the article's blur suggestion can increase painting cost and harm
text clarity; our default excludes it. Under reduced motion use static state
changes. Tooltips never carry required information. Browser timings were not
measured during this intake.

## 3. web.dev: How to create high-performance CSS animations

[Publisher guide](https://web.dev/articles/animations-guide), updated 2020-10-06.
Brain ID: `webdev-animation-rendering-guide`.

Published mechanism: prefer transform/opacity over properties requiring layout
or paint; inspect rendering work rather than assuming smoothness. Layer promotion
is selective, with will-change introduced only after identifying a problem.

Portfolio application (our inference): reserve figure geometry before reveal,
then animate only an optional presentation layer. All proof, labels and source
links must exist in the static document. Profile actual animation during the QA
pass and remove costly decoration if it competes with reading.

Limits: compositor-friendly properties do not guarantee low memory use or good
frame pacing. Large layers and blur remain expensive. Reduced-motion behavior is
our project requirement, not a finding of this guide. No runtime performance was
measured here. Page license states CC BY 4.0 for prose and Apache 2.0 for samples;
the intake uses mechanisms only.

## 4. Codrops: Sticky Grid Scroll

[Theo Plawinski tutorial](https://tympanus.net/codrops/2026/03/02/sticky-grid-scroll-building-a-scroll-driven-animated-grid/),
published March 2, 2026. Brain ID: `codrops-sticky-grid-scroll-study`.

Published mechanism: a sticky scene maps scroll progress to staged grid reveal,
expansion and content focus. The article specifies 12 images in three columns,
a 425vh scene and a GSAP/ScrollTrigger/Lenis implementation. Those are authored
example values, not measurements from our browser.

Portfolio fit (our inference): a short explanation could preserve a stable
diagram while highlighting stages. Long pinned scenes are a poor default for a
recruiter trying to scan evidence. The viewport-derived root font sizing needs
independent zoom and mobile review; do not transplant it.

Costs/limits: long scroll travel, image decoding and animation dependencies.
Use ordinary document flow for mobile, reduced motion and no JavaScript; never
hide required links until a scroll timeline completes. No new dependency is
proposed. The linked demo was not exercised, so this is published-mechanism
research, not observed smoothness or measured accessibility.

## 5. Lusion: live studio reference

[Studio site](https://lusion.co/). Brain ID: `lusion-studio-storytelling-study`.

Verified page content: the studio describes 3D storytelling and interactive web
work; its page exposes a reel, selected projects, approach and contact paths.
This makes it a candidate for studying presentation hierarchy and movement in a
future browser session. No exact scroll mechanics, easing or frame rates are
claimed from the extracted text.

Portfolio fit (our inference): a coherent project narrative and disciplined
transition from overview to selected evidence are useful questions for critique.
Full immersive scenes are not a requirement of the approved portfolio.

Costs/limits: likely media/GPU costs must be measured before recommending any
similar technique; no cost estimate is asserted as an observed fact. Require
static posters, keyboard-readable links and a reduced-motion path before using
immersive motion. Browser screenshots and computed styles are still pending.

## Supplemental reading: developing taste

[Emil Kowalski's Developing Taste](https://emilkowal.ski/ui/developing-taste)
recommends exposure, explanation, practice and critique. It is a reading pointer,
not a sixth core intake resource. Apply it by writing what a reference achieves,
how the mechanism does it, what fails on mobile and why it suits this audience.
Feedback should test those explanations rather than merely collect screenshots.

## Repeatable study checklist

1. State the user's task and the reference's mechanism in plain words.
2. Separate author-published numbers, browser measurements and inference.
3. In a dedicated browser pass, record 1440px and 390px, computed timings,
   keyboard order, reduced motion, zoom and a performance trace.
4. Derive an original mechanism sketch using our tokens and content. Include
   a static version and explicit cost limits.
5. Submit it to design-director critique. Promote trust only with documented
   evidence; REVIEWED references are not silently promoted into production.

Validation: `node scripts/validate-brain.mjs` → `✓ brain valid — 91 resources,
16 patterns, 36 tools`. Five resources and four mechanism candidates were added;
no duplicate URLs were found. Inserted IDs are in `docs/handoff/research.json`.
