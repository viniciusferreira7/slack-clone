'use client'

import type { UseGetMessagesReturnType } from '@/features/messages/api/use-get-message'

import type { Doc } from '../../../convex/_generated/dataModel'

interface MessageListProps {
  channel: Doc<'channels'>
  messages: UseGetMessagesReturnType | undefined
  onLoadMore: () => void
  isLoadingMore: boolean
  canLoadMore: boolean
  variant?: 'channel' | 'thread' | 'conversation'
}

export function MessageList({
  channel,
  messages,
  onLoadMore,
  isLoadingMore,
  canLoadMore,
  variant = 'channel',
}: MessageListProps) {
  return <div className="flex flex-1 flex-col-reverse"></div>
}
