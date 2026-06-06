// Approval Gate - Human approval for risky actions
import { ActionDraft } from '../lib/types'
import { actionRegistry } from './actionRegistry'

export interface ApprovalRequest {
  action: ActionDraft
  requestedAt: number
  requestedBy: string
  message: string
}

// Simple approval gate - requires human confirmation for risky actions
export class ApprovalGate {
  private pendingRequests: Map<string, ApprovalRequest> = new Map()

  requestApproval(action: ActionDraft, requestedBy: string): ApprovalRequest | null {
    if (!action.requiresApproval) {
      // Auto-approve safe actions
      actionRegistry.approveAction(action.id, 'Auto-approved (safe action)')
      return null
    }

    const request: ApprovalRequest = {
      action,
      requestedAt: Date.now(),
      requestedBy,
      message: this.formatApprovalMessage(action)
    }

    this.pendingRequests.set(action.id, request)
    return request
  }

  approve(actionId: string, approverNote?: string): boolean {
    const request = this.pendingRequests.get(actionId)
    if (!request) return false

    this.pendingRequests.delete(actionId)
    return actionRegistry.approveAction(actionId, approverNote)
  }

  reject(actionId: string, reason: string): boolean {
    const request = this.pendingRequests.get(actionId)
    if (!request) return false

    this.pendingRequests.delete(actionId)
    return actionRegistry.rejectAction(actionId, reason)
  }

  getPendingRequests(): ApprovalRequest[] {
    return Array.from(this.pendingRequests.values())
  }

  getRequestCount(): number {
    return this.pendingRequests.size
  }

  private formatApprovalMessage(action: ActionDraft): string {
    const lines = [
      `**Action: ${action.title}**`,
      `**Type:** ${action.actionType}`,
      `**Risk Level:** ${action.riskLevel}`,
      '',
      action.description,
      ''
    ]

    if (action.payload) {
      lines.push('**Payload:**')
      lines.push('```')
      lines.push(JSON.stringify(action.payload, null, 2).slice(0, 500))
      lines.push('```')
    }

    lines.push('')
    lines.push('**WARNING:** This action requires human approval before execution.')
    lines.push('Reply "approve" to execute, "reject" to cancel.')

    return lines.join('\n')
  }
}

export const approvalGate = new ApprovalGate()