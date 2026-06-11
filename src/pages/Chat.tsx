import { useState, useRef, useEffect } from 'react'
import { AIMessage, AIMode } from '../lib/types'
import { ChatRequest, getProviderLabel, sendChatMessage, sendChatMessageDemo } from '../lib/api'
import { saveSessions, loadSessions } from '../lib/storage'
import MessageBubble from '../components/MessageBubble'
import ModeSelector from '../components/ModeSelector'
import ProviderSelector from '../components/ProviderSelector'
import ChatInput from '../components/ChatInput'

interface ChatProps {
  messages: AIMessage[]
  setMessages: React.Dispatch<React.SetStateAction<AIMessage[]>>
  currentMode: string
  currentProvider: string
  onModeChange: (modeId: string) => void
  onProviderChange: (provider: string) => void
  modes: AIMode[]
}

const EXAMPLE_CHIPS = [
  'Saya jual ebook di Google Play',
  'Bantu buat deskripsi produk',
  'Buat strategi konten',
  'Review prompt saya'
]

export default function Chat({
  messages,
  setMessages,
  currentMode,
  currentProvider,
  onModeChange,
  onProviderChange,
  modes
}: ChatProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [providerNotice, setProviderNotice] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    setProviderNotice('')
  }, [currentProvider])

  const buildHistory = (items: AIMessage[]): ChatRequest['history'] => {
    return items
      .filter(m => m.role === 'user' || m.role === 'assistant')
      .map(m => ({ role: m.role, content: m.content }))
  }

  const handleEnhancePrompt = (enhancedText: string) => {
    handleSendMessage(enhancedText)
  }

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return

    const userMessage: AIMessage = {
      id: `msg_${Date.now()}_user`,
      role: 'user',
      content: text,
      timestamp: Date.now(),
      mode: currentMode,
      provider: currentProvider
    }

    const nextMessages = [...messages, userMessage]
    setMessages(nextMessages)
    setIsLoading(true)

    try {
      let responseText = ''
      let usedProvider = currentProvider
      let notice = ''
      const history = buildHistory(messages)

      if (currentProvider === 'demo') {
        const demoResponse = sendChatMessageDemo({
          message: text,
          mode: currentMode,
          history
        })
        responseText = demoResponse.text
        usedProvider = 'Campaa Lite'
      } else {
        const result = await sendChatMessage({
          message: text,
          mode: currentMode,
          provider: currentProvider,
          history
        })

        if (result.success) {
          responseText = result.text
          usedProvider = getProviderLabel(result.provider || currentProvider)
        } else {
          const demoResponse = sendChatMessageDemo({
            message: text,
            mode: currentMode,
            history
          })
          notice = result.error || `${getProviderLabel(currentProvider)} belum aktif di server. Saya lanjutkan dengan Campaa Lite agar percakapan tetap berjalan.`
          responseText = `${notice}\n\n${demoResponse.text}`
          usedProvider = 'Campaa Lite • fallback'
        }
      }

      setProviderNotice(notice)

      const assistantMessage: AIMessage = {
        id: `msg_${Date.now()}_assistant`,
        role: 'assistant',
        content: responseText,
        timestamp: Date.now(),
        mode: currentMode,
        provider: usedProvider
      }

      const finalMessages = [...nextMessages, assistantMessage]
      setMessages(finalMessages)

      const sessions = loadSessions()
      const newSession = {
        id: `session_${Date.now()}`,
        title: text.slice(0, 50) + (text.length > 50 ? '...' : ''),
        mode: currentMode,
        messages: finalMessages,
        createdAt: Date.now(),
        updatedAt: Date.now()
      }
      saveSessions([newSession, ...sessions.slice(0, 19)])
    } catch {
      const history = buildHistory(messages)
      const demoResponse = sendChatMessageDemo({
        message: text,
        mode: currentMode,
        history
      })
      const notice = 'Provider belum aktif di server. Saya lanjutkan dengan Campaa Lite agar percakapan tetap berjalan.'
      setProviderNotice(notice)

      const fallbackMessage: AIMessage = {
        id: `msg_${Date.now()}_assistant`,
        role: 'assistant',
        content: `${notice}\n\n${demoResponse.text}`,
        timestamp: Date.now(),
        mode: currentMode,
        provider: 'Campaa Lite • fallback'
      }
      setMessages(prev => [...prev, fallbackMessage])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="chat-page">
      <div className="chat-header">
        <div className="chat-header-topline">
          <span className="chat-kicker">Campaa AI v1.2</span>
          <span className={`provider-state ${currentProvider === 'demo' ? 'demo' : 'provider'}`}>
            {currentProvider === 'demo' ? 'Campaa Lite aktif' : `${getProviderLabel(currentProvider)} dipilih`}
          </span>
        </div>
        <ModeSelector
          modes={modes}
          currentMode={currentMode}
          onModeChange={onModeChange}
        />
        <ProviderSelector
          currentProvider={currentProvider}
          onProviderChange={onProviderChange}
          isDemo={currentProvider === 'demo'}
        />
        {providerNotice && <div className="provider-notice">{providerNotice}</div>}
      </div>

      <div className="chat-messages">
        {messages.length === 0 ? (
          <div className="welcome-message premium-welcome">
            <span className="welcome-pill">Campaa Lite • Smart Demo Mode</span>
            <h2>Selamat Datang di Campaa AI</h2>
            <p>Ceritakan kebutuhan Anda. Campaa akan membantu dengan mode demo cerdas, dan bisa memakai provider AI jika sudah dikonfigurasi.</p>
            <div className="example-chips" aria-label="Contoh prompt cepat">
              {EXAMPLE_CHIPS.map(chip => (
                <button
                  key={chip}
                  type="button"
                  className="example-chip"
                  onClick={() => handleSendMessage(chip)}
                  disabled={isLoading}
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {messages.map(message => (
              <MessageBubble key={message.id} message={message} />
            ))}
            {isLoading && (
              <div className="message-bubble assistant-row loading-row">
                <div className="message-avatar assistant">AI</div>
                <div className="message-content assistant-card">
                  <div className="message-header">
                    <span className="message-role">Campaa sedang berpikir</span>
                    <span className="provider-meta">{currentProvider === 'demo' ? 'Campaa Lite' : getProviderLabel(currentProvider)}</span>
                  </div>
                  <div className="typing-indicator">
                    <span className="typing-dot" />
                    <span className="typing-dot" />
                    <span className="typing-dot" />
                  </div>
                </div>
              </div>
            )}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>

      <ChatInput
        onSendMessage={handleSendMessage}
        onEnhancePrompt={handleEnhancePrompt}
        isLoading={isLoading}
        currentMode={currentMode}
      />
    </div>
  )
}
