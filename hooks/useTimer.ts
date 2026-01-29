'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

interface UseTimerOptions {
  durationMs: number
  onComplete?: () => void
  autoStart?: boolean
}

interface UseTimerReturn {
  elapsed: number
  remaining: number
  isRunning: boolean
  isComplete: boolean
  start: () => void
  reset: () => void
}

export function useTimer({
  durationMs,
  onComplete,
  autoStart = true,
}: UseTimerOptions): UseTimerReturn {
  const [elapsed, setElapsed] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  
  const startTimeRef = useRef<number | null>(null)
  const frameRef = useRef<number | null>(null)
  const onCompleteRef = useRef(onComplete)
  
  // Keep callback ref updated
  useEffect(() => {
    onCompleteRef.current = onComplete
  }, [onComplete])
  
  const tick = useCallback(() => {
    if (startTimeRef.current === null) return
    
    const now = performance.now()
    const currentElapsed = now - startTimeRef.current
    
    if (currentElapsed >= durationMs) {
      setElapsed(durationMs)
      setIsRunning(false)
      setIsComplete(true)
      onCompleteRef.current?.()
      return
    }
    
    setElapsed(currentElapsed)
    frameRef.current = requestAnimationFrame(tick)
  }, [durationMs])
  
  const start = useCallback(() => {
    if (isComplete) return
    
    startTimeRef.current = performance.now() - elapsed
    setIsRunning(true)
    frameRef.current = requestAnimationFrame(tick)
  }, [elapsed, isComplete, tick])
  
  const reset = useCallback(() => {
    if (frameRef.current !== null) {
      cancelAnimationFrame(frameRef.current)
      frameRef.current = null
    }
    startTimeRef.current = null
    setElapsed(0)
    setIsRunning(false)
    setIsComplete(false)
  }, [])
  
  // Auto-start on mount if enabled
  useEffect(() => {
    if (autoStart && !isRunning && !isComplete) {
      start()
    }
  }, [autoStart]) // eslint-disable-line react-hooks/exhaustive-deps
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current)
      }
    }
  }, [])
  
  return {
    elapsed,
    remaining: Math.max(0, durationMs - elapsed),
    isRunning,
    isComplete,
    start,
    reset,
  }
}

// Countdown timer (counts down from duration)
interface UseCountdownOptions {
  durationMs: number
  onComplete?: () => void
  autoStart?: boolean
}

export function useCountdown({
  durationMs,
  onComplete,
  autoStart = true,
}: UseCountdownOptions) {
  const timer = useTimer({ durationMs, onComplete, autoStart })
  
  return {
    ...timer,
    display: timer.remaining,
  }
}

// Stopwatch (counts up, no limit)
interface UseStopwatchOptions {
  onTick?: (elapsed: number) => void
  autoStart?: boolean
}

export function useStopwatch({
  onTick,
  autoStart = true,
}: UseStopwatchOptions = {}) {
  const [elapsed, setElapsed] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  
  const startTimeRef = useRef<number | null>(null)
  const frameRef = useRef<number | null>(null)
  const onTickRef = useRef(onTick)
  
  useEffect(() => {
    onTickRef.current = onTick
  }, [onTick])
  
  const tick = useCallback(() => {
    if (startTimeRef.current === null) return
    
    const now = performance.now()
    const currentElapsed = now - startTimeRef.current
    
    setElapsed(currentElapsed)
    onTickRef.current?.(currentElapsed)
    frameRef.current = requestAnimationFrame(tick)
  }, [])
  
  const start = useCallback(() => {
    startTimeRef.current = performance.now() - elapsed
    setIsRunning(true)
    frameRef.current = requestAnimationFrame(tick)
  }, [elapsed, tick])
  
  const stop = useCallback(() => {
    if (frameRef.current !== null) {
      cancelAnimationFrame(frameRef.current)
      frameRef.current = null
    }
    setIsRunning(false)
  }, [])
  
  const reset = useCallback(() => {
    stop()
    startTimeRef.current = null
    setElapsed(0)
  }, [stop])
  
  const getElapsed = useCallback(() => {
    if (startTimeRef.current === null) return elapsed
    return performance.now() - startTimeRef.current
  }, [elapsed])
  
  useEffect(() => {
    if (autoStart && !isRunning) {
      start()
    }
  }, [autoStart]) // eslint-disable-line react-hooks/exhaustive-deps
  
  useEffect(() => {
    return () => {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current)
      }
    }
  }, [])
  
  return {
    elapsed,
    isRunning,
    start,
    stop,
    reset,
    getElapsed,
  }
}
