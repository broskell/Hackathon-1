import type { User } from '@supabase/supabase-js'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { UserRole } from '@/types'

export async function ensureProfile(
  supabase: SupabaseClient,
  user: User,
  fallbackRole: UserRole = 'employee'
) {
  const { data: existing, error: selectError } = await supabase
    .from('profiles')
    .select('role, full_name')
    .eq('id', user.id)
    .maybeSingle()

  if (selectError) {
    throw new Error(`Could not load profile: ${selectError.message}`)
  }

  if (existing) return existing

  const role = (user.user_metadata?.role as UserRole | undefined) ?? fallbackRole
  const fullName =
    (user.user_metadata?.full_name as string | undefined) ??
    user.email?.split('@')[0] ??
    'User'

  const { data, error: insertError } = await supabase
    .from('profiles')
    .insert({
      id: user.id,
      full_name: fullName,
      email: user.email!,
      role,
    })
    .select('role, full_name')
    .single()

  if (!insertError) {
    return data
  }

  // Profile row may exist but SELECT was blocked (RLS) or id mismatch — retry read
  if (insertError.code === '23505') {
    const { data: retry, error: retryError } = await supabase
      .from('profiles')
      .select('role, full_name')
      .eq('id', user.id)
      .maybeSingle()

    if (retry) return retry
    if (retryError) {
      throw new Error(`Profile exists but cannot be read (RLS): ${retryError.message}`)
    }

    throw new Error(
      `Profile id mismatch. Auth user id is ${user.id} but no matching profiles row. Run supabase/FIX-PROFILE-ACCESS.sql in Supabase SQL Editor.`
    )
  }

  throw new Error(
    `Could not create profile: ${insertError.message}. If this mentions permission or RLS, run supabase/FIX-PROFILE-ACCESS.sql in Supabase SQL Editor.`
  )
}
