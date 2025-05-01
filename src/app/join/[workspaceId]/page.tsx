import { convexAuthNextjsToken } from '@convex-dev/auth/nextjs/server'
import { preloadQuery } from 'convex/nextjs'
import { Hash } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'

import { Button } from '@/components/ui/button'

import { api } from '../../../../convex/_generated/api'
import type { Id } from '../../../../convex/_generated/dataModel'
import { VerificationInput } from './components/verification-input'

interface JoinPageProps {
  params: Promise<{
    workspaceId: string
  }>
}

export const metadata: Metadata = {
  title: 'Join',
}

export default async function JoinPage({ params }: JoinPageProps) {
  const { workspaceId } = await params

  const preloadedWorkspace = await preloadQuery(
    api.workspaces.getInfoById,
    {
      id: workspaceId as Id<'workspaces'>,
    },
    { token: await convexAuthNextjsToken() },
  )

  const workspaceData = preloadedWorkspace._valueJSON as unknown as {
    name: string
    isMember: boolean
  }

  if (workspaceData.isMember) {
    redirect(`/workspace/${workspaceId}`)
  }

  return (
    <div className="flex h-full flex-col items-center justify-center gap-y-8 rounded-lg bg-white p-8 shadow-sm">
      <Hash className="size-16 shrink-0 text-rose-500" />
      <div className="flex max-w-md flex-col items-center justify-center gap-y-4">
        <div className="flex max-w-md flex-col items-center justify-center gap-y-2">
          <h1 className="text-2xl font-bold">Join {workspaceData?.name}</h1>
          <p className="text-muted-foreground">
            Enter the workspace code to join
          </p>
        </div>
        <VerificationInput workspaceId={workspaceId} />
        <div className="flex gap-y-4">
          <Button size="lg" variant="outline" asChild>
            <Link href="/">Back to home</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
