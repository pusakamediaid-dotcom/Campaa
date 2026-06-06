// Core Types for Campaa AI

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
  recommendedTools?: string[]
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

// Tool System Types
export type ToolType = 
  | 'calculator'
  | 'prompt'
  | 'markdown_export'
  | 'task_planner'
  | 'repository_helper'
  | 'ebook_agent'
  | 'safety_check'
  | 'reasoning'

export type RiskLevel = 'safe' | 'approval_required' | 'blocked'

export interface ToolDefinition {
  id: ToolType
  name: string
  description: string
  requiresApproval: boolean
  riskLevel: RiskLevel
  execute: (input: ToolInput) => Promise<ToolOutput>
}

export interface ToolInput {
  query?: string
  mode?: string
  context?: Record<string, any>
  payload?: Record<string, any>
}

export interface ToolOutput {
  success: boolean
  result: string
  toolUsed?: string
  metadata?: Record<string, any>
}

// Agent Pipeline Types
export type IntentType =
  | 'general_question'
  | 'coding'
  | 'research'
  | 'ebook_production'
  | 'business'
  | 'repository'
  | 'tool_usage'
  | 'action_request'
  | 'ebook_agent_integration'
  | 'unknown'

export interface IntentResult {
  intent: IntentType
  confidence: number
  suggestedMode: string
  suggestedTools: string[]
  requiresApproval: boolean
  riskLevel: RiskLevel
}

export interface TaskStep {
  order: number
  description: string
  tool?: string
  provider?: string
  riskLevel: RiskLevel
}

export interface AgentPlan {
  intent: IntentResult
  steps: TaskStep[]
  estimatedComplexity: 'simple' | 'medium' | 'complex'
  requiresApproval: boolean
}

// Action System Types
export type ActionStatus = 'draft' | 'pending_approval' | 'approved' | 'executed' | 'blocked' | 'failed'

export interface ActionDraft {
  id: string
  title: string
  description: string
  actionType: string
  riskLevel: RiskLevel
  requiresApproval: boolean
  payload: Record<string, any>
  status: ActionStatus
  createdAt: number
  approverNote?: string
}

// Ebook Agent Bridge Types
export interface EbookBrief {
  ebookTitle: string
  targetAudience: string
  readingLevel: 'beginner' | 'intermediate' | 'advanced'
  mode: 'planning' | 'test' | 'session'
  totalChapters: number
  targetPages?: number
  sessionNumber?: number
  contentBrief: string
  specialInstructions?: string
  apiPreference?: string
  pdfRequired?: boolean
}

export interface EbookSessionChecklist {
  sessionNumber: number
  mode: string
  chapters: number
  checklistItems: string[]
  warnings: string[]
}

// Memory Types
export interface MemoryEntry {
  key: string
  value: string
  timestamp: number
  expiresAt?: number
}

export interface ChatMemory {
  messages: AIMessage[]
  summary?: string
  lastUpdated: number
}

// Cost Guard Types
export interface CostEstimate {
  inputTokens: number
  estimatedOutputTokens: number
  estimatedCostUSD: number
  provider: string
}

export interface CostLimit {
  maxTokensPerMessage: number
  maxHistoryLength: number
  maxCostPerRequestUSD: number
  warnOnLongChat: number
}