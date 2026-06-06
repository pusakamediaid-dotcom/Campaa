// Intent Detector - Detect user intent from query
import { IntentResult, IntentType } from '../lib/types'
import { getModeById, getModeTools } from '../lib/prompts'

const INTENT_PATTERNS: Record<IntentType, { keywords: string[]; weight: number }> = {
  general_question: {
    keywords: ['apa', 'bagaimana', 'kenapa', 'siapa', 'dimana', 'kapan', 'jelaskan', 'terangkan', ' расскажи', 'what', 'how', 'why'],
    weight: 1
  },
  coding: {
    keywords: ['kode', 'code', 'coding', 'function', 'debug', 'program', 'javascript', 'typescript', 'python', 'react', 'vite', 'api', 'bug', 'error', 'sintaks', 'syntax', 'import', 'export', 'class', 'interface'],
    weight: 2
  },
  research: {
    keywords: ['riset', 'research', 'analisis', 'studi', 'data', 'metodologi', 'penelitian', 'survey', 'kuesioner', 'hipotesis', 'literatur', 'academic'],
    weight: 2
  },
  ebook_production: {
    keywords: ['ebook', 'buku', 'bab', 'subbab', 'kONSEP', 'analogi', 'rumus', 'contoh', 'aplikasi', 'outline', 'produksi', 'metode 5', '5-lapis', 'publish', 'jual ebook'],
    weight: 3
  },
  business: {
    keywords: ['bisnis', 'business', 'produk digital', 'monetisasi', 'harga', 'pricing', 'marketing', 'strategi', 'offer', 'jual', 'uang', 'income', 'revenue', 'customer', 'market'],
    weight: 2
  },
  repository: {
    keywords: ['github', 'repository', 'commit', 'pull request', 'readme', 'workflow', 'gitignore', 'issue', 'branch', 'git', 'merge', 'deploy', 'vercel', 'netlify'],
    weight: 3
  },
  tool_usage: {
    keywords: ['hitung', 'calculate', 'estimasi', 'token', 'biaya', 'cost', 'berapa', 'total', 'jumlah'],
    weight: 2
  },
  action_request: {
    keywords: ['buatkan', 'generate', 'create', 'make', 'buat', 'jelaskan cara', 'tolong', 'please', 'help me'],
    weight: 1
  },
  ebook_agent_integration: {
    keywords: ['agent otonom', 'dil autonomous', 'ebook agent', 'github issue', 'session', 'production', 'dila', 'pusaka'],
    weight: 3
  },
  unknown: {
    keywords: [],
    weight: 0
  }
}

export function detectIntent(query: string): IntentResult {
  const queryLower = query.toLowerCase()
  
  const scores: Record<IntentType, number> = {
    general_question: 0,
    coding: 0,
    research: 0,
    ebook_production: 0,
    business: 0,
    repository: 0,
    tool_usage: 0,
    action_request: 0,
    ebook_agent_integration: 0,
    unknown: 0
  }

  // Score each intent
  for (const [intent, config] of Object.entries(INTENT_PATTERNS)) {
    if (intent === 'unknown') continue
    
    for (const keyword of config.keywords) {
      if (queryLower.includes(keyword)) {
        scores[intent as IntentType] += config.weight
      }
    }
  }

  // Find best intent
  let bestIntent: IntentType = 'unknown'
  let bestScore = 0

  for (const [intent, score] of Object.entries(scores)) {
    if (score > bestScore) {
      bestScore = score
      bestIntent = intent as IntentType
    }
  }

  // Fallback to general question if no match
  if (bestScore === 0) {
    bestIntent = 'general_question'
  }

  // Determine risk level
  let requiresApproval = false
  let riskLevel: 'safe' | 'approval_required' | 'blocked' = 'safe'

  if (bestIntent === 'action_request') {
    requiresApproval = true
    riskLevel = 'approval_required'
  }

  // Determine recommended mode and tools
  const recommendedMode = intentToMode(bestIntent)
  const modeInfo = getModeById(recommendedMode)
  const recommendedTools = modeInfo?.recommendedTools || []

  const confidence = bestScore > 0 ? Math.min(bestScore / 5, 1) : 0.2

  return {
    intent: bestIntent,
    confidence,
    suggestedMode: recommendedMode,
    suggestedTools: recommendedTools,
    requiresApproval,
    riskLevel
  }
}

function intentToMode(intent: IntentType): string {
  const mapping: Record<IntentType, string> = {
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
  return mapping[intent] || 'general'
}