'use client'

import { create } from 'zustand'
import { STORAGE_KEY_NAME, PRELIMS_DEFAULT_QUESTIONS, PRELIMS_DEFAULT_TIME_MINUTES } from '@/lib/constants'

export type PrelimsPaper = 'GS' | 'CSAT'
export type MainsType = '10M' | '15M' | 'ESSAY'

interface AppState {
  // User
  name: string | null
  
  // Prelims session
  prelimsPaper: PrelimsPaper | null
  totalQuestions: number
  idealTimeMinutes: number
  lapTimes: number[] // ms per question
  prelimsStartTime: number | null
  currentQuestion: number
  
  // Mains session
  mainsType: MainsType | null
  mainsDurationMinutes: number
  mainsStartTime: number | null
  mainsEndTime: number | null
  
  // Actions
  setName: (name: string | null) => void
  loadNameFromStorage: () => void
  
  // Prelims actions
  startPrelimsSession: (paper: PrelimsPaper, questions: number, timeMinutes: number) => void
  recordLap: (elapsedMs: number) => void
  endPrelimsSession: () => void
  
  // Mains actions
  startMainsSession: (type: MainsType, durationMinutes: number) => void
  endMainsSession: (endTime: number) => void
  
  // Reset
  resetSession: () => void
}

const initialState = {
  name: null,
  prelimsPaper: null,
  totalQuestions: PRELIMS_DEFAULT_QUESTIONS,
  idealTimeMinutes: PRELIMS_DEFAULT_TIME_MINUTES,
  lapTimes: [],
  prelimsStartTime: null,
  currentQuestion: 1,
  mainsType: null,
  mainsDurationMinutes: 0,
  mainsStartTime: null,
  mainsEndTime: null,
}

export const useStore = create<AppState>((set, get) => ({
  ...initialState,
  
  setName: (name) => {
    set({ name })
    if (typeof window !== 'undefined') {
      if (name) {
        localStorage.setItem(STORAGE_KEY_NAME, name)
      } else {
        localStorage.removeItem(STORAGE_KEY_NAME)
      }
    }
  },
  
  loadNameFromStorage: () => {
    if (typeof window !== 'undefined') {
      const storedName = localStorage.getItem(STORAGE_KEY_NAME)
      if (storedName) {
        set({ name: storedName })
      }
    }
  },
  
  startPrelimsSession: (paper, questions, timeMinutes) => {
    set({
      prelimsPaper: paper,
      totalQuestions: questions,
      idealTimeMinutes: timeMinutes,
      lapTimes: [],
      prelimsStartTime: performance.now(),
      currentQuestion: 1,
    })
  },
  
  recordLap: (elapsedMs) => {
    const state = get()
    const previousTotal = state.lapTimes.reduce((sum, t) => sum + t, 0)
    const lapTime = elapsedMs - previousTotal
    
    set({
      lapTimes: [...state.lapTimes, lapTime],
      currentQuestion: state.currentQuestion + 1,
    })
  },
  
  endPrelimsSession: () => {
    set({ prelimsStartTime: null })
  },
  
  startMainsSession: (type, durationMinutes) => {
    set({
      mainsType: type,
      mainsDurationMinutes: durationMinutes,
      mainsStartTime: performance.now(),
      mainsEndTime: null,
    })
  },
  
  endMainsSession: (endTime) => {
    set({ mainsEndTime: endTime })
  },
  
  resetSession: () => {
    const { name } = get()
    set({
      ...initialState,
      name, // Keep the name
    })
  },
}))
