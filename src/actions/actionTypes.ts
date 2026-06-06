// Action Types - Define action categories and risk levels
import { ActionStatus, RiskLevel } from '../lib/types'

export type ActionType = 
  | 'generate_issue'
  | 'update_file'
  | 'webhook_call'
  | 'email_notification'
  | 'export_data'
  | 'generate_draft'
  | 'api_request'

export const ACTION_RISK_LEVELS: Record<ActionType, RiskLevel> = {
  generate_issue: 'approval_required',
  update_file: 'approval_required',
  webhook_call: 'approval_required',
  email_notification: 'approval_required',
  export_data: 'safe',
  generate_draft: 'safe',
  api_request: 'blocked' // auto-call to external API without approval
}

export const ACTION_DESCRIPTIONS: Record<ActionType, string> = {
  generate_issue: 'Generate GitHub Issue body untuk trigger agent otonom',
  update_file: 'Update atau create file di repository via API',
  webhook_call: 'Kirim data ke external webhook URL',
  email_notification: 'Kirim notifikasi via email atau messaging',
  export_data: 'Export chat atau data ke file',
  generate_draft: 'Generate draft dokumen, prompt, atau template',
  api_request: 'Langsung panggil external API tanpa approval'
}

export interface ActionDefinition {
  type: ActionType
  name: string
  description: string
  riskLevel: RiskLevel
  requiresApproval: boolean
  blocked: boolean
  allowedWithoutApproval: boolean
}

export const ACTION_DEFINITIONS: ActionDefinition[] = [
  {
    type: 'generate_issue',
    name: 'Generate GitHub Issue',
    description: 'Generate body issue untuk trigger agent otonom DIL',
    riskLevel: 'approval_required',
    requiresApproval: true,
    blocked: false,
    allowedWithoutApproval: false
  },
  {
    type: 'generate_draft',
    name: 'Generate Draft',
    description: 'Generate draft dokumen, prompt, atau template',
    riskLevel: 'safe',
    requiresApproval: false,
    blocked: false,
    allowedWithoutApproval: true
  },
  {
    type: 'export_data',
    name: 'Export Data',
    description: 'Export chat atau data ke file download',
    riskLevel: 'safe',
    requiresApproval: false,
    blocked: false,
    allowedWithoutApproval: true
  },
  {
    type: 'webhook_call',
    name: 'Webhook Call',
    description: 'Kirim data ke webhook URL',
    riskLevel: 'approval_required',
    requiresApproval: true,
    blocked: false,
    allowedWithoutApproval: false
  },
  {
    type: 'update_file',
    name: 'Update File',
    description: 'Update file di repository via GitHub API',
    riskLevel: 'approval_required',
    requiresApproval: true,
    blocked: false,
    allowedWithoutApproval: false
  },
  {
    type: 'email_notification',
    name: 'Email Notification',
    description: 'Kirim notifikasi via email',
    riskLevel: 'approval_required',
    requiresApproval: true,
    blocked: false,
    allowedWithoutApproval: false
  },
  {
    type: 'api_request',
    name: 'API Request (Auto)',
    description: 'Langsung panggil external API tanpa user approval',
    riskLevel: 'blocked',
    requiresApproval: true,
    blocked: true,
    allowedWithoutApproval: false
  }
]

export function getActionDefinition(type: ActionType): ActionDefinition | undefined {
  return ACTION_DEFINITIONS.find(a => a.type === type)
}

export function isActionBlocked(type: ActionType): boolean {
  const def = getActionDefinition(type)
  return def?.blocked ?? true
}

export function requiresApproval(type: ActionType): boolean {
  const def = getActionDefinition(type)
  return def?.requiresApproval ?? true
}