import { getScoreColor, getScoreLabel } from '@/lib/scoring/accountability'
import { cn } from '@/lib/utils'

interface AccountabilityScoreBadgeProps {
  score: number
  showLabel?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export function AccountabilityScoreBadge({
  score,
  showLabel = true,
  size = 'md',
}: AccountabilityScoreBadgeProps) {
  const color = getScoreColor(score)
  const label = getScoreLabel(score)

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1',
    lg: 'text-base px-3 py-1.5',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border border-border bg-surface-2 font-medium',
        sizeClasses[size]
      )}
    >
      <span className={cn('font-bold tabular-nums', color)}>{Math.round(score)}</span>
      {showLabel && <span className="text-text-secondary">{label}</span>}
    </span>
  )
}
