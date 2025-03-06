import { convexAuthNextjsToken } from '@convex-dev/auth/nextjs/server'
import { preloadQuery } from 'convex/nextjs'
import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import { redirect } from 'next/navigation'
import type { ReactNode } from 'react'

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable'

import { api } from '../../../../convex/_generated/api'
import type { Id } from '../../../../convex/_generated/dataModel'
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

export async function generateMetadata({
  params,
}: WorkspaceIdLayoutProps): Promise<Metadata> {
  const { id } = await params

  const preloadedWorkspace = await preloadQuery(
    api.workspaces.getById,
    {
      id: id as Id<'workspaces'>,
    },
    { token: await convexAuthNextjsToken() },
  )

  // FIXME: Come a object, but type is a string, you can see putting a log in workspace data
  const workspaceData = preloadedWorkspace._valueJSON

  return {
    title: `${workspaceData?.name} - Workspace`,
  }
}
export default async function WorkspaceIdLayout({
  params,
  children,
}: WorkspaceIdLayoutProps) {
  const { id } = await params

  const preloadedWorkspace = await preloadQuery(
    api.workspaces.getById,
    {
      id: id as Id<'workspaces'>,
    },
    { token: await convexAuthNextjsToken() },
  )

  const workspaceData = preloadedWorkspace._valueJSON

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
              <WorkspaceSidebar />
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel minSize={20}>{children}</ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </div>
      <CreateChannelModal />
    </>
  )
}
