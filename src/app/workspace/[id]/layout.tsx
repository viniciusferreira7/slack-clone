import { convexAuthNextjsToken } from '@convex-dev/auth/nextjs/server'
import { preloadQuery } from 'convex/nextjs'
import type { Metadata } from 'next'
import type { ReactNode } from 'react'

import { api } from '../../../../convex/_generated/api'
import type { Id } from '../../../../convex/_generated/dataModel'
import { Sidebar } from './components/sidebar'
import { Toolbar } from './components/toolbar'

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
  children,
}: WorkspaceIdLayoutProps) {
  return (
    <div className="min-h-screen">
      <Toolbar />
      <div className="flex h-[calc(100vh-40px)]">
        <Sidebar />
        {children}
      </div>
    </div>
  )
}
