import { convexAuthNextjsToken } from '@convex-dev/auth/nextjs/server'
import { preloadQuery } from 'convex/nextjs'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

import { Button } from '@/components/ui/button'

import { api } from '../../../../../../convex/_generated/api'
import type { Id } from '../../../../../../convex/_generated/dataModel'

interface ChannelProps {
  params: Promise<{
    id: string
    channelId: string
  }>
}

export default async function ChannelPage({ params }: ChannelProps) {
  const { id: workspaceId, channelId } = await params

  const preloadedChannel = await preloadQuery(
    api.channels.getById,
    {
      workspaceId: workspaceId as Id<'workspaces'>,
      channelId: channelId as Id<'channels'>,
    },
    { token: await convexAuthNextjsToken() },
  )

  if (!preloadedChannel?._valueJSON) {
    return (
      <div className="grid h-full place-items-center">
        <div className="flex flex-col items-center gap-y-4 rounded-md border p-12 shadow-2xl">
          <p className="text-2xl font-semibold">No channel found</p>
          <Button asChild>
            <Link href={`/workspace/${workspaceId}`}>
              <ArrowLeft className="size-4 shrink-0" /> Go back to workspace
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  return <div className="">Channel</div>
}
