// Memory System - Local storage for conversation memory
import { AIMessage, MemoryEntry } from './types'

const MEMORY_KEY = 'campaa_memory'
const MAX_MESSAGES = 50
const MAX_TOKEN_ESTIMATE = 8000

export interface MemoryConfig {
  maxMessages: number
  maxTokenEstimate: number
  enableSummarization: boolean
}

export const DEFAULT_MEMORY_CONFIG: MemoryConfig = {
  maxMessages: MAX_MESSAGES,
  maxTokenEstimate: MAX_TOKEN_ESTIMATE,
  enableSummarization: true
}

export class ChatMemory {
  private messages: AIMessage[] = []
  private config: MemoryConfig
  private summary: string = ''

  constructor(config: MemoryConfig = DEFAULT_MEMORY_CONFIG) {
    this.config = config
    this.load()
  }

  load(): void {
    try {
      const stored = localStorage.getItem(MEMORY_KEY)
      if (stored) {
        const data = JSON.parse(stored)
        this.messages = data.messages || []
        this.summary = data.summary || ''
      }
    } catch (e) {
      this.messages = []
    }
  }

  save(): void {
    try {
      const data = {
        messages: this.messages.slice(-this.config.maxMessages),
        summary: this.summary,
        savedAt: Date.now()
      }
      localStorage.setItem(MEMORY_KEY, JSON.stringify(data))
    } catch (e) {
      console.warn('Failed to save memory to localStorage')
    }
  }

  addMessage(message: AIMessage): void {
    this.messages.push(message)
    this.pruneIfNeeded()
    this.save()
  }

  getMessages(): AIMessage[] {
    return this.messages
  }

  getContext(): AIMessage[] {
    // Return messages with summary if history is long
    if (this.summary && this.messages.length > 20) {
      return [
        { id: 'summary', role: 'system', content: `Ringkasan percakapan sebelumnya: ${this.summary}`, timestamp: 0 },
        ...this.messages.slice(-10)
      ]
    }
    return this.messages.slice(-this.config.maxMessages)
  }

  getHistory(): Array<{ role: string; content: string }> {
    return this.getContext().map(m => ({ role: m.role, content: m.content }))
  }

  estimateTokens(): number {
    const text = this.messages.map(m => m.content).join(' ')
    return Math.ceil(text.length / 4) // ~4 chars per token
  }

  isLongChat(): boolean {
    return this.estimateTokens() > this.config.maxTokenEstimate
  }

  getLongChatWarning(): string | null {
    if (!this.isLongChat()) return null
    
    const tokens = this.estimateTokens()
    return `Chat cukup panjang (${tokens} tokens). Older messages mungkin tidak dikirim ke AI untuk menghemat biaya.`
  }

  private pruneIfNeeded(): void {
    if (this.messages.length > this.config.maxMessages) {
      // Keep recent messages
      this.messages = this.messages.slice(-this.config.maxMessages)
    }
  }

  clear(): void {
    this.messages = []
    this.summary = ''
    localStorage.removeItem(MEMORY_KEY)
  }

  setSummary(summary: string): void {
    this.summary = summary
    this.save()
  }

  getSummary(): string {
    return this.summary
  }
}

// Global memory instance
export const chatMemory = new ChatMemory()

// Memory helper functions
export function saveConversation(messages: AIMessage[]): void {
  try {
    localStorage.setItem('campaa_conversation_backup', JSON.stringify({
      messages,
      savedAt: Date.now()
    }))
  } catch (e) {
    console.warn('Failed to backup conversation')
  }
}

export function loadConversation(): AIMessage[] | null {
  try {
    const data = localStorage.getItem('campaa_conversation_backup')
    if (data) {
      return JSON.parse(data).messages
    }
  } catch (e) {
    console.warn('Failed to load conversation backup')
  }
  return null
}

export function clearConversation(): void {
  localStorage.removeItem('campaa_conversation_backup')
  chatMemory.clear()
}

// Token estimation
export function estimateInputTokens(text: string): number {
  return Math.ceil(text.length / 4)
}

export function estimateOutputTokens(inputTokens: number): number {
  // Estimate output is typically 1.5x input for AI responses
  return Math.ceil(inputTokens * 1.5)
}

export function truncateHistoryIfNeeded(
  history: Array<{ role: string; content: string }>,
  maxTokens: number = 6000
): Array<{ role: string; content: string }> {
  let totalTokens = 0
  const truncated: Array<{ role: string; content: string }> = []

  // Start from most recent
  for (let i = history.length - 1; i >= 0; i--) {
    const msg = history[i]
    const tokens = estimateInputTokens(msg.content)
    
    if (totalTokens + tokens <= maxTokens) {
      truncated.unshift(msg)
      totalTokens += tokens
    } else {
      break
    }
  }

  return truncated
}