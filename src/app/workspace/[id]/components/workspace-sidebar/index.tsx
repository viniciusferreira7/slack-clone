'use client'

import {
  AlertTriangle,
  HashIcon,
  Loader,
  MessageSquareText,
  SendHorizontal,
} from 'lucide-react'

import { useCreateChannelModal } from '@/features/channels/store/use-create-channel-modal'
import { useGetMembers } from '@/features/members/api/use-get-members'
import { useChannelId } from '@/hooks/use-channel-id'
import { useWorkspaceId } from '@/hooks/use-workspace-id'

import type { Doc } from '../../../../../../convex/_generated/dataModel'
import { SidebarItem } from './sidebar-item'
import { UserItem } from './user-item'
import { WorkspaceHeader } from './workspace-header'
import { WorkspaceSection } from './workspace-section'

interface WorkspaceSidebarProps {
  workspace: Doc<'workspaces'>
  currentMember: Doc<'members'>
  channels: Array<Doc<'channels'>>
}

export function WorkspaceSidebar({
  workspace,
  currentMember,
  channels,
}: WorkspaceSidebarProps) {
  const workspaceId = useWorkspaceId()
  const channelId = useChannelId()
  const [, setOpen] = useCreateChannelModal()

  const { data: members, isLoading: isMembersLoading } = useGetMembers({
    workspaceId: workspace._id,
  })

  if (!workspace || !currentMember || !channels) {
    return (
      <div className="flex h-full flex-col items-center justify-center bg-slack-purple-600">
        <Loader className="size-5 animate-spin text-white" />
      </div>
    )
  }

  if (!currentMember || !workspace) {
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
        isAdmin={currentMember?.role === 'admin'}
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
        onNew={currentMember.role === 'admin' ? () => setOpen(true) : undefined}
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
      {members?.length === 0 && (
        <WorkspaceSection label="Direct Messages" hint="New direct message">
          <div className="mt-2 flex items-center justify-center">
            <p className="text-sm font-semibold text-muted">No members found</p>
          </div>
        </WorkspaceSection>
      )}
      {members?.length && !isMembersLoading ? (
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
      ) : (
        <WorkspaceSection label="Direct Messages" hint="New direct message">
          <div className="mt-2 flex items-center justify-center">
            <Loader className="size-5 animate-spin text-white" />
          </div>
        </WorkspaceSection>
      )}
    </div>
  )
}
