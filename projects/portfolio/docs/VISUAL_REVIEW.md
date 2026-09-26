# Portfolio visual review

Reviewed by design-director, 2026-09-27. Status: **S5 static visual acceptance passed after polish loop 1 and rebuilt screenshot inspection**. Interactive and performance gates remain separate.

## Evidence and scope

Inspected every production screenshot in `docs/evidence/visual/` with `view_image`: home, work, all six case studies, about, contact, resume and styleguide, each at 390px and 1440px. The initial 24 screenshots exposed the issues below. The current 24 screenshots were then regenerated from a clean production server and every image was inspected again after loop 1. The paired `observations.json` records root browser observations; screenshots alone do not prove keyboard, reduced-motion or contact state behavior.

Compared the rendered pages against `DESIGN.md`, `MOTION.md`, `WIREFRAMES.md` and `IA.md`. The approved static report direction takes precedence over earlier wireframe reveal suggestions. Loaded frontend-design, taste-skill and web-design-guidelines; fetched the current interface guidelines during frontend review.

## Findings and loop 1 changes

| Finding | Initial evidence | Change | Rebuilt verification |
|---|---|---|---|
| Stacked ledger caption shrinks into a narrow word or character column, leaving an excessive blank band before results. | `390-home.png`, `390-styleguide.png`, all twelve case screenshots. Most severe on desktop case pages. | `app/globals.css`: set the caption to block layout and full width only where the table is a stacked record. The native `table-caption` display was creating an anonymous table layout beside block table content. | Passed in all rebuilt stacked ledgers: readable caption above the first record, no character stack. |
| Source-type text runs directly into the source title. | `1440-home.png`, `1440-styleguide.png` and all desktop case ledgers. | `app/globals.css`: source-type label is a separate block, with token spacing before the link. | Passed: labels and links remain separate on both sizes. |
| NeuroUX flow caption says bar lengths use a logarithmic scale although the figure contains no bars. | Both NeuroUX screenshots. | `EvidenceFigure.tsx`: logarithmic statement is conditional on an actual comparison bar chart. | Passed in both NeuroUX images: no nonexistent-bar statement. |
| Figure captions describe the source but omit its literal filename. | Case figures and work dock. | `EvidenceFigure.tsx`: append filenames from the sources used by verified metrics, in code typography. Pending-only sources are excluded. | Passed: filenames wrap without overflow, including the compact dock. |

Focused command after loop 1: `pnpm exec eslint components/portfolio/EvidenceFigure.tsx` returned exit 0. No build, browser or performance process was started by this agent; the orchestrator serializes those runs.

## Route review

| Route | 390px | 1440px |
|---|---|---|
| `/` | Name, role, contact action and measured specimen form a clear sequence; source caveat and n=50 are visible. Rebuilt caption is readable and full width. | Approved split hero and one resting result mark; balanced type/figure relationship. Rebuilt source labels are separated. |
| `/work` | Six readable rows, touch disclosures and plain stack text. More-work groups remain disclosure based. | Docked figure sits beside the first row, separate from title/content. No card grid or cursor treatment. |
| `/work/edge-node` | Outcome first, exact 5.356 s and 0.973 s, vertical figure with solid/hatched encoding. Rebuilt caption is readable and full width. | Three-zone layout, source note rail and exact ledger values. Rebuilt caption is readable and full width. |
| `/work/cited-researcher` | Bounded research flow and verified suite count; pending timing stays absent from the ledger. Rebuilt caption is readable and full width. | Three-zone layout, source notes and related cases. Rebuilt caption is readable and full width. |
| `/work/ledgerbridge` | Scale dataset, timing and demo disposition remain distinct. Rebuilt caption is readable and full width. | Separate records preserve caveats rather than merging dataset claims. Rebuilt caption is readable and full width. |
| `/work/ghostcursor` | Human-action flow and evaluation caveat are explicit. Rebuilt caption is readable and full width. | Report layout preserves the bounded execution claim. Rebuilt caption is readable and full width. |
| `/work/neuroux` | Flow stays readable; approximation caveat remains attached to timing. Rebuilt caption and figure annotation are correct. | Experimental proxy/limits remain visible. Rebuilt flow caption has no nonexistent bar-scale statement. |
| `/work/studyos` | Qualitative learning workflow is labelled as a fact, with no fabricated learning result. Rebuilt caption is readable and full width. | Outcome, facts and limits stay separate. Rebuilt caption is readable and full width. |
| `/about` | Bio, timeline, proof-linked skills, recognition and contact channels are legible as one column. | Timeline uses booktabs; skills use two columns; no invented portrait or decorative media. |
| `/contact` | Visible labels, full-width submit action and direct channels below form. | Form and direct channels are balanced in two zones; footer action correctly changes to See the work. |
| `/resume` | Download action, PDF size and HTML sections are visible; project links remain readable. | Projects and skills use two columns with clear section spacing. |
| `/styleguide` | Token/type/components gallery renders; shared ledger caption is fixed in the rebuilt image. | Shared components confirm separated source labels and readable captions. |

## Acceptance boundary

The initial screenshots establish the overall approved visual grammar: cool paper and ink, Archivo hierarchy, restrained yellow result marks, booktabs, static content, clear CTAs and source-linked records. The rebuilt screenshots verify that all four loop 1 findings are resolved, so **static visual acceptance is passed** for these 12 routes at the two approved sizes.

The current observations JSON was checked directly: 24 observations, 12 unique routes, 24 HTTP 200 responses, 24 scroll widths at or below viewport width and 24 empty error arrays. All regenerated screenshots were visually inspected. No remaining static layout blocker was found. The owner update making `/styleguide` indexable is reflected in current DESIGN and IA; it does not change the approved visual direction. Browser tests must separately prove modal keyboard containment, focus return, citation twins, reduced motion, contact success/recovery and both browser engines. Lighthouse must verify the performance budget; none of those checks is inferred from static screenshots.


## Post-loop 1 verification

- Home and styleguide mobile captions render as ordinary full-width caption lines, without a narrow word stack.
- Every case caption at both sizes is readable above the result records; the previous large character-column gap is gone.
- Source-type tags and links are distinct lines on both sizes, including desktop home/styleguide tables.
- NeuroUX flow caption describes its approximate timing and experimental context without a bar-scale claim.
- Source filenames render in mono without overflow in case figures, styleguide and compact work dock.
- Mobile Edge Node figure remains vertical with solid/hatched distinction and exact values. Desktop figure remains horizontal.
- Static content retains the approved paper/ink hierarchy, one resting case result mark, source notes, quiet row separators and contact CTA grammar.
- No additional polish loop was needed. No UI files were edited during this verification.

## Subsequent browser blockers, separate from static acceptance

The orchestrator's production browser suite exposed two behavior defects after static acceptance. These do not change the approved visual direction, and the interaction gate stays unpassed until the rebuilt browser suite verifies their fixes.

- **Empty SVG titles and hydration error #418.** The failed `/work` trace network response contains an empty `<title id="edge-node-_S_7_-title"></title>`, while the component intended an accessible description. A minimal `react-dom/server` render of an SVG title with multiple JSX children reproduced the empty server element and the framework warning that title children must be a single value. Rendering the same title as one string produced the correct nonempty element. Both `EvidenceFigure.tsx` titles now use a single interpolated string. `tests/unit/evidence-figure-ssr.test.tsx` renders the actual Edge Node figure and checks both title texts and their SVG label references; root runs this focused regression in its serialized slot.
- **Native dialog focus cycle crosses the boundary.** The Chromium mobile trace passed five Tab containment checks, then failed on the sixth. The menu has six focusable controls; native modal behavior alone did not cycle directly from the last link back to the first button. `Navigation.tsx` now intercepts endpoint Tab/Shift+Tab to wrap within the dialog and recovers an outside active element to its first control. Escape and close focus restoration remain in place. The existing E2E scenario now explicitly checks reverse and forward endpoint wrapping before repeated Tab containment.

Changed behavior files: `components/portfolio/EvidenceFigure.tsx`, `components/portfolio/Navigation.tsx`. Regression coverage: `tests/unit/evidence-figure-ssr.test.tsx`, `e2e/site.spec.ts`. No browser, build or full test process was started by this agent during diagnosis. Browser evidence remains the authoritative acceptance requirement.

## Actual Playwright baseline review

On 2026-09-26 UTC (2026-09-27 local), design-director `/root/frontend_finish` inspected every existing Playwright PNG with `view_image`: 12 Chromium desktop, 12 Chromium mobile, 11 WebKit desktop and 12 WebKit mobile. Exact project-relative paths, SHA-256 hashes and review timestamps are recorded in `docs/evidence/snapshot-review.json`. This is an actual image review, separate from the earlier production captures.

All 47 reviewed images preserve the approved layout and source-led report hierarchy. The ledger caption and source label fixes are visible across engines. Case diagrams, source filenames, exact values, yellow citation marks and mobile stacking remain readable. Contact's magenta Turnstile rectangle is the intentional screenshot mask. No further UI polish or baseline edit was performed.

Windows WebKit appears heavier than Chromium in paragraphs and navigation, and wider in display headings. Source declarations remain consistent with DESIGN: body defaults to normal 400; hero name uses 700/112%, the before value 400/75%, work-row titles 600/112%, display tracking -0.03em and footer tracking -0.035em. An image cannot establish a computed font-axis mismatch; this is an observation, not a demonstrated contract failure. The orchestrator will capture computed font properties after its active suite ends.

At the initial 47-image review, complete baseline acceptance was pending because `e2e/__snapshots__/win32/webkit-desktop/styleguide.png` was absent. The orchestrator diagnosed a screenshot stability timeout rather than a layout mismatch. The final capture and inspection below resolve that gap.

## Final 48-image acceptance

At 2026-09-26 22:29 UTC (2026-09-27 local), the final `e2e/__snapshots__/win32/webkit-desktop/styleguide.png` was inspected with `view_image`. Its token gallery, type hierarchy, full-width ledger caption, separate source labels, six evidence figures, form, FAQ, appendix and footer are accepted. All prior 47 file hashes still match the images already inspected. `docs/evidence/snapshot-review.json` now records all 48 images with exact paths, SHA-256 hashes, reviewer and timestamps, with no missing captures. **Static baseline visual acceptance is complete.**

The orchestrator confirmed the lightweight runtime typography probe reported Archivo in both engines, body weight 400/stretch 100%, hero before weight 400/stretch 75%, normal font variation settings, and mobile home H1 weight 700/stretch 100% consistent with the explicit max-399px override. No actual axis defect was found. The probe output was not retained, so this is a reported runtime observation rather than archived command evidence. No new UI polish was needed. The latest browser suite separately passes mobile menu focus in both engines; contact widget verification remains owned by the orchestrator and is not inferred from image acceptance.
