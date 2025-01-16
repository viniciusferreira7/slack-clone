'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'

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
  const { handleSubmit, register } = useForm<
    CreateWorkspaceFormSchemaInput,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    any,
    CreateWorkspaceFormSchemaOutput
  >({
    resolver: zodResolver(createWorkspaceFormSchema),
  })

  useEffect(() => {
    if (openModal) {
      setOpen(openModal)
    }
  }, [openModal, setOpen])

  if (typeof window === 'undefined') {
    return null
  }

  function handleCreateWorkspace(data: CreateWorkspaceFormSchemaOutput) {
    console.log({ data })
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
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </DialogDescription>
        </DialogHeader>
        <form
          className="space-y-4"
          onSubmit={handleSubmit(handleCreateWorkspace)}
        >
          <Input {...register('workspace_name')} autoFocus />
        </form>
      </DialogContent>
    </Dialog>
  )
}
