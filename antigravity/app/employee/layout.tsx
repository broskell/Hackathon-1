import { EmployeeSidebar } from '@/components/layout/EmployeeSidebar'
import { Topbar } from '@/components/layout/Topbar'
import { getEmployeeProfile } from '@/lib/mock-data'

export default function EmployeeLayout({ children }: { children: React.ReactNode }) {
  const profile = getEmployeeProfile()

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
