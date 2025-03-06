import { cva, type VariantProps } from 'class-variance-authority'
import Link from 'next/link'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

import type { Id } from '../../../../../../convex/_generated/dataModel'

const userItemVariants = cva(
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

interface UserItemProps {
  id: Id<'members'>
  label?: string
  image?: string
  variant?: VariantProps<typeof userItemVariants>['variant']
  workspaceId: Id<'workspaces'>
}

export function UserItem({
  id,
  label = 'Member',
  image,
  variant,
  workspaceId,
}: UserItemProps) {
  const avatarFallback = label.charAt(0).toUpperCase()

  return (
    <Button
      variant="transparent"
      className={cn(userItemVariants({ variant }))}
      asChild
    >
      <Link href={`/workspace/${workspaceId}/member/${id}`}>
        <Avatar className="size-5 rounded-md">
          <AvatarFallback className="rounded-md bg-sky-500 text-white">
            {avatarFallback}
          </AvatarFallback>
          <AvatarImage className="rounded-md" src={image} />
        </Avatar>
        <span className="truncate text-sm">{label}</span>
      </Link>
    </Button>
  )
}
