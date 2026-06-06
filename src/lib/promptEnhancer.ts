import { PromptEnhancerResult } from './types'
import { getSystemPrompt } from './prompts'

export const ENHANCEMENT_TYPES = [
  { id: 'clarify', label: 'Perjelas Pertanyaan', description: 'Jadikan lebih spesifik dan jelas' },
  { id: 'strengthen', label: 'Perkuat Prompt', description: 'Tambah depth dan konteks' },
  { id: 'technical', label: 'Buat Teknis', description: 'Ubah jadi instruksi teknis' },
  { id: 'research', label: 'Buat Riset', description: 'Ubah jadi prompt riset formal' },
  { id: 'ebook', label: 'Buat Produksi Ebook', description: 'Prompt untuk arsitek ebook' }
]

export const enhancePrompt = (
  original: string,
  type: string,
  currentMode: string
): PromptEnhancerResult => {
  const enhancements: Record<string, string> = {
    clarify: `Perjelas pertanyaan berikut agar lebih spesifik dan mendapat jawaban yang tepat:

${original}

Berikan versi yang lebih jelas dan spesifik.`,

    strengthen: `Kuatkan prompt berikut dengan menambahkan konteks, contoh, dan batasan yang relevan:

${original}

Buat prompt yang lebih kuat dan efektif.`,

    technical: `Ubah prompt berikut menjadi instruksi teknis yang precise:

${original}

Fokus pada aspek teknis dan spesifik.`,

    research: `Ubah menjadi prompt riset yang terstruktur dengan metodologi yang jelas:

${original}

Tambahkan framework riset dan struktur analisis.`,

    ebook: `Ubah menjadi prompt untuk arsitektur ebook yang komprehensif:

${original}

Pertimbangkan outline, sesi, gaya penulisan, dan audience target.`
  }

  const enhanced = enhancements[type] || original

  return {
    original,
    enhanced,
    type
  }
}

const DEMO_RESPONSES: Record<string, string[]> = {
  general: [
    'Terima kasih atas pertanyaan Anda. Berdasarkan analisis saya, ada beberapa hal penting yang perlu dipertimbangkan.\n\nPertama, penting untuk memahami konteks secara menyeluruh sebelum membuat keputusan. Kedua, setiap solusi memiliki trade-off yang perlu dievaluasi.\n\nApakah ada aspek spesifik yang ingin Anda eksplorasi lebih dalam?',
    'Saya memahami pertanyaan Anda. Berikut pandangan saya:\n\n1. Analisis Awal - Konteks yang Anda berikan menunjukkan kebutuhan akan pendekatan sistematis.\n\n2. Rekomendasi - Disarankan untuk memulai dengan langkah kecil yang terukur, lalu evaluasi hasilnya.\n\n3. Next Steps - Tentukan metric yang jelas untuk mengukur keberhasilan.\n\nApakah ada detail lain yang perlu dibahas?'
  ],
  research: [
    'Berdasarkan framework riset yang saya pahami, berikut analisis untuk topik Anda:\n\n## Latar Belakang Masalah\nKonteks yang relevan perlu dipahami secara mendalam sebelum masuk ke analisis.\n\n## Asumsi Dasar\nBeberapa asumsi yang perlu divalidasi:\n- Asumsi pertama...\n- Asumsi kedua...\n\n## Data yang Perlu Dicari\n- Data kuantitatif terkait...\n- Data kualitatif berupa...\n\n## Analisis yang Direkomendasikan\nMetodologi yang sesuai dengan konteks adalah...\n\n## Kesimpulan Awal\nMasih dalam tahap awal, perlu data tambahan untuk validasi penuh.',
    'Berikut struktur riset yang bisa Anda gunakan:\n\n## Kerangka Berpikir\nDefinisikan masalah dengan jelas dan spesifik.\n\n## Variabel Utama\nIdentifikasi faktor-faktor yang paling berpengaruh.\n\n## Metodologi\nPilih pendekatan yang sesuai: kualitatif, kuantitatif, atau mixed method.\n\n## Timeline\nSusun jadwal penelitian yang realistis.\n\n## Expected Outcomes\nDefinisikan deliverable yang diharapkan.'
  ],
  writer: [
    'Berikut versi konten yang lebih elaboratif:\n\n## Pendahuluan\nDi era digital yang terus berkembang, kemampuan untuk beradaptasi dan belajar secara berkelanjutan menjadi kunci utama kesuksesan. Ini bukan hanya tentang menguasai teknologi baru, tetapi juga tentang mengembangkan mindset yang tepat.\n\n## Pengembangan\nBayangkan Anda sedang membangun sebuah rumah. Fondasi yang kuat adalah kunci untuk menopang seluruh struktur. Sama halnya dengan pengetahuan, kita perlu membangun fondasi yang kokoh sebelum bisa berkembang lebih jauh.\n\nHal ini mencakup:\n- Pemahaman fundamental yang mendalam\n- Praktik berkelanjutan yang konsisten\n- Refleksi dan evaluasi berkala\n\n## Penutup\nDengan pendekatan yang sistematis dan berkelanjutan, Anda akan mampu mencapai tujuan yang telah ditetapkan. Kunci utamanya adalah konsistensi dan kesabaran dalam proses.',
    'Berikut kerangka penulisan yang bisa Anda gunakan sebagai referensi untuk mengembangkan konten yang lebih kaya dan engaging.\n\n## Struktur Narasi\n1. Hook - Mulailah dengan fakta atau pertanyaan yang menarik perhatian\n2. Konteks - Berikan latar belakang yang relevan\n3. Pengembangan - Elaborasi ide utama dengan bukti dan contoh\n4. Klimaks - Puncak argumen atau insights\n5. Resolusi - Kesimpulan dan call-to-action\n\n## Tips Penulisan\n- Gunakan kalimat aktif untuk engagement\n- Variasikan panjang kalimat untuk flow yang natural\n- Sertakan anecdote atau studi kasus untuk relatabilitas'
  ],
  business: [
    'Berikut analisis strategi bisnis untuk Anda:\n\n## Analisis Peluang\n1. Market Gap - Identifikasi celah di pasar yang belum terlayani dengan baik\n2. Competitive Advantage - Definisikan unique selling proposition Anda\n3. Target Market - Siapa ideal customer Anda dan apa pain point mereka?\n\n## Strategi Monetisasi\nOpsi yang bisa dipertimbangkan:\n- Subscription model untuk passive income\n- One-time purchase untuk entry-level product\n- Hybrid model untuk fleksibilitas\n\n## Action Plan\nMinggu 1-2: Riset pasar dan validasi konsep\nMinggu 3-4: Develop minimum viable product\nMinggu 5-6: Soft launch dan gather feedback\nMinggu 7-8: Iterate dan scale\n\n## Metric Penting\n- Customer Acquisition Cost\n- Lifetime Value\n- Conversion Rate\n- Churn Rate',
    'Berikut framework untuk strategi produk digital Anda:\n\n## Value Proposition Canvas\n- Jobs to be Done: Apa yang ingin dicapai customer?\n- Pains: Obstacle dan risk yang mereka hadapi\n- Gains: Outcome yang mereka desire\n\n## Go-to-Market Strategy\n1. Positioning yang jelas dan differentiating\n2. Channel yang tepat untuk reach target audience\n3. Pricing strategy yang optimize value perception\n\n## Launch Checklist\n- Landing page dengan copy yang compelling\n- Lead magnet untuk build email list\n- Funnel yang smooth untuk convert\n- Analytics setup untuk track performance'
  ],
  coding: [
    'Berikut pendekatan untuk solve problem tersebut:\n\n## Approach yang Direkomendasikan\n\n1. Define clear interfaces\n\ninterface ProblemScope {\n  input: unknown;\n  constraints: string[];\n  expectedOutput: unknown;\n}\n\n2. Break down into smaller functions\n\nfunction solve(input: ProblemScope["input"]): unknown {\n  if (!validateInput(input)) {\n    throw new Error("Invalid input format");\n  }\n  const processed = processInput(input);\n  return formatOutput(processed);\n}\n\n3. Error handling untuk edge cases\n\n4. Helper functions untuk modularity\n\n## Best Practices\n- Use meaningful variable names\n- Add comments untuk complex logic\n- Write unit tests untuk edge cases\n- Consider error handling upfront',
    'Berikut beberapa opsi solusi untuk consideration Anda:\n\n## Option 1: Direct Approach\nCocok untuk use case yang straightforward dan tidak require kompleks handling.\n\nconst simpleSolution = async (input: InputType): Promise<OutputType> => {\n  return transform(input);\n};\n\n## Option 2: Layered Architecture\nLebih robust untuk aplikasi yang complejo dengan banyak dependencies.\n\nPresentation Layer: handleRequest -> validate -> process -> formatResponse\nBusiness Logic Layer: process -> transform -> enrich\nData Layer: transform -> return transformed data\n\n## Considerations\n- Scalability requirements\n- Maintenance ease\n- Testing strategy\n- Performance constraints'
  ],
  ebook_architect: [
    'Berikut kerangka ebook yang bisa Anda gunakan:\n\n## Struktur Ebook\n\n### Cover & Opening\n- Judul yang compelling dan target-focused\n- Sub-judul yang jelas menjelaskan value proposition\n- Hook opening paragraph\n\n### Bab 1: Fondasi\n- Pengenalan konsep dasar\n- Context dan latar belakang\n- Mengapa topik ini penting\n\n### Bab 2: Deep Dive\n- Penjelasan komprehensif\n- Case studies dan contoh nyata\n- Step-by-step implementation\n\n### Bab 3: Advanced Strategies\n- Teknik lanjut untuk yang sudah paham dasar\n- Tips dan tricks praktis\n- Common mistakes dan cara menghindari\n\n### Bab 4: Action Plan\n- 30-day implementation plan\n- Checklist untuk tracking progress\n- Resources untuk belajar lebih lanjut\n\n### Closing\n- Summary dan key takeaways\n- Next steps yang actionable\n- Call to action untuk conversions\n\n## Sesi Produksi\nDisarankan 4 sesi dengan target:\n- Sesi 1: Outline + Bab 1\n- Sesi 2: Bab 2\n- Sesi 3: Bab 3\n- Sesi 4: Bab 4 + Editing',
    'Berikut template untuk produksi ebook premium:\n\n## Format EPUB/PDF A4\n- Font: System font atau Google Fonts (Inter, Roboto)\n- Line height: 1.6 untuk readability\n- Margin: 2.5cm untuk print-ready\n- Heading hierarchy yang konsisten\n\n## Gaya Penulisan\n- Bahasa Indonesia formal dengan tone friendly\n- Paragraph length: 3-5 kalimat\n- Active voice majority\n- Contoh spesifik dan actionable\n\n## Visual Standards\n- Image resolution: min 300dpi untuk print\n- Screenshot dengan annotations\n- Infographic untuk data complexity\n- Callout boxes untuk emphasis\n\n## 5-Layer Method per Sub-chapter\n1. Konsep - Penjelasan teori\n2. Analogi - Penjelasan dengan perumpamaan\n3. Rumus - Prinsip atau framework\n4. Contoh - Case study atau studi kasus\n5. Aplikasi - Implementasi praktis'
  ],
  reviewer: [
    'Berikut review komprehensif untuk konten Anda:\n\n## Overall Assessment\nScore: 7/10\n\n## Strengths\n- Struktur yang clear dan mudah followed\n- Content yang relevant dengan target audience\n- Tone yang appropriate dan professional\n- Contoh yang spesifik dan relatable\n\n## Areas for Improvement\n1. Structure - Beberapa section terasa terlalu panjang, sub-heading yang lebih granular akan membantu\n2. Clarity - Beberapa paragraph conflasi multiple ideas, break down untuk alur yang lebih smooth\n3. Engagement - Butuh lebih banyak call-to-action, consider adding interactive elements\n\n## Recommendations\n1. Revise introduction untuk hook yang lebih kuat\n2. Add summary section di setiap bab\n3. Strengthen closing dengan actionable takeaways\n\n## Priority Fixes\n1. High: Perjelas main argument di section 2\n2. Medium: Add visual hierarchy di list items\n3. Low: Consider adding case study di section 4',
    'Berikut feedback terstruktur untuk improvement:\n\n## Content Quality\n| Aspect | Current | Recommended |\n|--------|---------|-------------|\n| Depth | 7/10 | 8.5/10 |\n| Clarity | 7.5/10 | 9/10 |\n| Structure | 8/10 | 8.5/10 |\n| Actionability | 6/10 | 8/10 |\n\n## Specific Feedback\n\n### Introduction\n- Good: Clear problem statement\n- Improve: Add urgency untuk engage reader\n\n### Body Content\n- Good: Well-researched dan informative\n- Improve: Add more practical examples\n\n### Conclusion\n- Good: Strong summary\n- Improve: Add specific next steps\n\n## Action Items\n- Revise intro paragraph (priority: high)\n- Add 2 more case studies (priority: medium)\n- Create summary checklist (priority: medium)\n- Add appendix dengan resources (priority: low)'
  ],
  product_strategy: [
    'Berikut framework untuk strategi produk digital Anda:\n\n## Angle Validation Framework\n\n### Step 1: Identifikasi Pain Points\n- Apa masalah utama target market?\n- Seberapa urgent masalah tersebut?\n- Apakah sudah ada solusi yang adequate?\n\n### Step 2: Unique Angle\n- Apa perspective unik yang Anda punya?\n- Bagaimana pengalaman Anda differentiate?\n- Apa cerita yang bisa diceritakan?\n\n### Step 3: Offer Construction\n\nTier 1: Entry\n- Free content atau lead magnet\n- Value: Education dan awareness\n\nTier 2: Core\n- Main product (ebook, course, template)\n- Price point: sesuai dengan value perception\n- USP yang jelas\n\nTier 3: Premium\n- High-ticket coaching atau consulting\n- Personal touch dan customization\n- Guarantee yang kuat\n\n## Content Strategy\n- Platform: Thread, Instagram, YouTube\n- Content pillars: 3-5 themes utama\n- Posting cadence: 3-5x per minggu\n- Engagement tactics untuk build community',
    'Berikut breakdown untuk offer yang compelling:\n\n## Offer Structure\n\n### Problem Statement\nMengidentifikasi masalah spesifik yang solved oleh produk Anda.\n\n### Solution Overview\nPenjelasan bagaimana produk Anda solve problem tersebut.\n\n### Benefits (Not Features)\n- Benefit 1: Outcome spesifik yang didapat\n- Benefit 2: Emotional gain dari outcome tersebut\n- Benefit 3: Time saved atau money earned\n\n### Proof Elements\n- Testimonials dari early users\n- Case studies dengan metrics\n- Expertise credentials\n- Guarantee terms\n\n### Pricing Psychology\n- Anchor price dengan original price\n- Urgency dengan limited spots\n- Bonuses yang add value\n- Payment options untuk accessibility\n\n## Landing Page Structure\n1. Hero section dengan hook\n2. Problem agitating\n3. Solution presentation\n4. Benefits breakdown\n5. Social proof\n6. Offer dan pricing\n7. Guarantee\n8. Call to action'
  ],
  github_assistant: [
    'Berikut template untuk repository README yang professional:\n\n# Project Name\n\nShort description of what this project does.\n\n## Features\n\n- Feature 1\n- Feature 2\n- Feature 3\n\n## Installation\n\ngit clone https://github.com/username/repo.git\ncd repo\nnpm install\n\n## Usage\n\nnpm run dev\nnpm run build\n\n## Contributing\n\n1. Fork the project\n2. Create your feature branch (git checkout -b feature/AmazingFeature)\n3. Commit your changes (git commit -m Add some AmazingFeature)\n4. Push to the branch (git push origin feature/AmazingFeature)\n5. Open a Pull Request\n\n## License\n\nThis project is licensed under the MIT License.\n\n## Commit Convention\n- feat: untuk fitur baru\n- fix: untuk bug fix\n- docs: untuk dokumentasi\n- style: untuk formatting\n- refactor: untuk code restructuring\n- test: untuk testing\n- chore: untuk maintenance',
    'Berikut template untuk GitHub Issue yang terstruktur:\n\n## Description\nDescribe the issue or feature request\n\n## Steps to Reproduce (Bug only)\n1. Go to\n2. Click on\n3. See error\n\n## Expected Behavior\nWhat should happen\n\n## Actual Behavior\nWhat actually happens\n\n## Screenshots\nIf applicable, add screenshots\n\n## Environment\n- OS: [e.g., Windows 10, macOS, Ubuntu]\n- Version: [e.g., 1.0.0]\n\n## Additional Context\nAdd any other context about the problem here\n\n## Workflow Checklist\n- Branch name menggunakan feature/ atau fix/\n- Commit message mengikuti convention\n- Pull request memiliki description\n- Review dari maintainer\n- Merge dengan squash jika needed'
  ]
}

export const getDemoResponse = (mode: string): string => {
  const responses = DEMO_RESPONSES[mode] || DEMO_RESPONSES['general']
  const randomIndex = Math.floor(Math.random() * responses.length)
  return responses[randomIndex]
}