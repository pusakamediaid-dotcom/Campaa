// Task Planner - Decompose complex requests into steps
import { AgentPlan, IntentResult, TaskStep } from '../lib/types'

export function createTaskPlan(intent: IntentResult, query: string): AgentPlan {
  const steps: TaskStep[] = []

  // Step 1: Understand
  steps.push({
    order: 1,
    description: 'Pahami maksud user dari query',
    riskLevel: 'safe'
  })

  // Step 2: Plan based on intent
  switch (intent.intent) {
    case 'ebook_production':
      steps.push(
        { order: 2, description: 'Identifikasi outline ebook (bab, subbab)', riskLevel: 'safe' },
        { order: 3, description: 'Tentukan sesi produksi (planning/test/session)', riskLevel: 'safe' },
        { order: 4, description: 'Generate brief konten', riskLevel: 'safe' },
        { order: 5, description: 'Buat GitHub issue body jika perlu', riskLevel: 'safe' }
      )
      break

    case 'ebook_agent_integration':
      steps.push(
        { order: 2, description: 'Generate issue body untuk DIL Ebook Agent', riskLevel: 'safe' },
        { order: 3, description: 'Buat session checklist', riskLevel: 'safe' },
        { order: 4, description: 'Validasi brief dan aturan khusus', riskLevel: 'safe' },
        { order: 5, description: 'Berikan instruksi deployment', riskLevel: 'safe' }
      )
      break

    case 'coding':
      steps.push(
        { order: 2, description: 'Analisis requirements dan constraints', riskLevel: 'safe' },
        { order: 3, description: 'Generate kode dengan dokumentasi', riskLevel: 'safe' },
        { order: 4, description: 'Tambahkan error handling', riskLevel: 'safe' },
        { order: 5, description: 'Suggest testing strategy', riskLevel: 'safe' }
      )
      break

    case 'repository':
      steps.push(
        { order: 2, description: 'Identifikasi kebutuhan repository', riskLevel: 'safe' },
        { order: 3, description: 'Generate artifacts (README, issue template, workflow)', riskLevel: 'safe' },
        { order: 4, description: 'Berikan setup instructions', riskLevel: 'safe' }
      )
      break

    case 'business':
      steps.push(
        { order: 2, description: 'Analisis market dan target audience', riskLevel: 'safe' },
        { order: 3, description: 'Identifikasi value proposition', riskLevel: 'safe' },
        { order: 4, description: 'Buat strategi monetisasi', riskLevel: 'safe' },
        { order: 5, description: 'Susun action plan dengan timeline', riskLevel: 'safe' }
      )
      break

    case 'research':
      steps.push(
        { order: 2, description: 'Identifikasi research framework', riskLevel: 'safe' },
        { order: 3, description: 'Tentukan metodologi', riskLevel: 'safe' },
        { order: 4, description: 'Susun timeline research', riskLevel: 'safe' },
        { order: 5, description: 'Identifikasi expected outcomes', riskLevel: 'safe' }
      )
      break

    default:
      steps.push(
        { order: 2, description: 'Analisis query', riskLevel: 'safe' },
        { order: 3, description: 'Beri respons sesuai mode', riskLevel: 'safe' }
      )
  }

  // Determine complexity
  const complexity = intent.suggestedTools.length > 2 ? 'complex' 
    : intent.suggestedTools.length > 0 ? 'medium' 
    : 'simple'

  return {
    intent,
    steps,
    estimatedComplexity: complexity,
    requiresApproval: intent.requiresApproval
  }
}