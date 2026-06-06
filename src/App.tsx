import { useState, useEffect } from 'react'
import Home from './pages/Home'
import Chat from './pages/Chat'
import Sidebar from './components/Sidebar'
import SettingsPanel from './components/SettingsPanel'
import { AIMessage, ChatSession } from './lib/types'
import { loadSessions, saveSessions, saveCurrentSession, loadCurrentSession } from './lib/storage'
import { AI_MODES } from './lib/prompts'

function App() {
  const [currentView, setCurrentView] = useState<'home' | 'chat'>('home')
  const [currentMode, setCurrentMode] = useState<string>('general')
  const [currentProvider, setCurrentProvider] = useState<string>('demo')
  const [messages, setMessages] = useState<AIMessage[]>([])
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [showSettings, setShowSettings] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  useEffect(() => {
    const loadedSessions = loadSessions()
    setSessions(loadedSessions)
    const currentSession = loadCurrentSession()
    if (currentSession) {
      setMessages(currentSession.messages)
      setCurrentMode(currentSession.mode)
      setCurrentView('chat')
    }
  }, [])

  useEffect(() => {
    if (currentView === 'chat' && messages.length > 0) {
      const session = {
        id: `session_${Date.now()}`,
        title: messages.find(m => m.role === 'user')?.content.slice(0, 50) || 'New Chat',
        mode: currentMode,
        messages,
        createdAt: Date.now(),
        updatedAt: Date.now()
      }
      saveCurrentSession(session)
    }
  }, [messages, currentMode, currentView])

  const handleStartChat = (mode?: string) => {
    if (mode) setCurrentMode(mode)
    setMessages([])
    setCurrentView('chat')
  }

  const handleNewChat = () => {
    setMessages([])
    setCurrentView('home')
  }

  const handleSelectSession = (session: ChatSession) => {
    setMessages(session.messages)
    setCurrentMode(session.mode)
    setCurrentView('chat')
  }

  const handleDeleteSession = (sessionId: string) => {
    const updated = sessions.filter(s => s.id !== sessionId)
    setSessions(updated)
    saveSessions(updated)
  }

  return (
    <div className="app">
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        sessions={sessions}
        onSelectSession={handleSelectSession}
        onDeleteSession={handleDeleteSession}
        onNewChat={handleNewChat}
        currentView={currentView}
      />
      
      <main className="main-content">
        <header className="top-header">
          <button className="menu-toggle" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
          <h1 className="app-title">Campaa AI</h1>
          <button className="settings-btn" onClick={() => setShowSettings(true)}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
          </button>
        </header>

        <div className="content-area">
          {currentView === 'home' ? (
            <Home 
              onStartChat={handleStartChat}
              modes={AI_MODES}
              currentMode={currentMode}
              onSelectMode={setCurrentMode}
            />
          ) : (
            <Chat
              messages={messages}
              setMessages={setMessages}
              currentMode={currentMode}
              currentProvider={currentProvider}
              onModeChange={setCurrentMode}
              onProviderChange={setCurrentProvider}
              modes={AI_MODES}
            />
          )}
        </div>

        {showSettings && (
          <SettingsPanel
            onClose={() => setShowSettings(false)}
            currentProvider={currentProvider}
            onProviderChange={setCurrentProvider}
          />
        )}
      </main>
    </div>
  )
}

export default App