'use client'

import dayjs from 'dayjs'
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
import { isToday } from '@/utils/date/is-today'
import { isYesterday } from '@/utils/date/is-yesterday'

import type { Id } from '../../../../convex/_generated/dataModel'
import { useCreateMessage } from '../api/use-create-message'
import { useGetMessage } from '../api/use-get-message'
import { useGetMessages } from '../api/use-get-messages'

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

const TIME_THRESHOLD = 5

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

  const {
    results: messages,
    isLoading: isMessagesLoading,
    status,
    loadMore,
  } = useGetMessages({
    channelId,
    parentMessageId: (parentMessageId as Id<'messages'>) ?? undefined,
  })

  const canLoadMore = status === 'CanLoadMore'
  const isLoadingMore = status === 'LoadingMore'

  const showPanel =
    !!parentMessageId ||
    isMessageLoading ||
    isCurrentMemberLoading ||
    isMessagesLoading ||
    status === 'LoadingFirstPage'

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

  function formatDateLabel(dateStr: string) {
    const date = dayjs(dateStr)

    if (isToday(dateStr)) return 'Today'
    if (isYesterday(dateStr)) return 'Yesterday'

    return date.format('ddd, MMMM d')
  }

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
                              isEditing={editingId === message._id}
                              onEditingId={setEditingId}
                              isCompact={isCompact}
                              hideThreadButton={true}
                              isAuthor={message.memberId === currentMember?._id}
                            />
                          )
                        })}
                      </div>
                    </div>
                  )
                })}
              <div
                ref={(el) => {
                  if (el) {
                    const observer = new IntersectionObserver(
                      ([entry]) => {
                        if (entry.isIntersecting && canLoadMore) {
                          loadMore()
                        }
                      },
                      { threshold: 1.0 },
                    )

                    observer.observe(el)

                    return () => observer.disconnect()
                  }
                }}
                className="h-1"
              />
              {isLoadingMore && (
                <div className="relative my-2 text-center">
                  <hr className="absolute left-0 right-0 top-1/2 border-t border-gray-300" />
                  <span className="relative inline-block rounded-full border border-gray-300 bg-white px-4 py-1 text-xs shadow-sm">
                    <Loader className="size-4 animate-spin" />
                  </span>
                </div>
              )}
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
