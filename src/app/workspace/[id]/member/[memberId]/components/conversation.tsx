'use client'

import { AlertTriangle, Loader } from 'lucide-react'
import { useEffect } from 'react'
import { toast } from 'sonner'

import { MessageList } from '@/components/message-list'
import { useCreateOrGetConversation } from '@/features/conversations/api/use-create-or-get-conversation'
import { useGetMember } from '@/features/members/api/use-get-member'
import { useGetMessages } from '@/features/messages/api/use-get-messages'

import type { Id } from '../../../../../../../convex/_generated/dataModel'
import { ChatInput } from './chat-input'
import { Header } from './header'

interface ConversationProps {
  workspaceId: string
  memberId: string
}

export function Conversation(props: ConversationProps) {
  const workspaceId = props.workspaceId as Id<'workspaces'>
  const memberId = props.memberId as Id<'members'>

  const { data: member, isLoading: isMemberLoading } = useGetMember({
    workspaceId,
    memberId,
  })

  const {
    data,
    mutate,
    isPending: isCreatingOrGettingConversation,
  } = useCreateOrGetConversation()

  const {
    results: messages,
    isLoading: isMessagesLoading,
    loadMore,
    status,
  } = useGetMessages({
    conversationId: data?.conversation._id,
  })

  useEffect(() => {
    mutate(
      {
        workspaceId,
        memberId,
      },
      {
        onError: () => {
          toast.error('Failed to load conversation')
        },
      },
    )
  }, [workspaceId, memberId, mutate])

  const isLoading =
    isCreatingOrGettingConversation ||
    isMemberLoading ||
    isMessagesLoading ||
    status === 'LoadingFirstPage'

  if (isLoading) {
    return (
      <div className="grid h-full place-items-center">
        <Loader className="size-6 animate-spin text-muted-foreground"></Loader>
      </div>
    )
  }

  if (!data || !member) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-y-2">
        <AlertTriangle className="size-5 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">Conversation not found</p>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col">
      <Header
        memberName={member?.user?.name}
        memberImage={member?.user?.image}
        onClick={() => {}}
      />
      {!messages.length ? (
        <div className="flex h-full flex-col items-center justify-center gap-y-2">
          <AlertTriangle className="size-5 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            There are no messages yet
          </p>
        </div>
      ) : (
        <MessageList
          memberName={member?.user?.name}
          memberImage={member?.user?.image}
          messages={messages}
          onLoadMore={loadMore}
          canLoadMore={status === 'CanLoadMore'}
          isLoadingMore={status === 'LoadingMore'}
          variant="conversation"
        />
      )}
      <ChatInput
        placeholder={`Message ${member?.user?.name}`}
        conversationId={data?.conversation._id}
      />
    </div>
  )
}
