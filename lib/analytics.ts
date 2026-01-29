import { HEATMAP_THRESHOLDS, MS_PER_MINUTE } from './constants'

export type QuestionStatus = 'good' | 'warning' | 'danger'

export interface QuestionStat {
  questionNumber: number
  timeMs: number
  status: QuestionStatus
}

export interface PrelimsStats {
  totalQuestions: number
  questionsAnswered: number
  avgTimeMs: number
  totalTimeSpentMs: number
  omrBufferMs: number
  idealTimePerQuestionMs: number
  questionStats: QuestionStat[]
  insight: string
}

function getQuestionStatus(timeMs: number, idealTimeMs: number): QuestionStatus {
  const ratio = timeMs / idealTimeMs
  if (ratio <= HEATMAP_THRESHOLDS.good) {
    return 'good'
  } else if (ratio <= HEATMAP_THRESHOLDS.warning) {
    return 'warning'
  }
  return 'danger'
}

function generateInsight(stats: Omit<PrelimsStats, 'insight'>): string {
  const { avgTimeMs, idealTimePerQuestionMs, omrBufferMs, questionStats } = stats
  
  const goodCount = questionStats.filter(q => q.status === 'good').length
  const dangerCount = questionStats.filter(q => q.status === 'danger').length
  const totalAnswered = questionStats.length
  
  const avgRatio = avgTimeMs / idealTimePerQuestionMs
  
  if (avgRatio <= 0.8 && omrBufferMs > 10 * MS_PER_MINUTE) {
    return 'Excellent pace. You have ample time for revision and OMR marking.'
  }
  
  if (dangerCount > totalAnswered * 0.3) {
    return 'Too many questions took longer than ideal. Focus on time management for difficult questions.'
  }
  
  if (omrBufferMs < 5 * MS_PER_MINUTE) {
    return 'Tight on OMR buffer. Practice faster decision-making on uncertain questions.'
  }
  
  if (goodCount > totalAnswered * 0.7) {
    return 'Good consistency. Maintain this pace in the actual exam.'
  }
  
  if (avgRatio > 1.2) {
    return 'Average time per question is high. Consider skipping difficult questions faster.'
  }
  
  return 'Decent practice session. Keep refining your time allocation strategy.'
}

export function calculatePrelimsStats(
  lapTimes: number[],
  totalQuestions: number,
  idealTimeMinutes: number
): PrelimsStats {
  const idealTimeTotalMs = idealTimeMinutes * MS_PER_MINUTE
  const idealTimePerQuestionMs = idealTimeTotalMs / totalQuestions
  
  const totalTimeSpentMs = lapTimes.reduce((sum, t) => sum + t, 0)
  const avgTimeMs = lapTimes.length > 0 ? totalTimeSpentMs / lapTimes.length : 0
  const omrBufferMs = idealTimeTotalMs - totalTimeSpentMs
  
  const questionStats: QuestionStat[] = lapTimes.map((timeMs, index) => ({
    questionNumber: index + 1,
    timeMs,
    status: getQuestionStatus(timeMs, idealTimePerQuestionMs),
  }))
  
  const statsWithoutInsight = {
    totalQuestions,
    questionsAnswered: lapTimes.length,
    avgTimeMs,
    totalTimeSpentMs,
    omrBufferMs,
    idealTimePerQuestionMs,
    questionStats,
  }
  
  return {
    ...statsWithoutInsight,
    insight: generateInsight(statsWithoutInsight),
  }
}

export function formatTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
}

export function formatTimeWithMs(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  const milliseconds = Math.floor((ms % 1000) / 10)
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`
}
