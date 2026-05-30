'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BarChart3, ClipboardList, LayoutDashboard, Menu, TrendingUp } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'

const navItems = [
  { href: '/employee/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/employee/tasks', label: 'My Tasks', icon: ClipboardList },
  { href: '/employee/analytics', label: 'Analytics', icon: TrendingUp },
]

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname()

  return (
    <nav className="flex flex-col gap-1">
      {navItems.map(({ href, label, icon: Icon }) => {
        const active = pathname.startsWith(href)
        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
              active
                ? 'bg-accent-muted text-accent'
                : 'text-text-secondary hover:bg-surface-2 hover:text-text-primary'
            )}
          >
            <Icon className="size-4" />
            {label}
          </Link>
        )
      })}
    </nav>
  )
}

export function EmployeeSidebar({ mobileOnly = false }: { mobileOnly?: boolean }) {
  if (mobileOnly) {
    return (
      <Sheet>
        <SheetTrigger
          className="inline-flex md:hidden size-9 items-center justify-center rounded-md hover:bg-surface-2"
        >
          <Menu className="size-5" />
        </SheetTrigger>
        <SheetContent side="left" className="w-64 border-border bg-surface p-0">
          <div className="flex h-16 items-center gap-2 border-b border-border px-6">
            <div className="flex size-8 items-center justify-center rounded-lg bg-accent">
              <BarChart3 className="size-4 text-white" />
            </div>
            <p className="text-sm font-bold">Antigravity</p>
          </div>
          <div className="p-4">
            <NavLinks />
          </div>
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <>
      <aside className="hidden w-64 shrink-0 flex-col border-r border-border bg-surface md:flex">
        <div className="flex h-16 items-center gap-2 border-b border-border px-6">
          <div className="flex size-8 items-center justify-center rounded-lg bg-accent">
            <BarChart3 className="size-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-text-primary">Antigravity</p>
            <p className="text-xs text-text-muted">Employee Portal</p>
          </div>
        </div>
        <div className="flex flex-1 flex-col gap-1 p-4">
          <NavLinks />
        </div>
      </aside>

      <Sheet>
        <SheetTrigger
          className="inline-flex md:hidden size-9 items-center justify-center rounded-md hover:bg-surface-2"
        >
          <Menu className="size-5" />
        </SheetTrigger>
        <SheetContent side="left" className="w-64 border-border bg-surface p-0">
          <div className="flex h-16 items-center gap-2 border-b border-border px-6">
            <div className="flex size-8 items-center justify-center rounded-lg bg-accent">
              <BarChart3 className="size-4 text-white" />
            </div>
            <p className="text-sm font-bold">Antigravity</p>
          </div>
          <div className="p-4">
            <NavLinks />
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}
