import Link from 'next/link'
import { AlertTriangle } from 'lucide-react'
import type { Task } from '@/types'
import { formatDate } from '@/lib/format'

interface OverdueAlertBannerProps {
  tasks: Task[]
}

export function OverdueAlertBanner({ tasks }: OverdueAlertBannerProps) {
  const overdue = tasks.filter((t) => t.status === 'overdue' || t.status !== 'done')

  const overdueTasks = overdue.filter((t) => {
    if (!t.due_date || t.status === 'done') return false
    return new Date(t.due_date) < new Date()
  })

  if (overdueTasks.length === 0) return null

  return (
    <div className="flex items-center gap-3 rounded-xl border border-danger/30 bg-danger/10 px-4 py-3">
      <AlertTriangle className="size-5 shrink-0 text-danger" />
      <div className="flex-1">
        <p className="text-sm font-medium text-text-primary">
          {overdueTasks.length} overdue task{overdueTasks.length > 1 ? 's' : ''} need attention
        </p>
        <p className="text-xs text-text-secondary">
          {overdueTasks.slice(0, 2).map((t) => t.title).join(', ')}
          {overdueTasks.length > 2 && ` +${overdueTasks.length - 2} more`}
        </p>
      </div>
      <Link
        href="/manager/tasks"
        className="shrink-0 text-sm font-medium text-danger hover:underline"
      >
        View tasks
      </Link>
    </div>
  )
}
