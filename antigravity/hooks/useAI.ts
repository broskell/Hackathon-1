'use client'

import { useCallback, useState } from 'react'
import type { SmartTaskResult, TeamSummaryResult, VerifyLogResult } from '@/types'

export function useAI() {
  const [loading, setLoading] = useState(false)

  const verifyLog = useCallback(
    async (taskTitle: string, taskDescription: string, logContent: string) => {
      setLoading(true)
      try {
        const res = await fetch('/api/ai/verify-log', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ taskTitle, taskDescription, logContent }),
        })
        if (!res.ok) throw new Error('Verification failed')
        return (await res.json()) as VerifyLogResult
      } finally {
        setLoading(false)
      }
    },
    []
  )

  const generateTeamSummary = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/ai/team-summary', { method: 'POST' })
      if (!res.ok) throw new Error('Summary generation failed')
      return (await res.json()) as TeamSummaryResult & { id: string }
    } finally {
      setLoading(false)
    }
  }, [])

  const suggestTask = useCallback(async (title: string, description: string) => {
    setLoading(true)
    try {
      const res = await fetch('/api/ai/smart-task', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description }),
      })
      if (!res.ok) throw new Error('Smart task failed')
      return (await res.json()) as SmartTaskResult
    } finally {
      setLoading(false)
    }
  }, [])

  return { loading, verifyLog, generateTeamSummary, suggestTask }
}
