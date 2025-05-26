import { convexAuthNextjsToken } from '@convex-dev/auth/nextjs/server'
import { preloadQuery } from 'convex/nextjs'
import dynamic from 'next/dynamic'
import { redirect } from 'next/navigation'
import type { ReactNode } from 'react'

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable'

import { api } from '../../../../convex/_generated/api'
import type { Doc, Id } from '../../../../convex/_generated/dataModel'
import { Thread } from '../../../features/messages/components/thread'
import { Sidebar } from './components/sidebar'
import { Toolbar } from './components/toolbar'
import { WorkspaceSidebar } from './components/workspace-sidebar'

const CreateChannelModal = dynamic(
  () => import('@/features/channels/components/create-channel-modal'),
)

interface WorkspaceIdLayoutProps {
  params: Promise<{
    id: string
  }>
  children: ReactNode
}

export default async function WorkspaceIdLayout({
  params,
  children,
}: WorkspaceIdLayoutProps) {
  const { id } = await params

  const [preloadedWorkspace, preloadedCurrentMember, preloadedChannels] =
    await Promise.all([
      preloadQuery(
        api.workspaces.getById,
        {
          id: id as Id<'workspaces'>,
        },
        { token: await convexAuthNextjsToken() },
      ),
      preloadQuery(
        api.members.currentMember,
        {
          workspaceId: id as Id<'workspaces'>,
        },
        { token: await convexAuthNextjsToken() },
      ),
      preloadQuery(
        api.channels.get,
        {
          workspaceId: id as Id<'workspaces'>,
        },
        { token: await convexAuthNextjsToken() },
      ),
    ])

  const workspaceData =
    preloadedWorkspace._valueJSON as unknown as Doc<'workspaces'>

  const currentMemberData =
    preloadedCurrentMember._valueJSON as unknown as Doc<'members'>

  const channelsData = preloadedChannels._valueJSON as unknown as Array<
    Doc<'channels'>
  >

  if (!workspaceData) {
    redirect('/')
  }
  return (
    <>
      <div className="min-h-screen">
        <Toolbar />
        <div className="flex h-[calc(100vh-40px)]">
          <Sidebar />
          <ResizablePanelGroup
            direction="horizontal"
            autoSaveId="ca-workspace-id"
          >
            <ResizablePanel
              defaultSize={20}
              minSize={11}
              className="bg-slack-purple-600"
            >
              <WorkspaceSidebar
                workspace={workspaceData}
                currentMember={currentMemberData}
                channels={channelsData}
              />
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={90} minSize={20}>
              {children}
            </ResizablePanel>
            <Thread />
          </ResizablePanelGroup>
        </div>
      </div>
      <CreateChannelModal />
    </>
  )
}
