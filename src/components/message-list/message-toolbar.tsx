import { MessageSquareIcon, Pencil, Smile, Trash } from 'lucide-react'

import { EmojiPopover } from '../emoji-popover'
import { Hint } from '../hint'
import { Button } from '../ui/button'

interface MessageToolbarProps {
  isAuthor: boolean
  isPending: boolean
  onEdit: () => void
  onThread: () => void
  onDelete: () => void
  onReaction: (emoji: string) => void //eslint-disable-line
  hideThreadButton: boolean
}

export function MessageToolbar({
  isAuthor,
  isPending,
  onEdit,
  onThread,
  onDelete,
  onReaction,
  hideThreadButton,
}: MessageToolbarProps) {
  return (
    <div className="absolute right-5 top-0">
      <div className="rounded-md border border-white opacity-0 shadow-md transition-opacity group-hover:opacity-100">
        <EmojiPopover hint="Add reaction" onEmojiSelect={onReaction}>
          <Button variant="ghost" size="iconSm" disabled={isPending}>
            <Smile className="size-4" />
          </Button>
        </EmojiPopover>
        {!hideThreadButton && (
          <Hint label="Reply in thread">
            <Button
              variant="ghost"
              size="iconSm"
              disabled={isPending}
              onClick={onThread}
            >
              <MessageSquareIcon className="size-4" />
            </Button>
          </Hint>
        )}
        {isAuthor && (
          <Hint label="Edit message">
            <Button
              variant="ghost"
              size="iconSm"
              disabled={isPending}
              onClick={onEdit}
            >
              <Pencil className="size-4" />
            </Button>
          </Hint>
        )}
        <Hint label="Delete message">
          <Button
            variant="ghost"
            size="iconSm"
            disabled={isPending}
            onClick={onDelete}
          >
            <Trash className="size-4" />
          </Button>
        </Hint>
      </div>
    </div>
  )
}
