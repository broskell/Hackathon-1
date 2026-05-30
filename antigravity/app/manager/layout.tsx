import { createClient } from '@/lib/supabase/server'
import { ensureProfile } from '@/lib/supabase/ensure-profile'
import { redirect } from 'next/navigation'
import { ManagerSidebar } from '@/components/layout/ManagerSidebar'
import { Topbar } from '@/components/layout/Topbar'

export default async function ManagerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  let profile
  try {
    profile = await ensureProfile(supabase, user, 'manager')
  } catch {
    redirect('/login?error=schema')
  }

  if (profile.role !== 'manager') redirect('/employee/dashboard')

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <ManagerSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar
          title="Manager Portal"
          userName={profile.full_name}
          mobileNav={<ManagerSidebar mobileOnly />}
        />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}
