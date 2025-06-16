'use client'

import { AlertTriangle, Loader, XIcon } from 'lucide-react'

import { Message } from '@/components/message-list/message'
import { Button } from '@/components/ui/button'
import { ResizableHandle, ResizablePanel } from '@/components/ui/resizable'
import { useCurrentMember } from '@/features/members/api/use-current-member'
import { usePanel } from '@/hooks/use-panel'
import { useWorkspaceId } from '@/hooks/use-workspace-id'

import type { Id } from '../../../../convex/_generated/dataModel'
import { useGetMessage } from '../api/use-get-message'

export function Thread() {
  const { parentMessageId, onClose } = usePanel()

  const { data: message, isLoading: isMessageLoading } = useGetMessage({
    messageId: parentMessageId as Id<'messages'>,
  })

  const workspaceId = useWorkspaceId()

  const { data: currentMember, isLoading: isCurrentMemberLoading } =
    useCurrentMember({
      workspaceId,
    })

  const showPanel =
    !!parentMessageId || isMessageLoading || isCurrentMemberLoading

  if (!parentMessageId) {
    return null
  }

  return (
    <>
      <ResizableHandle withHandle />
      <ResizablePanel minSize={20} defaultSize={20}>
        {!message && !isMessageLoading && (
          <div className="flex h-full flex-col">
            <div className="flex min-h-[49px] items-center justify-between border-b px-4">
              <p className="text-lg font-bold">Thread</p>
              <Button variant="ghost" size="iconSm" onClick={onClose}>
                <XIcon className="size-5 stroke-[1.5]" />
              </Button>
            </div>
            <div className="flex h-full flex-col items-center justify-center gap-y-2">
              <AlertTriangle className="size-5 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Message not found</p>
            </div>
          </div>
        )}
        {showPanel && !!message ? (
          <div className="flex h-full flex-col">
            <div className="flex min-h-[49px] items-center justify-between border-b px-4">
              <p className="text-lg font-bold">Thread</p>
              <Button variant="ghost" size="iconSm" onClick={onClose}>
                <XIcon className="size-5 stroke-[1.5]" />
              </Button>
            </div>
            <Message
              {...message}
              hideThreadButton
              memberId={message.memberId}
              isEditing={false}
              isCompact={false}
              isAuthor={currentMember?._id === message.memberId}
              reactions={message.reactions}
              onEditingId={() => {}}
              threadCount={0}
              threadImage={undefined}
              threadTimestamp={0}
            />
          </div>
        ) : (
          <div className="grid h-full place-items-center">
            <Loader className="size-5 animate-spin text-muted-foreground" />
          </div>
        )}
      </ResizablePanel>
    </>
  )
}
