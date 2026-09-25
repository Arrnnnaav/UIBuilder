---
description: Add new links/resources to the Designer Brain — /intake <urls or notes>
argument-hint: <urls...>
---

Resources to add: `$ARGUMENTS`

For each one:
1. Skip it if its URL already exists in `brain/resources.json`, and report that it was skipped.
2. Classify it: open it via WebFetch, or Playwright for JS-heavy sites. For a GitHub repo, use `gh repo view <owner/repo> --json description,licenseInfo,pushedAt,stargazerCount,isArchived`.
3. Write the entry against `brain/schema/resource.schema.json`:
   - id (kebab-case), type, categories;
   - **usage_mode**: dependency | direct_or_reference | code_reference | inspiration_only | skill | optional_tool | research_only;
   - best_for;
   - trust `NEW`, or `REVIEWED` if you verified it;
   - license and maintenance (for repos: last push, archived, licence SPDX);
   - do_not_copy (for sites);
   - provenance `{type:"intake", url, observed_at}`.
4. If it shows a reusable mechanism, add a pattern to `brain/patterns/<category>.json` with `sources: [{resource, confidence}]`.
5. If a tool is paid, register it in `brain/tools.json` with `enabled_if` gated. Never enable it.

Finish by running `node scripts/validate-brain.mjs`, and print a summary table of what was added (id, usage_mode, trust, patterns).
