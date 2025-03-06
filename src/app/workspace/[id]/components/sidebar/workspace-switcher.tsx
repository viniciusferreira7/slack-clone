'use client'

import { Loader, Plus } from 'lucide-react'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useGetWorkspace } from '@/features/workspaces/api/use-get-workspace'
import { useGetWorkspaces } from '@/features/workspaces/api/use-get-workspaces'
import { CreateWorkspaceModal } from '@/features/workspaces/components/create-workspace-modal'
import { useCreateWorkspaceModal } from '@/features/workspaces/store/use-create-workspace-modal'
import { useWorkspaceId } from '@/hooks/use-workspace-id'

export function WorkspaceSwitcher() {
  const workspaceId = useWorkspaceId()
  const [openModal, setOpenModal] = useCreateWorkspaceModal()

  const { data: workspace, isLoading: isWorkspaceLoading } = useGetWorkspace({
    id: workspaceId,
  })

  const { data: workspaces, isLoading: isWorkspacesLoading } =
    useGetWorkspaces()

  const filteredWorkspace = workspaces?.filter(
    (workspace) => workspace._id !== workspaceId,
  )

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          asChild
          disabled={isWorkspaceLoading || isWorkspacesLoading}
        >
          <Button className="relative size-9 overflow-hidden bg-slack-gray-400 text-xl font-bold text-slate-800 hover:bg-slack-gray-400/80">
            {isWorkspaceLoading ? (
              <Loader className="size-5 shrink-0 animate-spin" />
            ) : (
              workspace?.name.charAt(0).toUpperCase()
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="bottom" align="start" className="w-64">
          <DropdownMenuGroup>
            <DropdownMenuItem
              className="flex cursor-pointer flex-col items-start justify-start capitalize"
              asChild
            >
              <Link href={`/workspace/${workspaceId}`}>
                {workspace?.name}{' '}
                <span className="text-xs text-muted-foreground">
                  Active Workspace
                </span>
              </Link>
            </DropdownMenuItem>
            {!!filteredWorkspace?.length && <DropdownMenuSeparator />}
            {filteredWorkspace?.map((workspace) => {
              return (
                <DropdownMenuItem
                  key={workspace._id}
                  className="flex cursor-pointer capitalize"
                  asChild
                >
                  <Link href={`/workspace/${workspace._id}`}>
                    <div className="relative flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-md bg-slack-gray-600 text-xl font-bold text-white hover:bg-slack-gray-400/80">
                      {workspace?.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="max-w-36 truncate">{workspace?.name}</span>
                  </Link>
                </DropdownMenuItem>
              )
            })}
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => setOpenModal(true)}
            >
              <div className="text-ls relative mr-2 flex size-9 items-center justify-center overflow-hidden rounded-md bg-slack-gray-200 font-semibold text-slate-800">
                <Plus />
              </div>
              Create new workspace
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <CreateWorkspaceModal open={openModal} />
    </>
  )
}
