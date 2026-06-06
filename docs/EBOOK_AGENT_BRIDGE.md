# Ebook Agent Bridge Documentation - Campaa AI

## Overview

Ebook Agent Bridge adalah integrasi konsep antara Campaa AI dan DIL Autonomous Ebook Agent repository.

**Penting:** Bridge ini TIDAK langsung mengakses atau mengontrol DIL Ebook Agent. Bridge hanya menghasilkan instruksi dan payload yang bisa digunakan user untuk berinteraksi dengan agent.

## DIL Autonomous Ebook Agent

Repository: https://github.com/pusakamediaid-dotcom/dil-autonomous-ebook-agent

### Mode Produksi

| Mode | Bab | Subbab | Biaya | Penggunaan |
|------|-----|--------|-------|------------|
| `planning` | 0 | 0 | Minimal | Hanya planning |
| `test` | 1 | 2 | $0.10 | Validasi |
| `session` | 3-4 | 9-12 | $0.50 | Produksi MVP |
| `full` | 5-10 | 15-30 | $2.00 | Book panjang |

### 5-Layer Method

Setiap subbab dalam mode session必须有:

1. **[KONSEP]** - Penjelasan teori dan konsep
2. **[ANALOGI]** - Perumpamaan dari kehidupan sehari-hari
3. **[RUMUS]** - Prinsip atau framework
4. **[CONTOH]** - Case study atau studi kasus
5. **[APLIKASI]** - Implementasi praktis

## Fitur Bridge

### 1. Generate Issue Body

Membuat GitHub Issue body yang compatible dengan `generate_ebook.yml` template.

```typescript
import { generateEbookIssueBody } from './integrations/ebookAgentBridge'

const body = generateEbookIssueBody({
  ebookTitle: 'Panduan AI untuk Pebisnis',
  targetAudience: 'Entrepreneur, pebisnis digital',
  readingLevel: 'intermediate',
  mode: 'session',
  totalChapters: 3,
  contentBrief: 'Ebook tentang memanfaatkan AI untuk bisnis...',
  specialInstructions: 'Gunakan Bahasa Indonesia',
  apiPreference: 'auto',
  approvalGiven: true
})
```

### 2. Session Checklist

Membuat checklist sebelum menjalankan produksi.

```typescript
import { generateSessionChecklist, formatChecklistAsMarkdown } from './integrations/ebookAgentBridge'

const checklist = generateSessionChecklist(1, 'session', 3)
const markdown = formatChecklistAsMarkdown(checklist)
```

### 3. Artifact Analysis

Menganalisa output dari agent.

```typescript
import { analyzeRunReport } from './integrations/ebookAgentBridge'

const analysis = analyzeRunReport({
  status: 'PARTIAL_SUCCESS',
  fallback_used: true,
  review_score: 100,
  total_cost_usd: 0
})
// Returns verdict, recommendation, issues
```

### 4. RAW BRIEF Generator

Membuat brief lengkap untuk ebook kompleks.

```typescript
import { generateRawBrief } from './integrations/ebookAgentBridge'

const brief = generateRawBrief({
  title: 'Ebook Title',
  audience: 'Target audience',
  goal: 'Tujuan ebook',
  scope: 'Scope dan coverage',
  uniqueAngle: 'Apa yang membedakan',
  targetLength: '5000-8000 kata'
})
```

### 5. Repair Prompt Builder

Membuat prompt untuk memperbaiki output yang gagal.

```typescript
import { buildRepairPrompt } from './integrations/ebookAgentBridge'

const repair = buildRepairPrompt(
  'Konten terlalu singkat dan ada placeholder',
  'session'
)
```

## Workflow Integration

### Cara Menggunakan dengan GitHub Issue

1. **Generate Issue Body** di Campaa AI
2. **Copy** hasil ke clipboard
3. **Buka** DIL Ebook Agent repository
4. **Create New Issue** dengan label `generate-ebook`
5. **Paste** issue body
6. **Submit** dan tunggu workflow

### Manual Trigger via workflow_dispatch

1. Buka tab Actions di DIL Ebook Agent
2. Pilih workflow `agent_run.yml`
3. Klik "Run workflow"
4. Isi parameters sesuai dengan brief dari Campaa AI
5. Execute

## Artifact Files

DIL Ebook Agent menghasilkan file:

| File | Description |
|------|-------------|
| `ebook.md` | Konten ebook |
| `task_plan.json` | Rencana task |
| `outline.json` | Outline ebook |
| `run_report.json` | Laporan eksekusi |
| `cost_report.json` | Laporan biaya |
| `review_report.json` | Quality review |
| `fallback_info.json` | Fallback info |
| `writer_cost_report.json` | Cost dari writer |

## Security Notes

- Bridge hanya generate payload, tidak execute actions
- GitHub token hanya untuk read operations
- Write operations memerlukan approval manual
- API keys tidak pernah di-share atau logged