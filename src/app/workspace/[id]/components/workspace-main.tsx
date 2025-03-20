'use client'

import { ArrowRight, Plus, TriangleAlert } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useMemo } from 'react'

import { Button } from '@/components/ui/button'
import { useCreateChannelModal } from '@/features/channels/store/use-create-channel-modal'

import type { Doc } from '../../../../../convex/_generated/dataModel'

interface WorkspaceMainProps {
  workspaceData: Doc<'workspaces'>
  channels: Array<Doc<'channels'>>
  currentMember: Doc<'members'>
}

export function WorkspaceMain({
  workspaceData,
  channels,
  currentMember,
}: WorkspaceMainProps) {
  const [, setOpen] = useCreateChannelModal()

  const hasChannels = !!channels.length

  const isAdmin = useMemo(
    () => currentMember?.role === 'admin',
    [currentMember],
  )

  useEffect(() => {
    if (!hasChannels && isAdmin) {
      setOpen(true)
    }
  }, [hasChannels, channels, setOpen, isAdmin])

  const firstChannel = channels?.[0]

  return (
    <div className="grid h-full place-items-center">
      {hasChannels ? (
        <div className="flex flex-col items-center gap-y-4 rounded-md border p-12 shadow-2xl">
          <p className="text-2xl font-semibold">Access channel</p>
          <Button asChild>
            <Link
              href={`/workspace/${workspaceData._id}/channel/${firstChannel._id}`}
            >
              <ArrowRight className="size-4 shrink-0" />
              Go to {firstChannel.name}
            </Link>
          </Button>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-y-4 rounded-md border p-12 shadow-2xl">
          <div className="flex flex-col items-center gap-y-3">
            <TriangleAlert className="size-7 text-muted-foreground" />
            <p className="text-2xl font-semibold text-muted-foreground">
              No channels found
            </p>
          </div>

          {isAdmin && (
            <Button onClick={() => setOpen(true)}>
              <Plus className="size-4 shrink-0" /> new channel
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
