import { ChevronDown, PlusIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { useToggle } from 'react-use'

import { Hint } from '@/components/hint'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface WorkspaceSection {
  children: ReactNode
  label: string
  hint: string
  onNew?: () => void
}

export function WorkspaceSection({
  children,
  label,
  hint,
  onNew,
}: WorkspaceSection) {
  const [on, toggle] = useToggle(true)

  return (
    <div className="mt-3 flex flex-col px-2">
      <div className="group flex items-center px-3.5">
        <Button
          variant="transparent"
          className="size-6 shrink-0 p-0.5 text-slack-purple-100"
          onClick={toggle}
        >
          <ChevronDown
            className={cn('size-4 transition-transform', on && '-rotate-90')}
          />
        </Button>
        <Button
          variant="transparent"
          size="sm"
          className="group h-[28px] items-center justify-start overflow-hidden px-1.5 text-sm text-slack-purple-100"
        >
          <span className="truncate">{label}</span>
        </Button>

        {onNew && (
          <Hint label={hint} side="top" align="center">
            <Button
              onClick={onNew}
              variant="transparent"
              size="iconSm"
              className="ml-auto size-6 shrink-0 p-0.5 text-sm text-slack-purple-100 opacity-0 transition-opacity group-hover:opacity-100"
            >
              <PlusIcon className="size-5" />
            </Button>
          </Hint>
        )}
      </div>
      {on && children}
    </div>
  )
}
