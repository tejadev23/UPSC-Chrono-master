'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useStore } from '@/store/useStore'
import { formatTime } from '@/lib/analytics'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { MS_PER_MINUTE } from '@/lib/constants'

export default function MainsEndPage() {
  const router = useRouter()
  const { mainsType, mainsDurationMinutes, mainsEndTime, mainsStartTime, resetSession } = useStore()
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])
  
  useEffect(() => {
    if (mounted && !mainsType) {
      router.push('/mains/type')
    }
  }, [mounted, mainsType, router])
  
  const handlePracticeAgain = () => {
    resetSession()
    router.push('/mains/type')
  }
  
  const handleExit = () => {
    resetSession()
    router.push('/mode')
  }
  
  if (!mounted || !mainsType) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }
  
  const targetTimeMs = mainsDurationMinutes * MS_PER_MINUTE
  const actualTimeMs = mainsEndTime || targetTimeMs
  const differenceMs = actualTimeMs - targetTimeMs
  const isOverrun = differenceMs > 0
  const isExact = Math.abs(differenceMs) < 1000 // Within 1 second
  
  const typeLabels: Record<string, string> = {
    '10M': '10 Marks Question',
    '15M': '15 Marks Question',
    'ESSAY': 'Essay',
  }
  
  return (
    <div className="flex flex-col min-h-[70vh] space-y-8 py-4">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">
          {isExact ? 'Perfect Timing!' : isOverrun ? 'Time Overrun' : 'Finished Early'}
        </h1>
        <p className="text-gray-500 text-sm">
          {typeLabels[mainsType]}
        </p>
      </div>
      
      {/* Time Comparison */}
      <div className="grid grid-cols-2 gap-3">
        <Card padding="md" className="text-center">
          <div className="text-gray-500 text-xs uppercase tracking-wide mb-1">
            Target
          </div>
          <div className="text-2xl font-bold">
            {formatTime(targetTimeMs)}
          </div>
        </Card>
        
        <Card padding="md" className="text-center">
          <div className="text-gray-500 text-xs uppercase tracking-wide mb-1">
            Actual
          </div>
          <div className="text-2xl font-bold">
            {formatTime(actualTimeMs)}
          </div>
        </Card>
      </div>
      
      {/* Difference */}
      {!isExact && (
        <Card padding="lg" variant={isOverrun ? 'danger' : 'good'} className="text-center">
          <div className="text-gray-600 text-xs uppercase tracking-wide mb-2">
            {isOverrun ? 'Overrun by' : 'Finished early by'}
          </div>
          <div className={`text-4xl font-bold ${isOverrun ? 'text-danger' : 'text-success'}`}>
            {formatTime(Math.abs(differenceMs))}
          </div>
          <p className="text-sm text-gray-600 mt-3">
            {isOverrun
              ? 'Practice structuring your answer to stay within time.'
              : 'Great pace! Use extra time to review or add depth.'}
          </p>
        </Card>
      )}
      
      {isExact && (
        <Card padding="lg" variant="good" className="text-center">
          <div className="text-4xl mb-2">
            <span className="text-success">✓</span>
          </div>
          <p className="text-sm text-gray-600">
            You finished right on time. Excellent discipline.
          </p>
        </Card>
      )}
      
      {/* Actions */}
      <div className="flex-1 flex flex-col justify-end space-y-3 pt-4">
        <Button onClick={handlePracticeAgain} fullWidth size="lg">
          Practice Again
        </Button>
        
        <Button onClick={handleExit} variant="ghost" fullWidth>
          Exit to Menu
        </Button>
      </div>
    </div>
  )
}
