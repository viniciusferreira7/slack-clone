import { TrashIcon } from 'lucide-react'
import { useState } from 'react'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useRemoveWorkspace } from '@/features/workspaces/api/use-remove-workspace'
import { useUpdateWorkspace } from '@/features/workspaces/api/use-update-workspace'

import { UpdateWorkspaceModal } from './update-workspace-modal'

interface PreferencesModalProps {
  open: boolean
  onOpenChange: (value: boolean) => void
  initialValue: string
}

export function PreferencesModal({
  open,
  onOpenChange,
  initialValue,
}: PreferencesModalProps) {
  const [value, setValue] = useState(initialValue)
  const [editOpen, setEditOpen] = useState(false)

  const { mutate: removeWorkspace, isPending: isRemovingWorkspace } =
    useRemoveWorkspace()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="overflow-hidden bg-gray-50 p-0">
        <DialogHeader className="border-b bg-white p-4">
          <DialogTitle>{value}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-y-2 px-4 pb-4">
          <UpdateWorkspaceModal
            open={editOpen}
            onOpenChange={setEditOpen}
            workspaceName={initialValue}
          />

          <button
            disabled={false}
            className="hover:bbg-gray-50 flex cursor-pointer items-center gap-x-2 rounded-lg border bg-white px-5 py-4 text-rose-600"
          >
            <TrashIcon className="size-4" />
            <p className="text-sm font-semibold">Delete workspace</p>
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
