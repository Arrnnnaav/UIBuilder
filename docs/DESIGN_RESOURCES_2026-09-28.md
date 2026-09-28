# Design learning and visual references

Reviewed: 2026-09-28. These are reading and visual-study references, not installable tools. All five are registered in `brain/resources.json`. `REVIEWED` means the publisher or live page was checked; no reference has been tested or promoted to a production pattern in this intake.

The existing portfolio `DESIGN.md` and `MOTION.md` remain binding. These sources add study material for future research and critique. Do not reuse another site's assets, fonts, copy, exact layout, animations, or code.

## Reading: content and editorial UI

### GOV.UK content design

[Understand content design](https://guidance.publishing.service.gov.uk/writing-to-gov-uk-standards/plan-manage-content/understand-content-design/) and the [A to Z style guide](https://guidance.publishing.service.gov.uk/writing-to-gov-uk-standards/style-guides/a-to-z-style-guide/) are official publishing guidance. They make content design start with user needs, then consider how much to publish, what format to use, where it belongs, clarity, accessibility, and currency. The style guide provides concrete editorial conventions such as active voice and abbreviation handling.

**Study for:** audience-first page hierarchy, deciding what content to omit, and editorial consistency. GOV.UK terminology, UK spelling, and service conventions are examples, not UIBuilder policy.

Brain ID: `govuk-content-design-guidance`.

### IBM Carbon content guidelines

[Carbon content](https://carbondesignsystem.com/guidelines/content/overview/) covers writing style, action labels, voice and tone, and writing for accessibility. Its examples connect microcopy decisions to the user's place in a task; the guidance favors clear, simple language and sentence case. IBM's brand voice and product context remain specific to IBM.

**Study for:** consistent labels, error and form copy, and a voice that can adapt tone by situation. Adapt the method to the approved project voice rather than copying Carbon wording.

Brain ID: `carbon-content-writing-guidelines`.

## Reading: interaction and motion

### Apple Human Interface Guidelines: Motion

[Apple's Motion guidance](https://developer.apple.com/design/human-interface-guidelines/motion) asks designers to use motion purposefully, keep feedback brief and precise, avoid unnecessary animation for frequent interactions, make important information available without motion, and let people cancel motion. This is platform guidance, not a source of web timing values or a specification for Apple-style visuals.

**Study for:** checking whether an animation explains a state or relationship, whether a repeated control makes the user wait, and whether the same information remains available with reduced motion.

Brain ID: `apple-human-interface-motion`.

## Live visual references

### Locomotive studio

[Locomotive's official site](https://locomotive.ca/en) presents featured projects, a short studio position, hiring/contact paths, and an articles section. The article index includes pieces about Locomotive Scroll and its frontend-framework choices. These are useful prompts for studying how brand narrative, selected work, and technical point of view fit into one studio site.

**Study for:** work hierarchy, transitions from studio story to project evidence, and which interactions support the narrative. The current page text was verified; its scroll behavior, timings, accessibility, mobile behavior, and performance were not measured in a real browser.

Brain ID: `locomotive-studio-portfolio`.

### MONOGRID web-experience archive

[MONOGRID's web works index](https://monogrid.com/en/works/websites/) organizes projects alongside filters for web experiences, content production, installations/events, AR, VR, and games; it also exposes project search. This is a high-production archive from an interactive studio, useful for examining how a large body of work is grouped and how project titles signal different formats.

**Study for:** archive taxonomy, project selection, and how a case-study index labels diverse experiences. Specific scroll behavior, media cost, accessibility, and mobile behavior were not measured. Treat immersive techniques as questions to investigate, not a default direction.

Brain ID: `monogrid-web-experiences-index`.

## Pattern and provenance decision

No pattern JSON was changed. The live sites were checked through their official page content, but no viewport screenshots, computed CSS timings, keyboard paths, reduced-motion behavior, or performance traces were measured in this intake. Adding exact mechanisms or durations to a pattern without those measurements would overstate the evidence. All five resources remain `REVIEWED`; the two sites are `inspiration_only`, and none are `APPROVED` or `TRUSTED`.

## Suggested study pass

For each live site, record a desktop and mobile page capture, initial and scrolled section order, interaction trigger, keyboard behavior, reduced-motion fallback, and any computed duration/easing. Separate direct observation from inference. Then sketch an original mechanism that fits a specific user task and the project's approved design contract. Promote a Brain pattern only after the mechanism and limitations are recorded; never use a screenshot as an asset source.
