'use client'

import { AlertTriangle, Loader, XIcon } from 'lucide-react'
import dynamic from 'next/dynamic'
import type Quill from 'quill'
import { useRef, useState } from 'react'
import { toast } from 'sonner'

import { Message } from '@/components/message-list/message'
import { Button } from '@/components/ui/button'
import { ResizableHandle, ResizablePanel } from '@/components/ui/resizable'
import { useCurrentMember } from '@/features/members/api/use-current-member'
import { useGenerateUploadUrl } from '@/features/upload/api/use-generate-upload-url'
import { useChannelId } from '@/hooks/use-channel-id'
import { usePanel } from '@/hooks/use-panel'
import { useWorkspaceId } from '@/hooks/use-workspace-id'

import type { Id } from '../../../../convex/_generated/dataModel'
import { useCreateMessage } from '../api/use-create-message'
import { useGetMessage } from '../api/use-get-message'

const Editor = dynamic(() => import('@/components/editor'), {
  ssr: false,
})

interface HandleSubmitParams {
  body: string
  image: File | null
}

interface CreateMessageValues {
  channelId: Id<'channels'>
  workspaceId: Id<'workspaces'>
  parentMessageId: Id<'messages'>
  body: string
  image?: Id<'_storage'>
}

export function Thread() {
  const [editingId, setEditingId] = useState<Id<'messages'> | null>(null)

  const editorRef = useRef<Quill | null>(null)
  const [editorKey, setEditorKey] = useState(0)
  const [isPending, setIsPending] = useState(false)

  const { parentMessageId, onClose } = usePanel()

  const { data: message, isLoading: isMessageLoading } = useGetMessage({
    messageId: parentMessageId as Id<'messages'>,
  })

  const channelId = useChannelId()

  const { mutate } = useCreateMessage()
  const { mutate: generateUploadUrl, data: url } = useGenerateUploadUrl()

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

  async function handleSubmit({ body, image }: HandleSubmitParams) {
    if (!parentMessageId) return

    setIsPending(true)
    editorRef?.current?.enable(false)

    try {
      const values: CreateMessageValues = {
        channelId,
        parentMessageId: parentMessageId as Id<'messages'>,
        body,
        workspaceId,
      }

      if (image) {
        await generateUploadUrl({ throwError: true })

        if (!url) throw new Error('Url not found')

        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': image.type },
          body: image,
        })

        if (!response.ok) {
          throw new Error('Failed to upload image')
        }

        const { storageId } = await response.json()

        values.image = storageId
      }

      await mutate(values, {
        throwError: true,
      })

      setEditorKey((prevKey) => prevKey + 1)
    } catch (err) {
      toast.error('failed to send message')
    } finally {
      setIsPending(false)
      editorRef?.current?.enable(true)
    }
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
            <div>
              <Message
                {...message}
                hideThreadButton
                memberId={message.memberId}
                isEditing={editingId === message._id}
                isCompact={false}
                isAuthor={message.memberId === currentMember?._id}
                reactions={message.reactions}
                onEditingId={setEditingId}
                threadCount={0}
                threadImage={undefined}
                threadTimestamp={0}
              />
            </div>
            <div className="px-4">
              <Editor
                key={editorKey}
                innerRef={editorRef}
                onSubmit={handleSubmit}
                disabled={isPending}
                placeholder="Reply..."
              />
            </div>
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
