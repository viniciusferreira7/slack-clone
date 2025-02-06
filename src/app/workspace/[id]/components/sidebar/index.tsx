'use client'

import { Bell, Home, MessagesSquareIcon, MoreHorizontal } from 'lucide-react'
import { usePathname } from 'next/navigation'

import { UserButton } from '@/features/auth/components/user-button'

import { SidebarButton } from './sidebar-button'
import { WorkspaceSwitcher } from './workspace-switcher'

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="flex min-h-full w-[70px] flex-col items-center gap-y-4 bg-slack-purple-900 pb-4 pt-[9px]">
      <WorkspaceSwitcher />
      <SidebarButton
        icon={Home}
        label="Home"
        isActive={pathname.includes('workspace')}
      />
      <SidebarButton icon={MessagesSquareIcon} label="DMs" />
      <SidebarButton icon={Bell} label="Activity" />
      <SidebarButton icon={MoreHorizontal} label="More" />
      <div className="mt-auto flex flex-col items-center justify-center gap-y-1">
        <UserButton />
      </div>
    </aside>
  )
}
