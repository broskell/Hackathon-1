'use client'

import { useCallback, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Profile } from '@/types'

export function useEmployees() {
  const [employees, setEmployees] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchEmployees = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const supabase = createClient()
      const { data, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'employee')
        .order('accountability_score', { ascending: false })

      if (fetchError) throw fetchError
      setEmployees((data ?? []) as Profile[])
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
