'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useStore } from '@/store/useStore'
import { Card } from '@/components/ui/Card'

export default function ModePage() {
  const router = useRouter()
  const { name, loadNameFromStorage, resetSession } = useStore()
  const [isLoaded, setIsLoaded] = useState(false)
  
  useEffect(() => {
    loadNameFromStorage()
    resetSession()
    setIsLoaded(true)
  }, [loadNameFromStorage, resetSession])
  
  const handleSelectMode = (mode: 'prelims' | 'mains') => {
    if (mode === 'prelims') {
      router.push('/prelims/paper')
    } else {
      router.push('/mains/type')
    }
  }
  
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }
  
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-10">
      {/* Greeting */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          {name ? `Ready, ${name}?` : 'Ready?'}
        </h1>
        <p className="text-gray-500">
          Choose your practice mode
        </p>
      </div>
      
      {/* Mode Cards */}
      <div className="w-full space-y-4">
        <Card
          variant="interactive"
          padding="lg"
          onClick={() => handleSelectMode('prelims')}
          className="cursor-pointer"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && handleSelectMode('prelims')}
        >
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-semibold">Prelims</h2>
            <p className="text-gray-500 text-sm">
              Practice MCQ timing with lap tracking
            </p>
            <div className="pt-2 text-xs text-gray-500">
              GS Paper I &bull; CSAT Paper II
            </div>
          </div>
        </Card>
        
        <Card
          variant="interactive"
          padding="lg"
          onClick={() => handleSelectMode('mains')}
          className="cursor-pointer"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && handleSelectMode('mains')}
        >
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-semibold">Mains</h2>
            <p className="text-gray-500 text-sm">
              Answer writing with milestone phases
            </p>
            <div className="pt-2 text-xs text-gray-500">
              10 Marks &bull; 15 Marks &bull; Essay
            </div>
          </div>
        </Card>
      </div>
      
      {/* Back link */}
      <button
        onClick={() => router.push('/')}
        className="text-gray-500 hover:text-gray-900 transition-colors text-sm"
      >
        Change name
      </button>
    </div>
  )
}
