# Campaa AI

Chatbot AI Cerdas dengan Multi-Mode Kecerdasan, Tool System, dan Integrasi Agent Otonom.

## Fitur Utama

### AI Modes (15 Mode)
- **Mode Umum** - Asisten umum untuk semua pertanyaan
- **Mode Riset** - Analisis mendalam dan struktur riset
- **Mode Penulis** - Penulisan teks panjang dan kreatif
- **Mode Strategi Bisnis** - Strategi produk digital dan monetisasi
- **Mode Coding** - Debugging dan arsitektur aplikasi
- **Mode Ebook Architect** - Arsitektur dan produksi ebook
- **Mode Reviewer** - Quality assurance dan feedback
- **Mode Strategi Produk Digital** - Angle produk dan konten
- **Mode GitHub Assistant** - Repository dan workflow
- **Mode Deep Reasoning** - Pemecahan masalah kompleks
- **Mode Tool Commander** - Memilih dan mengoperasikan tool
- **Mode Ebook Production Architect** - Pipeline produksi ebook
- **Mode Autonomous Agent Supervisor** - Mengawasi agent otonom
- **Mode Safety Reviewer** - Pengecekan risiko keamanan
- **Mode Business Builder** - Produk digital dan monetisasi

### Multi-Provider Support
- **Demo Mode** - Respons simulasi offline (default, tanpa biaya)
- **OpenAI** - GPT-4o-mini, GPT-4o (butuh `OPENAI_API_KEY`)
- **Gemini** - Google Gemini 1.5 Flash/Pro (butuh `GEMINI_API_KEY`)
- **OpenRouter** - Multi-provider AI (butuh `OPENROUTER_API_KEY`)

### Tool System
1. **Calculator** - Perhitungan dan estimasi biaya AI
2. **Prompt Tool** - Enhance prompt untuk riset, ebook, coding, audit, bisnis
3. **Markdown Export** - Export chat ke Markdown/TXT/JSON
4. **Task Planner** - Pecah tugas kompleks jadi langkah
5. **Repository Helper** - Generate README, issue template, workflow
6. **Ebook Agent Bridge** - Integrasi dengan DIL Autonomous Ebook Agent

### Agent Pipeline
- Intent detection otomatis
- Tool routing berdasarkan intent
- Cost guard untuk batas penggunaan
- Memory system untuk conversation history

### Ebook Agent Bridge
- Generate GitHub Issue body untuk produksi ebook
- Generate session checklist
- Analyze artifact dari ebook agent
- Build repair prompt untuk output yang gagal

## Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build untuk production
npm run build

# Type check
npm run typecheck
```

Akses: http://localhost:5173

## Deployment ke Vercel

1. Push ke GitHub
2. Import repository di vercel.com
3. Set environment variables:
   - `OPENAI_API_KEY`
   - `GEMINI_API_KEY`
   - `OPENROUTER_API_KEY`
4. Deploy

Lihat [docs/DEPLOY.md](docs/DEPLOY.md) untuk panduan lengkap.

## Environment Variables

| Variable | Provider | Required | Notes |
|----------|----------|----------|-------|
| `OPENAI_API_KEY` | OpenAI | Opsional | Untuk GPT models |
| `GEMINI_API_KEY` | Google | Opsional | Untuk Gemini models |
| `OPENROUTER_API_KEY` | OpenRouter | Opsional | Multi-provider |

Tanpa environment variables, chatbot berjalan dalam mode demo.

## Keamanan

- API key hanya di server-side (Vercel environment variables)
- Frontend tidak pernah memegang API key
- localStorage hanya untuk data lokal user
- Sensitive data disensor di error messages
- Action system memerlukan approval untuk operasi eksternal

Lihat [docs/SECURITY.md](docs/SECURITY.md) untuk detail.

## Tool System

Tool berjalan di frontend tanpa biaya API. Lihat [docs/TOOLS.md](docs/TOOLS.md).

## Action System

Action draft memerlukan approval sebelum eksekusi. Lihat [docs/ACTIONS.md](docs/ACTIONS.md).

## Ebook Agent Bridge

Integrasi dengan DIL Autonomous Ebook Agent repository. Lihat [docs/EBOOK_AGENT_BRIDGE.md](docs/EBOOK_AGENT_BRIDGE.md).

## Struktur Folder

```
Campaa/
├── api/
│   └── chat.ts              # Backend API (Vercel serverless)
├── src/
│   ├── main.tsx             # Entry point
│   ├── App.tsx              # Main component
│   ├── styles.css           # Global styles
│   ├── components/          # UI components
│   ├── pages/               # Page components
│   ├── lib/                 # Utilities
│   │   ├── types.ts         # TypeScript types
│   │   ├── prompts.ts       # AI mode prompts
│   │   ├── storage.ts       # localStorage helpers
│   │   ├── api.ts           # API client
│   │   ├── memory.ts        # Conversation memory
│   │   ├── costGuard.ts     # Cost estimation
│   │   └── promptEnhancer.ts # Prompt tools
│   ├── tools/               # Tool system
│   │   ├── calculatorTool.ts
│   │   ├── promptTool.ts
│   │   ├── markdownExportTool.ts
│   │   ├── taskPlannerTool.ts
│   │   ├── repositoryHelperTool.ts
│   │   ├── ebookAgentTool.ts
│   │   ├── toolRouter.ts
│   │   └── toolRegistry.ts
│   ├── agent/               # Agent pipeline
│   │   ├── intentDetector.ts
│   │   ├── taskPlanner.ts
│   │   └── agentPipeline.ts
│   ├── actions/             # Action system
│   │   ├── actionTypes.ts
│   │   ├── actionRegistry.ts
│   │   └── approvalGate.ts
│   └── integrations/        # External integrations
│       └── ebookAgentBridge.ts
├── docs/                    # Documentation
│   ├── SETUP.md
│   ├── DEPLOY.md
│   ├── SECURITY.md
│   ├── TOOLS.md
│   ├── ACTIONS.md
│   ├── EBOOK_AGENT_BRIDGE.md
│   └── ROADMAP.md
├── public/
│   └── favicon.svg
├── package.json
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.api.json
├── vite.config.ts
└── index.html
```

## Tech Stack

- **Frontend**: Vite 6 + React 18 + TypeScript 5
- **Backend**: Vercel Serverless Functions
- **Storage**: localStorage (client-side)
- **Deployment**: Vercel

## Batasan

- **Kuota API** - Tergantung provider yang digunakan
- **Token limit** - Maks 2000 tokens per response
- **No persistence** - Data hanya di localStorage
- **Single conversation** - Tidak ada multi-tab

## Roadmap

Lihat [docs/ROADMAP.md](docs/ROADMAP.md) untuk fitur yang direncanakan.

## License

MIT