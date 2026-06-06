// Prompt Tool - Transform user input into structured prompts
import { ToolOutput } from '../lib/types'

export type PromptType = 'research' | 'ebook' | 'coding' | 'audit' | 'business' | 'general'

export async function promptTool(input: {
  query: string
  type: PromptType
  mode?: string
  context?: Record<string, any>
}): Promise<ToolOutput> {
  try {
    const { query, type, mode = 'general', context = {} } = input

    let result: string

    switch (type) {
      case 'research': {
        result = `---
# Prompt Riset Formal

## Topik Utama
${query}

## Instruksi
Jawab dengan struktur berikut:

### 1. Latar Belakang Masalah
Jelaskan konteks dan urgensi topik.

### 2. Kerangka Teoritis
Gunakan teori atau konsep yang relevan.

### 3. Asumsi Dasar
Identifikasi asumsi yang perlu divalidasi.

### 4. Data yang Perlu Dicari
Daftar data kuantitatif dan kualitatif yang diperlukan.

### 5. Metodologi
Pilih dan jelaskan pendekatan riset yang sesuai.

### 6. Timeline Penelitian
Buat jadwal riset yang realistis.

### 7. Analisis dan Temuan
Struktur analisis yang akan dilakukan.

### 8. Kesimpulan dan Rekomendasi
Kesimpulan awal dan langkah selanjutnya.

---
Gunakan Bahasa Indonesia formal akademik.`
        break
      }

      case 'ebook': {
        const audience = context.audience || 'pembaca umum'
        const level = context.level || 'intermediate'
        result = `---
# Prompt Produksi Ebook

## Judul Ebook
${context.title || query}

## Target Pembaca
${audience} - Level ${level}

## Brief Konten
${query}

## Instruksi
Jawab dengan struktur berikut:

### 1. Outline Ebook
Buat outline 3-4 bab dengan subbab.

### 2. Metode 5-Lapis per Subbab
Untuk setiap subbab, berikan:
- [KONSEP] Penjelasan teori
- [ANALOGI] Perumpamaan sederhana
- [RUMUS] Prinsip atau framework
- [CONTOH] Case study atau studi kasus
- [APLIKASI] Implementasi praktis

### 3. Pembagian Sesi Produksi
Sesuaikan dengan mode (planning/test/session/full).

### 4. Standar Visual
Gaya penulisan, font, margin, format output.

### 5. Checklist Produksi
Langkah-langkah produksi ebook premium.

---
Gunakan Bahasa Indonesia yang rapi dan profesional.`
        break
      }

      case 'coding': {
        const language = context.language || 'JavaScript'
        const framework = context.framework || ''
        result = `---
# Prompt Produksi Kode

## Permintaan
${query}

## Stack Teknologi
- Bahasa: ${language}
- Framework: ${framework || 'Tidak ada'}

## Instruksi
Jawab dengan:

### 1. Analisis Permasalahan
Pecah masalah menjadi komponen kecil.

### 2. Solution Architecture
Struktur solusi dengan komponen dan hubungan.

### 3. Kode Lengkap
Berikan kode yang clean, terstruktur, dengan komentar.

### 4. Error Handling
Tangani edge cases dan error gracefully.

### 5. Testing
Strategi testing dan contoh test case.

### 6. Best Practices
Coding standards dan conventions.

---
Gunakan ${language}. Sertakan penjelasan dalam Bahasa Indonesia.`
        break
      }

      case 'audit': {
        result = `---
# Prompt Audit Repository

## Item yang Di Audit
${query}

## Instruksi
Audit dari aspek:

### 1. Struktur dan Organisasi
- Apakah struktur folder masuk akal?
- Apakah file naming konsisten?
- Apakah ada file yang redundan?

### 2. Kualitas Kode
- Apakah kode bersih dan terstruktur?
- Apakah ada code smell?
- Apakah ada security issues?

### 3. Dokumentasi
- Apakah README jelas?
- Apakah ada docs/
- Apakah inline comments cukup?

### 4. Workflow dan Automation
- Apakah GitHub Actions ada?
- Apakah CI/CD pipeline berjalan?
- Apakah ada governance rules?

### 5. Keamanan
- Apakah ada API key bocor?
- Apakah .gitignore tepat?
- Apakah secrets dimanage dengan benar?

### 6. Prioritas Perbaikan
Urutan perbaikan dari yang paling penting.

---
Bahasa Indonesia. Specific dan actionable.`
        break
      }

      case 'business': {
        result = `---
# Prompt Strategi Bisnis

## Topik Bisnis
${query}

## Instruksi
Jawab dengan struktur berikut:

### 1. Analisis Peluang
- Market gap yang relevan
- Competitive landscape
- Target customer persona

### 2. Value Proposition
- Unique selling proposition
- Pain points yang solved
- Gain yang diberikan

### 3. Monetisasi
- Revenue model yang cocok
- Pricing strategy
- Upsell/cross-sell opportunities

### 4. Go-to-Market
- Channel yang tepat
- Customer acquisition cost
- Retention strategy

### 5. Action Plan
- 30-day quick win
- 90-day foundation
- 180-day scale

### 6. Metrics
- KPI yang perlu di-track
- Target conversion rate
- CAC dan LTV target

---
Bahasa Indonesia profesional. Fokus actionable insights.`
        break
      }

      default: {
        result = `---
# Prompt yang Diperkuat

## Input Original
${query}

## Mode
${mode}

## Instruksi
Buat prompt yang lebih kuat dengan:
1. Konteks tambahan yang relevan
2. Batasan yang jelas
3. Format output yang diharapkan
4. Contoh sebagai reference

Berikan versi yang lebih efektif dan actionable.
---
Bahasa Indonesia.`
      }
    }

    return {
      success: true,
      result,
      toolUsed: 'prompt',
      metadata: { type, originalQuery: query }
    }
  } catch (error) {
    return { success: false, result: `Prompt tool error: ${error}`, toolUsed: 'prompt' }
  }
}