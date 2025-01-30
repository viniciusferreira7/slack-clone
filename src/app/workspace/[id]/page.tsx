import { convexAuthNextjsToken } from '@convex-dev/auth/nextjs/server'
import { preloadQuery } from 'convex/nextjs'
import { redirect } from 'next/navigation'

import { api } from '../../../../convex/_generated/api'
import type { Id } from '../../../../convex/_generated/dataModel'

interface WorkspacePageProps {
  params: Promise<{
    id: string
  }>
}

export default async function WorkspacePage({ params }: WorkspacePageProps) {
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

  return <div>Workspace: {id}</div>
}
