# Launch-day checklist — {{slug}}

Mark each line `ready`, `blocked`, `not applicable (reason)`, or `not verified`; attach the command/result, URL, owner and timestamp. A checked box without evidence is not a pass.

## Product and generated-code cleanup
- [ ] No misleading placeholder/dummy/testimonial/statistic or framework starter content
- [ ] No debug UI/logging, accidental localhost links, unused dependencies or unresolved TODOs
- [ ] Public content and claims match owner-approved source material

## UI and devices
- [ ] Primary routes reviewed at desktop, tablet, mobile, small mobile and landscape widths
- [ ] No overflow, overlap, broken sticky/fixed elements or unusable controls
- [ ] Keyboard, touch targets, focus visibility and reduced-motion behavior verified
- [ ] Visual identity matches approved `DESIGN.md`; any redesign has a fresh G2/G2.5 approval

## Routes and states
- [ ] Navigation, internal/external/social/contact links and refresh/deep links work
- [ ] 404/error pages and relevant loading, success, empty, error, retry and disabled states work
- [ ] No unintended localhost or staging destinations in generated output

## SEO and media
- [ ] Titles, descriptions, canonical, robots, sitemap, structured data and OG metadata audited
- [ ] Images have accurate alt text, dimensions and appropriate responsive/lazy loading
- [ ] Video has reviewed poster, captions/transcript, controls, source/rights check and no autoplay

## Accessibility and performance
- [ ] Configured axe/accessibility checks and critical keyboard flows pass
- [ ] Production performance checks meet the project’s current thresholds on required routes
- [ ] Layout shift, JS/font/media payloads and animation cost were inspected

## Backend, security and AI (when applicable)
- [ ] Forms/APIs validate server-side and handle success, failure, timeout and rate limits
- [ ] Auth/authz, CORS, cookies, headers/CSP and safe error responses checked
- [ ] No exposed secrets; dependency and configured security scans have recorded results
- [ ] AI provider keys stay server-side; privacy, prompt-injection, cost and failure behavior checked

## Release operations
- [ ] Production environment-variable names/configuration checked without exposing values
- [ ] Domain, HTTPS, redirects, cache, monitoring, analytics, backups and rollback owner identified
- [ ] CI/CD and production build/preview checks pass
- [ ] G3 evidence is complete and fresh
- [ ] Exact local release and target reviewed; G3.5 approval is recorded before external deployment
- [ ] Domain/DNS actions have separate explicit approval where needed

## Evidence and owner

- Audit report: `docs/PRODUCTION_READINESS_REPORT.md`
- Exact launch target: TODO
- Remaining items/owner: TODO
- Reviewed by / date: TODO
