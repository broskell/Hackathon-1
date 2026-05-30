'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Shield } from 'lucide-react'
import { EmptyState } from '@/components/shared/EmptyState'
import { SkeletonTable } from '@/components/shared/SkeletonCard'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { createClient } from '@/lib/supabase/client'
import { formatDateTime } from '@/lib/format'
import type { AuditLog, Profile } from '@/types'

export default function ManagerAuditPage() {
  const [logs, setLogs] = useState<(AuditLog & { user?: Profile })[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchLogs() {
      const supabase = createClient()
      const { data } = await supabase
        .from('audit_logs')
        .select('*, user:profiles(*)')
        .order('created_at', { ascending: false })
        .limit(100)
      setLogs((data ?? []) as (AuditLog & { user?: Profile })[])
      setLoading(false)
    }
    void fetchLogs()
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-6"
    >
      <div>
        <h2 className="text-2xl font-bold text-text-primary">Audit Trail</h2>
        <p className="text-sm text-text-secondary">Complete history of all platform actions</p>
      </div>

      {loading ? (
        <SkeletonTable rows={8} />
      ) : logs.length === 0 ? (
        <EmptyState
          icon={Shield}
          title="No audit logs yet"
          description="All actions will be logged here automatically."
        />
      ) : (
        <div className="rounded-xl border border-border bg-surface overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead>Timestamp</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Entity</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((log) => (
                <TableRow key={log.id} className="border-border">
                  <TableCell className="text-text-muted text-xs">
                    {formatDateTime(log.created_at)}
                  </TableCell>
                  <TableCell className="text-text-primary">
                    {log.user?.full_name ?? 'System'}
                  </TableCell>
                  <TableCell>
                    <span className="rounded bg-surface-2 px-2 py-0.5 text-xs font-mono text-accent">
                      {log.action}
                    </span>
                  </TableCell>
                  <TableCell className="text-text-secondary capitalize">
                    {log.entity_type.replace('_', ' ')}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </motion.div>
  )
}
