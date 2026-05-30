import type { TaskPriority } from '@/types'
import { cn } from '@/lib/utils'

const priorityStyles: Record<TaskPriority, { label: string; className: string }> = {
  low: { label: 'Low', className: 'bg-muted text-muted-foreground' },
  medium: { label: 'Medium', className: 'bg-blue-500/10 text-blue-400' },
  high: { label: 'High', className: 'bg-warning/10 text-warning' },
  critical: { label: 'Critical', className: 'bg-danger/10 text-danger' },
}

export function TaskPriorityBadge({ priority }: { priority: TaskPriority }) {
  const config = priorityStyles[priority]
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        config.className
      )}
    >
      {config.label}
    </span>
  )
}
