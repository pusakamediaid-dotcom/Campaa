# Keamanan Campaa AI

## Prinsip Keamanan

### 1. API Key Tidak di Frontend

- API key TIDAK boleh ditulis di kode frontend
- API key HARUS disimpan sebagai environment variable
- Environment variable hanya bisa dibaca di server-side

### 2. Environment Variables

Jangan pernah membuat file `.env` dengan konten:

```
OPENAI_API_KEY=sk-xxxxx
GEMINI_API_KEY=AIza-xxxxx
OPENROUTER_API_KEY=sk-xxxxx
```

Gunakan `.env.example` sebagai template:

```
# Copy ke .env dan isi dengan keys asli
OPENAI_API_KEY=
GEMINI_API_KEY=
OPENROUTER_API_KEY=
```

### 3. Git Ignore

Pastikan `.gitignore` berisi:

```
.env
.env.local
.env.production
.env.*.local
node_modules/
dist/
.vercel/
.netlify/
```

### 4. Logging Aman

- Jangan log API key atau token
- Jangan log raw request yang sensitif
- Gunakan error messages yang aman

### 5. localStorage

- localStorage hanya untuk data lokal pengguna
- Jangan menyimpan percakapan sensitif tanpa izin
- Data di localStorage bisa diakses oleh JavaScript di domain yang sama

## Verifikasi Keamanan

### Checklist sebelum deploy:

- [ ] Tidak ada API key di kode frontend
- [ ] `.gitignore` sudah benar
- [ ] Environment variables hanya di server
- [ ] Error messages tidak bocorkan secrets
- [ ] Logging tidak contains sensitif data

## Mode Demo

Campaa AI menyediakan mode demo yang aman:

- Tidak butuh API key
- Respons simulasi
- Bisa dipakai offline
- Tidak ada data yang dikirim ke external API

## Laporkan Vulnerability

Jika menemukan security issue, laporkan ke admin repository.