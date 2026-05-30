import type { ScoreInput } from '@/types'

export function calculateAccountabilityScore(data: ScoreInput): number {
  const completionRate = data.totalTasks > 0 ? data.completedOnTime / data.totalTasks : 0
  const overduePenalty = Math.min(data.overdueTasks * 6, 35)
  const aiQuality = (data.avgTrustScore + data.avgConfidenceScore) / 2
  const consistency = data.logConsistencyRatio * 20

  const raw = completionRate * 40 + (aiQuality / 100) * 30 + consistency - overduePenalty

  return Math.max(0, Math.min(100, Math.round(raw)))
}

export function getScoreColor(score: number): string {
  if (score >= 80) return 'text-emerald-400'
  if (score >= 60) return 'text-yellow-400'
  if (score >= 40) return 'text-orange-400'
  return 'text-red-400'
}

export function getScoreLabel(score: number): string {
  if (score >= 80) return 'Excellent'
  if (score >= 60) return 'Good'
  if (score >= 40) return 'Needs Improvement'
  return 'At Risk'
}

export function confidenceToScore(confidence: string | null): number {
  switch (confidence) {
    case 'High':
      return 100
    case 'Medium':
      return 65
    case 'Low':
      return 30
    default:
      return 50
  }
}
