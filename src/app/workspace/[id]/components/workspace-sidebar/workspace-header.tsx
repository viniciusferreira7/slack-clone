import { ChevronDown } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import type { Doc } from '../../../../../../convex/_generated/dataModel'

interface WorkspaceHeaderProps {
  workspace: Doc<'workspaces'>
}

export function WorkspaceHeader({ workspace }: WorkspaceHeaderProps) {
  console.log({ workspace })

  return (
    <div className="flex items-center justify-between px-4">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="transparent"
            className="w-auto overflow-hidden p-1.5 text-lg font-semibold"
            size="sm"
          >
            <span className="truncate">{workspace.name}</span>
            <ChevronDown className="ml-1 size-4 shrink-0" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="bottom" align="start" className="w-64">
          <DropdownMenuItem className="cursor-pointer capitalize">
            <div className="relative mr-2 flex size-9 items-center justify-center overflow-hidden rounded-md bg-slack-gray-600 text-xl font-semibold text-white">
              {workspace.name?.charAt(0).toUpperCase()}
            </div>
            <div className="flex flex-col items-start">
              <p className="font-bold">{workspace.name}</p>
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
