import { createClient } from '@/lib/supabase/server'
import { ensureProfile } from '@/lib/supabase/ensure-profile'
import { redirect } from 'next/navigation'
import { EmployeeSidebar } from '@/components/layout/EmployeeSidebar'
import { Topbar } from '@/components/layout/Topbar'

export default async function EmployeeLayout({
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
    profile = await ensureProfile(supabase, user, 'employee')
  } catch {
    redirect('/login?error=schema')
  }

  if (profile.role !== 'employee') redirect('/manager/dashboard')

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <EmployeeSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar
          title="Employee Portal"
          userName={profile.full_name}
          mobileNav={<EmployeeSidebar mobileOnly />}
        />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}
