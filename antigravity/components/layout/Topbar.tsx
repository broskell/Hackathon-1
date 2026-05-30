'use client'

import { useRouter } from 'next/navigation'
import { LogOut, User } from 'lucide-react'
import { getInitials } from '@/lib/format'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface TopbarProps {
  title: string
  subtitle?: string
  userName?: string
  mobileNav?: React.ReactNode
}

export function Topbar({ title, subtitle, userName, mobileNav }: TopbarProps) {
  const router = useRouter()

  function handleExit() {
    router.push('/login')
  }

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-surface px-4 md:px-6">
      <div className="flex items-center gap-3">
        {mobileNav}
        <div>
          <h1 className="text-lg font-semibold text-text-primary">{title}</h1>
          {subtitle && <p className="text-xs text-text-muted">{subtitle}</p>}
        </div>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-surface-2 outline-none">
          <Avatar className="size-8">
            <AvatarFallback className="bg-accent-muted text-accent text-xs">
              {userName ? getInitials(userName) : 'U'}
            </AvatarFallback>
          </Avatar>
          <span className="hidden text-sm text-text-secondary md:inline">
            {userName ?? 'User'}
          </span>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="border-border bg-surface">
          <DropdownMenuItem disabled>
            <User className="size-4" />
            {userName ?? 'Profile'}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleExit}>
            <LogOut className="size-4" />
            Switch portal
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}
