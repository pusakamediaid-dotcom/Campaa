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
    { id: 'demo', label: 'Campaa Lite', desc: 'Offline' },
    { id: 'openai', label: 'OpenAI', desc: 'Provider' },
    { id: 'gemini', label: 'Gemini', desc: 'Provider' },
    { id: 'openrouter', label: 'OpenRouter', desc: 'Provider' }
  ]

  return (
    <div className="provider-selector" aria-label="Pilih provider AI">
      {providers.map(p => (
        <button
          key={p.id}
          type="button"
          className={`provider-btn ${currentProvider === p.id ? 'active' : ''} ${p.id === 'demo' ? 'demo' : ''}`}
          onClick={() => onProviderChange(p.id)}
          aria-pressed={currentProvider === p.id}
        >
          <span>{p.label}</span>
          <small>{p.id === 'demo' && isDemo ? 'Default' : p.desc}</small>
        </button>
      ))}
    </div>
  )
}
