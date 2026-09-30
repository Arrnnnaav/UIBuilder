# Premium bar

The scorecard for "does this feel like a thousand-dollar site". It turns taste into evidence so the critic, the S5 review, `/audit` and the owner judge the same things. It has **no gate authority**: G2, G2.5 and G3.5 stay owner decisions and G3 stays the automatic Definition of Done. Companions: `taste-core.md` (rules), `immersive-playbook.md` (scroll film, 3D, story sequences).

## Who scores what, when
| Moment | Scorer | Input | Output |
|---|---|---|---|
| G2 concepts | design-director `critic` | each concept's offline HTML plus its thesis | scorecard per concept in `DESIGN_REVIEW.md`; the recommendation must name the concept with the best evidence |
| S5 review | design-director `review` | screenshots at 390 and 1440, computed styles, `premium-lint`, Lighthouse | scorecard in `VISUAL_REVIEW.md` and polish tasks for the three lowest-leverage-adjusted gaps |
| S6 audit | production-auditor (phase 13) | the same evidence plus the built site | scorecard section in `PRODUCTION_READINESS_REPORT.md` |
| After review | owner | live or local build | `VISUAL_OUTCOME.json` (six keys, 1 to 5), checked by `scripts/visual-eval.mjs` |

Score with evidence, never adjectives. A score without an evidence line is invalid. Run `node scripts/premium-lint.mjs <slug>` first and paste its counts.

## Scale (1 to 5)
5 = would sit in a paid studio's portfolio, 4 = clearly premium, 3 = competent and professional, 2 = template with polish, 1 = default output. Half points are not allowed.

## Seven dimensions
**1. Typography.** 5: at most two families, a stated scale ratio, tracking and leading tuned per size, headlines treated as designed objects, balanced wrapping (`text-wrap: balance`), true quotes, tabular numerals where numbers align, holds at 390 and 1440. 3: clear hierarchy from sound defaults. 1: default stack, arbitrary sizes. Evidence: computed styles and both-width screenshots. Hard fail: body under 16px on mobile, contrast below AA, more than two families.

**2. Composition and rhythm.** 5: a visible grid, deliberate asymmetry and whitespace, at least four layout families, hero fits the first viewport, nothing floats without alignment. 3: tidy but predictable. 1: stacked centered blocks and equal cards. Evidence: screenshots of every route. Hard fail: horizontal overflow, hero not fitting, three equal feature cards by default.

**3. Motion and interaction.** 5: one choreographed system (shared easing and duration tokens), motion communicates hierarchy, story, feedback or state, interruptible, 60fps on transform and opacity, and the reduced-motion version is a designed experience, not a disabled one. 3: tasteful hover and reveal. 1: decorative or missing. Evidence: `MOTION.md` versus implementation, Playwright frames or recording, reduced-motion screenshots. Hard fail: motion claimed but not shown, no reduced-motion handling, scroll listeners, INP over 200ms.

**4. Imagery and media.** 5: art-directed and consistent (one grade, one aspect logic, one lighting story), correctly sized and formatted, video only where it carries meaning, poster first. 3: real images, uneven treatment. 1: stock, gradient blobs or fake screenshots. Evidence: asset list with source and rights, byte sizes, `docs/MEDIA_LEDGER.md` for generated media. Hard fail: fake screenshots, unrighted assets, shipped placeholders.

**5. Copy and narrative.** 5: a clear thesis, concrete specific claims, one voice, an arc across sections, every string re-read. 3: clear and clean. 1: filler or generic. Evidence: copy audit and `premium-lint`. Hard fail: placeholder copy, dashes in visible copy, invented facts or metrics (never invent titles, dates, employers or results).

**6. Performance and access.** 5: LCP under 2.0s on mobile, CLS 0, INP under 150ms, AA everywhere, complete keyboard and touch paths, both themes tested. 3: meets G3. 1: fails G3. Evidence: Lighthouse, axe, keyboard walkthrough. Hard fail: any G3 failure.

**7. Memorability.** 5: one signature moment a visitor can describe a day later, tied to this person or brand, and the thesis fits in one sentence. 3: pleasant, forgettable. 1: could swap the logo and ship it for anyone. Evidence: the thesis sentence, the signature moment named with its file, and the stranger test (would a visitor recall it). Hard fail: the site is interchangeable with another brand's.

## Details that cost little and read expensive
Designed focus rings and selection color, pressed and disabled states, a real 404 and error page, loading skeletons matching the layout, an OG image and favicon that match the brand, consistent icon stroke, hanging punctuation and optical alignment in large type, image grading that matches the palette, considered page transitions, no layout shift when fonts load, dark and light both intentional.

## Verdict
- **Pass:** no hard fail, every dimension 3 or more, memorability 4 or more, average 4.0 or more (the same threshold `visual-eval.mjs` reports).
- Otherwise list the three fixes with the largest score lift per effort and re-score after the loop (S5 allows at most 2 loops).
- Write the table as: dimension, score, evidence line, top fix.

## Mapping to the owner's six keys (`VISUAL_OUTCOME.json`)
| Owner key | Drawn from |
|---|---|
| distinctiveness | 7 memorability, 1 typography |
| story_clarity | 5 copy and narrative |
| motion_with_purpose | 3 motion |
| visual_craft | 1, 2 and 4 |
| coherence | 2 composition, 1 typography consistency |
| usability_without_motion | 6 performance and access |
