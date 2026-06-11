# Campaa AI

Premium AI assistant demo with multi-mode intelligence, local tools, Campaa Lite, and optional provider integrations.

Campaa AI is designed as a premium-looking AI assistant demo website for content, research, coding, business strategy, and ebook workflow planning. It is positioned as a public portfolio demo, not as a production SaaS or guaranteed income system.

## Live Demo

https://campaa-2xas.vercel.app

## Current Status

**Published Premium Demo Website — v1.2.0 Smart Demo Upgrade**

Campaa is published as a public portfolio demo website on Vercel. Campaa Lite is the default no-cost mode. OpenAI, Gemini, and OpenRouter are optional provider modes and require server-side environment configuration if enabled.

Recommended repo description:

> Premium AI assistant demo with multi-mode intelligence, local tools, smart demo mode, and optional provider integrations.

## v1.2.0 Upgrade Scope

- Smart Demo Mode through Campaa Lite.
- Context-aware fallback when external provider routes are unavailable.
- Premium mobile chat UI with sticky compact header and input area.
- Friendly provider error handling without raw technical errors.
- No API key required for the default demo experience.

## Core Features

### AI Modes: 15 Modes

- **Mode Umum** — general assistant for broad questions.
- **Mode Riset** — research structure and analysis.
- **Mode Penulis** — long-form and creative writing support.
- **Mode Strategi Bisnis** — digital product and monetization strategy.
- **Mode Coding** — debugging and app architecture help.
- **Mode Ebook Architect** — ebook architecture and production planning.
- **Mode Reviewer** — quality assurance and feedback.
- **Mode Strategi Produk Digital** — product and content angles.
- **Mode GitHub Assistant** — repository and workflow assistance.
- **Mode Deep Reasoning** — complex problem solving.
- **Mode Tool Commander** — tool selection and orchestration.
- **Mode Ebook Production Architect** — ebook production pipeline planning.
- **Mode Autonomous Agent Supervisor** — supervision pattern for agent workflows.
- **Mode Safety Reviewer** — security and risk review.
- **Mode Business Builder** — digital product and business planning.

### Tool System

- **Calculator** — simple calculation and AI cost estimation.
- **Prompt Tool** — prompt enhancement for research, ebook, coding, audit, and business workflows.
- **Markdown Export** — export chat into Markdown, TXT, or JSON.
- **Task Planner** — break complex work into actionable steps.
- **Repository Helper** — generate repository documentation and workflow drafts.
- **Ebook Agent Bridge** — bridge for ebook workflow planning and issue/checklist generation.

### Agent Pipeline

- Intent detection.
- Tool routing based on intent.
- Cost guard for usage awareness.
- Memory system for conversation history.

## Campaa Lite / Demo Mode Explanation

Campaa Lite is the default no-cost mode. It now reads the user's message and provides contextual responses for ebook, research, prompt, coding, business, security, UI, and general requests.

Use Campaa Lite for the default public Vercel demo. This keeps the demo safe, predictable, and accessible without requiring paid provider access from visitors.

## AI Provider Explanation

Campaa includes optional provider paths for:

- OpenAI
- Gemini
- OpenRouter

These provider modes are optional. They require server-side environment configuration if enabled on Vercel or another hosting platform.

Without provider environment configuration, Campaa continues with Campaa Lite fallback instead of showing raw technical errors.

## Security Note

No private provider credential is committed to this repository. Do not add real provider credentials to README, source code, or documentation.

Security principles:

- Provider credentials should only be stored as server-side environment variables in the hosting dashboard.
- Frontend code should not contain private provider credentials.
- Local user data is stored in localStorage.
- Sensitive details should be avoided in public issues, commits, and docs.
- Action-style workflows should require user review before external execution.

See [docs/SECURITY.md](docs/SECURITY.md) for more details.

## Deployment Note

Recommended deployment path:

- Vercel Hobby.
- Vite framework.
- Campaa Lite as default.
- No paid provider access required for the initial public demo.

The current Vercel demo URL is listed in the Live Demo section above.

See [docs/VERCEL_FREE_DEPLOYMENT_CHECKLIST.md](docs/VERCEL_FREE_DEPLOYMENT_CHECKLIST.md) for deployment preparation.

## Tech Stack

- Vite 6
- React 18
- TypeScript 5
- Vercel Serverless Functions
- localStorage for client-side data
- GitHub Actions for CI

## Local Development

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Run the app typecheck:

```bash
npm run typecheck
```

Run the full repository check:

```bash
npm run check
```

Local app URL:

```text
http://localhost:5173
```

## Documentation Links

- [docs/SETUP.md](docs/SETUP.md) — setup notes.
- [docs/DEPLOY.md](docs/DEPLOY.md) — deployment notes.
- [docs/SECURITY.md](docs/SECURITY.md) — security documentation.
- [docs/TOOLS.md](docs/TOOLS.md) — tool system overview.
- [docs/ACTIONS.md](docs/ACTIONS.md) — action system documentation.
- [docs/EBOOK_AGENT_BRIDGE.md](docs/EBOOK_AGENT_BRIDGE.md) — Ebook Agent Bridge documentation.
- [docs/ROADMAP.md](docs/ROADMAP.md) — planned direction.
- [docs/PREMIUM_DEMO_PUBLICATION_PLAN.md](docs/PREMIUM_DEMO_PUBLICATION_PLAN.md) — premium demo publication plan.
- [docs/VERCEL_FREE_DEPLOYMENT_CHECKLIST.md](docs/VERCEL_FREE_DEPLOYMENT_CHECKLIST.md) — Vercel Hobby deployment checklist.
- [docs/PUBLICATION_READINESS_REVIEW.md](docs/PUBLICATION_READINESS_REVIEW.md) — final publication readiness review.

## Project Structure

```text
Campaa/
├── api/
│   └── chat.ts
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── styles.css
│   ├── components/
│   ├── pages/
│   ├── lib/
│   ├── tools/
│   ├── agent/
│   ├── actions/
│   └── integrations/
├── docs/
│   ├── SETUP.md
│   ├── DEPLOY.md
│   ├── SECURITY.md
│   ├── TOOLS.md
│   ├── ACTIONS.md
│   ├── EBOOK_AGENT_BRIDGE.md
│   ├── ROADMAP.md
│   ├── PREMIUM_DEMO_PUBLICATION_PLAN.md
│   ├── VERCEL_FREE_DEPLOYMENT_CHECKLIST.md
│   └── PUBLICATION_READINESS_REVIEW.md
├── public/
│   └── favicon.svg
├── package.json
├── package-lock.json
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.api.json
├── vite.config.ts
└── index.html
```

## Limitations

- Campaa is not positioned as a paid production SaaS yet.
- Campaa Lite is the recommended default for public no-budget deployment.
- Real provider modes require server-side environment configuration.
- Provider quota and token limits depend on the selected provider.
- Data persistence is limited to localStorage.
- No user account system is included.
- No external database is included.

## Publication Status

Campaa has been prepared and published as a premium demo website on Vercel. v1.2.0 improves the chat experience, smart demo behavior, fallback handling, and mobile-first UI polish. The remaining manual steps are to verify the public demo after deployment and create the first GitHub release tag.

## License

MIT
