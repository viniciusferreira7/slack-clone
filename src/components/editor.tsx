'use client'

import 'quill/dist/quill.snow.css'

import { CaseSensitive, ImageIcon, Send, Smile, XIcon } from 'lucide-react'
import Image from 'next/image'
import Quill, { type Delta, type Op, type QuillOptions } from 'quill'
import {
  type RefObject,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import { toast } from 'sonner'

import { cn } from '@/lib/utils'

import { EmojiPopover } from './emoji-popover'
import { Hint } from './hint'
import { Button } from './ui/button'

interface EditorSubmitParams {
  image: File | null
  body: string
}

interface EditorProps {
  variant?: 'create' | 'update'
  onSubmit: (params: EditorSubmitParams) => void
  onCancel?: () => void
  placeholder?: string
  defaultValue?: Delta | Op[]
  disabled?: boolean
  innerRef?: RefObject<Quill | null>
}

export default function Editor({
  variant = 'create',
  onSubmit,
  onCancel,
  placeholder = 'Write something...',
  defaultValue = [],
  disabled = false,
  innerRef,
}: EditorProps) {
  const [text, setText] = useState('')
  const [isToolbarVisible, setIsToolbarVisible] = useState(true)
  const [image, setImage] = useState<File | null>(null)

  const containerRef = useRef<HTMLDivElement>(null)
  const submitRef = useRef(onSubmit)
  const placeholderRef = useRef(placeholder)
  const quillRef = useRef<Quill | null>(null)
  const defaultValueRef = useRef(defaultValue)
  const disabledRef = useRef(disabled)
  const imageElementRef = useRef<HTMLInputElement>(null)

  useLayoutEffect(() => {
    submitRef.current = onSubmit
    placeholderRef.current = placeholder
    defaultValueRef.current = defaultValue
    disabledRef.current = disabled
  })

  useEffect(() => {
    if (!containerRef.current) return

    const container = containerRef.current
    const editorContainer = container.appendChild(
      container.ownerDocument.createElement('div'),
    )

    const options: QuillOptions = {
      theme: 'snow',
      placeholder: placeholderRef.current,
      modules: {
        toolbar: [
          ['bold', 'strike', 'italic'],
          ['link'],
          [{ list: 'ordered' }, { list: 'bullet' }],
        ],
        keyboard: {
          bindings: {
            enter: {
              key: 'Enter',
              handler: () => {
                const text = quill.getText()
                const addedImage = imageElementRef?.current?.files?.[0] ?? null

                const isEmpty =
                  !addedImage &&
                  text.replace(/<(.|\n)*?>/g, '').trim().length === 0

                if (isEmpty) return

                const body = JSON.stringify(quill.getContents())

                if (submitRef) {
                  submitRef.current?.({ body, image: addedImage })
                }
              },
            },
            shift_enter: {
              key: 'Enter',
              shiftKey: true,
              handler: () => {
                quill.insertText(quill.getSelection()?.index || 0, '\n')
              },
            },
          },
        },
      },
    }

    const quill = new Quill(editorContainer, options)
    quillRef.current = quill
    quillRef.current.focus()

    if (innerRef) {
      innerRef.current = quill
    }

    quill.setContents(defaultValueRef.current)
    setText(quill.getText())

    quill.on(Quill.events.TEXT_CHANGE, () => {
      setText(quill.getText())
    })

    return () => {
      quill.off(Quill.events.TEXT_CHANGE)

      if (container) {
        container.innerHTML = ''
      }

      if (quillRef.current) {
        quillRef.current = null
      }

      if (innerRef) {
        innerRef.current = null
      }
    }
  }, [innerRef])

  const toggleToolbar = () => {
    setIsToolbarVisible((state) => !state)
    const toolbarElement = containerRef.current?.querySelector('.ql-toolbar')

    if (toolbarElement) {
      toolbarElement.classList.toggle('hidden')
    }
  }

  // FIXME: The lib @emoji/mart doesn't provide the type of emoji
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function handleSelectEmoji(emoji: any) {
    const quill = quillRef.current

    if (quill) {
      quill.insertText(quill.getSelection()?.index || 0, emoji?.native)
    }
  }

  const isEmpty = !image && text.replace(/<(.|\n)*?>/g, '').trim().length === 0

  function handleSelectImage(uploadedFile: File | null) {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    const maxSizeInBytes = 5 * 1024 * 1024 // 5MB

    if (!uploadedFile) return

    const isAllowedType = allowedTypes.includes(uploadedFile.type)
    const isAllowedSize = uploadedFile.size <= maxSizeInBytes

    if (isAllowedType && isAllowedSize) {
      setImage(uploadedFile)
    } else {
      toast.error(
        'Invalid image. Allowed types: JPG, PNG, WEBP, GIF. Max: 5MB.',
      )
    }
  }

  return (
    <div className="flex flex-col">
      <input
        ref={imageElementRef}
        type="file"
        accept="image/jpeg, image/png, image/webp, image/gif"
        onChange={(event) =>
          handleSelectImage(event?.target?.files?.[0] || null)
        }
        className="hidden"
      />
      <div
        className={cn(
          'flex flex-col overflow-hidden rounded-md border border-slate-200 bg-white transition focus-within:border-slate-300 focus-within:shadow-sm',
          disabled && 'opacity-50',
        )}
      >
        <div ref={containerRef} className="ql-custom h-full" />
        {!!image && (
          <div className="p-2">
            <div className="group/image relative grid size-[62px] place-items-center">
              <Hint label="Remove image">
                <button
                  className="absolute -right-2.5 -top-2.5 z-[4] hidden items-center rounded-full border-2 border-white bg-black/70 text-white hover:bg-black group-hover/image:flex"
                  onClick={() => {
                    setImage(null)
                    if (imageElementRef.current?.value) {
                      imageElementRef.current.value = ''
                    }
                  }}
                >
                  <span className="sr-only">remove image</span>
                  <XIcon className="size-3.5" />
                </button>
              </Hint>
              <Image
                alt={`Uploaded: ${image.name}`}
                src={URL.createObjectURL(image)}
                fill
                className="overflow-hidden rounded-xl border object-cover"
              />
            </div>
          </div>
        )}
        <div className="z-[5] flex px-2 pb-2">
          <Hint
            label={isToolbarVisible ? 'Hide formatting' : 'Show formatting'}
          >
            <Button
              disabled={disabled}
              variant="ghost"
              size="iconSm"
              onClick={toggleToolbar}
            >
              <CaseSensitive className="size-4" />
            </Button>
          </Hint>
          <EmojiPopover hint="Emoji" onEmojiSelect={handleSelectEmoji}>
            <Button disabled={disabled} variant="ghost" size="iconSm">
              <Smile className="size-4" />
            </Button>
          </EmojiPopover>
          {variant === 'create' && (
            <Hint label="Image">
              <Button
                disabled={disabled}
                variant="ghost"
                size="iconSm"
                onClick={() => {
                  if (imageElementRef?.current) {
                    imageElementRef?.current?.click()
                  }
                }}
              >
                <ImageIcon className="size-4" />
              </Button>
            </Hint>
          )}
          {variant === 'update' && (
            <div className="ml-auto flex items-center gap-x-2">
              <Button
                variant="outline"
                size="sm"
                disabled={disabled || !onCancel}
                onClick={onCancel}
              >
                Cancel
              </Button>
              <Button
                className={cn(
                  'ml-auto',
                  isEmpty
                    ? 'bg-white text-muted-foreground hover:bg-white'
                    : 'bg-[#007a5a] text-white hover:bg-[#007a5a]/80',
                )}
                size="sm"
                disabled={disabled || isEmpty}
                onClick={() => {
                  onSubmit({
                    body: JSON.stringify(quillRef.current?.getContents()),
                    image,
                  })
                }}
              >
                Save
              </Button>
            </div>
          )}
          {variant === 'create' && (
            <Button
              className={cn(
                'ml-auto',
                isEmpty
                  ? 'bg-white text-muted-foreground hover:bg-white'
                  : 'bg-[#007a5a] text-white hover:bg-[#007a5a]/80',
              )}
              size="iconSm"
              disabled={disabled || isEmpty}
              onClick={() => {
                onSubmit({
                  body: JSON.stringify(quillRef.current?.getContents()),
                  image,
                })
              }}
            >
              <Send className="size-4" />
            </Button>
          )}
        </div>
      </div>
      {variant === 'create' && (
        <div
          className={cn(
            'ml-auto p-2 text-[10px] text-muted-foreground opacity-0 transition',
            isEmpty && 'opacity-100',
          )}
        >
          <p>
            <strong>Shift + Return</strong> to add new line
          </p>
        </div>
      )}
    </div>
  )
}
