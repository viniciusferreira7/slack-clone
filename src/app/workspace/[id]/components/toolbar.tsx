'use client'

import { Info, Search } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { ButtonWithTooltip } from '@/components/ui/button-with-tooltip'
import { useGetWorkspace } from '@/features/workspaces/api/use-get-workspace'
import { useWorkspaceId } from '@/hooks/use-workspace-id'

export function Toolbar() {
  const workspaceId = useWorkspaceId()
  const { data, isLoading } = useGetWorkspace({ id: workspaceId })

  return (
    <div className="bg-slack-purple-900 flex h-10 justify-between p-1.5">
      <div className="flex-1" />
      <div className="min-w-[280px] max-w-[642px] shrink grow-[2]">
        <Button
          disabled={isLoading}
          size="sm"
          className="h-7 w-full justify-start bg-accent/25 px-2 hover:bg-accent/25"
        >
          <Search className="mr-2 size-4 text-white" />
          <span className="text-xs text-white">Search {data?.name}</span>
        </Button>
      </div>
      <div className="ml-auto flex flex-1 items-center justify-end">
        <ButtonWithTooltip
          tooltip="Information"
          size="iconSm"
          variant="transparent"
        >
          <Info className="size-5 text-white" />
        </ButtonWithTooltip>
      </div>
    </div>
  )
}
