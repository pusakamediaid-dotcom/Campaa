// Calculator Tool - Basic math and cost estimation
import { ToolOutput } from '../lib/types'

export async function calculatorTool(input: {
  operation: 'add' | 'subtract' | 'multiply' | 'divide' | 'estimate_cost' | 'estimate_tokens'
  a: number
  b?: number
  tokensPerWord?: number
  costPer1k?: number
}): Promise<ToolOutput> {
  try {
    const { operation, a, b = 0, tokensPerWord = 1.33, costPer1k = 0.001 } = input

    let result: string = ''
    let calculation: number = 0

    switch (operation) {
      case 'add':
        calculation = a + b
        result = `${a} + ${b} = ${calculation}`
        break

      case 'subtract':
        calculation = a - b
        result = `${a} - ${b} = ${calculation}`
        break

      case 'multiply':
        calculation = a * b
        result = `${a} x ${b} = ${calculation}`
        break

      case 'divide':
        if (b === 0) {
          return { success: false, result: 'Tidak bisa membagi dengan 0', toolUsed: 'calculator' }
        }
        calculation = a / b
        result = `${a} / ${b} = ${calculation.toFixed(2)}`
        break

      case 'estimate_tokens':
        const wordCount = a
        const estimated = Math.ceil(wordCount * tokensPerWord)
        result = `Estimasi: ${wordCount} kata ≈ ${estimated} token (rasio ${tokensPerWord} token/kata)`
        break

      case 'estimate_cost':
        const tokens = a
        const cost = (tokens / 1000) * costPer1k
        result = `Estimasi biaya: ${tokens} token ≈ $${cost.toFixed(6)} ($${costPer1k}/1K tokens)`
        calculation = cost
        break

      default:
        return { success: false, result: 'Operasi tidak dikenal', toolUsed: 'calculator' }
    }

    return {
      success: true,
      result,
      toolUsed: 'calculator',
      metadata: { operation, calculation: calculation || 0 }
    }
  } catch (error) {
    return { success: false, result: 'Calculator error: ' + String(error), toolUsed: 'calculator' }
  }
}

// Quick estimate for AI costs
export function estimateAICost(
  inputTokens: number,
  outputTokens: number,
  provider: 'openai' | 'gemini' | 'openrouter',
  model: string
): string {
  const rates: Record<string, { input: number; output: number }> = {
    'gpt-4o-mini': { input: 0.00015, output: 0.0006 },
    'gpt-4o': { input: 0.005, output: 0.015 },
    'gemini-1.5-flash': { input: 0.000075, output: 0.0003 },
    'gemini-1.5-pro': { input: 0.00125, output: 0.005 },
    'openrouter/auto': { input: 0.001, output: 0.003 }
  }

  const rate = rates[model] || { input: 0.001, output: 0.003 }
  const cost = (inputTokens / 1000) * rate.input + (outputTokens / 1000) * rate.output

  return `Estimasi biaya ${provider}/${model}: $${cost.toFixed(6)} (${inputTokens} input + ${outputTokens} output tokens)`
}