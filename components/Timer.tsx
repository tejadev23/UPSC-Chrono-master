'use client'

import { formatTime } from '@/lib/analytics'

interface TimerProps {
  timeMs: number
  size?: 'md' | 'lg' | 'xl'
  variant?: 'default' | 'warning' | 'danger'
  showLabel?: boolean
  label?: string
}

export function Timer({
  timeMs,
  size = 'xl',
  variant = 'default',
  showLabel = false,
  label = 'Time',
}: TimerProps) {
  const sizes = {
    md: 'text-3xl',
    lg: 'text-5xl',
    xl: 'text-7xl',
  }
  
  const variants = {
    default: 'text-gray-900',
    warning: 'text-warning',
    danger: 'text-danger',
  }
  
  return (
    <div className="text-center">
      {showLabel && (
        <p className="text-gray-500 text-sm mb-2 uppercase tracking-wide">
          {label}
        </p>
      )}
      <div
        className={`timer-display font-mono font-bold no-select ${sizes[size]} ${variants[variant]}`}
      >
        {formatTime(timeMs)}
      </div>
    </div>
  )
}

interface CountdownTimerProps {
  remainingMs: number
  totalMs: number
  size?: 'md' | 'lg' | 'xl'
}

export function CountdownTimer({
  remainingMs,
  totalMs,
  size = 'xl',
}: CountdownTimerProps) {
  // Determine variant based on remaining time
  const percentRemaining = (remainingMs / totalMs) * 100
  let variant: 'default' | 'warning' | 'danger' = 'default'
  
  if (percentRemaining <= 10) {
    variant = 'danger'
  } else if (percentRemaining <= 25) {
    variant = 'warning'
  }
  
  return (
    <Timer
      timeMs={remainingMs}
      size={size}
      variant={variant}
    />
  )
}
