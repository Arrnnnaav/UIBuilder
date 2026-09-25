---
description: Hand a shipped site to BusinessOS for SEO/AEO/GEO maintenance — /connect <slug>
argument-hint: <slug>
---

Project: `projects/$ARGUMENTS`.

1. Verify that `seo.manifest.json` exists and that `site.url` matches the live URL. Update it if needed, commit it, and ask the user before pushing.
2. Collect the connection values:
   - repo `owner/name` (from `git remote get-url origin`)
   - default branch
   - live site URL
   - host (vercel | cloudflare)
3. Tell the user to create a **fine-grained GitHub PAT** limited to this one repo, with Contents: read/write and Pull requests: read/write. They keep it and paste it into BusinessOS; never ask them to paste it here.
4. If BusinessOS is running locally (`BUSINESSOS_URL`, default http://127.0.0.1:4173), explain that the owner connects the site from the dashboard (Website connection) or via `POST /api/sites` with `{ repoUrl: "https://github.com/<owner>/<repo>", defaultBranch, siteUrl (https only), token }`; the server health-checks the token (push permission) and the manifest before saving. Otherwise print the values as a checklist.
5. After connecting, run the first audit from the dashboard, or `GET /api/sites/audit`. Record the finding counts in `docs/GROWTH_REPORT.md` and `plan/PROGRESS.md`.

Security: never write the token to any file, log or chat.
