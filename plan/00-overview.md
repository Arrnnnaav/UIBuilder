# 00 — Overview

## Goal
Take an idea to a premium, tested, production-ready website, and then keep improving it: BusinessOS
finds SEO/AEO/GEO fixes, the owner approves them, and they ship as a PR, a preview and a publish.

## Systems
- **UIBuilder** (this repo) is the Claude Code multi-agent pipeline plus the Designer Brain. Rules are in `AGENTS.md`.
- **BusinessOS** (`D:\PROJECTS\abc\business-os`) is the owner dashboard: approvals, audit, SEO vertical, and the new git-site connector (spec R7).

## First targets
1. **Personal portfolio**: Vercel Hobby, $0. It's also the dogfood site for the BusinessOS loop.
2. **ABizCreator** (https://abizcreator.com/): the first commercial client. Cloudflare Workers in the client's account, $0. Adds a blog and case studies.

## Architecture
```
idea → Orchestrator ─┬─ research ─┐
                     ├─ ux ───────┼─ G1 → design-director (A|B|C → hybrid) → G2
                     └─ backend ──┘
      → ‖ frontend ‖ backend ‖ growth → visual review/polish → ship ‖ QA ‖ sec ‖ perf ‖ growth audit
      → G3 → deploy → /connect → BusinessOS ←→ owner approvals → PR → preview → publish
Designer Brain (resources · patterns · taste · builds · trust) feeds every stage; /learn writes back.
Tool Router = brain/tools.json allowlists; paid tools are registered but disabled.
```

## Phases
| Phase | File | Summary |
|---|---|---|
| M0 | `M0-setup.md` | spec conflict fixed, rulebook, tooling, MCPs, skills |
| M1 | `M1-skeleton-brain.md` | repo skeleton, templates, tool registry, brain seeded from links.docx |
| M2 | `M2-marketing-starter.md` | production starter with the SEO contract and full test suite |
| M3 | `M3-agents-recipes.md` | 7 subagents, commands, portfolio + company-site recipes |
| M4 | `M4-portfolio.md` | portfolio built end to end and live |
| M5 | `M5-businessos-connector.md` | BusinessOS: site connector, git connector, AEO/GEO, policy, tests |
| M6 | `M6-dashboard-dogfood.md` | dashboard UI plus a real approve→PR→publish on the portfolio |
| M7 | `M7-abizcreator.md` | client site end to end, connected to their tenant |
| M8 | `M8-later.md` | media tools, AI-citation tracking, SaaS recipe, pgvector |

Status is tracked in `PROGRESS.md`; decisions are in `DECISIONS.md`.
