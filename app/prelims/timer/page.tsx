'use client'

import { useEffect, useCallback, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useStore } from '@/store/useStore'
import { useCountdown } from '@/hooks/useTimer'
import { CountdownTimer } from '@/components/Timer'
import { Button } from '@/components/ui/Button'
import { ConfirmModal } from '@/components/ui/ConfirmModal'
import { MS_PER_MINUTE } from '@/lib/constants'

export default function PrelimsTimerPage() {
  const router = useRouter()
  const {
    prelimsPaper,
    totalQuestions,
    idealTimeMinutes,
    currentQuestion,
    lapTimes,
    recordLap,
    endPrelimsSession,
  } = useStore()
  
  const [sessionStarted, setSessionStarted] = useState(false)
  const [showExitModal, setShowExitModal] = useState(false)
  
  const durationMs = idealTimeMinutes * MS_PER_MINUTE
  
  const handleComplete = useCallback(() => {
    endPrelimsSession()
    router.push('/prelims/summary')
  }, [endPrelimsSession, router])
  
  const { remaining, elapsed, isComplete, isRunning } = useCountdown({
    durationMs,
    onComplete: handleComplete,
    autoStart: true,
  })
  
  // Check if session is valid
  useEffect(() => {
    if (!prelimsPaper) {
      router.push('/prelims/paper')
      return
    }
    setSessionStarted(true)
  }, [prelimsPaper, router])
  
  // Handle beforeunload warning
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isRunning) {
        e.preventDefault()
        e.returnValue = 'Your timer session will be lost. Are you sure you want to leave?'
        return e.returnValue
      }
    }
    
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [isRunning])
  
  const handleLap = () => {
    if (currentQuestion > totalQuestions || isComplete) return
    
    recordLap(elapsed)
    
    // If this was the last question, end the session
    if (currentQuestion === totalQuestions) {
      handleComplete()
    }
  }
  
  const handleExitConfirm = () => {
    // Record current in-progress question time if any questions have been started
    if (currentQuestion <= totalQuestions && lapTimes.length < currentQuestion) {
      recordLap(elapsed)
    }
    endPrelimsSession()
    router.push('/prelims/summary')
  }
  
  if (!sessionStarted) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }
  
  const questionsAnswered = lapTimes.length
  const isLastQuestion = currentQuestion === totalQuestions
  
  return (
    <div className="relative flex flex-col items-center justify-center min-h-[80vh] space-y-8 no-select">
      {/* Exit button - top right */}
      <div className="absolute top-0 right-0">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowExitModal(true)}
        >
          Exit
        </Button>
      </div>
      
      {/* Paper indicator */}
      <div className="text-gray-500 text-sm uppercase tracking-wide">
        {prelimsPaper} Paper
      </div>
      
      {/* Timer display */}
      <CountdownTimer
        remainingMs={remaining}
        totalMs={durationMs}
        size="xl"
      />
      
      {/* Question counter */}
      <div className="text-center space-y-1">
        <div className="text-4xl font-bold">
          {currentQuestion}
          <span className="text-gray-400 text-2xl"> / {totalQuestions}</span>
        </div>
        <div className="text-gray-500 text-sm">
          {questionsAnswered === 0
            ? 'Press LAP after each question'
            : `${questionsAnswered} answered`}
        </div>
      </div>
      
      {/* LAP button */}
      <div className="w-full pt-4">
        <Button
          onClick={handleLap}
          disabled={isComplete || currentQuestion > totalQuestions}
          fullWidth
          size="xl"
          className="py-6 text-2xl font-bold"
        >
          {isLastQuestion ? 'FINISH' : 'LAP'}
        </Button>
      </div>
      
      {/* Last lap time */}
      {lapTimes.length > 0 && (
        <div className="text-gray-500 text-sm">
          Last question: {(lapTimes[lapTimes.length - 1] / 1000).toFixed(1)}s
        </div>
      )}
      
      {/* Warning text */}
      <p className="text-gray-500 text-xs text-center max-w-xs">
        Session cannot be paused. Back/refresh will reset your progress.
      </p>
      
      {/* Exit confirmation modal */}
      <ConfirmModal
        isOpen={showExitModal}
        title="Stop session?"
        message="Timer will stop and summary will be generated till the current question."
        confirmLabel="Stop"
        cancelLabel="Cancel"
        onConfirm={handleExitConfirm}
        onCancel={() => setShowExitModal(false)}
      />
    </div>
  )
}
