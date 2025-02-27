import { type JSX, useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface UseConfirmProps {
  title: string
  message: string
}

interface PromiseState {
  resolve: (value: boolean) => void
}

type DialogConfirmType = () => JSX.Element
type ConfirmFunction = () => Promise<boolean>

export const useConfirm = ({
  title,
  message,
}: UseConfirmProps): [DialogConfirmType, ConfirmFunction] => {
  const [promise, setPromise] = useState<PromiseState | null>(null)

  function confirm(): Promise<boolean> {
    return new Promise((resolve) => {
      setPromise({ resolve })
    })
  }

  function handleClose() {
    setPromise(null)
  }

  function handleCancel() {
    promise?.resolve(false)
    handleClose()
  }

  function handleConfirm() {
    promise?.resolve(true)
    handleClose()
  }

  function DialogConfirm(): JSX.Element {
    return (
      <Dialog
        open={promise !== null}
        onOpenChange={(open) => {
          if (!open) {
            handleClose()
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{message}</DialogDescription>
          </DialogHeader>
          <DialogFooter className="pt-2">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button onClick={handleConfirm}>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  return [DialogConfirm, confirm]
}
