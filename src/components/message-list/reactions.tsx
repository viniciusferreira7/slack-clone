import { SmilePlus } from 'lucide-react'

import { useCurrentMember } from '@/features/members/api/use-current-member'
import { useWorkspaceId } from '@/hooks/use-workspace-id'
import { cn } from '@/lib/utils'

import { Doc, type Id } from '../../../convex/_generated/dataModel'
import { EmojiPopover } from '../emoji-popover'
import { Hint } from '../hint'

interface ReactionsProps {
  reactions: Array<
    Omit<Doc<'reactions'>, 'memberId'> & {
      count: number
      memberIds: Id<'members'>[]
    }
  >
  onReactionChange: (reaction: string) => Promise<void>
}

export function Reactions({ reactions, onReactionChange }: ReactionsProps) {
  const workspaceId = useWorkspaceId()

  const { data: currentMember } = useCurrentMember({
    workspaceId,
  })

  if (!reactions.length || !currentMember?._id) {
    return null
  }

  return (
    <div className="mb-1 mt-1 flex items-center gap-1">
      {reactions.map((reaction) => {
        return (
          <Hint
            key={reaction._id}
            label={`${reaction.count} ${reaction.count === 1 ? 'person' : 'people'} reacted with ${reaction.value}`}
          >
            <button
              onClick={() => onReactionChange(reaction.value)}
              className={cn(
                'flex h-6 items-center gap-x-1 rounded-full border border-transparent bg-slate-200/70 px-2 text-slate-800',
                reaction.memberIds.includes(currentMember._id) &&
                  'border-blue-500 bg-blue-100/70 text-blue-500',
              )}
            >
              {reaction.value}
              <span
                className={
                  cn(
                    'text-xs font-semibold text-muted-foreground',
                    reaction.memberIds.includes(currentMember._id),
                  ) && 'text-blue-500'
                }
              >
                {reaction.count}
              </span>
            </button>
          </Hint>
        )
      })}
      <EmojiPopover
        hint="Add reaction"
        onEmojiSelect={(emoji) => onReactionChange(emoji.native)}
      >
        <button className="flex h-7 items-center rounded-full border border-transparent bg-slate-200/70 px-3 text-slate-800 hover:border-slate-500">
          <SmilePlus className="size-4" />
        </button>
      </EmojiPopover>
    </div>
  )
}
