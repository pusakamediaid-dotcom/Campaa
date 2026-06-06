// Action Registry - Manage action drafts
import { ActionDraft, ActionStatus } from '../lib/types'
import { requiresApproval, isActionBlocked, getActionDefinition } from './actionTypes'

export class ActionRegistry {
  private actions: Map<string, ActionDraft> = new Map()

  createAction(
    title: string,
    description: string,
    actionType: string,
    payload: Record<string, any>
  ): ActionDraft | null {
    // Check if action is blocked
    if (isActionBlocked(actionType as any)) {
      return null
    }

    const riskLevel = requiresApproval(actionType as any) ? 'approval_required' : 'safe'

    const action: ActionDraft = {
      id: `action_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      title,
      description,
      actionType,
      riskLevel,
      requiresApproval: requiresApproval(actionType as any),
      payload,
      status: requiresApproval(actionType as any) ? 'pending_approval' : 'draft',
      createdAt: Date.now()
    }

    this.actions.set(action.id, action)
    return action
  }

  getAction(id: string): ActionDraft | undefined {
    return this.actions.get(id)
  }

  getAllActions(): ActionDraft[] {
    return Array.from(this.actions.values())
  }

  getPendingApproval(): ActionDraft[] {
    return this.getAllActions().filter(a => a.status === 'pending_approval')
  }

  approveAction(id: string, note?: string): boolean {
    const action = this.actions.get(id)
    if (!action || action.status !== 'pending_approval') return false

    action.status = 'approved'
    action.approverNote = note
    return true
  }

  rejectAction(id: string, note?: string): boolean {
    const action = this.actions.get(id)
    if (!action) return false

    action.status = 'blocked'
    action.approverNote = note
    return true
  }

  markExecuted(id: string): boolean {
    const action = this.actions.get(id)
    if (!action || action.status !== 'approved') return false

    action.status = 'executed'
    return true
  }

  markFailed(id: string, reason: string): boolean {
    const action = this.actions.get(id)
    if (!action) return false

    action.status = 'failed'
    action.approverNote = reason
    return true
  }

  clearOldActions(maxAgeMs: number = 86400000): void {
    const cutoff = Date.now() - maxAgeMs
    for (const [id, action] of this.actions.entries()) {
      if (action.createdAt < cutoff && action.status !== 'pending_approval') {
        this.actions.delete(id)
      }
    }
  }
}

// Global instance
export const actionRegistry = new ActionRegistry()

// Helper to create common action drafts
export function createEbookIssueAction(
  title: string,
  brief: Record<string, any>
): ActionDraft | null {
  return actionRegistry.createAction(
    title,
    'Generate GitHub Issue untuk trigger DIL Ebook Agent',
    'generate_issue',
    { ...brief, action: 'ebook_production' }
  )
}

export function createDraftAction(
  title: string,
  description: string,
  content: string
): ActionDraft | null {
  return actionRegistry.createAction(
    title,
    description,
    'generate_draft',
    { content }
  )
}

export function createExportAction(
  title: string,
  format: string,
  content: string
): ActionDraft | null {
  return actionRegistry.createAction(
    title,
    `Export chat ke format ${format}`,
    'export_data',
    { format, content }
  )
}