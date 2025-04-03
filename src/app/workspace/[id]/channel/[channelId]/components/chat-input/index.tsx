'use client'

import dynamic from 'next/dynamic'
import Quill from 'quill'
import { useRef } from 'react'

const Editor = dynamic(() => import('@/components/editor'), {
  ssr: false,
})

interface ChatInputProps {
  placeholder: string
}

export function ChatInput({ placeholder }: ChatInputProps) {
  const editorRef = useRef<Quill | null>(null)

  return (
    <div className="w-full px-5">
      <Editor
        placeholder={placeholder}
        onSubmit={() => {}}
        innerRef={editorRef}
      />
    </div>
  )
}
