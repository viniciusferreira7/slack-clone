import { convexAuthNextjsToken } from '@convex-dev/auth/nextjs/server'
import { preloadQuery } from 'convex/nextjs'
import type { Metadata } from 'next'

import { api } from '../../../../convex/_generated/api'
import type { Doc, Id } from '../../../../convex/_generated/dataModel'
import { WorkspaceMain } from './components/workspace-main'

interface WorkspacePageProps {
  params: Promise<{
    id: string
  }>
}

export async function generateMetadata({
  params,
}: WorkspacePageProps): Promise<Metadata> {
  const { id } = await params

  const preloadedWorkspace = await preloadQuery(
    api.workspaces.getById,
    {
      id: id as Id<'workspaces'>,
    },
    { token: await convexAuthNextjsToken() },
  )

  const workspaceData =
    preloadedWorkspace._valueJSON as unknown as Doc<'workspaces'>

  return {
    title: `${workspaceData?.name} - Workspace`,
  }
}

export default async function WorkspacePage({ params }: WorkspacePageProps) {
  const { id: workspaceId } = await params

  const [preloadedWorkspace, preloadedChannels, preloadedCurrentMember] =
    await Promise.all([
      preloadQuery(
        api.workspaces.getById,
        {
          id: workspaceId as Id<'workspaces'>,
        },
        { token: await convexAuthNextjsToken() },
      ),
      preloadQuery(
        api.channels.get,
        {
          workspaceId: workspaceId as Id<'workspaces'>,
        },
        { token: await convexAuthNextjsToken() },
      ),
      preloadQuery(
        api.members.currentMember,
        {
          workspaceId: workspaceId as Id<'workspaces'>,
        },
        { token: await convexAuthNextjsToken() },
      ),
    ])

  const workspaceData =
    preloadedWorkspace._valueJSON as unknown as Doc<'workspaces'>

  const channelsData = preloadedChannels._valueJSON as unknown as Array<
    Doc<'channels'>
  >

  const currentMemberData =
    preloadedCurrentMember._valueJSON as unknown as Doc<'members'>

  return (
    <WorkspaceMain
      workspaceData={workspaceData}
      channels={channelsData}
      currentMember={currentMemberData}
    />
  )
}
