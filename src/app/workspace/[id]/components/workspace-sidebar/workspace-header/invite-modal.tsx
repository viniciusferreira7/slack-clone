import { CopyIcon, RefreshCcw } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useNewJoinCode } from '@/features/workspaces/api/use-new-join-code'
import { useConfirm } from '@/hooks/use-confirm'

import type { Doc } from '../../../../../../../convex/_generated/dataModel'

interface InviteModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  workspace: Doc<'workspaces'>
  isAdmin: boolean
}

export function InviteModal({
  open,
  onOpenChange,
  workspace,
  isAdmin,
}: InviteModalProps) {
  const { mutate, isPending } = useNewJoinCode()
  const [ConfirmDialog, confirm] = useConfirm({
    title: 'Are you sure?',
    message:
      'This will deactivate the current invite code and generate a new one.',
  })

  function handleCopy() {
    const inviteLink = `${window.location.origin}/join/${workspace._id}`

    navigator.clipboard
      .writeText(inviteLink)
      .then(() => toast.success('Invite link copied to clipboard'))
  }

  async function handleNewCode() {
    const ok = await confirm()

    if (!ok) return

    await mutate(
      {
        workspaceId: workspace._id,
      },
      {
        onSuccess: () => {
          toast.info('Invite code regenerated')
        },
        onError: () => {
          toast.error('Failed to regenerate invite code')
        },
      },
    )
  }

  return (
    <>
      <ConfirmDialog />
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
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              disabled={isPending}
            >
              Copy link
              <CopyIcon className="ml-2 size-4 shrink-0" />
            </Button>
          </div>
          <div className="flex w-full items-center justify-between">
            {isAdmin && (
              <Button
                variant="outline"
                onClick={handleNewCode}
                disabled={isPending}
              >
                New code <RefreshCcw className="ml-2 size-4 shrink-0" />
              </Button>
            )}
            <DialogClose asChild>
              <Button>Close</Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
