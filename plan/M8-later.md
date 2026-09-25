# M8 — Later (only once there's budget or need)

- **Media:** enable MiniMax H3 (API key or local GPU), Higgsfield MCP and HeyGen in `brain/tools.json`, for hero video and product clips.
- **AI-citation tracking:** a scheduled prompt set sent to AI engines to count brand mentions. It costs money, so it stays off by default.
- **SaaS recipe:** Clerk + Supabase + Stripe + Upstash, with Storybook.
- **Brain v2:** Supabase Postgres + pgvector, once JSON search starts to miss.
- **Brain v3:** a knowledge graph.
- **More recipes:** ai-workspace, business-dashboard.
- **GhostCursor "AI Design Studio"** integration. It needs a hosted agent runtime. Candidates:
  - Claude Agent SDK: preferred, because it reuses `.claude/agents` and the skills
  - Google ADK (`google-adk-python` in the brain): Apache-2.0; Gemini/Vertex hosting; built-in evals
  - Vercel eve
