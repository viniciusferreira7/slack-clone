'use client'

import { Loader } from 'lucide-react'

import { MessageList } from '@/components/message-list'
import { useGetMessages } from '@/features/messages/api/use-get-messages'

import type { Doc } from '../../../../../../../../convex/_generated/dataModel'
import { ChatInput } from './chat-input'

interface ChannelChatProps {
  channel: Doc<'channels'>
}

export function ChannelChat({ channel }: ChannelChatProps) {
  const { results, status, loadMore, isLoading } = useGetMessages({
    channelId: channel._id,
  })

  if (isLoading && status === 'LoadingFirstPage') {
    return (
      <div className="flex h-full flex-col">
        <div className="grid h-full place-items-center">
          <Loader className="size-6 animate-spin text-muted-foreground" />
        </div>
        <ChatInput disabled />
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col overflow-y-auto">
      <MessageList
        channel={channel}
        messages={results}
        onLoadMore={loadMore}
        isLoadingMore={status === 'LoadingMore'}
        canLoadMore={status === 'CanLoadMore'}
      />
      <ChatInput />
    </div>
  )
}
