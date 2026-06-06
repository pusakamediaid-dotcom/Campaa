# Campaa AI

Chatbot AI Cerdas dengan Multi-Mode Kecerdasan untuk Produktivitas.

## Fitur Utama

- **9 Mode Kecerdasan**: General, Riset, Penulis, Bisnis, Coding, Ebook Architect, Reviewer, Strategi Produk Digital, GitHub Assistant
- **Multi-Provider**: OpenAI, Gemini, OpenRouter (plus mode demo)
- **Chat Interface Modern**: Responsive, mobile-friendly
- **Prompt Enhancer**: Perjelas dan kuatkan pertanyaan
- **Conversation Memory**: Simpan riwayat chat di localStorage
- **Export Chat**: Download sebagai Markdown atau TXT
- **Mode Demo**: Berjalan tanpa API key untuk keamanan

## Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build untuk production
npm run build
```

## Mode Kecerdasan

| Mode | Deskripsi |
|------|-----------|
| Mode Umum | Asisten umum untuk semua pertanyaan |
| Mode Riset | Analisis mendalam dan struktur riset |
| Mode Penulis | Penulisan teks panjang dan kreatif |
| Mode Strategi Bisnis | Strategi produk digital dan monetisasi |
| Mode Coding | Debugging dan arsitektur aplikasi |
| Mode Ebook Architect | Arsitektur dan produksi ebook |
| Mode Reviewer | Quality assurance dan feedback |
| Mode Strategi Produk Digital | Angle produk dan konten |
| Mode GitHub Assistant | Repository dan workflow |

## Deployment

Lihat [docs/DEPLOY.md](docs/DEPLOY.md) untuk panduan deploy ke Vercel.

## Keamanan

Lihat [docs/SECURITY.md](docs/SECURITY.md) untuk panduan keamanan.

## Setup

Lihat [docs/SETUP.md](docs/SETUP.md) untuk panduan setup lokal.

## Environment Variables

Untuk mengaktifkan API backend, set environment variables berikut:

- `OPENAI_API_KEY` - untuk OpenAI GPT
- `GEMINI_API_KEY` - untuk Google Gemini
- `OPENROUTER_API_KEY` - untuk OpenRouter

Tanpa environment variables, chatbot berjalan dalam mode demo.

## Tech Stack

- Vite + React + TypeScript
- Vercel Serverless Functions (backend)
- localStorage (client-side storage)

## Lisensi

MIT License