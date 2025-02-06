import type { LucideIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface SidebarButtonProps {
  icon: LucideIcon
  label: string
  isActive?: boolean
}

export function SidebarButton({
  icon: Icon,
  label,
  isActive,
}: SidebarButtonProps) {
  return (
    <div className="group flex cursor-pointer flex-col items-center justify-center gap-y-0.5">
      <Button
        variant="ghost"
        className={cn(
          'size-9 p-2 group-hover:bg-accent/20',
          isActive && 'bg-accent/20',
        )}
      >
        <Icon className="size-5 text-white transition-all group-hover:scale-110" />
      </Button>
      <span className="text-[11px] text-white group-hover:text-accent">
        {label}
      </span>
    </div>
  )
}
