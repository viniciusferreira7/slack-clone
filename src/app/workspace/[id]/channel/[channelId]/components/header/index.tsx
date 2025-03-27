'use client'

import { ChevronDown, TrashIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

import { refreshData } from '@/app/workspace/actions'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { useRemoveChannel } from '@/features/channels/api/use-remove-channel'
import { useConfirm } from '@/hooks/use-confirm'

import type { Doc } from '../../../../../../../../convex/_generated/dataModel'
import { EditChannelModal } from './edit-channel-modal'

interface HeaderProps {
  channel: Doc<'channels'>
}

export function Header({ channel }: HeaderProps) {
  const [editOpen, setEditOpen] = useState(false)
  const router = useRouter()

  const [DialogConfirm, confirm] = useConfirm({
    title: 'Delete channel',
    message:
      'You are about to delete this channel. This action is irreversible',
  })

  const { mutate: mutateRemoveChannel, isPending: isRemovePending } =
    useRemoveChannel()

  async function handleRemoveChannel() {
    const ok = await confirm()

    if (!ok) return

    await mutateRemoveChannel(
      {
        channelId: channel._id,
      },
      {
        onSuccess: async (data) => {
          toast.success('Channel was removed')
          await refreshData('/workspace', 'layout')

          router.replace(`/workspace/${data.workspaceId}`)
        },
        onError: () => {
          toast.error('Failed to remove channel')
        },
      },
    )
  }

  return (
    <>
      <DialogConfirm />

      <header className="flex h-[49px] items-center overflow-hidden border-b bg-white px-4">
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="w-auto overflow-hidden px-2 text-lg font-semibold"
            >
              <span className="truncate"># {channel.name}</span>
              <ChevronDown className="ml-2 size-2.5 shrink-0" />
            </Button>
          </DialogTrigger>
          <DialogContent className="overflow-hidden bg-gray-50 p-0">
            <DialogHeader className="border-b bg-white p-4">
              <DialogTitle># {channel.name}</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-y-2 px-4 pb-4">
              <EditChannelModal
                channel={channel}
                open={isRemovePending ? false : editOpen}
                onOpenChange={setEditOpen}
              />
              <Button
                variant="ghost"
                className="flex gap-x-2 border bg-white px-5 py-4 text-rose-600 hover:bg-gray-50"
                disabled={isRemovePending}
                onClick={handleRemoveChannel}
              >
                <TrashIcon className="size-4 shrink-0" />
                <p className="text-sm font-semibold">Delete channel</p>
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </header>
    </>
  )
}
