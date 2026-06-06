interface ProviderSelectorProps {
  currentProvider: string
  onProviderChange: (provider: string) => void
  isDemo?: boolean
}

export default function ProviderSelector({ 
  currentProvider, 
  onProviderChange,
  isDemo = false
}: ProviderSelectorProps) {
  const providers = [
    { id: 'demo', label: 'Demo', desc: 'Offline' },
    { id: 'openai', label: 'OpenAI', desc: 'GPT-4' },
    { id: 'gemini', label: 'Gemini', desc: 'Google' },
    { id: 'openrouter', label: 'OpenRouter', desc: 'Multi-AI' }
  ]

  return (
    <div className="provider-selector">
      {providers.map(p => (
        <button
          key={p.id}
          className={`provider-btn ${currentProvider === p.id ? 'active' : ''} ${p.id === 'demo' ? 'demo' : ''}`}
          onClick={() => onProviderChange(p.id)}
        >
          {p.label}
          {p.id === 'demo' && <span className="demo-badge">Mode</span>}
        </button>
      ))}
    </div>
  )
}