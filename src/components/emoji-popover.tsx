'use client'

import EmojiPicker, { type EmojiClickData } from 'emoji-picker-react'
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
  onEmojiSelect: (emoji: string) => void
}

export function EmojiPopover({
  children,
  hint = 'Emoji',
  onEmojiSelect,
}: EmojiPopoverProps) {
  const [popoverOpen, setPopoverOpen] = useState(false)
  const [tooltipOpen, setTooltipOpen] = useState(false)

  function handleSelectEmoji(value: EmojiClickData) {
    onEmojiSelect(value?.emoji)
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
          <EmojiPicker onEmojiClick={handleSelectEmoji} />
        </PopoverContent>
      </Popover>
    </TooltipProvider>
  )
}
