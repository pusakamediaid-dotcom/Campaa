import { ChatSession } from '../lib/types'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
  sessions: ChatSession[]
  onSelectSession: (session: ChatSession) => void
  onDeleteSession: (sessionId: string) => void
  onNewChat: () => void
  currentView: string
}

export default function Sidebar({
  isOpen,
  onClose,
  sessions,
  onSelectSession,
  onDeleteSession,
  onNewChat,
  currentView
}: SidebarProps) {
  return (
    <>
      <div 
        className={`sidebar-overlay ${isOpen ? 'active' : ''}`} 
        onClick={onClose}
      />
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2>Campaa AI</h2>
          <button className="sidebar-close" onClick={onClose}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        
        <div className="sidebar-content">
          <button className="new-chat-btn" onClick={onNewChat}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Chat Baru
          </button>
          
          <div className="sidebar-section">
            <div className="sidebar-section-title">Riwayat Chat</div>
            {sessions.length === 0 ? (
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', padding: '12px' }}>
                Belum ada chat
              </p>
            ) : (
              sessions.map(session => (
                <div 
                  key={session.id} 
                  className={`session-item ${currentView === 'chat' ? 'active' : ''}`}
                  onClick={() => onSelectSession(session)}
                >
                  <span className="session-title">{session.title}</span>
                  <button 
                    className="session-delete"
                    onClick={(e) => {
                      e.stopPropagation()
                      onDeleteSession(session.id)
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="3,6 5,6 21,6" />
                      <path d="M19,6v14a2,2,0,0,1-2,2H7a2,2,0,0,1-2-2V6m3,0V4a2,2,0,0,1,2-2h4a2,2,0,0,1,2,2v2" />
                    </svg>
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
        
        <div className="powered-by">
          Powered by Campaa AI v1.0
        </div>
      </aside>
    </>
  )
}