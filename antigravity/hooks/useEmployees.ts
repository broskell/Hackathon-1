'use client'

import { useCallback, useEffect, useState } from 'react'
import { getEmployees } from '@/lib/mock-data'
import type { Profile } from '@/types'

export function useEmployees() {
  const [employees, setEmployees] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchEmployees = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      await new Promise((r) => setTimeout(r, 150))
      setEmployees(getEmployees())
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void fetchEmployees()
  }, [fetchEmployees])

  return { employees, loading, error, refetch: fetchEmployees }
}
