import { createClient } from '@/lib/supabase/client'

export async function logAuditEvent({
  userId,
  action,
  entityType,
  entityId,
  previousValue,
  newValue,
}: {
  userId: string
  action: string
  entityType: 'task' | 'work_log' | 'profile' | 'team_summary'
  entityId?: string
  previousValue?: Record<string, unknown>
  newValue?: Record<string, unknown>
}) {
  const supabase = createClient()
  await supabase.from('audit_logs').insert({
    user_id: userId,
    action,
    entity_type: entityType,
    entity_id: entityId,
    previous_value: previousValue,
    new_value: newValue,
  })
}
