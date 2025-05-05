'use client'

import dynamic from 'next/dynamic'
import Quill from 'quill'
import { useRef, useState } from 'react'
import { toast } from 'sonner'

import { useCreateMessage } from '@/features/messages/api/use-create-message'
import { useGenerateUploadUrl } from '@/features/upload/api/use-generate-upload-url'
import { useChannelId } from '@/hooks/use-channel-id'
import { useWorkspaceId } from '@/hooks/use-workspace-id'

import type { Id } from '../../../../../../../../../convex/_generated/dataModel'

const Editor = dynamic(() => import('@/components/editor'), {
  ssr: false,
})

interface HandleSubmitParams {
  body: string
  image: File | null
}

interface ChatInputProps {
  placeholder?: string
  disabled?: boolean
}

interface CreateMessageValues {
  channelId: Id<'channels'>
  workspaceId: Id<'workspaces'>
  body: string
  image?: Id<'_storage'>
}

export function ChatInput({ placeholder, disabled }: ChatInputProps) {
  const editorRef = useRef<Quill | null>(null)
  const [editorKey, setEditorKey] = useState(0)
  const [isPending, setIsPending] = useState(false)

  const workspaceId = useWorkspaceId()
  const channelId = useChannelId()
  const { mutate } = useCreateMessage()
  const { mutate: generateUploadUrl, data: url } = useGenerateUploadUrl()

  async function handleSubmit({ body, image }: HandleSubmitParams) {
    setIsPending(true)
    editorRef?.current?.enable(false)

    try {
      const values: CreateMessageValues = {
        channelId,
        workspaceId,
        body,
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
    <div className="w-full px-5">
      <Editor
        key={editorKey}
        placeholder={placeholder}
        onSubmit={handleSubmit}
        innerRef={editorRef}
        disabled={isPending || disabled}
      />
    </div>
  )
}
