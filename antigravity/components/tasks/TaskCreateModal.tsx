'use client'

import { useState } from 'react'
import { Loader2, Sparkles } from 'lucide-react'
import { toast } from 'sonner'
import { useAI } from '@/hooks/useAI'
import { addDays } from '@/lib/format'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import type { Profile, TaskPriority } from '@/types'

interface TaskCreateModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  employees: Profile[]
  onCreated: () => void
}

export function TaskCreateModal({
  open,
  onOpenChange,
  employees,
  onCreated,
}: TaskCreateModalProps) {
  const { suggestTask, loading: aiLoading } = useAI()
  const [submitting, setSubmitting] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<TaskPriority>('medium')
  const [assignedTo, setAssignedTo] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [deliverables, setDeliverables] = useState('')
  const [suggestedPlan, setSuggestedPlan] = useState('')
  const [estimatedHours, setEstimatedHours] = useState<number | undefined>()
  const [aiGenerated, setAiGenerated] = useState(false)

  async function handleAIAssist() {
    if (!title.trim()) {
      toast.error('Enter a task title first')
      return
    }
    try {
      const result = await suggestTask(title, description)
      setPriority(result.priority)
      setDueDate(addDays(result.suggested_due_days).split('T')[0])
      setDeliverables(result.deliverables.join('\n'))
      setSuggestedPlan(result.suggested_plan)
      setEstimatedHours(result.estimated_hours)
      setAiGenerated(true)
      toast.success('AI suggestions applied')
    } catch {
      toast.error('AI assist failed')
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    try {
      await new Promise((r) => setTimeout(r, 400))
      toast.success('Task created (demo — not persisted)')
      onCreated()
      onOpenChange(false)
      setTitle('')
      setDescription('')
      setPriority('medium')
      setAssignedTo('')
      setDueDate('')
      setDeliverables('')
      setSuggestedPlan('')
      setEstimatedHours(undefined)
      setAiGenerated(false)
    } catch {
      toast.error('Failed to create task')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto border-border bg-surface sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
        </DialogHeader>
        <form onSubmit={(e) => void handleSubmit(e)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Redesign checkout page"
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief task description..."
              rows={3}
            />
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={() => void handleAIAssist()}
            disabled={aiLoading}
          >
            {aiLoading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Sparkles className="size-4" />
            )}
            AI Assist
          </Button>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label>Priority</Label>
              <Select value={priority} onValueChange={(v) => v && setPriority(v as TaskPriority)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="due">Due Date</Label>
              <Input
                id="due"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label>Assign To</Label>
            <Select value={assignedTo} onValueChange={(v) => setAssignedTo(v ?? '')}>
              <SelectTrigger>
                <SelectValue placeholder="Select employee" />
              </SelectTrigger>
              <SelectContent>
                {employees.map((emp) => (
                  <SelectItem key={emp.id} value={emp.id}>
                    {emp.full_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {deliverables && (
            <div className="flex flex-col gap-2">
              <Label>Deliverables</Label>
              <Textarea value={deliverables} onChange={(e) => setDeliverables(e.target.value)} rows={3} />
            </div>
          )}
          {suggestedPlan && (
            <div className="flex flex-col gap-2">
              <Label>AI Suggested Plan</Label>
              <p className="rounded-lg bg-surface-2 p-3 text-sm text-text-secondary">
                {suggestedPlan}
              </p>
            </div>
          )}
          <Button type="submit" disabled={submitting}>
            {submitting ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Creating...
              </>
            ) : (
              'Create Task'
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
