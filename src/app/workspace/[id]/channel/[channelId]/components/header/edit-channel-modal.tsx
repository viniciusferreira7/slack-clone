import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

import type { Doc } from '../../../../../../../../convex/_generated/dataModel'
import {
  type EditChannelSchema,
  editChannelSchema,
} from './schemas/edit-channel-schema'

interface EditChannelModalProps {
  channel: Doc<'channels'>
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditChannelModal({
  channel,
  open,
  onOpenChange,
}: EditChannelModalProps) {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<EditChannelSchema>({
    resolver: zodResolver(editChannelSchema),
    defaultValues: {
      name: channel.name,
    },
  })

  function handleChangeChannel(data: EditChannelSchema) {
    console.log(data)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <div className="cursor-pointer rounded-lg border bg-white px-5 py-4 hover:bg-gray-50">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold">Channel name</p>
            <p className="text-slack-blue-200 text-sm font-semibold hover:underline">
              Edit
            </p>
          </div>
          <p className="text-sm"># {channel.name}</p>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rename this channel</DialogTitle>
        </DialogHeader>
        <form
          className="space-y-4"
          onSubmit={handleSubmit(handleChangeChannel)}
        >
          <div className="space-y-2">
            <Input
              {...register('name')}
              placeholder="e.g. plan-budget"
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
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Create</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
