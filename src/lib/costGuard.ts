// Cost Guard - Simple cost estimation and limits
import { CostEstimate, CostLimit } from './types'

export const DEFAULT_COST_LIMITS: CostLimit = {
  maxTokensPerMessage: 4000,
  maxHistoryLength: 10000,
  maxCostPerRequestUSD: 0.05,
  warnOnLongChat: 6000
}

// Model pricing (per 1K tokens)
const MODEL_PRICING: Record<string, { input: number; output: number }> = {
  'gpt-4o-mini': { input: 0.00015, output: 0.0006 },
  'gpt-4o': { input: 0.005, output: 0.015 },
  'gemini-1.5-flash': { input: 0.000075, output: 0.0003 },
  'gemini-1.5-pro': { input: 0.00125, output: 0.005 },
  'openrouter/auto': { input: 0.001, output: 0.003 }
}

export function estimateCost(
  inputTokens: number,
  outputTokens: number,
  model: string = 'gpt-4o-mini'
): CostEstimate {
  const pricing = MODEL_PRICING[model] || { input: 0.001, output: 0.003 }
  
  const inputCost = (inputTokens / 1000) * pricing.input
  const outputCost = (outputTokens / 1000) * pricing.output
  const totalCost = inputCost + outputCost

  return {
    inputTokens,
    estimatedOutputTokens: outputTokens,
    estimatedCostUSD: Math.round(totalCost * 1000000) / 1000000,
    provider: model.includes('gemini') ? 'gemini' : model.includes('openrouter') ? 'openrouter' : 'openai'
  }
}

export function checkCostLimit(
  estimatedCost: number,
  limit: CostLimit = DEFAULT_COST_LIMITS
): { allowed: boolean; warning: string | null } {
  if (estimatedCost > limit.maxCostPerRequestUSD) {
    return {
      allowed: false,
      warning: `Estimasi biaya $${estimatedCost.toFixed(4)} melebihi limit $${limit.maxCostPerRequestUSD}`
    }
  }

  return { allowed: true, warning: null }
}

export function estimateFromText(text: string): number {
  return Math.ceil(text.length / 4)
}

export function formatCost(costUSD: number): string {
  if (costUSD < 0.001) {
    return `$${(costUSD * 1000).toFixed(2)} mil`
  } else if (costUSD < 0.01) {
    return `$${(costUSD * 1000).toFixed(1)} mil`
  } else {
    return `$${costUSD.toFixed(4)}`
  }
}

export function getModelName(provider: string): string {
  const models: Record<string, string> = {
    openai: 'gpt-4o-mini',
    gemini: 'gemini-1.5-flash',
    openrouter: 'openrouter/auto',
    demo: 'N/A'
  }
  return models[provider] || 'gpt-4o-mini'
}

export function getModelPricing(model: string): { input: number; output: number } {
  return MODEL_PRICING[model] || { input: 0.001, output: 0.003 }
}