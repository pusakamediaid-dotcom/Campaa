import { useState, useRef, useEffect } from 'react'
import { enhancePrompt, ENHANCEMENT_TYPES } from '../lib/promptEnhancer'

interface ChatInputProps {
  onSendMessage: (message: string) => void
  onEnhancePrompt: (enhanced: string) => void
  isLoading: boolean
  currentMode: string
}

export default function ChatInput({
  onSendMessage,
  onEnhancePrompt,
  isLoading,
  currentMode
}: ChatInputProps) {
  const [input, setInput] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const hasInput = Boolean(input.trim())

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px'
    }
  }, [input])

  const handleSubmit = () => {
    if (hasInput && !isLoading) {
      onSendMessage(input.trim())
      setInput('')
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const handleEnhanceAndSend = (type: string) => {
    if (!hasInput || isLoading) return

    const result = enhancePrompt(input, type, currentMode)
    setInput('')
    onEnhancePrompt(result.enhanced)
  }

  return (
    <div className="chat-input-area">
      <div className={`enhancer-tools ${!hasInput ? 'empty' : ''}`} aria-label="Prompt enhancer">
        {ENHANCEMENT_TYPES.map(type => (
          <button
            key={type.id}
            className="enhancer-btn"
            onClick={() => handleEnhanceAndSend(type.id)}
            title={type.description}
            disabled={!hasInput || isLoading}
            type="button"
          >
            {type.label}
          </button>
        ))}
      </div>
      <div className="input-wrapper">
        <textarea
          ref={textareaRef}
          className="chat-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Tulis pesan..."
          rows={1}
          disabled={isLoading}
        />
        <button
          className="send-btn"
          onClick={handleSubmit}
          disabled={!hasInput || isLoading}
          type="button"
          aria-label="Kirim pesan"
        >
          {isLoading ? (
            <svg className="send-spinner" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 12a9 9 0 11-6.219-8.56" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22,2 15,22 11,13 2,9" />
            </svg>
          )}
        </button>
      </div>
    </div>
  )
}
