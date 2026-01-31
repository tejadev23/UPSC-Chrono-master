'use client'

import { useEffect, useCallback, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useStore } from '@/store/useStore'
import { useCountdown } from '@/hooks/useTimer'
import { CountdownTimer } from '@/components/Timer'
import { Button } from '@/components/ui/Button'
import { ConfirmModal } from '@/components/ui/ConfirmModal'
import { MilestoneIndicator, getMainsPhases } from '@/components/MilestoneIndicator'
import { MS_PER_MINUTE } from '@/lib/constants'

export default function MainsTimerPage() {
  const router = useRouter()
  const { mainsType, mainsDurationMinutes, endMainsSession } = useStore()
  
  const [sessionStarted, setSessionStarted] = useState(false)
  const [showExitModal, setShowExitModal] = useState(false)
  const prevPhaseRef = useRef<number>(-1)
  
  const durationMs = mainsDurationMinutes * MS_PER_MINUTE
  
  const handleComplete = useCallback(() => {
    endMainsSession(performance.now())
    router.push('/mains/end')
  }, [endMainsSession, router])
  
  const { remaining, elapsed, isRunning } = useCountdown({
    durationMs,
    onComplete: handleComplete,
    autoStart: true,
  })
  
  // Check if session is valid
  useEffect(() => {
    if (!mainsType || mainsDurationMinutes <= 0) {
      router.push('/mains/type')
      return
    }
    setSessionStarted(true)
  }, [mainsType, mainsDurationMinutes, router])
  
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
  
  // Phase change audio cue (optional - using Web Audio API)
  useEffect(() => {
    if (!sessionStarted || !mainsType) return
    
    const phases = getMainsPhases(mainsType, mainsDurationMinutes)
    const elapsedMinutes = elapsed / MS_PER_MINUTE
    
    const currentPhaseIndex = phases.findIndex(
      (phase) => elapsedMinutes >= phase.startMin && elapsedMinutes < phase.endMin
    )
    
    // Play subtle beep on phase change
    if (currentPhaseIndex !== -1 && currentPhaseIndex !== prevPhaseRef.current && prevPhaseRef.current !== -1) {
      try {
        const audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
        const oscillator = audioContext.createOscillator()
        const gainNode = audioContext.createGain()
        
        oscillator.connect(gainNode)
        gainNode.connect(audioContext.destination)
        
        oscillator.frequency.value = 440 // A4 note
        oscillator.type = 'sine'
        
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3)
        
        oscillator.start(audioContext.currentTime)
        oscillator.stop(audioContext.currentTime + 0.3)
      } catch {
        // Audio not supported, ignore
      }
    }
    
    prevPhaseRef.current = currentPhaseIndex
  }, [elapsed, sessionStarted, mainsType, mainsDurationMinutes])
  
  const handleFinishEarly = () => {
    endMainsSession(elapsed)
    router.push('/mains/end')
  }
  
  if (!sessionStarted || !mainsType) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }
  
  const phases = getMainsPhases(mainsType, mainsDurationMinutes)
  const typeLabels: Record<string, string> = {
    '10M': '10 Marks',
    '15M': '15 Marks',
    'ESSAY': 'Essay',
  }
  
  return (
    <div className="relative flex flex-col items-center justify-center min-h-[80vh] space-y-10 no-select">
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
      
      {/* Type indicator */}
      <div className="text-gray-500 text-sm uppercase tracking-wide">
        {typeLabels[mainsType]} &bull; {mainsDurationMinutes} min
      </div>
      
      {/* Timer display */}
      <CountdownTimer
        remainingMs={remaining}
        totalMs={durationMs}
        size="xl"
      />
      
      {/* Milestone indicator */}
      <div className="w-full max-w-sm">
        <MilestoneIndicator
          phases={phases}
          elapsedMs={elapsed}
          totalDurationMs={durationMs}
        />
      </div>
      
      {/* Current phase hint */}
      <div className="text-center">
        {elapsed < phases[0].endMin * MS_PER_MINUTE && (
          <p className="text-gray-500 text-sm">
            Structure your answer
          </p>
        )}
        {elapsed >= phases[0].endMin * MS_PER_MINUTE && elapsed < phases[1].endMin * MS_PER_MINUTE && (
          <p className="text-gray-500 text-sm">
            Write your main content
          </p>
        )}
        {elapsed >= phases[1].endMin * MS_PER_MINUTE && (
          <p className="text-gray-500 text-sm">
            Conclude and review
          </p>
        )}
      </div>
      
      {/* Warning text */}
      <p className="text-gray-500 text-xs text-center max-w-xs">
        Session cannot be paused. Back/refresh will reset your progress. So, you should finish the session in one go.
      </p>
      
      {/* Exit confirmation modal */}
      <ConfirmModal
        isOpen={showExitModal}
        title="Stop session?"
        message="Timer will stop and summary will be generated."
        confirmLabel="Stop"
        cancelLabel="Cancel"
        onConfirm={handleFinishEarly}
        onCancel={() => setShowExitModal(false)}
      />
    </div>
  )
}
