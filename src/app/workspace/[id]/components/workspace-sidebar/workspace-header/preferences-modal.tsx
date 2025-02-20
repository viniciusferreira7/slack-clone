import { TrashIcon } from 'lucide-react'
import { useState } from 'react'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="overflow-hidden bg-gray-50 p-0">
        <DialogHeader className="border-b bg-white p-4">
          <DialogTitle>{value}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-y-2 px-4 pb-4">
          <div className="cursor-pointer rounded-lg border bg-white px-5 py-4 hover:bg-gray-50">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold">Workspace name</p>
              <p className="text-slack-blue-700 text-sm">Edit</p>
            </div>
            <p className="text-sm">{value}</p>
          </div>
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
