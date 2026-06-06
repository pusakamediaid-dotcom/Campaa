// Agent Pipeline - Orchestrate the full agent flow
import { IntentResult, AgentPlan, TaskStep, AIMessage } from '../lib/types'
import { detectIntent } from './intentDetector'
import { routeToTool, shouldUseTool } from '../tools/toolRouter'

export interface PipelineResult {
  response: string
  intent: IntentResult
  toolsUsed: string[]
  warnings: string[]
  nextSteps: string[]
}

export async function runAgentPipeline(
  query: string,
  messages: AIMessage[],
  currentMode: string
): Promise<PipelineResult> {
  // Step 1: Intent Detection
  const intent = detectIntent(query)

  const warnings: string[] = []
  const nextSteps: string[] = []
  const toolsUsed: string[] = []

  let response = ''

  // Step 2: Check if tool usage is recommended
  if (shouldUseTool(query) && intent.suggestedTools.length > 0) {
    // Try using tools
    for (const toolId of intent.suggestedTools) {
      try {
        const toolResult = await routeToTool(toolId, {
          query,
          mode: currentMode,
          messages,
          context: { intent: intent.intent }
        })

        if (toolResult.success) {
          toolsUsed.push(toolId)
          response = toolResult.result

          // If tool gives a good result, we're done
          if (response && response.length > 100) {
            break
          }
        }
      } catch (e) {
        // Tool failed, fall through to AI response
        warnings.push(`Tool ${toolId} execution failed, using AI fallback`)
      }
    }
  }

  // Step 3: If no tool result or tools not suggested, just use AI
  // The AI call happens in Chat.tsx with the proper mode
  if (!response) {
    response = '' // Will be filled by AI call in Chat.tsx
  }

  // Step 4: Add next steps based on intent
  switch (intent.intent) {
    case 'ebook_production':
      nextSteps.push('Pertimbangkan menggunakan Ebook Agent Bridge untuk generate GitHub issue')
      nextSteps.push('Buat task plan untuk produksi ebook')
      break
    case 'ebook_agent_integration':
      nextSteps.push('Generate issue body untuk DIL Ebook Agent')
      nextSteps.push('Buat session checklist sebelum produksi')
      break
    case 'repository':
      nextSteps.push('Generate repository artifacts (README, issue template, dll)')
      nextSteps.push('Pertimbangkan membuat GitHub Actions workflow')
      break
    case 'coding':
      nextSteps.push('Test kode yang dihasilkan')
      nextSteps.push('Pertimbangkan edge cases dan error handling')
      break
    case 'business':
      nextSteps.push('Buat action plan dengan timeline konkret')
      nextSteps.push('Identifikasi metrics untuk tracked')
      break
    default:
      nextSteps.push('Jika perlu, minta detail lebih lanjut')
  }

  // Add warnings for risky intents
  if (intent.requiresApproval) {
    warnings.push('Tindakan ini memerlukan approval sebelum eksekusi')
  }

  return {
    response,
    intent,
    toolsUsed,
    warnings,
    nextSteps
  }
}

// Quick pipeline for simple intent detection
export function quickIntentCheck(query: string): {
  intent: string
  confidence: number
  needsTool: boolean
  recommendedMode: string
} {
  const result = detectIntent(query)
  return {
    intent: result.intent,
    confidence: result.confidence,
    needsTool: result.suggestedTools.length > 0,
    recommendedMode: result.suggestedMode
  }
}