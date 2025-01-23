import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { UserButton } from '@/features/auth/components/user-button'
import { ModalCreateWorkspace } from '@/features/workspaces/components/modal-create-workspace'

export default async function Home() {
  const cookieStore = await cookies()

  const workspaceId = cookieStore.get('workspace-id')

  if (workspaceId) {
    redirect(`/workspace/${workspaceId.value}`)
  }

  return (
    <div>
      <h1>Hello world</h1>
      <UserButton />
      <ModalCreateWorkspace open={!workspaceId} />
    </div>
  )
}
