import { ManagerSidebar } from '@/components/layout/ManagerSidebar'
import { Topbar } from '@/components/layout/Topbar'
import { MOCK_MANAGER } from '@/lib/mock-data'

export default function ManagerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <ManagerSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar
          title="Manager Portal"
          userName={MOCK_MANAGER.full_name}
          mobileNav={<ManagerSidebar mobileOnly />}
        />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}
