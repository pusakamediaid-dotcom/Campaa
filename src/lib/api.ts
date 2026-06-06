import { AIMessage } from './types'
import { getSystemPrompt } from './prompts'
import { getDemoResponse } from './promptEnhancer'

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
      const errorData = await response.json().catch(() => ({}))
      return {
        success: false,
        text: '',
        error: errorData.message || `Request failed with status ${response.status}`
      }
    }

    const data = await response.json()
    return {
      success: true,
      text: data.text || '',
      provider: data.provider || request.provider
    }
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      return {
        success: false,
        text: '',
        error: 'Tidak dapat terhubung ke server. Pastikan API backend sudah dideploy.'
      }
    }
    return {
      success: false,
      text: '',
      error: 'Terjadi kesalahan saat menghubungi server.'
    }
  }
}

export const sendChatMessageDemo = (mode: string): ChatResponse => {
  return {
    success: true,
    text: getDemoResponse(mode),
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