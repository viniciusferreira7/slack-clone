'use client'

import { ChevronDown, TrashIcon } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

import type { Doc } from '../../../../../../../../convex/_generated/dataModel'
import { EditChannelModal } from './edit-channel-modal'

interface HeaderProps {
  channel: Doc<'channels'>
}

export function Header({ channel }: HeaderProps) {
  const [editOpen, setEditOpen] = useState(false)

  return (
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
              open={editOpen}
              onOpenChange={setEditOpen}
            />
            <Button
              variant="ghost"
              className="flex gap-x-2 border bg-white px-5 py-4 text-rose-600 hover:bg-gray-50"
            >
              <TrashIcon className="size-4 shrink-0" />
              <p className="text-sm font-semibold">Delete channel</p>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </header>
  )
}
