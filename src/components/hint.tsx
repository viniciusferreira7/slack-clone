import type { ReactNode } from 'react'

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip'

interface HintProps {
  label: string
  children: ReactNode
  side?: 'top' | 'left' | 'bottom' | 'right'
  align?: 'start' | 'center' | 'end'
}

export function Hint({ label, children, side, align }: HintProps) {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={50}>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent
          side={side}
          align={align}
          className="border border-white bg-black text-white"
        >
          <p className="text-xs font-medium">{label}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
