import { AIMessage } from './types'
import { getSystemPrompt } from './prompts'
import { getSmartDemoResponse } from './promptEnhancer'

export interface ChatRequest {
  message: string
  mode: string
  provider: string
  history: Array<{ role: string; content: string }>
}

export interface ChatResponse {
  success: boolean
  text: string
  error?: string
  provider?: string
}

const API_BASE = '/api'

const getFriendlyProviderError = (provider: string): string => {
  const providerLabel = getProviderLabel(provider)
  return `${providerLabel} belum aktif di server. Saya lanjutkan dengan Campaa Lite agar percakapan tetap berjalan.`
}

export const getProviderLabel = (provider: string): string => {
  const labels: Record<string, string> = {
    demo: 'Campaa Lite',
    openai: 'OpenAI',
    gemini: 'Gemini',
    openrouter: 'OpenRouter',
    fallback: 'Campaa Lite • fallback'
  }

  return labels[provider] || provider || 'Campaa Lite'
}

export const sendChatMessage = async (request: ChatRequest): Promise<ChatResponse> => {
  try {
    const response = await fetch(`${API_BASE}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(request)
    })

    if (!response.ok) {
      return {
        success: false,
        text: '',
        error: getFriendlyProviderError(request.provider),
        provider: request.provider
      }
    }

    const data = await response.json()
    return {
      success: true,
      text: data.text || '',
      provider: data.provider || request.provider
    }
  } catch {
    return {
      success: false,
      text: '',
      error: getFriendlyProviderError(request.provider),
      provider: request.provider
    }
  }
}

export const sendChatMessageDemo = (request: Pick<ChatRequest, 'message' | 'mode' | 'history'>): ChatResponse => {
  return {
    success: true,
    text: getSmartDemoResponse(request.message, request.mode, request.history),
    provider: 'demo'
  }
}

export const buildPromptWithHistory = (
  currentMessage: string,
  history: AIMessage[],
  mode: string
): { systemPrompt: string; userPrompt: string } => {
  const systemPrompt = getSystemPrompt(mode)
  
  let conversationHistory = ''
  history.forEach(msg => {
    const roleLabel = msg.role === 'user' ? 'Pengguna' : 'Asisten'
    conversationHistory += `${roleLabel}: ${msg.content}\n\n`
  })
  
  const userPrompt = conversationHistory
    ? `${conversationHistory}Pengguna: ${currentMessage}`
    : currentMessage
  
  return { systemPrompt, userPrompt }
}
