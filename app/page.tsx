'use client'

import { useState, useEffect, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { useStore } from '@/store/useStore'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

export default function HomePage() {
  const router = useRouter()
  const { name, setName, loadNameFromStorage } = useStore()
  const [inputName, setInputName] = useState('')
  const [isLoaded, setIsLoaded] = useState(false)
  
  useEffect(() => {
    loadNameFromStorage()
    setIsLoaded(true)
  }, [loadNameFromStorage])
  
  useEffect(() => {
    if (isLoaded && name) {
      setInputName(name)
    }
  }, [isLoaded, name])
  
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const trimmedName = inputName.trim()
    if (trimmedName) {
      setName(trimmedName)
    }
    router.push('/mode')
  }
  
  const handleSkip = () => {
    router.push('/mode')
  }
  
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }
  
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          UPSC Chrono-Master
        </h1>
        <p className="text-gray-500">
          Master your exam timing
        </p>
      </div>
      
      {/* Form */}
      <form onSubmit={handleSubmit} className="w-full space-y-6">
        <Input
          type="text"
          placeholder="Enter your name"
          value={inputName}
          onChange={(e) => setInputName(e.target.value)}
          autoFocus
          autoComplete="name"
        />
        
        <div className="space-y-3">
          <Button type="submit" fullWidth size="lg">
            Continue
          </Button>
          
          <button
            type="button"
            onClick={handleSkip}
            className="w-full text-center text-gray-500 hover:text-gray-900 transition-colors py-2 text-sm"
          >
            Skip for now
          </button>
        </div>
      </form>
    </div>
  )
}
