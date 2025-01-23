import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

interface WorkspacePageProps {
  params: {
    id: string
  }
}

export const metadata: Metadata = {
  title: 'Workspace',
}
export default async function WorkspacePage({ params }: WorkspacePageProps) {
  const { id } = await params

  const cookieStore = await cookies()

  if (!cookieStore.has('workspace-id')) {
    redirect('/')
  }

  return <div>Workspace: {id}</div>
}
