import type { LucideIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'

interface SidebarButtonProps {
  icon: LucideIcon
  label: string
  isActive?: boolean
}

export function SidebarButton({ icon, label, isActive }: SidebarButtonProps) {
  return (
    <div className="group flex cursor-pointer flex-col items-center justify-center gap-y-0.5">
      <Button disabled={isActive}>{label}</Button>
    </div>
  )
}
