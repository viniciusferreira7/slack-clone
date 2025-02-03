import { Home } from 'lucide-react'

import { UserButton } from '@/features/auth/components/user-button'

import { SidebarButton } from './sidebar-button'
import { WorkspaceSwitcher } from './workspace-switcher'

export function Sidebar() {
  return (
    <aside className="flex min-h-full w-[70px] flex-col items-center gap-y-4 bg-slack-purple-900 pb-4 pt-[9px]">
      <WorkspaceSwitcher />
      <SidebarButton icon={Home} label="Home" isActive />
      <div className="mt-auto flex flex-col items-center justify-center gap-y-1">
        <UserButton />
      </div>
    </aside>
  )
}
