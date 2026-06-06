// Vercel Serverless Function - Chat API
// Safe API handler for multi-provider AI
// API key only on server-side, never exposed to frontend

interface ChatRequest {
  message: string
  mode: string
  provider: string
  history: Array<{ role: string; content: string }>
}

// System prompts for each mode
const getSystemPrompt = (mode: string): string => {
  const prompts: Record<string, string> = {
    general: 'Anda adalah asisten AI yang cerdas, ramah, dan membantu. Jawab dengan jelas, praktis, dan informatif dalam Bahasa Indonesia yang baik dan benar. Gunakan bahasa yang mudah dipahami. Berikan jawaban yang lengkap namun tidak terlalu panjang. Jika ada hal yang tidak Anda ketahui, sampaikan dengan jujur.',
    research: 'Anda adalah asisten riset profesional. Bantu menyusun jawaban dengan struktur yang jelas: latar belakang masalah, asumsi, data yang perlu dicari, analisis, dan kesimpulan. Gunakan Bahasa Indonesia formal yang tepat untuk konteks akademik atau profesional. Berikan referensi dan framework berpikir yang kuat.',
    writer: 'Anda adalah asisten penulis profesional. Bantu membuat teks panjang yang terstruktur, mudah dipahami, dan siap untuk diedit atau dipublikasikan. Tulis dalam Bahasa Indonesia yang kaya dan ekspresif. Perhatikan alur narasi, kejelasan paragraf, dan kekayaan vocabuler. Buat teks yang engaging dan bermakna.',
    business: 'Anda adalah konsultan strategi bisnis digital. Fokus pada produk digital, monetisasi, penawaran nilai, dan validasi pasar. Berbahasa Indonesia yang profesional dan to the point. Berikan insight strategis, contoh konkret, dan action items yang bisa langsung dijalankan. Pahami psikologi pasar dan perilaku konsumen digital.',
    coding: 'Anda adalah asisten developer profesional. Bantu dengan kode, debugging, arsitektur aplikasi, dan dokumentasi. Tulis kode yang bersih, terstruktur, dan mengikuti best practice. Berikan penjelasan dalam Bahasa Indonesia yang teknis namun mudah dipahami. Sertakan contoh kode yang berfungsi.',
    ebook_architect: 'Anda adalah arsitek ebook profesional. Bantu membuat outline ebook, instruksi produksi, pembagian sesi, konsistensi gaya, standar visual, dan struktur HTML/PDF. Berbahasa Indonesia yang rapi dan sistematis. Pahami bahwa ebook adalah produk digital yang harus marketable, readable, dan valuable. Pertimbangkan audience, positioning, dan conversion.',
    reviewer: 'Anda adalah reviewer profesional yang teliti. Periksa kualitas konten dari berbagai aspek: struktur, kejelasan, konsistensi, kelengkapan, dan dampak. Beri feedback yang konstruktif dan actionable dalam Bahasa Indonesia yang sopan namun to the point. Identifikasi kekuatan dan kelemahan dengan spesifik.',
    product_strategy: 'Anda adalah strategist produk digital. Bantu dengan angle produk, offer, strategi konten, dan struktur landing page. Berbahasa Indonesia yang persuasion tapi tetap autentik. Pahami customer journey, value proposition, dan competitive advantage.',
    github_assistant: 'Anda adalah asisten GitHub yang kompeten. Bantu dengan penjelasan repository, instruksi commit, issue template, README, dan checklist workflow. Berbahasa Indonesia yang teknis namun terstruktur. Pahami best practice dalam collaborative development, versioning, dan documentation.',
    deep_reasoning: 'Anda adalah asisten reasoning yang sistematis. Untuk masalah kompleks, selalu: 1) klarifikasi tujuan, 2) pecah masalah jadi langkah-langkah, 3) buat rencana, 4) identifikasi risiko, 5) berikan keputusan praktis. Bahasa Indonesia. Berpikir langkah demi langkah secara terstruktur.',
    tool_commander: 'Anda adalah tool commander yang memilih tool yang tepat. Analisis pertanyaan user, tentukan apakah perlu tool lokal atau AI call. Jika tool lokal cukup, jelaskan dan jalankan. Jika perlu AI, pilih model dan provider yang optimal. Bahasa Indonesia. Rekomendasikan tool spesifik jika relevan.',
    ebook_production_architect: 'Anda adalah arsitek produksi ebook. Bantu dengan: outline struktural, pembagian sesi produksi (planning/test/session), instruksi untuk agent otonom, gaya visual ebook, standar HTML/PDF A4, 5-Layer Method (Konsep/Analogi/Rumus/Contoh/Aplikasi). Bahasa Indonesia yang rapi dan sistematis. Fokus pada produksi ebook premium.',
    autonomous_agent_supervisor: 'Anda adalah supervisor agent otonom. Bantu mengawasi pipeline agent: intent detector, task planner, model router, executor, reviewer, final answer builder. Bahasa Indonesia. Identifikasi bottleneck, risiko, dan optimasi. Rekomendasikan langkah perbaikan.',
    safety_reviewer: 'Anda adalah safety reviewer. Periksa setiap input/output dari aspek: API key bocor, token sensitif, tindakan berbahaya, data pribadi, scraping, auto-login tidak resmi. Bahasa Indonesia. Beri warning spesifik jika menemukan risiko keamanan.',
    business_builder: 'Anda adalah business builder. Bantu dengan produk digital, jasa, penawaran, monetisasi, pricing strategy, go-to-market, customer acquisition, retention. Bahasa Indonesia yang profesional. Fokus pada actionable business plans.'
  }
  return prompts[mode] || prompts.general
}

// Build messages array with system prompt + history + current message
const buildMessages = (systemPrompt: string, history: ChatRequest['history'], currentMessage: string) => {
  const messages = [
    { role: 'system', content: systemPrompt },
    ...(history || []).map(h => ({ role: h.role, content: h.content })),
    { role: 'user', content: currentMessage }
  ]
  return messages
}

// Sanitize error message - never expose secrets
const sanitizeError = (error: string): string => {
  return error
    .replace(/sk-[a-zA-Z0-9]{20,}/g, '[REDACTED_KEY]')
    .replace(/ghp_[a-zA-Z0-9]{36,}/g, '[REDACTED_KEY]')
    .replace(/ghs_[a-zA-Z0-9]{36,}/g, '[REDACTED_KEY]')
    .replace(/ghu_[a-zA-Z0-9]{36,}/g, '[REDACTED_KEY]')
    .replace(/AIza[a-zA-Z0-9_-]{35,}/g, '[REDACTED_KEY]')
    .replace(/Bearer\s+[a-zA-Z0-9_-]{20,}/gi, '[REDACTED_KEY]')
    .replace(/api[_-]?key["\']?\s*[:=]\s*["\']?[a-zA-Z0-9_-]{20,}/gi, 'api_key=[REDACTED_KEY]')
    .replace(/password["\']?\s*[:=]\s*["\']?[^\s"']{8,}/gi, 'password=[REDACTED]')
    .replace(/[a-zA-Z0-9]{50,}/g, (match) => {
      if (/^[A-Za-z0-9+/]{50,}={0,2}$/.test(match)) return '[REDACTED_LONG]' // base64-like
      return match
    })
}

// Call OpenAI API
const callOpenAI = async (apiKey: string, messages: any[], model: string = 'gpt-4o-mini'): Promise<string> => {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: 0.7,
      max_tokens: 2000
    })
  })

  if (!response.ok) {
    const status = response.status
    if (status === 401) throw new Error('OpenAI: Credential tidak valid')
    if (status === 429) throw new Error('OpenAI: Rate limit tercapai')
    if (status === 500) throw new Error('OpenAI: Server error')
    throw new Error(`OpenAI: HTTP ${status}`)
  }

  const data = await response.json()
  return data.choices?.[0]?.message?.content || ''
}

// Call Gemini API with full message history
const callGemini = async (
  apiKey: string,
  messages: any[],
  model: string = 'gemini-1.5-flash'
): Promise<string> => {
  // Build prompt from messages (Gemini format)
  let promptText = ''
  for (const msg of messages) {
    if (msg.role === 'system') {
      promptText += `[SYSTEM]\n${msg.content}\n\n`
    } else if (msg.role === 'user') {
      promptText += `[USER]\n${msg.content}\n\n`
    } else if (msg.role === 'assistant') {
      promptText += `[ASSISTANT]\n${msg.content}\n\n`
    }
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: promptText }] }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 2000
      }
    })
  })

  if (!response.ok) {
    const status = response.status
    if (status === 400) throw new Error('Gemini: Request tidak valid')
    if (status === 403) throw new Error('Gemini: API key tidak valid atau tidak diizinkan')
    if (status === 429) throw new Error('Gemini: Rate limit tercapai')
    throw new Error(`Gemini: HTTP ${status}`)
  }

  const data = await response.json()
  return data.candidates?.[0]?.content?.parts?.[0]?.text || ''
}

// Call OpenRouter API
const callOpenRouter = async (apiKey: string, messages: any[], model: string = 'openrouter/auto'): Promise<string> => {
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
      'HTTP-Referer': 'https://campaa.ai',
      'X-Title': 'Campaa AI'
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: 0.7,
      max_tokens: 2000
    })
  })

  if (!response.ok) {
    const status = response.status
    if (status === 401) throw new Error('OpenRouter: Credential tidak valid')
    if (status === 402) throw new Error('OpenRouter: Kuota tidak cukup')
    if (status === 429) throw new Error('OpenRouter: Rate limit tercapai')
    throw new Error(`OpenRouter: HTTP ${status}`)
  }

  const data = await response.json()
  return data.choices?.[0]?.message?.content || ''
}

// Main handler
export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' })
  }

  try {
    const { message, mode, provider, history }: ChatRequest = req.body || {}

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required and must be a string' })
    }

    // Validate message length
    if (message.length > 10000) {
      return res.status(400).json({ error: 'Message too long. Maximum 10000 characters.' })
    }

    const systemPrompt = getSystemPrompt(mode || 'general')
    const messages = buildMessages(systemPrompt, history, message)
    let usedProvider = 'none'

    // Provider chain: try in order based on preference
    const allProviders = [
      { id: 'openai', envKey: 'OPENAI_API_KEY', call: callOpenAI },
      { id: 'gemini', envKey: 'GEMINI_API_KEY', call: callGemini },
      { id: 'openrouter', envKey: 'OPENROUTER_API_KEY', call: callOpenRouter }
    ]

    // Determine provider order
    let providerOrder
    if (provider === 'auto' || !provider || provider === 'demo') {
      providerOrder = allProviders // try all in priority order
    } else {
      const selected = allProviders.find(p => p.id === provider)
      providerOrder = selected
        ? [selected, ...allProviders.filter(p => p.id !== provider)]
        : allProviders
    }

    // Try providers
    for (const p of providerOrder) {
      const apiKey = process.env[p.envKey]
      if (!apiKey || apiKey.trim() === '') continue

      try {
        const model = p.id === 'openai' ? 'gpt-4o-mini' : p.id === 'gemini' ? 'gemini-1.5-flash' : 'openrouter/auto'
        const result = await p.call(apiKey, messages, model)
        usedProvider = p.id
        return res.status(200).json({
          text: result,
          provider: usedProvider,
          mode: mode || 'general'
        })
      } catch (err) {
        const safeErr = sanitizeError(String(err))
        console.error(`[${p.id}] Failed: ${safeErr}`)
        continue // try next provider
      }
    }

    // All providers failed or not configured
    return res.status(503).json({
      error: 'Semua provider AI belum tersedia atau tidak dikonfigurasi. Pastikan environment variable telah diset di Vercel dashboard.',
      providers_tried: allProviders.map(p => p.id),
      suggestion: 'Tambahkan OPENAI_API_KEY, GEMINI_API_KEY, atau OPENROUTER_API_KEY di Vercel Environment Variables.'
    })
  } catch (error) {
    const safeError = sanitizeError(String(error))
    console.error('[chat handler] Unexpected error:', safeError)
    return res.status(500).json({
      error: 'Terjadi kesalahan internal. Silakan coba lagi dalam beberapa saat.'
    })
  }
}