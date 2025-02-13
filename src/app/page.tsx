import { convexAuthNextjsToken } from '@convex-dev/auth/nextjs/server'
import { preloadQuery } from 'convex/nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { UserButton } from '@/features/auth/components/user-button'
import { ModalCreateWorkspace } from '@/features/workspaces/components/modal-create-workspace'

import { api } from '../../convex/_generated/api'
import type { Id } from '../../convex/_generated/dataModel'

export default async function Home() {
  const cookieStore = await cookies()

  const workspaceId = cookieStore.get('workspace-id')?.value

  if (workspaceId) {
    const preloadedWorkspace = await preloadQuery(
      api.workspaces.getById,
      {
        id: workspaceId as Id<'workspaces'>,
      },
      { token: await convexAuthNextjsToken() },
    )

    if (preloadedWorkspace._valueJSON) {
      const workspaceData = preloadedWorkspace._valueJSON

      // FIXME: Come a object, but type is a string, you can see putting a log in workspace data
      redirect(`/workspace/${workspaceData?._id}`)
    }
  }

  return (
    <div>
      <h1>Hello world</h1>
      <UserButton />
      <ModalCreateWorkspace open={!workspaceId} />
    </div>
  )
}
