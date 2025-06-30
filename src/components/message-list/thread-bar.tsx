import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { ChevronRight } from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'

dayjs.extend(relativeTime)

interface ThreadProps {
  count?: number
  image?: string
  name?: string
  timestamp?: number
  onClick?: () => void
}

export function ThreadBar({
  count,
  image,
  name = 'Member',
  timestamp,
  onClick,
}: ThreadProps) {
  if (!count || !image || !timestamp) return null

  const avatarFallback = name.charAt(0).toUpperCase()

  return (
    <button
      className="group/thread-bar flex max-w-[600px] items-center justify-start rounded-md border border-transparent p-1 transition hover:border-border hover:bg-white"
      onClick={onClick}
    >
      <div className="flex items-center gap-2 overflow-hidden">
        <Avatar className="size-6 shrink-0">
          <AvatarImage src={image} />
          <AvatarFallback className="bg-sky-500 text-white">
            {avatarFallback}
          </AvatarFallback>
        </Avatar>
        <span className="truncate text-xs font-bold text-sky-700 hover:underline">
          {count} {count > 1 ? 'replies' : 'reply'}
        </span>
        <span className="block truncate text-xs text-muted-foreground group-hover/thread-bar:hidden">
          Last reply {dayjs().from(timestamp)}
        </span>
        <span className="hidden truncate text-xs text-muted-foreground group-hover/thread-bar:block">
          View thread
        </span>
      </div>
      <ChevronRight className="ml-auto size-5 shrink-0 text-muted-foreground opacity-0 transition group-hover/thread-bar:opacity-100" />
    </button>
  )
}
