import { AIMessage } from '../lib/types'
import { downloadFile } from '../lib/storage'

interface MessageBubbleProps {
  message: AIMessage
  onCopy?: () => void
}

const getProviderMeta = (provider?: string) => {
  if (!provider) return ''
  if (provider === 'demo') return 'Campaa Lite'
  return provider
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user'
  const providerMeta = getProviderMeta(message.provider)

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content)
  }

  const handleExportMd = () => {
    const md = `# Chat Export\n\n**Role:** ${message.role === 'user' ? 'User' : 'Campaa AI'}\n**Provider:** ${providerMeta || '-'}\n**Time:** ${new Date(message.timestamp).toLocaleString('id-ID')}\n\n---\n\n${message.content}`
    downloadFile(md, `message_${Date.now()}.md`, 'text/markdown')
  }

  const escapeHtml = (text: string) => {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
  }

  const formatContent = (text: string) => {
    let formatted = escapeHtml(text)

    formatted = formatted.replace(/```(\w+)?\n([\s\S]*?)```/g, (_, lang, code) => {
      return `<pre><code class="language-${lang || 'plaintext'}">${code.trim()}</code></pre>`
    })

    formatted = formatted.replace(/`([^`]+)`/g, '<code>$1</code>')
    formatted = formatted.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    formatted = formatted.replace(/\n\n/g, '</p><p>')
    formatted = `<p>${formatted}</p>`

    return formatted
  }

  return (
    <div className={`message-bubble ${isUser ? 'user-row' : 'assistant-row'}`}>
      <div className={`message-avatar ${isUser ? 'user' : 'assistant'}`}>
        {isUser ? 'U' : 'AI'}
      </div>
      <div className={`message-content ${isUser ? 'user-card' : 'assistant-card'}`}>
        <div className="message-header">
          <span className="message-role">{isUser ? 'Anda' : 'Campaa AI'}</span>
          {!isUser && providerMeta && <span className="provider-meta">{providerMeta}</span>}
          <span className="message-time">
            {new Date(message.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
        <div
          className="message-text"
          dangerouslySetInnerHTML={{ __html: formatContent(message.content) }}
        />
        {!isUser && (
          <div className="message-actions">
            <button className="action-btn" onClick={handleCopy} type="button">
              Copy
            </button>
            <button className="action-btn" onClick={handleExportMd} type="button">
              Simpan MD
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
