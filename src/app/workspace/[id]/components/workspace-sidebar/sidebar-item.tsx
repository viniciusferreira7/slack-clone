import { cva, type VariantProps } from 'class-variance-authority'
import type { LucideIcon } from 'lucide-react'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { useWorkspaceId } from '@/hooks/use-workspace-id'
import { cn } from '@/lib/utils'

const sidebarItemVariants = cva(
  'flex items-center bg-transparent gap-1.5 justify-start font-normal h-7 px-[18px] text-sm overflow-hidden',
  {
    variants: {
      variant: {
        default: 'text-slack-purple-100 hover:bg-white/20',
        active: 'text-slack-purple-900 bg-white/90 hover:bg-white/90',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

interface SidebarItemProps {
  id: string
  label: string
  icon: LucideIcon
  variant?: VariantProps<typeof sidebarItemVariants>['variant']
}

export function SidebarItem({
  id,
  label,
  icon: Icon,
  variant,
}: SidebarItemProps) {
  const workspaceId = useWorkspaceId()

  return (
    <Button className={cn(sidebarItemVariants({ variant }))} size="sm" asChild>
      <Link href={`/workspace/${workspaceId}/channel/${id}`}>
        <Icon className="mr-1 size-3.5 shrink-0" />
        <span className="truncate text-sm">{label}</span>
      </Link>
    </Button>
  )
}
