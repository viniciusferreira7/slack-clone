import { convexAuthNextjsToken } from '@convex-dev/auth/nextjs/server'
import { preloadQuery } from 'convex/nextjs'
import { ArrowLeft, TriangleAlert } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'

import { Button } from '@/components/ui/button'

import { api } from '../../../../../../convex/_generated/api'
import type { Doc, Id } from '../../../../../../convex/_generated/dataModel'
import { ChannelChat } from './components/channel-chat'
import { Header } from './components/header'

interface ChannelProps {
  params: Promise<{
    id: string
    channelId: string
  }>
}

export async function generateMetadata({
  params,
}: ChannelProps): Promise<Metadata> {
  const { id: workspaceId, channelId } = await params

  const [preloadedWorkspace, preloadedChannel] = await Promise.all([
    preloadQuery(
      api.workspaces.getById,
      {
        id: workspaceId as Id<'workspaces'>,
      },
      { token: await convexAuthNextjsToken() },
    ),
    preloadQuery(
      api.channels.getById,
      {
        workspaceId: workspaceId as Id<'workspaces'>,
        channelId: channelId as Id<'channels'>,
      },
      { token: await convexAuthNextjsToken() },
    ),
  ])

  const workspaceData =
    preloadedWorkspace._valueJSON as unknown as Doc<'workspaces'>

  const channelData = preloadedChannel._valueJSON as unknown as Doc<'channels'>

  return {
    title: `${channelData?.name} | ${workspaceData.name} - Workspace`,
  }
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
          <div className="flex flex-col items-center gap-y-3">
            <TriangleAlert className="size-7 text-muted-foreground" />
            <p className="text-2xl font-semibold text-muted-foreground">
              No channels found
            </p>
          </div>
          <Button asChild>
            <Link href={`/workspace/${workspaceId}`}>
              <ArrowLeft className="size-4 shrink-0" /> Go back to workspace
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  const channelsData = preloadedChannel._valueJSON as unknown as Doc<'channels'>

  return (
    <div className="flex h-full flex-col">
      <Header channel={channelsData} />
      <div className="flex-1" />
      <ChannelChat channel={channelsData} />
    </div>
  )
}
