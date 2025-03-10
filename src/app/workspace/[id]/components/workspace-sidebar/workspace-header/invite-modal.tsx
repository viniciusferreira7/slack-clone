import { CopyIcon } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

import type { Doc } from '../../../../../../../convex/_generated/dataModel'

interface InviteModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  workspace: Doc<'workspaces'>
}

export function InviteModal({
  open,
  onOpenChange,
  workspace,
}: InviteModalProps) {
  function handleCopy() {
    const inviteLink = `${window.location.origin}/join/${workspace._id}`

    navigator.clipboard
      .writeText(inviteLink)
      .then(() => toast.success('Invite link copied to clipboard'))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite people to {workspace?.name}</DialogTitle>
          <DialogDescription>
            Use the code below to invite people to your workspace
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center gap-y-4 py-10">
          <p className="text-2xl font-bold tracking-widest">
            {workspace?.joinCode}
          </p>
          <Button variant="ghost" size="sm" onClick={handleCopy}>
            Copy link
            <CopyIcon className="ml-2 size-4 shrink-0" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
