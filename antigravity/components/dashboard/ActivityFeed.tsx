'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { formatRelative } from '@/lib/format'
import { ScrollArea } from '@/components/ui/scroll-area'
import type { AuditLog, Profile } from '@/types'

export function ActivityFeed() {
  const [logs, setLogs] = useState<(AuditLog & { user?: Profile })[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()

    async function fetchLogs() {
      const { data } = await supabase
        .from('audit_logs')
        .select('*, user:profiles(*)')
        .order('created_at', { ascending: false })
        .limit(20)

      setLogs((data ?? []) as (AuditLog & { user?: Profile })[])
      setLoading(false)
    }

    void fetchLogs()

    const channel = supabase
      .channel('audit_logs')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'audit_logs' },
        (payload) => {
          setLogs((prev) => [payload.new as AuditLog, ...prev].slice(0, 20))
        }
      )
      .subscribe()

    return () => {
      void supabase.removeChannel(channel)
    }
  }, [])

  if (loading) {
    return (
      <div className="flex flex-col gap-3 p-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-12 animate-pulse rounded-lg bg-surface-2" />
        ))}
      </div>
    )
  }

  if (logs.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-text-muted">No activity yet</p>
    )
  }

  return (
    <ScrollArea className="h-80">
      <AnimatePresence>
        <div className="flex flex-col gap-1 p-2">
          {logs.map((log, index) => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.03 }}
              className="flex items-start gap-3 rounded-lg p-3 hover:bg-surface-2"
            >
              <div className="mt-1 size-2 shrink-0 rounded-full bg-accent" />
              <div className="min-w-0 flex-1">
                <p className="text-sm text-text-primary">
                  <span className="font-medium">{log.user?.full_name ?? 'System'}</span>
                  {' '}
                  <span className="text-text-secondary">{log.action.replace(/_/g, ' ').toLowerCase()}</span>
                </p>
                <p className="text-xs text-text-muted">{formatRelative(log.created_at)}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </AnimatePresence>
    </ScrollArea>
  )
}
