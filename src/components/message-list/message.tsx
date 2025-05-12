import dayjs from 'dayjs'
import dynamic from 'next/dynamic'

import type { UseGetMessagesReturnType } from '@/features/messages/api/use-get-message'
import { isToday } from '@/utils/date/is-today'
import { isYesterday } from '@/utils/date/is-yesterday'

import type { Id } from '../../../convex/_generated/dataModel'
import { Hint } from '../hint'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'

const Renderer = dynamic(() => import('./renderer'), { ssr: false })

type MessageProps = UseGetMessagesReturnType[number] & {
  isEditing: boolean
  onEditingId: (id: Id<'messages'>) => void
  isCompact: boolean
  hideThreadButton: boolean
  isAuthor: boolean
}

export function Message(props: MessageProps) {
  function formatFullTime(date: Date) {
    const formattedDate = dayjs(date).format('MMM d, YYYY [ at ] hh:mm:ss A')

    if (isToday(date)) return `Today ${dayjs(date).format('[ at ] hh:mm:ss A')}`

    if (isYesterday(date))
      return `Yesterday ${dayjs(date).format('[ at ] hh:mm:ss A')}`

    return formattedDate
  }

  if (props.isCompact) {
    return (
      <div className="group relative flex flex-col gap-2 px-5 hover:bg-gray-100/60">
        <div className="flex items-start gap-2">
          <Hint label={formatFullTime(new Date(props._creationTime))}>
            <button className="w-[40px] text-center text-xs leading-[22px] text-muted-foreground opacity-0 hover:underline group-hover:opacity-100">
              {dayjs(new Date(props._creationTime)).format('HH:mm')}
            </button>
          </Hint>
          <div className="flex w-full flex-col">
            <Renderer value={props.body} />
            {props.updatedAt && (
              <span className="text-xs text-muted-foreground">(Edited)</span>
            )}
          </div>
        </div>
      </div>
    )
  }

  const avatarFallback = (props.user.name ?? 'Member').charAt(0).toUpperCase()

  return (
    <div className="group relative flex flex-col gap-2 px-5 hover:bg-gray-100/60">
      <div className="flex items-start gap-2">
        <button>
          <Avatar>
            <AvatarFallback className="rounded-md bg-sky-500 text-white">
              {avatarFallback}
            </AvatarFallback>
            <AvatarImage src={props.user.image} />
          </Avatar>
        </button>
        <div className="flex w-full flex-col overflow-hidden">
          <div className="text-sm">
            <button className="font-bold text-primary">
              {props.user.name}
            </button>
            <span>&nbsp;&nbsp;</span>
            <Hint label={formatFullTime(new Date(props._creationTime))}>
              <button className="text-sm text-muted-foreground hover:underline">
                {dayjs(new Date(props._creationTime)).format('hh:mm A')}
              </button>
            </Hint>
          </div>
          <Renderer value={props.body} />
          {props.updatedAt && (
            <span className="text-xs text-muted-foreground">(Edited)</span>
          )}
        </div>
      </div>
    </div>
  )
}
