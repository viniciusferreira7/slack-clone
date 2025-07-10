import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { useUpdateWorkspace } from '@/features/workspaces/api/use-update-workspace'
import { useConfirm } from '@/hooks/use-confirm'
import { useWorkspaceId } from '@/hooks/use-workspace-id'

const updateFormSchema = z.object({
  name: z.string().min(3, { message: 'Please provide at least 3 characters.' }),
})

type UpdateFormSchema = z.infer<typeof updateFormSchema>

interface UpdateWorkspaceModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  workspaceName: string
}

export function UpdateWorkspaceModal({
  open,
  onOpenChange,
  workspaceName,
}: UpdateWorkspaceModalProps) {
  const workspaceId = useWorkspaceId()
  const { mutate: updateWorkspace, isPending: isUpdatingWorkspace } =
    useUpdateWorkspace()

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<UpdateFormSchema>({
    resolver: zodResolver(updateFormSchema),
    defaultValues: {
      name: workspaceName,
    },
  })

  const [DialogConfirmEdit, confirm] = useConfirm({
    title: 'Are you sure?',
    message: 'This action is irreversible',
  })

  async function handleUpdateForm(data: UpdateFormSchema) {
    const ok = await confirm()

    if (!ok) return
    await updateWorkspace(
      {
        workspace_id: workspaceId,
        workspace_name: data.name,
      },
      {
        onSuccess: () => {
          toast.success('Workspace was updated')
          onOpenChange(false)
        },
        onError: () => {
          toast.error('Failed to update workspace')
        },
      },
    )
  }

  return (
    <>
      <DialogConfirmEdit />
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogTrigger className="cursor-pointer rounded-lg border bg-white px-5 py-4 hover:bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex flex-col items-start">
              <p className="text-sm font-semibold">Workspace name</p>
              <p className="text-sm">{workspaceName}</p>
            </div>
            <p className="text-sm text-slack-blue-200">Edit</p>
          </div>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename this workspace</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(handleUpdateForm)} className="space-y-4">
            <Input
              {...register('name')}
              disabled={isUpdatingWorkspace}
              autoFocus
              placeholder='Workspace name e.g. "Work", "Personal", "Home"'
            />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name.message}</p>
            )}
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" disabled={isUpdatingWorkspace}>
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" disabled={isUpdatingWorkspace}>
                Save
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
