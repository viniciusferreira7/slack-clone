import { ChevronDown, ListFilter, SquarePen } from 'lucide-react'

import { Hint } from '@/components/hint'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import type { Doc } from '../../../../../../convex/_generated/dataModel'

interface WorkspaceHeaderProps {
  workspace: Doc<'workspaces'>
  isAdmin: boolean
}

export function WorkspaceHeader({ workspace, isAdmin }: WorkspaceHeaderProps) {
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
              <p className="text-xs text-muted-foreground">Active workspace</p>
            </div>
          </DropdownMenuItem>
          {isAdmin && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer">
                Invite people to {workspace.name}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer">
                Preferences
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      <div className="flex items-center gap-0.5">
        <Hint label="Filter conversation" side="bottom">
          <Button variant="transparent" size="iconSm">
            <ListFilter className="size-4" />
            <span className="sr-only">Filter</span>
          </Button>
        </Hint>
        <Hint label="New message" side="bottom">
          <Button variant="transparent" size="iconSm">
            <SquarePen className="size-4" />
            <span className="sr-only">Edit</span>
          </Button>
        </Hint>
      </div>
    </div>
  )
}
