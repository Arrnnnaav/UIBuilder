# DISCOVERY — {{slug}}

The brief is researched first and asked second. Order: (1) the owner gives the starting facts, (2) `research` audits the client's current site and 3 to 8 competitors (`node scripts/competitor-audit.mjs {{slug}} --sites <urls> --client <url>`), (3) tailored questions are written from what the evidence shows, (4) the owner answers, (5) additions are proposed with evidence and the owner decides each. Nothing here is a fixed questionnaire: delete questions the evidence already answers, and add ones it raises.

## 1. Starting facts (from the owner)
- **Company / person:**
- **What they sell or do:**
- **Who buys:**
- **City / service area:**
- **Current site URL (if any):**
- **Competitors the owner already knows:**
- **Anything the owner already wants explicitly (features, resources, look):**

## 2. Evidence (from research)
- `docs/CLIENT_SITE.md`, `docs/COMPETITORS.md`, `docs/COMPETITOR_MATRIX.md`, `docs/COMPETITOR_AUDIT.json`
- **What competitors consistently show:**
- **What they do well (worth matching):**
- **Where they are weak (room to be better):**
- **Speed, accessibility and SEO snapshot (from the audit):**

## 3. Tailored questions
One row per question. Each must cite the evidence that raised it. The owner sets the status to `answered` or `skipped`.

| # | Question | Why we ask (evidence) | Suggested default | Answer (owner) | Status |
|---|---|---|---|---|---|
| 1 | | | | | open |
| 2 | | | | | open |
| 3 | | | | | open |

## 4. Suggested additions
Ideas from the competitor gap that the owner may not have thought of. The owner decides each: `accept`, `reject` or `defer`. Accepted ones go to the product-manager as capabilities.

| ID | Addition | Evidence | Effort (S/M/L) | Cost / risk | Decision | Decided by / date |
|---|---|---|---|---|---|---|
| A1 | | | | | open | |

## 5. Fixed checks
Always asked, because they change legal, cost or ownership.

| Topic | Question | Answer |
|---|---|---|
| Ownership | Who owns the domain, hosting, GitHub, email and analytics accounts? | |
| Legal | Which licenses, disclaimers, privacy or consent text must appear, and what claims must not be made? | |
| Conversion | What is the single main action a visitor should take? | |
| Contact | Which phone, email, address and hours are public? | |

## 6. Notes
Competitor exception: (only if fewer than 3 competitors could be audited, say why)
