'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'

import { useCreateWorkspace } from '../../api/use-create-workspace'
import { useGetWorkspaces } from '../../api/use-get-workspaces'
import { useCreateWorkspaceModal } from '../../store/use-create-workspace-modal'
import {
  createWorkspaceFormSchema,
  type CreateWorkspaceFormSchemaInput,
  type CreateWorkspaceFormSchemaOutput,
} from './schema/create-worskpace-form-schema'

interface CreateWorkspaceModalProps {
  open: boolean
}

export function CreateWorkspaceModal({
  open: openModal,
}: CreateWorkspaceModalProps) {
  const pathname = usePathname()
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

  const { data: workspaces, isLoading: isWorkspacesLoading } =
    useGetWorkspaces()

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
          toast.success('Workspace created')
          router.push(`/workspace/${data.workspaceId}`)
          setOpen(false)
        },
      },
    )
  }

  const isWorkspace = pathname.split('/').includes('workspace')

  return (
    <Dialog
      modal
      open={open}
      onOpenChange={(value) => {
        if (openModal && !value && !isWorkspace) {
          setOpen(true)
        } else {
          setOpen(value)
        }
      }}
    >
      <DialogContent hiddenCloseIcon={!isWorkspace}>
        <DialogHeader>
          <DialogTitle>Add a workspace</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </DialogDescription>
        </DialogHeader>
        {!isWorkspacesLoading && workspaces?.length !== 0 && (
          <div className="w-full">
            <Select
              disabled={isWorkspacesLoading || isPending}
              onValueChange={(value) => {
                router.push(`/workspace/${value}`)
                setOpen(false)
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a workspaces" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Workspaces</SelectLabel>
                  {workspaces?.map((workspace) => {
                    return (
                      <SelectItem key={workspace._id} value={workspace._id}>
                        {workspace.name}
                      </SelectItem>
                    )
                  })}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        )}
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
