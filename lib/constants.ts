// Time constants (in milliseconds)
export const MS_PER_SECOND = 1000
export const MS_PER_MINUTE = 60 * MS_PER_SECOND
export const MS_PER_HOUR = 60 * MS_PER_MINUTE

// Prelims defaults
export const PRELIMS_DEFAULT_QUESTIONS = 100
export const PRELIMS_DEFAULT_TIME_MINUTES = 120
export const PRELIMS_TOTAL_TIME_MS = PRELIMS_DEFAULT_TIME_MINUTES * MS_PER_MINUTE

// Mains durations (in minutes)
export const MAINS_10M_DURATION = 7
export const MAINS_15M_DURATION = 12
export const MAINS_ESSAY_DEFAULT_DURATION = 180

// Mains milestone phases (in minutes from start)
export const MAINS_10M_PHASES = {
  outline: { start: 0, end: 2 },
  write: { start: 2, end: 5 },
  conclude: { start: 5, end: 7 },
}

export const MAINS_15M_PHASES = {
  outline: { start: 0, end: 3 },
  write: { start: 3, end: 10 },
  conclude: { start: 10, end: 12 },
}

// Essay phases are proportional (15% outline, 70% write, 15% conclude)
export const ESSAY_PHASE_PROPORTIONS = {
  outline: 0.15,
  write: 0.70,
  conclude: 0.15,
}

// Heatmap thresholds (multipliers of ideal time)
export const HEATMAP_THRESHOLDS = {
  good: 1.0,      // Green: <= ideal
  warning: 1.5,   // Yellow: 1-1.5x ideal
  danger: 1.5,    // Red: > 1.5x ideal
}

// Local storage keys
export const STORAGE_KEY_NAME = 'upsc-chrono-master-name'
