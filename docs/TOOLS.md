# Tools Documentation - Campaa AI

## Overview

Campaa AI menyediakan sistem tool yang memungkinkan pemrosesan lokal tanpa harus memanggil AI untuk setiap tugas sederhana.

## Available Tools

### 1. Calculator Tool
Perhitungan matematika dan estimasi biaya AI.

**Operations:**
- `add` - Penjumlahan
- `subtract` - Pengurangan
- `multiply` - Perkalian
- `divide` - Pembagian
- `estimate_cost` - Estimasi biaya API
- `estimate_tokens` - Estimasi jumlah token

**Usage:**
```
Hitung biaya untuk 1000 token dengan GPT-4o-mini
```

### 2. Prompt Tool
Mengubah input menjadi prompt terstruktur untuk berbagai keperluan.

**Types:**
- `research` - Prompt riset formal
- `ebook` - Prompt produksi ebook
- `coding` - Prompt coding
- `audit` - Prompt audit repository
- `business` - Prompt strategi bisnis
- `general` - Prompt yang diperkuat

**Usage:**
```
Buatkan prompt riset untuk topik AI dalam bisnis
```

### 3. Markdown Export Tool
Export percakapan ke berbagai format.

**Formats:**
- `markdown` - Format Markdown lengkap
- `txt` - Plain text
- `json` - JSON dengan metadata
- `issue_body` - GitHub issue body

**Usage:**
```
Export chat ini ke Markdown
```

### 4. Task Planner Tool
Memecah tugas kompleks menjadi langkah-langkah.

**Modes:**
- `simple` - 2-4 jam
- `medium` - 4-8 jam
- `complex` - 8+ jam

**Usage:**
```
Buatkan task plan untuk membuat landing page
```

### 5. Repository Helper Tool
Generate artifact untuk GitHub repository.

**Types:**
- `readme` - README.md template
- `issue_template` - GitHub Issue template
- `commit_message` - Commit convention guide
- `workflow_yaml` - GitHub Actions workflow
- `folder_structure` - Recommended folder structure
- `gitignore` - .gitignore template

**Usage:**
```
Buatkan README untuk project React
```

### 6. Ebook Agent Tool
Integrasi dengan DIL Autonomous Ebook Agent.

**Actions:**
- `generate_issue_body` - Generate GitHub issue body
- `generate_checklist` - Generate session checklist
- `analyze_artifact` - Analyze agent output
- `build_repair_prompt` - Build repair prompt
- `session_template` - Generate session template

**Usage:**
```
Buatkan issue body untuk ebook tentang AI
```

## Tool Router

Tool router secara otomatis mendeteksi apakah input user memerlukan tool.

**Detected Intents:**
- `coding` - Kode, debugging, programming
- `research` - Riset, analisis data
- `ebook_production` - Ebook, produksi konten
- `business` - Strategi bisnis, monetisasi
- `repository` - GitHub, workflow
- `tool_usage` - Perhitungan, estimasi

## Safety Checker

Tool untuk memeriksa keamanan input/output:
- API key detection
- Token sensitive detection
- Password leak detection
- Auto-login prevention

## Usage Guidelines

1. **Tool lokal dulu** - Gunakan tool lokal sebelum memanggil AI
2. **Cost efficient** - Tool lokal tidak memakan biaya API
3. **Approval untuk eksternal** - Action yang mengakses external system butuh approval
4. **Fallback AI** - Jika tool gagal, AI akan memberikan respons