'use client'

import { AlertTriangle, Loader } from 'lucide-react'
import { useEffect } from 'react'
import { toast } from 'sonner'

import { useCreateOrGetConversation } from '@/features/conversations/api/use-create-or-get-conversation'

import type { Id } from '../../../../../../../convex/_generated/dataModel'

interface ConversationProps {
  workspaceId: string
  memberId: string
}

export function Conversation({ workspaceId, memberId }: ConversationProps) {
  const { data, mutate, isPending } = useCreateOrGetConversation()

  useEffect(() => {
    mutate(
      {
        workspaceId: workspaceId as Id<'workspaces'>,
        memberId: memberId as Id<'members'>,
      },
      {
        onError: () => {
          toast.error('Failed to load conversation')
        },
      },
    )
  }, [workspaceId, memberId, mutate])

  if (isPending) {
    return (
      <div className="grid h-full place-items-center">
        <Loader className="size-6 animate-spin text-muted-foreground"></Loader>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-y-2">
        <AlertTriangle className="size-5 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">Conversation not found</p>
      </div>
    )
  }

  return <div></div>
}
