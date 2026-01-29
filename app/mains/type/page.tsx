'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useStore, MainsType } from '@/store/useStore'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { MAINS_10M_DURATION, MAINS_15M_DURATION, MAINS_ESSAY_DEFAULT_DURATION } from '@/lib/constants'

const QUESTION_TYPES: Array<{
  type: MainsType
  label: string
  description: string
  defaultDuration: number
}> = [
  {
    type: '10M',
    label: '10 Marks',
    description: '7 minutes ideal',
    defaultDuration: MAINS_10M_DURATION,
  },
  {
    type: '15M',
    label: '15 Marks',
    description: '12 minutes ideal',
    defaultDuration: MAINS_15M_DURATION,
  },
  {
    type: 'ESSAY',
    label: 'Essay',
    description: 'Custom duration',
    defaultDuration: MAINS_ESSAY_DEFAULT_DURATION,
  },
]

export default function MainsTypePage() {
  const router = useRouter()
  const { startMainsSession } = useStore()
  
  const [selectedType, setSelectedType] = useState<MainsType | null>(null)
  const [customDuration, setCustomDuration] = useState(MAINS_ESSAY_DEFAULT_DURATION.toString())
  
  const handleSelectType = (type: MainsType) => {
    setSelectedType(type)
    if (type === '10M') {
      setCustomDuration(MAINS_10M_DURATION.toString())
    } else if (type === '15M') {
      setCustomDuration(MAINS_15M_DURATION.toString())
    } else {
      setCustomDuration(MAINS_ESSAY_DEFAULT_DURATION.toString())
    }
  }
  
  const handleStart = () => {
    if (!selectedType) return
    
    const duration = parseInt(customDuration, 10)
    if (duration <= 0) return
    
    startMainsSession(selectedType, duration)
    router.push('/mains/timer')
  }
  
  const isValid = selectedType !== null && parseInt(customDuration, 10) > 0
  const showCustomInput = selectedType === 'ESSAY'
  
  return (
    <div className="flex flex-col min-h-[70vh] space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">Mains Practice</h1>
        <p className="text-gray-500 text-sm">
          Select question type
        </p>
      </div>
      
      {/* Type Selection */}
      <div className="space-y-3">
        {QUESTION_TYPES.map(({ type, label, description }) => (
          <Card
            key={type}
            variant={selectedType === type ? 'selected' : 'interactive'}
            padding="md"
            onClick={() => handleSelectType(type)}
            className="cursor-pointer"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && handleSelectType(type)}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold">{label}</div>
                <div className="text-xs text-gray-500 mt-0.5">{description}</div>
              </div>
              <div className={`w-4 h-4 rounded-full border-2 transition-colors ${
                selectedType === type
                  ? 'border-accent bg-accent'
                  : 'border-gray-300'
              }`} />
            </div>
          </Card>
        ))}
      </div>
      
      {/* Custom Duration for Essay */}
      {showCustomInput && (
        <div className="space-y-2">
          <Input
            label="Duration (minutes)"
            type="number"
            min="1"
            max="300"
            value={customDuration}
            onChange={(e) => setCustomDuration(e.target.value)}
          />
          <p className="text-xs text-gray-500 text-center">
            Recommended: 180 minutes for a full essay
          </p>
        </div>
      )}
      
      {/* Selected Duration Display */}
      {selectedType && !showCustomInput && (
        <div className="text-center py-2">
          <span className="text-gray-500 text-sm">Duration: </span>
          <span className="text-gray-900 font-medium">{customDuration} minutes</span>
        </div>
      )}
      
      {/* Actions */}
      <div className="flex-1 flex flex-col justify-end space-y-3 pt-4">
        <Button
          onClick={handleStart}
          disabled={!isValid}
          fullWidth
          size="lg"
        >
          Start Writing
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
