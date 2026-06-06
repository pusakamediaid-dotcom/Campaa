interface SettingsPanelProps {
  onClose: () => void
  currentProvider: string
  onProviderChange: (provider: string) => void
}

export default function SettingsPanel({ 
  onClose, 
  currentProvider,
  onProviderChange 
}: SettingsPanelProps) {
  return (
    <>
      <div className="sidebar-overlay active" onClick={onClose} style={{ zIndex: 40 }} />
      <div className="settings-panel open" style={{ zIndex: 50 }}>
        <div className="settings-header">
          <h2>Pengaturan</h2>
          <button className="settings-close" onClick={onClose}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        
        <div className="settings-content">
          <div className="settings-section">
            <div className="settings-section-title">Provider AI</div>
            <div className="settings-info">
              <p>
                Saat ini menggunakan <strong>{currentProvider === 'demo' ? 'Mode Demo' : currentProvider}</strong>.
                Untuk menggunakan API sungguhan, deploy ke Vercel dan set environment variable.
              </p>
              <div className="status-indicator unavailable">
                <span className="status-dot red" />
                Backend API belum aktif (mode demo)
              </div>
            </div>
          </div>
          
          <div className="settings-section">
            <div className="settings-section-title">Environment Variables</div>
            <div className="settings-info">
              <p>Untuk mengaktifkan API backend, set environment variable berikut di Vercel:</p>
              <ul style={{ fontSize: '13px', color: 'var(--text-secondary)', paddingLeft: '20px', marginTop: '8px' }}>
                <li><code>OPENAI_API_KEY</code> - untuk OpenAI GPT</li>
                <li><code>GEMINI_API_KEY</code> - untuk Google Gemini</li>
                <li><code>OPENROUTER_API_KEY</code> - untuk OpenRouter</li>
              </ul>
            </div>
          </div>
          
          <div className="settings-section">
            <div className="settings-section-title">Keamanan</div>
            <div className="settings-info">
              <p>
                API key TIDAK boleh disimpan di frontend. 
                Semua API key harus diset sebagai environment variable di server.
              </p>
              <p style={{ marginTop: '8px', color: 'var(--success)', fontSize: '12px' }}>
                Campaa AI menggunakan mode demo untuk keamanan maksimal.
              </p>
            </div>
          </div>
          
          <div className="settings-section">
            <div className="settings-section-title">Mode Demo</div>
            <div className="settings-info">
              <p>
                Mode demo memberikan respons simulasi yang menunjukkan 
                bagaimana chatbot bekerja. Untuk implementasi penuh, 
                diperlukan API backend yang dideploy ke Vercel.
              </p>
            </div>
          </div>
          
          <div className="settings-section">
            <div className="settings-section-title">Deployment Guide</div>
            <div className="settings-info">
              <p>1. Push perubahan ke GitHub</p>
              <p>2. Import repository ke Vercel</p>
              <p>3. Set environment variables di Vercel dashboard</p>
              <p>4. Deploy dan aktifkan API routes</p>
              <p style={{ marginTop: '12px', fontSize: '12px', color: 'var(--text-muted)' }}>
                Lihat docs/DEPLOY.md untuk panduan lengkap
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}