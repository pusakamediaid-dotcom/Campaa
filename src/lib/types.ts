export interface AIMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: number
  mode?: string
  provider?: string
}

export interface AIProvider {
  id: string
  name: string
  description: string
  available: boolean
  needsApiKey: boolean
}

export interface AIMode {
  id: string
  label: string
  description: string
  icon: string
  systemPrompt: string
}

export interface ChatSession {
  id: string
  title: string
  mode: string
  messages: AIMessage[]
  createdAt: number
  updatedAt: number
}

export interface AppState {
  currentMode: string
  currentProvider: string
  messages: AIMessage[]
  sessions: ChatSession[]
  isLoading: boolean
  error: string | null
}

export interface PromptEnhancerResult {
  original: string
  enhanced: string
  type: string
}