import { useState, useRef, useEffect } from 'react'
import { AIMessage, AIMode } from '../lib/types'
import { sendChatMessage, sendChatMessageDemo } from '../lib/api'
import { getDemoResponse, enhancePrompt } from '../lib/promptEnhancer'
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
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Handle enhanced prompt from ChatInput
  const handleEnhancePrompt = (enhancedText: string) => {
    // Just send the enhanced text as a new message
    handleSendMessage(enhancedText)
  }

  const handleSendMessage = async (text: string) => {
    const userMessage: AIMessage = {
      id: `msg_${Date.now()}_user`,
      role: 'user',
      content: text,
      timestamp: Date.now(),
      mode: currentMode,
      provider: currentProvider
    }

    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)

    try {
      let responseText = ''
      let usedProvider = currentProvider

      if (currentProvider === 'demo') {
        const demoResponse = sendChatMessageDemo(currentMode)
        responseText = demoResponse.text
        usedProvider = 'demo'
      } else {
        const history = messages.map(m => ({ role: m.role, content: m.content }))
        const result = await sendChatMessage({
          message: text,
          mode: currentMode,
          provider: currentProvider,
          history
        })

        if (result.success) {
          responseText = result.text
          usedProvider = result.provider || currentProvider
        } else {
          responseText = `Maaf, terjadi kesalahan: ${result.error || 'Unknown error'}\n\nMenggunakan mode demo sebagai fallback.`
          usedProvider = 'demo (fallback)'
        }
      }

      const assistantMessage: AIMessage = {
        id: `msg_${Date.now()}_assistant`,
        role: 'assistant',
        content: responseText,
        timestamp: Date.now(),
        mode: currentMode,
        provider: usedProvider
      }

      setMessages(prev => [...prev, assistantMessage])

      const sessions = loadSessions()
      const newSession = {
        id: `session_${Date.now()}`,
        title: text.slice(0, 50) + (text.length > 50 ? '...' : ''),
        mode: currentMode,
        messages: [...messages, userMessage, assistantMessage],
        createdAt: Date.now(),
        updatedAt: Date.now()
      }
      saveSessions([newSession, ...sessions.slice(0, 19)])

    } catch (error) {
      const errorMessage: AIMessage = {
        id: `msg_${Date.now()}_assistant`,
        role: 'assistant',
        content: 'Terjadi kesalahan yang tidak terduga. Silakan coba lagi.',
        timestamp: Date.now(),
        mode: currentMode,
        provider: 'error'
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="chat-page">
      <div className="chat-header">
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
      </div>

      <div className="chat-messages">
        {messages.length === 0 ? (
          <div className="welcome-message">
            <h2>Selamat Datang di Campaa AI</h2>
            <p>Pilih mode kecerdasan di atas dan mulai percakapan</p>
            {currentProvider === 'demo' && (
              <div className="demo-badge" style={{ marginTop: '16px' }}>
                Mode Demo Aktif
              </div>
            )}
          </div>
        ) : (
          <>
            {messages.map(message => (
              <MessageBubble key={message.id} message={message} />
            ))}
            {isLoading && (
              <div className="message-bubble">
                <div className="message-avatar assistant">AI</div>
                <div className="message-content">
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