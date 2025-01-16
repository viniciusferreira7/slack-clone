import { cookies } from 'next/headers'

import { UserButton } from '@/features/auth/components/user-button'
import { ModalCreateWorkspace } from '@/features/workspaces/components/modal-create-workspace'

export default async function Home() {
  const cookieStore = await cookies()

  const hasWorkspaceId = cookieStore.has('workspace-id')

  return (
    <div>
      <h1>Hello world</h1>
      <UserButton />
      <ModalCreateWorkspace open={!hasWorkspaceId} />
    </div>
  )
}
