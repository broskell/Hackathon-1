'use client'

import { useCallback, useEffect, useState } from 'react'
import { getTasks } from '@/lib/mock-data'
import type { Task } from '@/types'

export function useTasks(assignedTo?: string) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTasks = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      await new Promise((r) => setTimeout(r, 200))
      setTasks(getTasks(assignedTo ? { assigned_to: assignedTo } : undefined))
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
