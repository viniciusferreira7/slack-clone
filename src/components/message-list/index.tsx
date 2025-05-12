'use client'

import dayjs from 'dayjs'

import { useCurrentMember } from '@/features/members/api/use-current-member'
import type { UseGetMessagesReturnType } from '@/features/messages/api/use-get-message'
import { useWorkspaceId } from '@/hooks/use-workspace-id'
import { isToday } from '@/utils/date/is-today'
import { isYesterday } from '@/utils/date/is-yesterday'

import type { Doc } from '../../../convex/_generated/dataModel'
import { Message } from './message'

interface MessageListProps {
  channel: Doc<'channels'>
  messages: UseGetMessagesReturnType | undefined
  onLoadMore: () => void
  isLoadingMore: boolean
  canLoadMore: boolean
  variant?: 'channel' | 'thread' | 'conversation'
}

const TIME_THRESHOLD = 5

export function MessageList({
  channel,
  messages,
  onLoadMore,
  isLoadingMore,
  canLoadMore,
  variant = 'channel',
}: MessageListProps) {
  const groupedMessages = messages?.reduce(
    (groups, message) => {
      if (!message) return groups

      const date = new Date(message?._creationTime)
      const dateKey = dayjs(date).format('YYYY-MM-DD')

      if (!groups[dateKey]) {
        groups[dateKey] = []
      }

      groups[dateKey].unshift(message)

      return groups
    },
    {} as Record<string, typeof messages>,
  )

  function formatDateLabel(dateStr: string) {
    const date = dayjs(dateStr)

    if (isToday(dateStr)) return 'Today'
    if (isYesterday(dateStr)) return 'Yesterday'

    return date.format('ddd, MMMM d')
  }

  const workspaceId = useWorkspaceId()

  const { data: member } = useCurrentMember({
    workspaceId,
  })

  return (
    <div className="messages-scrollbar flex flex-1 flex-col-reverse overflow-y-auto pb-4">
      {groupedMessages &&
        Object.entries(groupedMessages).map(([dateKey, messages]) => {
          return (
            <div key={dateKey}>
              <div className="relative my-2 text-center">
                <hr className="absolute left-0 right-0 top-1/2 border-t border-gray-300" />
                <span className="relative inline-block rounded-full border border-gray-300 bg-white px-4 py-1 text-xs shadow-sm">
                  {formatDateLabel(dateKey)}
                </span>
              </div>
              <div className="flex flex-col gap-3">
                {messages?.map((message, index, originalMessages) => {
                  if (!message?.member || !message?.user) return null

                  const prevMessage = originalMessages[index - 1]

                  const diffInMinutes = prevMessage
                    ? dayjs(new Date(message._creationTime)).diff(
                        new Date(prevMessage._creationTime),
                        'minutes',
                      )
                    : 6

                  const isCompact =
                    !!prevMessage &&
                    prevMessage.user._id === message.user._id &&
                    diffInMinutes < TIME_THRESHOLD
                  return (
                    <Message
                      key={message?._id}
                      {...message}
                      isEditing={false}
                      onEditingId={() => {}}
                      isCompact={isCompact}
                      hideThreadButton={false}
                      isAuthor={message.memberId === member?._id}
                    />
                  )
                })}
              </div>
            </div>
          )
        })}
    </div>
  )
}
