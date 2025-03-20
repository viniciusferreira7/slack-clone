'use client'

import {
  AlertTriangle,
  HashIcon,
  Loader,
  MessageSquareText,
  SendHorizontal,
} from 'lucide-react'

import { useGetChannels } from '@/features/channels/api/use-get-channels'
import { useCreateChannelModal } from '@/features/channels/store/use-create-channel-modal'
import { useCurrentMember } from '@/features/members/api/use-current-member'
import { useGetMembers } from '@/features/members/api/use-get-members'
import { useGetWorkspace } from '@/features/workspaces/api/use-get-workspace'
import { useChannelId } from '@/hooks/use-channel-id'
import { useWorkspaceId } from '@/hooks/use-workspace-id'

import { SidebarItem } from './sidebar-item'
import { UserItem } from './user-item'
import { WorkspaceHeader } from './workspace-header'
import { WorkspaceSection } from './workspace-section'

export function WorkspaceSidebar() {
  const workspaceId = useWorkspaceId()
  const channelId = useChannelId()
  const { data: member, isLoading: isMemberLoading } = useCurrentMember({
    workspaceId,
  })
  const { data: workspace, isLoading: isWorkspaceLoading } = useGetWorkspace({
    id: workspaceId,
  })

  const { data: channels, isLoading: isChannelsLoading } = useGetChannels({
    workspaceId,
  })

  const { data: members, isLoading: isMembersLoading } = useGetMembers({
    workspaceId,
  })

  const [, setOpen] = useCreateChannelModal()

  if (
    isMemberLoading ||
    isWorkspaceLoading ||
    isChannelsLoading ||
    isMembersLoading
  ) {
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
        <SidebarItem
          id="threads"
          label="Threads"
          icon={MessageSquareText}
          workspaceId={workspaceId}
        />
        <SidebarItem
          id="drafts"
          label="Drafts & Send"
          icon={SendHorizontal}
          workspaceId={workspaceId}
        />
      </div>
      <WorkspaceSection
        label="Channels"
        hint="New channel"
        onNew={member.role === 'admin' ? () => setOpen(true) : undefined}
      >
        {channels?.map((item) => {
          return (
            <SidebarItem
              key={item._id}
              id={item._id}
              label={item.name}
              icon={HashIcon}
              workspaceId={workspaceId}
              variant={channelId === item._id ? 'active' : 'default'}
            />
          )
        })}
      </WorkspaceSection>
      {!!members?.length && (
        <WorkspaceSection label="Direct Messages" hint="New direct message">
          {members?.map((item) => {
            return (
              <UserItem
                key={item._id}
                id={item._id}
                label={item.user.name}
                image={item.user.image}
                workspaceId={workspaceId}
              />
            )
          })}
        </WorkspaceSection>
      )}
    </div>
  )
}
