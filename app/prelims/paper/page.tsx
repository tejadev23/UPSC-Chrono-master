'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useStore, PrelimsPaper } from '@/store/useStore'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { PRELIMS_DEFAULT_QUESTIONS, PRELIMS_DEFAULT_TIME_MINUTES } from '@/lib/constants'

export default function PrelimsPaperPage() {
  const router = useRouter()
  const { startPrelimsSession } = useStore()
  
  const [paper, setPaper] = useState<PrelimsPaper | null>(null)
  const [questions, setQuestions] = useState(PRELIMS_DEFAULT_QUESTIONS.toString())
  const [timeMinutes, setTimeMinutes] = useState(PRELIMS_DEFAULT_TIME_MINUTES.toString())
  
  const handleStart = () => {
    if (!paper) return
    
    const numQuestions = parseInt(questions, 10) || PRELIMS_DEFAULT_QUESTIONS
    const numMinutes = parseInt(timeMinutes, 10) || PRELIMS_DEFAULT_TIME_MINUTES
    
    startPrelimsSession(paper, numQuestions, numMinutes)
    router.push('/prelims/timer')
  }
  
  const isValid = paper !== null && parseInt(questions, 10) > 0 && parseInt(timeMinutes, 10) > 0
  
  return (
    <div className="flex flex-col min-h-[70vh] space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">Prelims Setup</h1>
        <p className="text-gray-500 text-sm">
          Configure your practice session
        </p>
      </div>
      
      {/* Paper Selection */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-600">
          Select Paper
        </label>
        <div className="grid grid-cols-2 gap-3">
          <Card
            variant={paper === 'GS' ? 'selected' : 'interactive'}
            padding="md"
            onClick={() => setPaper('GS')}
            className="cursor-pointer text-center"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && setPaper('GS')}
          >
            <div className="font-semibold">GS</div>
            <div className="text-xs text-gray-500 mt-1">Paper I</div>
          </Card>
          
          <Card
            variant={paper === 'CSAT' ? 'selected' : 'interactive'}
            padding="md"
            onClick={() => setPaper('CSAT')}
            className="cursor-pointer text-center"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && setPaper('CSAT')}
          >
            <div className="font-semibold">CSAT</div>
            <div className="text-xs text-gray-500 mt-1">Paper II</div>
          </Card>
        </div>
      </div>
      
      {/* Configuration Inputs */}
      <div className="space-y-4">
        <Input
          label="Total Questions"
          type="number"
          min="1"
          max="200"
          value={questions}
          onChange={(e) => setQuestions(e.target.value)}
        />
        
        <Input
          label="Time (minutes)"
          type="number"
          min="1"
          max="300"
          value={timeMinutes}
          onChange={(e) => setTimeMinutes(e.target.value)}
        />
        
        {/* Calculated ideal time per question */}
        {parseInt(questions, 10) > 0 && parseInt(timeMinutes, 10) > 0 && (
          <div className="text-center text-sm text-gray-500 py-2">
            Ideal time per question:{' '}
            <span className="text-gray-900 font-medium">
              {((parseInt(timeMinutes, 10) * 60) / parseInt(questions, 10)).toFixed(1)}s
            </span>
          </div>
        )}
      </div>
      
      {/* Actions */}
      <div className="flex-1 flex flex-col justify-end space-y-3 pt-4">
        <Button
          onClick={handleStart}
          disabled={!isValid}
          fullWidth
          size="lg"
        >
          Start Timer
        </Button>
        
        <button
          onClick={() => router.push('/mode')}
          className="w-full text-center text-gray-500 hover:text-gray-900 transition-colors py-2 text-sm"
        >
          Back to modes
        </button>
      </div>
    </div>
  )
}
