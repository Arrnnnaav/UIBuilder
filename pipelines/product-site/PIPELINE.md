# Pipeline: product-site

**For:** a product's public marketing and launch website. This recipe does not build the product application itself.
**Default hosting:** Vercel Hobby for personal/non-commercial work; commercial sites use a client-owned Cloudflare account.

## Intake (discovery first, contract version 2)
Start with the owner's starting facts, then audit comparable products' public sites with `node scripts/competitor-audit.mjs` and write the questions and suggested additions from that evidence into `docs/DISCOVERY.md` (the owner decides each addition; G1 checks the record). The list below is the fact base the discovery must end up with.

Capture the product's actual job, audience, differentiator, proof, launch goal, current product screenshots or demo, brand constraints, ownership, and conversion action. Claims, roadmap items, customer logos, metrics, and endorsements require evidence or explicit client approval.

## Experience contract

- Build an original narrative around the product's real workflow: show the before state, meaningful product action, and verified result.
- The memorable moment must clarify the product. Motion should reveal cause/effect, progress, transformation, or an interaction the visitor can try.
- S1/S2 can use local standalone HTML previews only. G2 presents at least two distinct, offline, paired HTML + concise Markdown concepts. G2.5 reviews the selected interaction and reduced-motion equivalent. No production UI before approvals.
- Keep the main explanation readable without animation; add keyboard, touch, reduced-motion and low-bandwidth modes. Do not fake a live product or fabricate product data.

## Typical public pages

Choose from Home, Product, Use cases, Pricing (only when supplied), About, Changelog, Docs, Contact, Privacy, Terms, and 404. The brief determines the actual IA. Add app auth, billing, databases, or product APIs only through a separate application scope.

## Verification additions

Follow root gates and production audit. Verify every product claim against a source, interactions without motion, media budgets, responsive states, and CTA destination. Assess visual storytelling with `docs/VISUAL_OUTCOME.json` and its evidence refs; owner review is distinct from automated checks.
