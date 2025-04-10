'use client'

import emojiData from '@emoji-mart/data'
import EmojiPicker from '@emoji-mart/react'
import { type ReactNode, useState } from 'react'

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip'

interface EmojiPopoverProps {
  children: ReactNode
  hint?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onEmojiSelect: (emoji: any) => void
}

export function EmojiPopover({
  children,
  hint = 'Emoji',
  onEmojiSelect,
}: EmojiPopoverProps) {
  const [popoverOpen, setPopoverOpen] = useState(false)
  const [tooltipOpen, setTooltipOpen] = useState(false)

  // FIXME: The lib @emoji/mart doesn't provide the type of emoji
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function handleSelectEmoji(emoji: any) {
    onEmojiSelect(emoji)
    setPopoverOpen(false)

    setTimeout(() => {
      setTooltipOpen(false)
    }, 500)
  }

  return (
    <TooltipProvider>
      <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
        <Tooltip
          open={tooltipOpen}
          onOpenChange={setTooltipOpen}
          delayDuration={50}
        >
          <PopoverTrigger asChild>
            <TooltipTrigger asChild>{children}</TooltipTrigger>
          </PopoverTrigger>
          <TooltipContent className="border border-white/5 bg-black text-white">
            <p className="text-xs font-medium">{hint}</p>
          </TooltipContent>
        </Tooltip>
        <PopoverContent className="w-full border-none p-0 shadow-none">
          <EmojiPicker
            data={emojiData}
            onEmojiSelect={handleSelectEmoji}
            theme="light"
          />
        </PopoverContent>
      </Popover>
    </TooltipProvider>
  )
}
