'use client'

interface Phase {
  name: string
  startMin: number
  endMin: number
}

interface MilestoneIndicatorProps {
  phases: Phase[]
  elapsedMs: number
  totalDurationMs: number
}

export function MilestoneIndicator({
  phases,
  elapsedMs,
  totalDurationMs,
}: MilestoneIndicatorProps) {
  const elapsedMinutes = elapsedMs / (1000 * 60)
  
  // Find current phase
  const currentPhaseIndex = phases.findIndex(
    (phase) => elapsedMinutes >= phase.startMin && elapsedMinutes < phase.endMin
  )
  
  return (
    <div className="w-full space-y-4">
      {/* Progress bar */}
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-accent transition-all duration-100"
          style={{
            width: `${Math.min(100, (elapsedMs / totalDurationMs) * 100)}%`,
          }}
        />
      </div>
      
      {/* Phase indicators */}
      <div className="flex justify-between">
        {phases.map((phase, index) => {
          const isActive = index === currentPhaseIndex
          const isPast = currentPhaseIndex > index
          const isFuture = currentPhaseIndex < index && currentPhaseIndex !== -1
          
          return (
            <div
              key={phase.name}
              className={`
                flex flex-col items-center text-center
                transition-all duration-300
                ${isActive ? 'scale-110' : ''}
              `}
            >
              <div
                className={`
                  w-3 h-3 rounded-full mb-2 transition-colors
                  ${isActive ? 'bg-accent ring-2 ring-accent ring-offset-2 ring-offset-white' : ''}
                  ${isPast ? 'bg-success' : ''}
                  ${isFuture || currentPhaseIndex === -1 ? 'bg-gray-300' : ''}
                `}
              />
              <span
                className={`
                  text-xs font-medium uppercase tracking-wide
                  ${isActive ? 'text-accent' : ''}
                  ${isPast ? 'text-success' : ''}
                  ${isFuture || currentPhaseIndex === -1 ? 'text-gray-500' : ''}
                `}
              >
                {phase.name}
              </span>
              <span className="text-xs text-gray-500 mt-0.5">
                {phase.endMin - phase.startMin}m
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// Helper to generate phases for different question types
export function getMainsPhases(type: '10M' | '15M' | 'ESSAY', durationMinutes: number): Phase[] {
  if (type === '10M') {
    return [
      { name: 'Outline', startMin: 0, endMin: 2 },
      { name: 'Write', startMin: 2, endMin: 5 },
      { name: 'Conclude', startMin: 5, endMin: 7 },
    ]
  }
  
  if (type === '15M') {
    return [
      { name: 'Outline', startMin: 0, endMin: 3 },
      { name: 'Write', startMin: 3, endMin: 10 },
      { name: 'Conclude', startMin: 10, endMin: 12 },
    ]
  }
  
  // Essay - proportional phases (15% outline, 70% write, 15% conclude)
  const outlineEnd = Math.round(durationMinutes * 0.15)
  const writeEnd = Math.round(durationMinutes * 0.85)
  
  return [
    { name: 'Outline', startMin: 0, endMin: outlineEnd },
    { name: 'Write', startMin: outlineEnd, endMin: writeEnd },
    { name: 'Conclude', startMin: writeEnd, endMin: durationMinutes },
  ]
}
