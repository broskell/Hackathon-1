import type { User } from '@supabase/supabase-js'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { UserRole } from '@/types'

export async function ensureProfile(
  supabase: SupabaseClient,
  user: User,
  fallbackRole: UserRole = 'employee'
) {
  const { data: existing } = await supabase
    .from('profiles')
    .select('role, full_name')
    .eq('id', user.id)
    .maybeSingle()

  if (existing) return existing

  const role = (user.user_metadata?.role as UserRole | undefined) ?? fallbackRole
  const fullName =
    (user.user_metadata?.full_name as string | undefined) ??
    user.email?.split('@')[0] ??
    'User'

  const { data, error } = await supabase
    .from('profiles')
    .insert({
      id: user.id,
      full_name: fullName,
      email: user.email!,
      role,
    })
    .select('role, full_name')
    .single()

  if (error) {
    throw new Error(
      'Profile not found. Run supabase/schema.sql in your Supabase SQL Editor first.'
    )
  }

  return data
}
