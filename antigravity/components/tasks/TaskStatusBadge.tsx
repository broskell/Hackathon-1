import type { TaskPriority, TaskStatus } from '@/types'
import { cn } from '@/lib/utils'

const statusStyles: Record<TaskStatus, { label: string; className: string }> = {
  todo: { label: 'To Do', className: 'bg-muted text-muted-foreground' },
  in_progress: { label: 'In Progress', className: 'bg-blue-500/10 text-blue-400' },
  review: { label: 'Review', className: 'bg-warning/10 text-warning' },
  done: { label: 'Done', className: 'bg-success/10 text-success' },
  overdue: { label: 'Overdue', className: 'bg-danger/10 text-danger' },
}

export function TaskStatusBadge({ status }: { status: TaskStatus }) {
  const config = statusStyles[status]
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
