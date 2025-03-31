'use client'

import 'quill/dist/quill.snow.css'

import { CaseSensitive, ImageIcon, Send, Smile } from 'lucide-react'
import Quill, { type Delta, type Op, type QuillOptions } from 'quill'
import { useEffect, useRef, type MutableRefObject, type RefObject } from 'react'

import { Hint } from './hint'
import { Button } from './ui/button'

interface EditorSubmitParams {
  image: File | null
  body:
}

interface EditorProps {
  variant?: 'create' | 'update'
  onSubmit: (params: EditorSubmitParams) => void
  onCancel?: () =>void
  placeholder?: string
  defaultValue?: Delta | Op[]
  disabled?: boolean
  innerRef?: RefObject <Quill | null>
}

export default function Editor({ variant = 'create' }: EditorProps) {
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
        <div className="z-[5] flex px-2 pb-2">
          <Hint label="Hide formatting">
            <Button disabled variant="ghost" size="iconSm">
              <CaseSensitive className="size-4" />
            </Button>
          </Hint>
          <Hint label="Emoji">
            <Button disabled variant="ghost" size="iconSm">
              <Smile className="size-4" />
            </Button>
          </Hint>
          {variant === 'create' && (
            <Hint label="Image">
              <Button disabled variant="ghost" size="iconSm">
                <ImageIcon className="size-4" />
              </Button>
            </Hint>
          )}
          {variant === 'update' && (
            <div className="ml-auto flex items-center gap-x-2">
              <Button variant="outline" size="sm" disabled>
                Cancel
              </Button>
              <Button
                className="ml-auto bg-[#007a5a] text-white hover:bg-[#007a5a]/80"
                size="sm"
                disabled
              >
                Save
              </Button>
            </div>
          )}
          {variant === 'create' && (
            <Button
              disabled
              className="ml-auto bg-[#007a5a] text-white hover:bg-[#007a5a]/80"
              size="iconSm"
            >
              <Send className="size-4" />
            </Button>
          )}
        </div>
      </div>
      <div className="ml-auto p-2 text-[10px] text-muted-foreground">
        <p>
          <strong>Shift + Return</strong> to add new line
        </p>
      </div>
    </div>
  )
}
