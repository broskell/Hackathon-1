'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getAuditLogs } from '@/lib/mock-data'
import { formatRelative } from '@/lib/format'
import { ScrollArea } from '@/components/ui/scroll-area'
import type { AuditLog, Profile } from '@/types'

export function ActivityFeed() {
  const [logs, setLogs] = useState<(AuditLog & { user?: Profile })[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    void (async () => {
      await new Promise((r) => setTimeout(r, 200))
      setLogs(getAuditLogs().slice(0, 20))
      setLoading(false)
    })()
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
                  <span className="font-medium">{log.user?.full_name ?? 'System'}</span>{' '}
                  <span className="text-text-secondary">
                    {log.action.replace(/_/g, ' ').toLowerCase()}
                  </span>
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
