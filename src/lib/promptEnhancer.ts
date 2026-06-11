import type { PromptEnhancerResult } from './types'

export const ENHANCEMENT_TYPES = [
  { id: 'clarify', label: 'Perjelas', description: 'Jadikan lebih spesifik dan jelas' },
  { id: 'strengthen', label: 'Perkuat', description: 'Tambah depth dan konteks' },
  { id: 'technical', label: 'Teknis', description: 'Ubah jadi instruksi teknis' },
  { id: 'research', label: 'Riset', description: 'Ubah jadi prompt riset formal' },
  { id: 'ebook', label: 'Ebook', description: 'Prompt untuk arsitek ebook' }
]

interface DemoHistoryMessage {
  role: string
  content: string
}

type SmartIntent =
  | 'ebook'
  | 'research'
  | 'prompt'
  | 'coding'
  | 'business'
  | 'security'
  | 'ui'
  | 'general'

export const enhancePrompt = (
  original: string,
  type: string,
  currentMode: string
): PromptEnhancerResult => {
  const modeHint = currentMode ? `\n\nMode Campaa saat ini: ${currentMode}.` : ''
  const enhancements: Record<string, string> = {
    clarify: `Perjelas pertanyaan berikut agar lebih spesifik, punya konteks, dan mudah dijawab:${modeHint}\n\n${original}\n\nBerikan versi prompt yang lebih jelas, singkat, dan actionable.`,
    strengthen: `Kuatkan prompt berikut dengan menambahkan konteks, batasan, contoh output, dan kriteria sukses:${modeHint}\n\n${original}\n\nBuat prompt yang lebih kuat dan efektif.`,
    technical: `Ubah prompt berikut menjadi instruksi teknis yang precise, lengkap dengan scope, file target, batasan, dan acceptance criteria:${modeHint}\n\n${original}`,
    research: `Ubah prompt berikut menjadi prompt riset terstruktur dengan objektif, hipotesis, data yang dicari, metodologi, dan format output:${modeHint}\n\n${original}`,
    ebook: `Ubah prompt berikut menjadi brief produksi ebook yang jelas: target pembaca, positioning, outline, gaya bahasa, struktur bab, dan deliverable:${modeHint}\n\n${original}`
  }

  return {
    original,
    enhanced: enhancements[type] || original,
    type
  }
}

const includesAny = (text: string, keywords: string[]) => keywords.some(keyword => text.includes(keyword))

const detectIntent = (message: string, mode: string): SmartIntent => {
  const text = `${message} ${mode}`.toLowerCase()

  if (includesAny(text, ['ebook', 'penjual ebook', 'google play', 'play store', 'gumroad', 'produk digital', 'epub', 'pdf'])) {
    return 'ebook'
  }

  if (includesAny(text, ['riset', 'validasi', 'market', 'pasar', 'kompetitor', 'survey', 'data'])) {
    return 'research'
  }

  if (includesAny(text, ['prompt', 'perbaiki pertanyaan', 'instruksi ai', 'rewrite prompt', 'prompting'])) {
    return 'prompt'
  }

  if (includesAny(text, ['coding', 'error', 'bug', 'repo', 'github', 'typescript', 'react', 'css', 'build', 'deploy'])) {
    return 'coding'
  }

  if (includesAny(text, ['bisnis', 'monetisasi', 'harga', 'pricing', 'jualan', 'strategi', 'funnel', 'offer'])) {
    return 'business'
  }

  if (includesAny(text, ['api key', 'secret', 'keamanan', 'security', 'token', 'credential', 'env'])) {
    return 'security'
  }

  if (includesAny(text, ['ui', 'ux', 'css', 'tampilan', 'mobile', 'layout', 'desain', 'responsive'])) {
    return 'ui'
  }

  return 'general'
}

const getHistoryContext = (history: DemoHistoryMessage[] = []) => {
  const lastUserMessage = [...history].reverse().find(item => item.role === 'user')
  if (!lastUserMessage?.content) return ''

  return `\n\nSaya juga mempertimbangkan konteks percakapan sebelumnya: "${lastUserMessage.content.slice(0, 140)}${lastUserMessage.content.length > 140 ? '...' : ''}".`
}

const getModeContext = (mode: string) => {
  const labels: Record<string, string> = {
    general: 'Mode Umum',
    research: 'Mode Riset',
    writer: 'Mode Penulis',
    business: 'Mode Strategi Bisnis',
    coding: 'Mode Coding',
    ebook_architect: 'Mode Ebook Architect',
    reviewer: 'Mode Reviewer',
    product_strategy: 'Mode Strategi Produk Digital',
    github_assistant: 'Mode GitHub Assistant',
    deep_reasoning: 'Mode Deep Reasoning',
    tool_commander: 'Mode Tool Commander',
    ebook_production: 'Mode Ebook Production Architect',
    agent_supervisor: 'Mode Autonomous Agent Supervisor',
    safety_reviewer: 'Mode Safety Reviewer',
    business_builder: 'Mode Business Builder'
  }

  return labels[mode] || mode || 'Mode Umum'
}

const buildEbookResponse = () => `Hai, berarti konteks Anda adalah penjual ebook digital. Saya bisa bantu dari sisi positioning, riset keyword, deskripsi produk, struktur landing page, strategi harga, dan funnel promosi.\n\nUntuk Google Play Store atau marketplace ebook, fokus awal sebaiknya:\n\n1. **Judul ebook** — buat spesifik, mengandung manfaat, dan mudah dicari.\n2. **Metadata dan deskripsi** — jelaskan siapa pembacanya, masalah yang diselesaikan, dan hasil yang dijanjikan secara realistis.\n3. **Cover** — pastikan terlihat jelas di ukuran kecil, karena calon pembeli sering melihat thumbnail.\n4. **Kategori dan keyword** — pilih keyword yang dekat dengan niat beli, bukan hanya keyword luas.\n5. **Offer** — berikan alasan kenapa ebook Anda layak dibeli sekarang.\n\n5 langkah praktis yang bisa langsung Anda lakukan:\n\n- Audit 3 ebook kompetitor di kategori yang sama.\n- Tulis ulang deskripsi produk dengan struktur: masalah, solusi, isi ebook, manfaat, CTA.\n- Buat 10 variasi judul berbasis keyword.\n- Siapkan 3 angle promosi: edukasi, problem-solution, dan hasil akhir.\n- Buat funnel sederhana: konten pendek → halaman produk → bonus/checklist → pembelian.\n\nKalau Anda mau, kirim judul ebook atau deskripsi produk saat ini, lalu saya bantu polish agar lebih kuat untuk pembeli.`

const buildResearchResponse = () => `Baik, konteksnya mengarah ke riset atau validasi pasar. Saya sarankan mulai dari riset yang ringan tetapi tajam:\n\n1. **Tentukan hipotesis** — siapa targetnya, masalahnya apa, dan kenapa mereka mau membayar.\n2. **Cari bukti permintaan** — cek pencarian, review kompetitor, komentar audiens, forum, marketplace, dan pertanyaan yang sering muncul.\n3. **Petakan kompetitor** — lihat judul, harga, positioning, bonus, dan kelemahan mereka.\n4. **Validasi offer** — buat 2-3 versi angle lalu pilih yang paling spesifik.\n5. **Ambil keputusan kecil** — jangan tunggu data sempurna; gunakan riset untuk menentukan langkah promosi berikutnya.\n\nOutput riset yang ideal: target pembaca, pain point utama, keyword, kompetitor, angle produk, dan rekomendasi konten awal.`

const buildPromptResponse = () => `Saya bisa bantu memperbaiki prompt agar jawabannya lebih presisi. Formula yang saya sarankan:\n\n**Konteks:** jelaskan situasi Anda.\n**Tujuan:** apa hasil yang diinginkan.\n**Batasan:** format, panjang, tone, platform, atau hal yang tidak boleh dilakukan.\n**Output:** minta struktur jawaban yang jelas.\n\nContoh versi lebih kuat:\n\n"Saya sedang menyiapkan ebook digital untuk dijual. Bantu saya membuat deskripsi produk yang menarik untuk marketplace. Target pembaca adalah pemula. Gunakan Bahasa Indonesia natural, tidak berlebihan, dan susun dalam format: hook, masalah, solusi, isi ebook, manfaat, dan CTA."\n\nKirim prompt asli Anda, nanti saya polish menjadi versi yang lebih kuat.`

const buildCodingResponse = () => `Saya menangkap konteks teknis: coding, repo, error, atau GitHub. Cara paling aman adalah diagnosis bertahap:\n\n1. **Identifikasi error utama** — pesan error, file, command yang dijalankan.\n2. **Pisahkan area masalah** — dependency, TypeScript, build, API route, styling, atau deployment.\n3. **Reproduksi minimal** — cari langkah paling pendek untuk memunculkan error.\n4. **Patch kecil** — jangan ubah banyak file sekaligus.\n5. **Verifikasi** — jalankan typecheck/build setelah patch.\n\nJika ini repo React/Vite, prioritas cek biasanya: package.json, tsconfig, import path, env usage, dan error build Vercel. Kirim error atau file targetnya, saya bantu bedah.`

const buildBusinessResponse = () => `Konteks Anda mengarah ke bisnis, monetisasi, harga, atau strategi jualan. Saya sarankan pakai kerangka sederhana:\n\n1. **Target market** — siapa pembeli paling jelas?\n2. **Problem mahal** — masalah apa yang cukup penting sampai orang mau bayar?\n3. **Offer** — produk utama + bonus + alasan membeli sekarang.\n4. **Pricing** — mulai dari harga yang mudah diuji, lalu naikkan setelah ada validasi.\n5. **Channel promosi** — pilih 1-2 channel dulu, jangan semuanya sekaligus.\n\nUntuk ebook, funnel awal yang realistis: konten edukasi → contoh isi/preview → halaman produk → bonus checklist/template → CTA beli.\n\nKalau Anda beri niche ebook dan target pembaca, saya bisa bantu susun positioning dan harga awal.`

const buildSecurityResponse = () => `Untuk keamanan, prinsipnya sederhana: jangan menaruh konfigurasi sensitif di frontend, README, atau commit publik.\n\nRekomendasi aman:\n\n- Simpan konfigurasi provider hanya di dashboard hosting.\n- Jangan commit file lokal yang berisi konfigurasi pribadi.\n- Gunakan Demo Mode sebagai default publik.\n- Tampilkan pesan ramah saat provider belum aktif.\n- Jangan menampilkan error teknis mentah ke user.\n\nUntuk Campaa, pendekatan paling aman adalah: publik melihat Campaa Lite terlebih dahulu, sementara provider asli hanya aktif jika server sudah dikonfigurasi dengan benar.`

const buildUiResponse = () => `Konteksnya UI/UX atau tampilan. Untuk membuat Campaa terasa premium tanpa berat, fokus pada detail kecil yang berdampak besar:\n\n1. **Mobile-first** — header ringkas, input sticky, dan ruang chat luas.\n2. **Visual hierarchy** — bubble assistant seperti kartu, user bubble compact.\n3. **State jelas** — loading, disabled, provider aktif, dan fallback harus mudah dipahami.\n4. **Microcopy** — gunakan bahasa natural seperti "Tulis pesan..." bukan instruksi panjang.\n5. **Tidak berlebihan** — hindari animasi berat dan library tambahan.\n\nJika Anda ingin, saya bisa bantu audit satu layar: header, mode selector, provider selector, chat bubble, dan input area.`

const buildGeneralResponse = (message: string, mode: string) => `Saya paham. Dari pesan Anda, saya akan bantu dengan pendekatan praktis memakai ${getModeContext(mode)}.\n\nInti yang saya tangkap:\n\n- Anda butuh arahan yang jelas, bukan jawaban generik.\n- Jawaban sebaiknya langsung bisa dipakai untuk mengambil langkah berikutnya.\n- Campaa Lite bisa membantu menyusun ide, strategi, prompt, riset, atau rencana kerja meski provider eksternal belum aktif.\n\nRekomendasi awal:\n\n1. Jelaskan target atau konteks utama Anda.\n2. Tentukan output yang diinginkan: strategi, checklist, copywriting, riset, kode, atau review.\n3. Kirim contoh materi jika ada.\n4. Minta format jawaban yang spesifik.\n\nPesan Anda: "${message.slice(0, 180)}${message.length > 180 ? '...' : ''}"\n\nSaya bisa lanjutkan dengan struktur langkah, checklist, atau versi siap pakai.`

export const getSmartDemoResponse = (
  message: string,
  mode: string,
  history: DemoHistoryMessage[] = []
): string => {
  const intent = detectIntent(message, mode)
  const historyContext = getHistoryContext(history)
  const modeContext = `\n\nMode aktif: ${getModeContext(mode)}.`

  const responses: Record<SmartIntent, string> = {
    ebook: buildEbookResponse(),
    research: buildResearchResponse(),
    prompt: buildPromptResponse(),
    coding: buildCodingResponse(),
    business: buildBusinessResponse(),
    security: buildSecurityResponse(),
    ui: buildUiResponse(),
    general: buildGeneralResponse(message, mode)
  }

  return `${responses[intent]}${modeContext}${historyContext}`
}

export const getDemoResponse = (mode: string): string => {
  return getSmartDemoResponse('Saya ingin menggunakan Campaa Lite untuk mendapat arahan yang praktis.', mode, [])
}
