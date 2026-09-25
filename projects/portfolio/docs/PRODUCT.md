# PRODUCT — portfolio

> Draft by the Orchestrator on 2026-09-25, from `ArnavResume.pdf` and `docs/CONTENT_SOURCE.md`. Items marked ⚠ need the owner to confirm (see §Open questions).

- **Type:** portfolio
- **One line (G1-approved 2026-09-25):** "I build backends and AI pipelines that are fast, auditable and honest about their numbers."
- **Owner:** Arnav Khandelwal, Software Engineer, B.Tech Electrical Engineering at MNIT Jaipur (Aug 2023 onward). GitHub `Arrnnnaav`.
- **Audience:**
  - *Primary:* recruiters and engineering managers hiring backend/AI engineers (internships, then new-grad roles).
  - *Secondary:* hackathon judges, collaborators, and founders looking for a freelance backend/AI builder.
- **Job to be done:** within 60 seconds, a visitor believes "this person ships real backends and AI systems, measures them, and is honest about the numbers", then contacts him or opens GitHub.
- **Primary conversion:** contact (email or form). Secondary: opening the GitHub or LinkedIn profile, or downloading the résumé.
- **Pages:** see IA. Default from the recipe:
  - `/`, `/work`, `/work/[slug]`, `/about`, `/contact`
  - `/resume` (only if he provides a PDF)
- **Content inventory:**
  - **Six flagship case studies** (CONTENT_SOURCE §4):
    - Project Edge Node
    - Cited Multi-Agent Researcher
    - LedgerBridge
    - GhostCursor (AIOS)
    - NeuroUX
    - StudyOS
  - **BusinessHQ** is pending until the owner shares material.
  - **"More work" groups** (§3):
    - agents and evaluation
    - retrieval and NLP
    - learning tools
    - hyperspectral classification
    - classical CV
    - the 2025 CV experiments, as one tile
  - **Bio draft:** §5.
  - **Achievements:** Amazon ML Summer School '25, JEE Main 98.6 percentile, Asian Championship skating bronze (2018).
  - **Missing:** headshot, project screenshots and videos, résumé PDF, confirmed email.
- **Tone (3 words):** precise, calm, engineered. ⚠ The owner confirms their own vibe words.
- **Differentiator to carry into the design:** evidence. Every claim has a source, and numbers are shown as measured results (before → after, n=, method). The visual identity can borrow from benchmark reports, diffs and terminals without becoming a hacker cliché.
- **Must avoid:** generic dev-portfolio templates (a gradient hero with a headshot and skill bars), inflated claims, stock images, and anything in `brain/preferences.md` → Avoid.
- **Constraints:**
  - Vercel Hobby at $0 (personal, non-commercial).
  - No auth, no DB.
  - The contact form uses the starter's server action + Turnstile + Resend free tier.
  - Domain: none yet ⚠.
- **Success metrics:**
  - G3 green.
  - Lighthouse ≥ 90 on mobile.
  - Every flagship has a case study with a sourced result.
  - It gets indexed for "Arnav Khandelwal".
  - Contact submissions are tracked in PostHog, if a key is set.

## Open questions (for G1)
1. Email: `arnavkhandelwal446@email.com` looks like a typo. What is the real address?
2. LinkedIn URL. Location to display ("Jaipur, India"?).
3. Positioning line: pick one of the 3 options, or supply your own. Also 3 vibe words.
4. May Project Edge Node be shown publicly and named with Dehurdle?
5. BusinessHQ: share material, or leave it out of V1?
6. Three résumé numbers have no public source: Cited Researcher 152s→26s, BusinessHQ 180ms→35ms, BusinessHQ 35+ tests. Show them as "résumé-attested", or drop them?
7. Cited Researcher date: Jun 2026 (résumé) or Jul 2026 (repo)?
8. StudyOS: solo or team?
9. Can you supply a headshot, screenshots or recordings, and the résumé PDF? Until then, the design uses generated diagrams or charts built from the real benchmark data.
10. Domain?

## G1 decisions (2026-09-25, owner)
- Positioning: "fast, auditable, honest" (above).
- **Résumé numbers without a public source** (Cited Researcher 152s→26s; BusinessHQ 180ms→35ms and 35+ tests; Edge Node Q4_K_M): the owner will commit sources to the repos. Until then, those rows are **hidden**, and only repo-sourced numbers ship. The evidence data model keeps the rows with `status: "pending-source"`, so they appear once a source URL is filled in.
- G1 approved, so the project goes on to S3 Design Council.
