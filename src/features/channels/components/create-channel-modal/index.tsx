'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { useWorkspaceId } from '@/hooks/use-workspace-id'
import { cn } from '@/lib/utils'

import { useCreateChannel } from '../../api/use-create-channel'
import { useCreateChannelModal } from '../../store/use-create-channel-modal'
import {
  type CreateChannelSchema,
  createChannelSchema,
} from './schema/create-channel-schema'

interface CreateChannelModalProps {
  isOpen?: boolean
}

export default function CreateChannelModal({
  isOpen = false,
}: CreateChannelModalProps) {
  const [open, setOpen] = useCreateChannelModal()
  const workspaceId = useWorkspaceId()

  const router = useRouter()

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<CreateChannelSchema>({
    resolver: zodResolver(createChannelSchema),
  })

  const { mutate, isPending } = useCreateChannel()

  async function handleCreateChannel(data: CreateChannelSchema) {
    await mutate(
      {
        name: data.name,
        workspaceId,
      },
      {
        onSuccess: (data) => {
          toast.success('Channel was created')
          setOpen(false)
          router.push(
            `/workspace/${data.workspaceId}/channel/${data.channelId}`,
          )
        },
        onError: () => {
          toast.error('An error occurred when creating the channel')
        },
      },
    )
  }

  useEffect(() => {
    if (isOpen) {
      setOpen(true)
    }
  }, [isOpen, setOpen])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a channel</DialogTitle>
        </DialogHeader>
        <form
          className="space-y-4"
          onSubmit={handleSubmit(handleCreateChannel)}
          autoFocus
        >
          <div className="space-y-2">
            <Input
              {...register('name')}
              placeholder="e.g. plan-budget"
              disabled={isPending}
              className={cn(
                'duration-200 ease-in-out',
                errors.name &&
                  'border-destructive text-destructive placeholder:text-destructive',
              )}
            />
            {errors.name && (
              <p className="text-sm font-semibold text-destructive">
                {errors.name.message}
              </p>
            )}
          </div>
          <div className="flex justify-end">
            <Button type="submit" disabled={isPending}>
              Create
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
