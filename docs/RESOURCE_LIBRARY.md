# Brain resource library

## Where resources live

`brain/resources.json` is the single resource catalog. Each object is one source, skill, tool, guide, or reusable research item. `brain/schema/resource.schema.json` defines the entry contract, and `node scripts/validate-brain.mjs` checks it. The `/intake` command adds sources; `scripts/recommend-resources.mjs` ranks them for a pipeline stage and task.

Related Brain files:

- `brain/domains.json` maps pipeline stages to agents, output files, and resource categories.
- `brain/tools.json` records tool capabilities, availability conditions, approvals, and fallbacks. Listing a tool does not install or enable it.
- `brain/patterns/*.json` records reusable mechanisms with source provenance and trust.
- `brain/preferences.md` stores broader owner taste and standing preferences. It is not a replacement for a source-specific `my_take`.
- `brain/builds/<slug>.json` records which resources and patterns informed a project.

## `my_take` — owner interpretation

Every resource entry has a `my_take` string. It is intentionally blank (`""`) until the owner fills it. Write in your own words; it should explain how the source could help a real project, not repeat its marketing description.

Useful notes usually cover:

1. **When I would reach for it** — the kind of project or task.
2. **What I would study or use** — an interaction mechanism, workflow, constraint, or verified capability.
3. **A concrete idea** — how that mechanism could become an original feature or visual in one of your projects.
4. **Limits** — what must not be copied, what needs a license check, or what should be avoided for accessibility, mobile, performance, or cost.

Example:

```json
"my_take": "For a product walkthrough, study how motion reveals one step at a time. Rebuild the sequence with our own interface and content; keep a static/mobile version and respect reduced motion."
```

The recommender includes `my_take` beside a resource when it prints ready items and the review queue. It currently does not change trust, rank, rights, tool availability, or gate outcomes based on that note. A note is useful guidance from the owner; it does not grant permission to reuse source code, assets, text, or media.

## How to fill the catalog

The easiest way to annotate the full library is through a spreadsheet:

```powershell
node scripts/resource-notes.mjs export
```

This creates `brain/resource-my-takes.csv` with `id`, `name` and `my_take` columns; open it in Excel or another spreadsheet editor and fill the `my_take` column. Import your annotations back into the canonical JSON catalog with:

```powershell
node scripts/resource-notes.mjs import
```

Import matches rows by stable resource `id`, preserves other resource metadata, rejects duplicate or unknown IDs, and supports commas, quotes, newlines and Unicode. You can also edit a resource's `my_take` directly in `brain/resources.json`.

Then run:

```powershell
node scripts/validate-brain.mjs
node scripts/recommend-resources.mjs taste "story-led product walkthrough"
```

The first command checks the catalog. The second shows whether your note is available to the relevant agent. Editing `my_take` does not approve an unreviewed source or tool; `trust`, license, `usage_mode`, and router availability remain separate controls.
