# Panduan Deploy Campaa AI

## Deploy ke Vercel (Recommended)

### Langkah 1: Push ke GitHub

```bash
git add .
git commit -m "Initial Campaa AI setup"
git push origin main
```

### Langkah 2: Import ke Vercel

1. Buka [vercel.com](https://vercel.com)
2. Klik "Import Project"
3. Pilih repository `Campaa`
4. Vercel akan auto-detect konfigurasi

### Langkah 3: Set Environment Variables

Di Vercel Dashboard > Settings > Environment Variables:

```
OPENAI_API_KEY=sk-your-openai-key-here
GEMINI_API_KEY=your-gemini-key-here
OPENROUTER_API_KEY=your-openrouter-key-here
```

### Langkah 4: Deploy

1. Klik "Deploy"
2. Tunggu proses selesai
3. Dapatkan URL production

### Langkah 5: Custom Domain (Optional)

1. Buka Settings > Domains
2. Tambahkan domain kustom
3. Konfigurasi DNS records

## Verifikasi Deployment

1. Buka URL Vercel
2. Test chat dengan mode demo
3. Cek console untuk error
4. Verify API calls di network tab

## Troubleshooting

### Build Gagal

```bash
npm run build
```

Cek TypeScript errors dan fix sebelum push.

### API Tidak Berfungsi

1. Verify environment variables di Vercel
2. Cek API endpoint `/api/chat`
3. View Vercel function logs

### CORS Error

Backend Vercel sudah handle CORS dengan benar.

## GitHub Pages (Demo Only)

Untuk GitHub Pages (tanpa backend):

1. Build: `npm run build`
2. Copy `dist/` contents
3. Enable GitHub Pages di settings
4. Deploy dari `gh-pages` branch

**Catatan:** GitHub Pages hanya mendukung mode demo karena tidak ada server-side API.