# Actions Documentation - Campaa AI

## Overview

Action system memungkinkan Campaa AI untuk menghasilkan draft tindakan yang bisa dieksekusi oleh user atau memerlukan approval.

## Action Categories

### Safe Actions (No Approval Required)

| Action | Description |
|--------|-------------|
| `generate_draft` | Generate draft dokumen, prompt, template |
| `export_data` | Export chat atau data ke file |
| `prompt_tool` | Enhance prompt dengan tool lokal |
| `task_plan` | Buat rencana tugas |

### Approval Required Actions

| Action | Description |
|--------|-------------|
| `generate_issue` | Generate GitHub Issue body |
| `update_file` | Update file via GitHub API |
| `webhook_call` | Kirim data ke webhook |
| `email_notification` | Kirim notifikasi |

### Blocked Actions

| Action | Reason |
|--------|--------|
| `api_request` | Auto-call external API tanpa approval |
| `auto_login` | Auto-login ke akun pribadi |
| `scraping` | Scraping tanpa API resmi |
| `credential_access` | Akses credential tanpa authorization |

## Action Draft Flow

1. **Draft Created** - AI menghasilkan action draft
2. **Risk Assessment** - Sistem tentukan risk level
3. **Approval Gate** - Jika requires approval, tunggu konfirmasi
4. **Execute** - Action dieksekusi setelah approved

## Action Registry

Semua action draft disimpan di Action Registry:

```typescript
import { actionRegistry } from './actions/actionRegistry'

// Create action draft
const action = actionRegistry.createAction(
  'Generate Ebook Issue',
  'Create GitHub issue for ebook production',
  'generate_issue',
  { title: 'Ebook AI Guide', chapters: 3 }
)

// Approve action
actionRegistry.approveAction(action.id, 'Approved by user')

// Reject action
actionRegistry.rejectAction(action.id, 'Rejected - wrong format')
```

## Safety Rules

1. **No auto-execution** - Actions tidak jalan otomatis
2. **Human approval** - Risky actions butuh approval manual
3. **Audit trail** - Semua action di-log
4. **Payload validation** - Data action divalidasi sebelum eksekusi

## Ebook Agent Bridge Actions

### Generate Issue Body
Membuat body GitHub Issue untuk trigger DIL Ebook Agent.

Input:
- ebook_title
- target_audience
- reading_level
- mode (planning/test/session)
- total_chapters
- content_brief
- special_instructions

Output:
- GitHub Issue body dalam format yang compatible dengan generate_ebook.yml

### Generate Session Checklist
Membuat checklist sebelum produksi ebook.

Output:
- Checklist items
- Warnings
- Expected artifacts

### Analyze Artifact
Menganalisa output dari DIL Ebook Agent.

Input:
- run_report.json
- cost_report.json
- review_report.json

Output:
- Verdict (READY TO PUBLISH / NEEDS REVIEW / NEEDS REPAIR / FAILED)
- Recommendations
- Issues list

## Warning Messages

Action system akan tampilkan warning untuk:

- API key yang terdeteksi di input
- Actions yang memerlukan credential
- Actions yang bisa exposing sensitive data
- Actions yang memerlukan biaya API