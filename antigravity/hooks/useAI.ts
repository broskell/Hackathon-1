'use client'

import { useCallback, useState } from 'react'
import {
  MOCK_SMART_TASK,
  MOCK_TEAM_SUMMARY,
  MOCK_VERIFY_LOG,
} from '@/lib/mock-data'
import type { SmartTaskResult, TeamSummaryResult, VerifyLogResult } from '@/types'

export function useAI() {
  const [loading, setLoading] = useState(false)

  const verifyLog = useCallback(
    async (_taskTitle: string, _taskDescription: string, logContent: string) => {
      setLoading(true)
      try {
        await new Promise((r) => setTimeout(r, 800))
        const vague =
          logContent.length < 40 || /worked on stuff|made progress/i.test(logContent)
        if (vague) {
          return {
            trust_score: 34,
            confidence: 'High' as const,
            ai_verdict: 'vague' as const,
            ai_explanation: 'Vague language with no concrete artifacts or outcomes.',
            ai_flags: ['no_specifics', 'generic_phrasing'],
          } satisfies VerifyLogResult
        }
        return MOCK_VERIFY_LOG
      } finally {
        setLoading(false)
      }
    },
    []
  )

  const generateTeamSummary = useCallback(async () => {
    setLoading(true)
    try {
      await new Promise((r) => setTimeout(r, 1200))
      return MOCK_TEAM_SUMMARY
    } finally {
      setLoading(false)
    }
  }, [])

  const suggestTask = useCallback(async (_title: string, _description: string) => {
    setLoading(true)
    try {
      await new Promise((r) => setTimeout(r, 600))
      return MOCK_SMART_TASK
    } finally {
      setLoading(false)
    }
  }, [])

  return { loading, verifyLog, generateTeamSummary, suggestTask }
}
