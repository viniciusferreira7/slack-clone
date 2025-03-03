'use client'

import {
  AlertTriangle,
  HashIcon,
  Loader,
  MessageSquareText,
  SendHorizontal,
} from 'lucide-react'

import { useGetChannels } from '@/features/channels/api/use-get-channels'
import { useCurrentMember } from '@/features/members/api/use-current-member'
import { useGetWorkspace } from '@/features/workspaces/api/use-get-workspace'
import { useWorkspaceId } from '@/hooks/use-workspace-id'

import { SidebarItem } from './sidebar-item'
import { WorkspaceHeader } from './workspace-header'
import { WorkspaceSection } from './workspace-section'

export function WorkspaceSidebar() {
  const workspaceId = useWorkspaceId()
  const { data: member, isLoading: isMemberLoading } = useCurrentMember({
    workspaceId,
  })
  const { data: workspace, isLoading: isWorkspaceLoading } = useGetWorkspace({
    id: workspaceId,
  })

  const { data: channels, isLoading: isChannelsLoading } = useGetChannels({
    workspaceId,
  })

  if (isMemberLoading || isWorkspaceLoading || isChannelsLoading) {
    return (
      <div className="flex h-full flex-col items-center justify-center bg-slack-purple-600">
        <Loader className="size-5 animate-spin text-white" />
      </div>
    )
  }

  if (!member || !workspace) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-y-2 bg-slack-purple-600">
        <AlertTriangle className="size-5 shrink-0 text-white" />
        <p className="text-sm text-white">Workspace not found</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col bg-slack-purple-600 p-4">
      <WorkspaceHeader
        workspace={workspace}
        isAdmin={member?.role === 'admin'}
      />
      <div className="mt-3 flex flex-col px-2">
        <SidebarItem id="threads" label="Threads" icon={MessageSquareText} />
        <SidebarItem id="drafts" label="Drafts & Send" icon={SendHorizontal} />
      </div>
      <WorkspaceSection label="Channels" hint="New channel" onNew={() => {}}>
        {channels?.map((item) => {
          return (
            <SidebarItem
              key={item._id}
              id={item._id}
              label={item.name}
              icon={HashIcon}
            />
          )
        })}
      </WorkspaceSection>
    </div>
  )
}
