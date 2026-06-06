// Tool Router - Route requests to appropriate tools
import { ToolOutput, IntentResult, IntentType } from '../lib/types'
import { calculatorTool } from './calculatorTool'
import { promptTool, PromptType } from './promptTool'
import { markdownExportTool } from './markdownExportTool'
import { taskPlannerTool } from './taskPlannerTool'
import { repositoryHelperTool, RepositoryArtifactType } from './repositoryHelperTool'
import { ebookAgentTool } from './ebookAgentTool'

// Intent detection keywords
const INTENT_KEYWORDS: Record<IntentType, string[]> = {
  general_question: [],
  coding: ['kode', 'code', 'function', 'debug', 'programming', 'script', 'javascript', 'python', 'typescript', 'react', 'vite', 'api'],
  research: ['riset', 'research', 'analisis', 'studi', 'data', 'metodologi', 'penelitian'],
  ebook_production: ['ebook', 'buku', 'bab', 'subbab', 'kONSEP', 'analogi', 'rumus', 'contoh', 'aplikasi', 'outline', 'produksi ebook'],
  business: ['bisnis', 'business', 'produk digital', 'monetisasi', 'harga', 'pricing', 'marketing', 'strategi', 'offer'],
  repository: ['github', 'repository', 'commit', 'pull request', 'readme', 'workflow', 'gitignore', 'issue', 'branch'],
  tool_usage: ['hitung', 'calculate', 'estimasi', 'token', 'biaya', 'cost'],
  action_request: ['buatkan', 'generate', 'create', 'make', 'jelaskan cara'],
  ebook_agent_integration: ['agent otonom', 'dil autonomous', 'ebook agent', 'github issue', 'session', 'production'],
  unknown: []
}

export function detectIntent(query: string): IntentResult {
  const queryLower = query.toLowerCase()
  
  let bestIntent: IntentType = 'general_question'
  let maxScore = 0

  for (const [intent, keywords] of Object.entries(INTENT_KEYWORDS)) {
    if (intent === 'general_question' || intent === 'unknown') continue
    
    let score = 0
    for (const keyword of keywords) {
      if (queryLower.includes(keyword)) {
        score++
      }
    }
    
    if (score > maxScore) {
      maxScore = score
      bestIntent = intent as IntentType
    }
  }

  let requiresApproval = false
  let riskLevel: 'safe' | 'approval_required' | 'blocked' = 'safe'

  if (bestIntent === 'action_request') {
    requiresApproval = true
    riskLevel = 'approval_required'
  }

  const suggestedTools = getSuggestedTools(bestIntent)

  return {
    intent: bestIntent,
    confidence: maxScore > 0 ? Math.min(maxScore / 3, 1) : 0.1,
    suggestedMode: getRecommendedMode(bestIntent),
    suggestedTools,
    requiresApproval,
    riskLevel
  }
}

function getSuggestedTools(intent: IntentType): string[] {
  switch (intent) {
    case 'tool_usage':
      return ['calculator']
    case 'coding':
      return ['prompt', 'calculator']
    case 'research':
      return ['task_planner', 'prompt']
    case 'ebook_production':
      return ['ebook_agent', 'markdown_export', 'prompt', 'task_planner']
    case 'business':
      return ['task_planner', 'calculator', 'prompt']
    case 'repository':
      return ['repository_helper']
    case 'ebook_agent_integration':
      return ['ebook_agent', 'task_planner']
    case 'action_request':
      return ['repository_helper', 'ebook_agent']
    default:
      return []
  }
}

function getRecommendedMode(intent: IntentType): string {
  const modeMap: Record<IntentType, string> = {
    general_question: 'general',
    coding: 'coding',
    research: 'research',
    ebook_production: 'ebook_architect',
    business: 'business_builder',
    repository: 'github_assistant',
    tool_usage: 'tool_commander',
    action_request: 'safety_reviewer',
    ebook_agent_integration: 'ebook_production_architect',
    unknown: 'general'
  }
  return modeMap[intent] || 'general'
}

// Route to appropriate tool
export async function routeToTool(
  toolId: string,
  input: any
): Promise<ToolOutput> {
  switch (toolId) {
    case 'calculator':
      return calculatorTool({
        operation: input.operation || 'add',
        a: input.a || 0,
        b: input.b,
        tokensPerWord: input.tokensPerWord,
        costPer1k: input.costPer1k
      })

    case 'prompt':
      return promptTool({
        query: input.query || input.message || '',
        type: (input.type || 'general') as PromptType,
        mode: input.mode,
        context: input.context
      })

    case 'markdown_export':
      return markdownExportTool({
        messages: input.messages || [],
        format: input.format || 'markdown',
        title: input.title,
        includeMetadata: input.includeMetadata !== false
      })

    case 'task_planner':
      return taskPlannerTool({
        query: input.query || input.message || '',
        mode: input.mode || 'medium',
        context: input.context
      })

    case 'repository_helper':
      return repositoryHelperTool({
        type: (input.type || 'readme') as RepositoryArtifactType,
        projectName: input.projectName,
        description: input.description,
        context: input.context
      })

    case 'ebook_agent':
      return ebookAgentTool({
        action: input.action || 'generate_issue_body',
        brief: input.brief,
        artifactPath: input.artifactPath,
        sessionNumber: input.sessionNumber,
        context: input.context
      })

    default:
      return {
        success: false,
        result: 'Tool "' + toolId + '" tidak ditemukan. Available tools: calculator, prompt, markdown_export, task_planner, repository_helper, ebook_agent',
        toolUsed: 'tool_router'
      }
  }
}

// Check if query suggests tool usage
export function shouldUseTool(query: string): boolean {
  const intent = detectIntent(query)
  return intent.confidence > 0.3 || intent.suggestedTools.length > 0
}