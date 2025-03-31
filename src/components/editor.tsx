'use client'

import 'quill/dist/quill.snow.css'

import Quill, { type QuillOptions } from 'quill'
import { useEffect, useRef } from 'react'

export default function Editor() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const container = containerRef.current
    const editorContainer = container.appendChild(
      container.ownerDocument.createElement('div'),
    )

    const options: QuillOptions = {
      theme: 'snow',
    }

    const _quill = new Quill(editorContainer, options)

    return () => {
      if (container) {
        container.innerHTML = ''
      }
    }
  }, [])

  return (
    <div className="flex flex-col">
      <div className="flex flex-col overflow-hidden rounded-md border border-slate-200 bg-white transition focus-within:border-slate-300 focus-within:shadow-sm">
        <div ref={containerRef} className="ql-custom h-full" />
      </div>
    </div>
  )
}
