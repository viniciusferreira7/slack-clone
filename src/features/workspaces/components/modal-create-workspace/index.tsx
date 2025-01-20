'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

import { useCreateWorkspace } from '../../api/use-create-workspace'
import { useCreateWorkspaceModal } from '../../store/use-create-workspace-modal'
import {
  createWorkspaceFormSchema,
  type CreateWorkspaceFormSchemaInput,
  type CreateWorkspaceFormSchemaOutput,
} from './schema/create-worskpace-form-schema'

interface ModalCreateWorkspaceProps {
  open: boolean
}

export function ModalCreateWorkspace({
  open: openModal,
}: ModalCreateWorkspaceProps) {
  const [open, setOpen] = useCreateWorkspaceModal()
  const router = useRouter()
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<
    CreateWorkspaceFormSchemaInput,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    any,
    CreateWorkspaceFormSchemaOutput
  >({
    resolver: zodResolver(createWorkspaceFormSchema),
  })

  const { mutate, isPending } = useCreateWorkspace()

  useEffect(() => {
    if (openModal) {
      setOpen(openModal)
    }
  }, [openModal, setOpen])

  if (typeof window === 'undefined') {
    return null
  }

  function handleCreateWorkspace(data: CreateWorkspaceFormSchemaOutput) {
    mutate(
      { workspace_name: data.workspace_name },
      {
        onSuccess(data) {
          router.push(`/workspace/${data.workspaceId}`)
        },
      },
    )
  }

  return (
    <Dialog
      modal
      open={open}
      onOpenChange={(value) => {
        if (openModal && !value) {
          setOpen(true)
        }
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a workspace</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </DialogDescription>
        </DialogHeader>
        <form
          className="space-y-4"
          onSubmit={handleSubmit(handleCreateWorkspace)}
        >
          <div className="space-y-2">
            <Input
              {...register('workspace_name')}
              autoFocus
              placeholder='Workspace name e.g. "Work", "Personal", "Home"'
              className={cn(
                'duration-200 ease-in-out',
                errors.workspace_name &&
                  'border-destructive text-destructive placeholder:text-destructive',
              )}
            />
            {errors.workspace_name && (
              <p className="text-sm font-semibold text-destructive">
                {errors.workspace_name.message}
              </p>
            )}
          </div>
          <Button type="submit" disabled={isPending}>
            Create
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
