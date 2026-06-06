import type { VercelRequest, VercelResponse } from '@vercel/node'

interface ChatRequest {
  message: string
  mode: string
  provider: string
  history: Array<{
    role: string
    content: string
  }>
}

const getSystemPrompt = (mode: string): string => {
  const prompts: Record<string, string> = {
    general: 'Anda adalah asisten AI yang cerdas, ramah, dan membantu. Jawab dengan jelas, praktis, dan informatif dalam Bahasa Indonesia yang baik dan benar.',
    research: 'Anda adalah asisten riset profesional. Bantu menyusun jawaban dengan struktur yang jelas: latar belakang masalah, asumsi, data yang perlu dicari, analisis, dan kesimpulan.',
    writer: 'Anda adalah asisten penulis profesional. Bantu membuat teks panjang yang terstruktur, mudah dipahami, dan siap untuk diedit atau dipublikasikan.',
    business: 'Anda adalah konsultan strategi bisnis digital. Fokus pada produk digital, monetisasi, penawaran nilai, dan validasi pasar.',
    coding: 'Anda adalah asisten developer profesional. Bantu dengan kode, debugging, arsitektur aplikasi, dan dokumentasi.',
    ebook_architect: 'Anda adalah arsitek ebook profesional. Bantu membuat outline ebook, instruksi produksi, pembagian sesi, konsistensi gaya, dan standar visual.',
    reviewer: 'Anda adalah reviewer profesional yang teliti. Periksa kualitas konten dari berbagai aspek dan berikan feedback yang konstruktif.',
    product_strategy: 'Anda adalah strategist produk digital. Bantu dengan angle produk, offer, strategi konten, dan struktur landing page.',
    github_assistant: 'Anda adalah asisten GitHub yang kompeten. Bantu dengan penjelasan repository, instruksi commit, dan workflow.'
  }
  return prompts[mode] || prompts.general
}

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
    const error = await response.json().catch(() => ({}))
    throw new Error(`OpenAI Error: ${response.status}`)
  }

  const data = await response.json()
  return data.choices?.[0]?.message?.content || ''
}

const callGemini = async (apiKey: string, prompt: string, model: string = 'gemini-1.5-flash'): Promise<string> => {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 2000
      }
    })
  })

  if (!response.ok) {
    throw new Error(`Gemini Error: ${response.status}`)
  }

  const data = await response.json()
  return data.candidates?.[0]?.content?.parts?.[0]?.text || ''
}

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
    throw new Error(`OpenRouter Error: ${response.status}`)
  }

  const data = await response.json()
  return data.choices?.[0]?.message?.content || ''
}

const sanitizeError = (error: string): string => {
  return error
    .replace(/sk-[a-zA-Z0-9]{20,}/g, '[REDACTED]')
    .replace(/ghp_[a-zA-Z0-9]{36,}/g, '[REDACTED]')
    .replace(/AIza[a-zA-Z0-9_-]{35,}/g, '[REDACTED]')
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { message, mode, provider, history }: ChatRequest = req.body

    if (!message) {
      return res.status(400).json({ error: 'Message is required' })
    }

    const systemPrompt = getSystemPrompt(mode || 'general')
    
    const messages = [
      { role: 'system', content: systemPrompt },
      ...(history || []).map((h: any) => ({ role: h.role, content: h.content })),
      { role: 'user', content: message }
    ]

    let result = ''
    let usedProvider = provider || 'auto'

    // Try providers based on preference
    const providers = [
      { id: 'openai', envKey: 'OPENAI_API_KEY', call: callOpenAI },
      { id: 'gemini', envKey: 'GEMINI_API_KEY', call: callGemini },
      { id: 'openrouter', envKey: 'OPENROUTER_API_KEY', call: callOpenRouter }
    ]

    const providerOrder = provider === 'auto' || !provider
      ? providers
      : providers.filter(p => p.id === provider).concat(providers.filter(p => p.id !== provider))

    for (const p of providerOrder) {
      const apiKey = process.env[p.envKey]
      if (!apiKey) continue

      try {
        if (p.id === 'gemini') {
          result = await p.call(apiKey, message, 'gemini-1.5-flash')
        } else {
          result = await p.call(apiKey, messages, p.id === 'openai' ? 'gpt-4o-mini' : 'openrouter/auto')
        }
        usedProvider = p.id
        break
      } catch (e) {
        console.error(`${p.id} call failed:`, sanitizeError(String(e)))
        continue
      }
    }

    if (!result) {
      return res.status(503).json({
        error: 'Semua provider AI belum tersedia. Pastikan environment variable sudah dikonfigurasi.',
        providers_tried: providerOrder.map(p => p.id)
      })
    }

    return res.status(200).json({
      text: result,
      provider: usedProvider,
      mode: mode || 'general'
    })
  } catch (error) {
    console.error('Chat handler error:', sanitizeError(String(error)))
    return res.status(500).json({
      error: 'Terjadi kesalahan internal. Silakan coba lagi.'
    })
  }
}