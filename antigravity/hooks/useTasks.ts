'use client'

import { useCallback, useEffect, useState } from 'react'
import type { Task } from '@/types'

export function useTasks(assignedTo?: string) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTasks = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams()
      if (assignedTo) params.set('assigned_to', assignedTo)
      const res = await fetch(`/api/tasks?${params}`)
      if (!res.ok) throw new Error('Failed to fetch tasks')
      const data = (await res.json()) as Task[]
      setTasks(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }, [assignedTo])

  useEffect(() => {
    void fetchTasks()
  }, [fetchTasks])

  return { tasks, loading, error, refetch: fetchTasks }
}
