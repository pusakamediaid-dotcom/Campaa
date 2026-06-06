# Panduan Setup Campaa AI

## Persyaratan

- Node.js 18 atau lebih baru
- npm atau yarn

## Cara Menjalankan Lokal

### 1. Clone Repository

```bash
git clone https://github.com/pusakamediaid-dotcom/Campaa.git
cd Campaa
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Jalankan Development Server

```bash
npm run dev
```

Akses aplikasi di `http://localhost:5173`

### 4. Build untuk Production

```bash
npm run build
```

Output akan ada di folder `dist/`

## Struktur Folder

```
Campaa/
├── src/
│   ├── main.tsx          # Entry point
│   ├── App.tsx           # Main component
│   ├── styles.css        # Global styles
│   ├── components/       # React components
│   │   ├── ChatWindow.tsx
│   │   ├── ChatInput.tsx
│   │   ├── MessageBubble.tsx
│   │   ├── ModeSelector.tsx
│   │   ├── ProviderSelector.tsx
│   │   ├── Sidebar.tsx
│   │   └── SettingsPanel.tsx
│   ├── lib/              # Utilities dan konfigurasi
│   │   ├── types.ts
│   │   ├── prompts.ts
│   │   ├── storage.ts
│   │   ├── api.ts
│   │   └── promptEnhancer.ts
│   └── pages/            # Page components
│       ├── Home.tsx
│       └── Chat.tsx
├── api/
│   └── chat.ts           # Backend API (Vercel serverless)
├── public/
│   └── favicon.svg
├── docs/
│   ├── SETUP.md
│   ├── DEPLOY.md
│   └── SECURITY.md
├── package.json
├── vite.config.ts
├── tsconfig.json
└── index.html
```

## Mode yang Tersedia

1. **Mode Umum** - Asisten umum untuk semua pertanyaan
2. **Mode Riset** - Analisis mendalam dan struktur riset
3. **Mode Penulis** - Penulisan teks panjang dan kreatif
4. **Mode Strategi Bisnis** - Strategi produk digital dan monetisasi
5. **Mode Coding** - Debugging dan arsitektur aplikasi
6. **Mode Ebook Architect** - Arsitektur dan produksi ebook
7. **Mode Reviewer** - Quality assurance dan feedback
8. **Mode Strategi Produk Digital** - Angle produk dan konten
9. **Mode GitHub Assistant** - Repository dan workflow

## Provider AI

- **Demo** - Mode offline (default, tidak butuh API key)
- **OpenAI** - GPT-4 (butuh OPENAI_API_KEY)
- **Gemini** - Google AI (butuh GEMINI_API_KEY)
- **OpenRouter** - Multi-provider (butuh OPENROUTER_API_KEY)

## Catatan

- Mode demo berjalan tanpa API key
- Untuk fitur penuh, deploy ke Vercel dan set environment variables
- API key tidak pernah disimpan di frontend