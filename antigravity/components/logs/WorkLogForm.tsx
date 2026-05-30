'use client'

import { useState } from 'react'
import { Loader2, Send } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import type { WorkLog } from '@/types'
import { TrustScoreCard } from './TrustScoreCard'

interface WorkLogFormProps {
  taskId: string
  onSubmitted: (log: WorkLog) => void
}

export function WorkLogForm({ taskId, onSubmitted }: WorkLogFormProps) {
  const [content, setContent] = useState('')
  const [hours, setHours] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [latestLog, setLatestLog] = useState<WorkLog | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!content.trim()) {
      toast.error('Please describe your work')
      return
    }
    setSubmitting(true)
    try {
      const res = await fetch('/api/logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          task_id: taskId,
          content,
          hours_worked: hours ? parseFloat(hours) : undefined,
        }),
      })
      if (!res.ok) throw new Error('Failed to submit log')
      const log = (await res.json()) as WorkLog
      setLatestLog(log)
      onSubmitted(log)
      setContent('')
      setHours('')
      toast.success('Work log submitted & verified by AI')
    } catch {
      toast.error('Failed to submit work log')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <form onSubmit={(e) => void handleSubmit(e)} className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="content">What did you accomplish?</Label>
          <Textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Be specific: files changed, outcomes achieved, blockers encountered..."
            rows={4}
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="hours">Hours Worked</Label>
          <Input
            id="hours"
            type="number"
            step="0.5"
            min="0"
            value={hours}
            onChange={(e) => setHours(e.target.value)}
            placeholder="2.5"
          />
        </div>
        <Button type="submit" disabled={submitting}>
          {submitting ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              AI Verifying...
            </>
          ) : (
            <>
              <Send className="size-4" />
              Submit Work Log
            </>
          )}
        </Button>
      </form>
      {latestLog && <TrustScoreCard log={latestLog} />}
    </div>
  )
}
