import { formatDateTime } from '@/lib/format'
import { TrustScoreCard } from './TrustScoreCard'
import type { WorkLog } from '@/types'

interface LogHistoryListProps {
  logs: WorkLog[]
}

export function LogHistoryList({ logs }: LogHistoryListProps) {
  if (logs.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-text-muted">No work logs yet</p>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {logs.map((log) => (
        <div key={log.id} className="rounded-xl border border-border bg-surface p-4">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-xs text-text-muted">{formatDateTime(log.created_at)}</p>
            {log.hours_worked && (
              <span className="text-xs text-text-secondary">{log.hours_worked}h logged</span>
            )}
          </div>
          <p className="mb-4 text-sm text-text-primary">{log.content}</p>
          {log.ai_verdict && <TrustScoreCard log={log} />}
        </div>
      ))}
    </div>
  )
}
