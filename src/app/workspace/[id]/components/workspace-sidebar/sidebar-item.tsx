import { cva, type VariantProps } from 'class-variance-authority'
import type { LucideIcon } from 'lucide-react'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

import type { Id } from '../../../../../../convex/_generated/dataModel'

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
  workspaceId: Id<'workspaces'>
}

export function SidebarItem({
  id,
  label,
  icon: Icon,
  variant,
  workspaceId,
}: SidebarItemProps) {
  return (
    <Button className={cn(sidebarItemVariants({ variant }))} size="sm" asChild>
      <Link href={`/workspace/${workspaceId}/channel/${id}`}>
        <Icon className="mr-1 size-3.5 shrink-0" />
        <span className="truncate text-sm">{label}</span>
      </Link>
    </Button>
  )
}
