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
import { getAuditLogs } from '@/lib/mock-data'
import { formatDateTime } from '@/lib/format'
import type { AuditLog, Profile } from '@/types'

export default function ManagerAuditPage() {
  const [logs, setLogs] = useState<(AuditLog & { user?: Profile })[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    void (async () => {
      await new Promise((r) => setTimeout(r, 200))
      setLogs(getAuditLogs())
      setLoading(false)
    })()
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-6"
    >
      <div>
        <h2 className="text-2xl font-bold text-text-primary">Audit Trail</h2>
        <p className="text-sm text-text-secondary">Sample history of platform actions (demo data)</p>
      </div>

      {loading ? (
        <SkeletonTable rows={8} />
      ) : logs.length === 0 ? (
        <EmptyState
          icon={Shield}
          title="No audit logs"
          description="Demo audit entries appear here."
        />
      ) : (
        <div className="overflow-hidden rounded-xl border border-border bg-surface">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Entity</TableHead>
                <TableHead>Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="font-medium">
                    {log.user?.full_name ?? 'System'}
                  </TableCell>
                  <TableCell>{log.action.replace(/_/g, ' ')}</TableCell>
                  <TableCell className="text-text-secondary">{log.entity_type}</TableCell>
                  <TableCell className="text-text-muted">
                    {formatDateTime(log.created_at)}
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
