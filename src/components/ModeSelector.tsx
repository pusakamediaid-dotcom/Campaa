import { AIMode } from '../lib/types'

interface ModeSelectorProps {
  modes: AIMode[]
  currentMode: string
  onModeChange: (modeId: string) => void
}

export default function ModeSelector({ modes, currentMode, onModeChange }: ModeSelectorProps) {
  return (
    <div className="mode-selector">
      {modes.map(mode => (
        <button
          key={mode.id}
          className={`mode-tab ${currentMode === mode.id ? 'active' : ''}`}
          onClick={() => onModeChange(mode.id)}
        >
          {mode.label}
        </button>
      ))}
    </div>
  )
}