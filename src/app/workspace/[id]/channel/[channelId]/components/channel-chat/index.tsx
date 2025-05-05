'use client'

import { useGetMessages } from '@/features/messages/api/use-get-message'

import type { Doc } from '../../../../../../../../convex/_generated/dataModel'
import { ChatInput } from './chat-input'

interface ChannelChatProps {
  channel: Doc<'channels'>
}

export function ChannelChat({ channel }: ChannelChatProps) {
  const { results } = useGetMessages({ channelId: channel._id })

  return (
    <div>
      <div>{JSON.stringify(results, null, 2)}</div>
      <ChatInput />
    </div>
  )
}
