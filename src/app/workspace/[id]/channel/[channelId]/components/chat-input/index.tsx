'use client'

import dynamic from 'next/dynamic'
import Quill from 'quill'
import { useRef, useState } from 'react'
import { toast } from 'sonner'

import { useCreateMessage } from '@/features/messages/api/use-create-message'
import { useChannelId } from '@/hooks/use-channel-id'
import { useWorkspaceId } from '@/hooks/use-workspace-id'

const Editor = dynamic(() => import('@/components/editor'), {
  ssr: false,
})

interface HandleSubmitParams {
  body: string
  image: File | null
}

interface ChatInputProps {
  placeholder: string
}

export function ChatInput({ placeholder }: ChatInputProps) {
  const editorRef = useRef<Quill | null>(null)
  const [editorKey, setEditorKey] = useState(0)
  const [isPending, setIsPending] = useState(false)

  const workspaceId = useWorkspaceId()
  const channelId = useChannelId()
  const { mutate } = useCreateMessage()

  async function handleSubmit({ body, image }: HandleSubmitParams) {
    setIsPending(true)

    try {
      await mutate(
        {
          body,
          workspaceId,
          channelId,
        },
        {
          throwError: true,
        },
      )

      setEditorKey((prevKey) => prevKey + 1)
    } catch (err) {
      toast.error('failed to send message')
    } finally {
      setIsPending(false)
    }
  }

  return (
    <div className="w-full px-5">
      <Editor
        key={editorKey}
        placeholder={placeholder}
        onSubmit={handleSubmit}
        innerRef={editorRef}
        disabled={isPending}
      />
    </div>
  )
}
