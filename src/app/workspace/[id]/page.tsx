import { convexAuthNextjsToken } from '@convex-dev/auth/nextjs/server'
import { preloadQuery } from 'convex/nextjs'

import { api } from '../../../../convex/_generated/api'
import type { Doc, Id } from '../../../../convex/_generated/dataModel'
import { WorkspaceMain } from './components/workspace-main'

interface WorkspacePageProps {
  params: Promise<{
    id: string
  }>
}

export default async function WorkspacePage({ params }: WorkspacePageProps) {
  const { id: workspaceId } = await params

  const [preloadedWorkspace, preloadedChannels] = await Promise.all([
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
  ])

  const workspaceData =
    preloadedWorkspace._valueJSON as unknown as Doc<'workspaces'>

  const channelsData = preloadedChannels._valueJSON as unknown as Array<
    Doc<'channels'>
  >

  return <WorkspaceMain workspaceData={workspaceData} channels={channelsData} />
}
