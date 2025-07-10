'use client'

import { Info, Search } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { ButtonWithTooltip } from '@/components/ui/button-with-tooltip'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'
import { useGetChannels } from '@/features/channels/api/use-get-channels'
import { useGetMembers } from '@/features/members/api/use-get-members'
import { useGetWorkspace } from '@/features/workspaces/api/use-get-workspace'
import { useWorkspaceId } from '@/hooks/use-workspace-id'

export function Toolbar() {
  const [open, setOpen] = useState(false)
  const workspaceId = useWorkspaceId()
  const { data, isLoading: isWorkspaceLoading } = useGetWorkspace({
    id: workspaceId,
  })

  const { data: channels, isLoading: isChannelsLoading } = useGetChannels({
    workspaceId,
  })

  const { data: members, isLoading: isMembersLoading } = useGetMembers({
    workspaceId,
  })

  const isLoading = isChannelsLoading || isMembersLoading || isWorkspaceLoading

  return (
    <div className="flex h-10 justify-between bg-slack-purple-900 p-1.5">
      <div className="flex-1" />
      <div className="min-w-[280px] max-w-[642px] shrink grow-[2]">
        <Button
          disabled={isLoading}
          size="sm"
          className="h-7 w-full justify-start bg-accent/25 px-2 hover:bg-accent/25"
          onClick={() => setOpen(true)}
        >
          <Search className="mr-2 size-4 text-white" />
          <span className="text-xs text-white">Search {data?.name}</span>
        </Button>

        <CommandDialog open={open} onOpenChange={setOpen}>
          <CommandInput
            placeholder="Type a command or search..."
            disabled={isLoading}
            className="focus:outline-none"
          />
          <CommandList>
            {(!isChannelsLoading || !isMembersLoading) && (
              <CommandEmpty>No results found.</CommandEmpty>
            )}
            <CommandGroup heading="Channels">
              {isChannelsLoading ? (
                <p className="py-1 text-center text-sm">Loading channels...</p>
              ) : channels?.length === 0 ? (
                <CommandEmpty>Channels not found</CommandEmpty>
              ) : (
                channels?.map((channel) => {
                  return (
                    <CommandItem key={channel?._id} asChild>
                      <Link
                        href={`/workspace/${workspaceId}/channel/${channel._id}`}
                        onClick={() => setOpen(false)}
                      >
                        {channel?.name}
                      </Link>
                    </CommandItem>
                  )
                })
              )}
            </CommandGroup>
            <CommandSeparator />

            <CommandGroup heading="Members">
              {isMembersLoading ? (
                <p className="py-1 text-center text-sm">Loading channels...</p>
              ) : channels?.length === 0 ? (
                <CommandEmpty>Members not found</CommandEmpty>
              ) : (
                members?.map((member) => {
                  return (
                    <CommandItem key={member?._id} asChild>
                      <Link
                        href={`/workspace/${workspaceId}/member/${member._id}`}
                        onClick={() => setOpen(false)}
                      >
                        {member?.user?.name}
                      </Link>
                    </CommandItem>
                  )
                })
              )}
            </CommandGroup>
          </CommandList>
        </CommandDialog>
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
