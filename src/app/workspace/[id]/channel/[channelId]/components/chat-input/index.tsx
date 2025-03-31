'use client'

import dynamic from 'next/dynamic'

const Editor = dynamic(() => import('@/components/editor'), {
  ssr: false,
})

export function ChatInput() {
  return (
    <div className="w-full px-5">
      <Editor />
    </div>
  )
}
