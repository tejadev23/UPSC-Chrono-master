'use client'

import { QuestionStat } from '@/lib/analytics'

interface HeatmapProps {
  questionStats: QuestionStat[]
  columns?: number
}

export function Heatmap({ questionStats, columns = 10 }: HeatmapProps) {
  const statusColors = {
    good: 'bg-pastel-mint border border-green-300',
    warning: 'bg-pastel-amber border border-amber-300',
    danger: 'bg-pastel-rose border border-red-300',
  }
  
  return (
    <div className="w-full">
      <div
        className="grid gap-1"
        style={{
          gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
        }}
      >
        {questionStats.map((stat) => (
          <div
            key={stat.questionNumber}
            className={`
              aspect-square rounded-sm 
              ${statusColors[stat.status]}
              transition-transform hover:scale-110
              cursor-default
            `}
            title={`Q${stat.questionNumber}: ${Math.round(stat.timeMs / 1000)}s`}
          />
        ))}
      </div>
      
      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-4 text-xs text-gray-600">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm bg-pastel-mint border border-green-300" />
          <span>Within ideal</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm bg-pastel-amber border border-amber-300" />
          <span>Slightly over</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm bg-pastel-rose border border-red-300" />
          <span>Over time</span>
        </div>
      </div>
    </div>
  )
}
