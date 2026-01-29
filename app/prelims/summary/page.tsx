'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useStore } from '@/store/useStore'
import { calculatePrelimsStats, formatTime, PrelimsStats } from '@/lib/analytics'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Heatmap } from '@/components/Heatmap'

export default function PrelimsSummaryPage() {
  const router = useRouter()
  const { lapTimes, totalQuestions, idealTimeMinutes, resetSession } = useStore()
  const [stats, setStats] = useState<PrelimsStats | null>(null)
  
  useEffect(() => {
    if (lapTimes.length === 0) {
      router.push('/prelims/paper')
      return
    }
    
    const calculatedStats = calculatePrelimsStats(lapTimes, totalQuestions, idealTimeMinutes)
    setStats(calculatedStats)
  }, [lapTimes, totalQuestions, idealTimeMinutes, router])
  
  const handlePracticeAgain = () => {
    resetSession()
    router.push('/prelims/paper')
  }
  
  const handleExit = () => {
    resetSession()
    router.push('/mode')
  }
  
  if (!stats) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }
  
  const omrBufferSeconds = Math.floor(stats.omrBufferMs / 1000)
  const omrBufferPositive = omrBufferSeconds >= 0
  
  return (
    <div className="flex flex-col min-h-[70vh] space-y-6 py-4">
      {/* Header */}
      <div className="text-center space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">Session Complete</h1>
        <p className="text-gray-500 text-sm">
          {stats.questionsAnswered} of {stats.totalQuestions} questions
        </p>
      </div>
      
      {/* Key Stats */}
      <div className="grid grid-cols-2 gap-3">
        <Card padding="md" className="text-center">
          <div className="text-gray-500 text-xs uppercase tracking-wide mb-1">
            Avg Time
          </div>
          <div className="text-2xl font-bold">
            {(stats.avgTimeMs / 1000).toFixed(1)}s
          </div>
          <div className="text-gray-500 text-xs mt-1">
            per question
          </div>
        </Card>
        
        <Card padding="md" variant={omrBufferPositive ? 'good' : 'danger'} className="text-center">
          <div className="text-gray-600 text-xs uppercase tracking-wide mb-1">
            OMR Buffer
          </div>
          <div className={`text-2xl font-bold ${omrBufferPositive ? 'text-success' : 'text-danger'}`}>
            {omrBufferPositive ? '+' : ''}{formatTime(Math.abs(stats.omrBufferMs))}
          </div>
          <div className="text-gray-600 text-xs mt-1">
            {omrBufferPositive ? 'remaining' : 'overrun'}
          </div>
        </Card>
      </div>
      
      {/* Time Breakdown */}
      <Card padding="md">
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Total Time Spent</span>
            <span className="font-medium">{formatTime(stats.totalTimeSpentMs)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Ideal Time/Question</span>
            <span className="font-medium">{(stats.idealTimePerQuestionMs / 1000).toFixed(1)}s</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Your Avg Time</span>
            <span className="font-medium">{(stats.avgTimeMs / 1000).toFixed(1)}s</span>
          </div>
        </div>
      </Card>
      
      {/* Heatmap */}
      {stats.questionStats.length > 0 && (
        <Card padding="md">
          <div className="text-gray-500 text-xs uppercase tracking-wide mb-4 text-center">
            Question Time Heatmap
          </div>
          <Heatmap questionStats={stats.questionStats} />
        </Card>
      )}
      
      {/* Insight */}
      <Card padding="md" className="border-blue-200 bg-blue-50">
        <p className="text-sm text-center leading-relaxed text-gray-700">
          {stats.insight}
        </p>
      </Card>
      
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
