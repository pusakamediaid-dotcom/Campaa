import { AIMessage, ChatSession } from './types'

const STORAGE_KEY = 'campaa_sessions'
const CURRENT_SESSION_KEY = 'campaa_current_session'

export const saveSessions = (sessions: ChatSession[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions))
  } catch (e) {
    console.warn('Failed to save sessions to localStorage')
  }
}

export const loadSessions = (): ChatSession[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    if (data) {
      return JSON.parse(data)
    }
  } catch (e) {
    console.warn('Failed to load sessions from localStorage')
  }
  return []
}

export const saveCurrentSession = (session: ChatSession | null): void => {
  try {
    if (session) {
      localStorage.setItem(CURRENT_SESSION_KEY, JSON.stringify(session))
    } else {
      localStorage.removeItem(CURRENT_SESSION_KEY)
    }
  } catch (e) {
    console.warn('Failed to save current session')
  }
}

export const loadCurrentSession = (): ChatSession | null => {
  try {
    const data = localStorage.getItem(CURRENT_SESSION_KEY)
    if (data) {
      return JSON.parse(data)
    }
  } catch (e) {
    console.warn('Failed to load current session')
  }
  return null
}

export const createNewSession = (mode: string, firstMessage?: string): ChatSession => {
  const now = Date.now()
  const id = `session_${now}`
  const title = firstMessage 
    ? firstMessage.slice(0, 50) + (firstMessage.length > 50 ? '...' : '')
    : `Chat ${new Date().toLocaleDateString('id-ID')}`
  
  return {
    id,
    title,
    mode,
    messages: [],
    createdAt: now,
    updatedAt: now
  }
}

export const exportChatToMarkdown = (session: ChatSession): string => {
  const lines: string[] = [
    `# ${session.title}`,
    ``,
    `Mode: ${session.mode}`,
    `Tanggal: ${new Date(session.createdAt).toLocaleString('id-ID')}`,
    ``,
    `---`,
    ``
  ]

  session.messages.forEach(msg => {
    const role = msg.role === 'user' ? 'Pengguna' : 'Campaa AI'
    const time = new Date(msg.timestamp).toLocaleTimeString('id-ID')
    lines.push(`## ${role} - ${time}`)
    lines.push('')
    lines.push(msg.content)
    lines.push('')
    lines.push('---')
    lines.push('')
  })

  return lines.join('\n')
}

export const exportChatToTxt = (session: ChatSession): string => {
  const lines: string[] = [
    session.title,
    '='.repeat(50),
    `Mode: ${session.mode}`,
    `Tanggal: ${new Date(session.createdAt).toLocaleString('id-ID')}`,
    '',
    ''
  ]

  session.messages.forEach(msg => {
    const role = msg.role === 'user' ? 'Pengguna' : 'Campaa AI'
    const time = new Date(msg.timestamp).toLocaleTimeString('id-ID')
    lines.push(`${role} [${time}]`)
    lines.push(msg.content)
    lines.push('')
    lines.push('-'.repeat(50))
    lines.push('')
  })

  return lines.join('\n')
}

export const downloadFile = (content: string, filename: string, type: string): void => {
  const blob = new Blob([content], { type })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}