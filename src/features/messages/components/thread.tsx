'use client'

import { Loader, XIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { ResizableHandle, ResizablePanel } from '@/components/ui/resizable'
import { usePanel } from '@/hooks/use-panel'

export function Thread() {
  const { parentMessageId, onClose } = usePanel()

  const showPanel = !!parentMessageId

  if (!showPanel) {
    return null
  }

  return (
    <>
      <ResizableHandle withHandle />
      <ResizablePanel minSize={20} defaultSize={20}>
        {parentMessageId ? (
          <div className="flex h-full flex-col">
            <div className="flex min-h-[49px] items-center justify-between border-b px-4">
              <p className="text-lg font-bold">Thread</p>
              <Button variant="ghost" size="iconSm" onClick={onClose}>
                <XIcon className="size-5 stroke-[1.5]" />
              </Button>
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
