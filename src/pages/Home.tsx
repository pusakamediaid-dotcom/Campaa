import { AIMode } from '../lib/types'

interface HomeProps {
  onStartChat: (mode?: string) => void
  modes: AIMode[]
  currentMode: string
  onSelectMode: (modeId: string) => void
}

export default function Home({ onStartChat, modes, currentMode, onSelectMode }: HomeProps) {
  return (
    <div className="home-page">
      <section className="hero-section">
        <h1 className="hero-title">
          Campaa <span>AI</span>
        </h1>
        <p className="hero-subtitle">
          Chatbot AI cerdas dengan berbagai mode kecerdasan untuk produktivitas maksimal
        </p>
        <button className="start-btn" onClick={() => onStartChat()}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          Mulai Chat
        </button>
      </section>

      <section className="modes-section">
        <h2 className="section-title">Pilih Mode Kecerdasan</h2>
        <div className="modes-grid">
          {modes.map(mode => (
            <div 
              key={mode.id}
              className={`mode-card ${currentMode === mode.id ? 'selected' : ''}`}
              onClick={() => onSelectMode(mode.id)}
            >
              <div className="mode-icon">
                {getModeIcon(mode.icon)}
              </div>
              <div className="mode-label">{mode.label}</div>
              <div className="mode-desc">{mode.description}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="security-note">
        <h3>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          Keamanan API Key
        </h3>
        <p>
          API key tidak pernah disimpan di kode atau frontend. 
          Semua request API ditangani oleh server-side dengan environment variable yang aman.
          Saat ini berjalan dalam mode demo untuk keamanan maksimal.
        </p>
      </section>
    </div>
  )
}

function getModeIcon(iconName: string) {
  const icons: Record<string, JSX.Element> = {
    chat: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
    search: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    ),
    edit: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
      </svg>
    ),
    briefcase: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
      </svg>
    ),
    code: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    ),
    book: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      </svg>
    ),
    check: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="9 11 12 14 22 4" />
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
      </svg>
    ),
    target: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="6" />
        <circle cx="12" cy="12" r="2" />
      </svg>
    ),
    git: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="18" cy="18" r="3" />
        <circle cx="6" cy="6" r="3" />
        <path d="M6 21V9a9 9 0 0 0 9 9" />
      </svg>
    )
  }
  return icons[iconName] || icons.chat
}