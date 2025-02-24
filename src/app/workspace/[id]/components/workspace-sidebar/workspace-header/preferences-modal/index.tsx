import { TrashIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useGetWorkspaces } from '@/features/workspaces/api/use-get-workspaces'
import { useRemoveWorkspace } from '@/features/workspaces/api/use-remove-workspace'
import { useWorkspaceId } from '@/hooks/use-workspace-id'

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
  const workspaceId = useWorkspaceId()
  const [value, setValue] = useState(initialValue)
  const [editOpen, setEditOpen] = useState(false)
  const { data: workspaces, isLoading: isLoadingWorkspaces } =
    useGetWorkspaces()

  const anotherWorkspace = workspaces?.filter(
    (workspace) => workspace?._id !== workspaceId,
  )

  const router = useRouter()

  const { mutate: removeWorkspace, isPending: isRemovingWorkspace } =
    useRemoveWorkspace()

  async function handleRemoveWorkspace() {
    await removeWorkspace(
      {
        workspace_id: workspaceId,
      },
      {
        onSuccess: async () => {
          toast.success('Workspace was removed')
          if (anotherWorkspace?.[0]) {
            router.replace(`/workspace/${anotherWorkspace?.[0]._id}`)
          } else {
            router.replace('/')
          }
        },
        onError: () => {
          toast.error('Failed to remove workspace')
        },
      },
    )
  }

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
            disabled={isRemovingWorkspace || isLoadingWorkspaces}
            onClick={handleRemoveWorkspace}
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
