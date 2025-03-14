'use client'

import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp'
import { useJoin } from '@/features/workspaces/api/use-join'

import type { Id } from '../../../../../convex/_generated/dataModel'

interface VerificationInputProps {
  workspaceId: string
}

export function VerificationInput({ workspaceId }: VerificationInputProps) {
  const router = useRouter()
  const { mutate, isPending } = useJoin()

  async function handleCompleteOTP(value: string) {
    await mutate(
      {
        workspaceId: workspaceId as Id<'workspaces'>,
        joinCode: value,
      },
      {
        onSuccess: (data) => {
          toast.success('Workspace joined')
          router.replace(`/workspace/${data.workspaceId}`)
        },
        onError: () => {
          toast.error('Failed to join workspace')
        },
      },
    )
  }

  return (
    <InputOTP
      maxLength={6}
      autoFocus
      onComplete={handleCompleteOTP}
      disabled={isPending}
    >
      <InputOTPGroup>
        <InputOTPSlot index={0} />
        <InputOTPSlot index={1} />
        <InputOTPSlot index={2} />
        <InputOTPSlot index={3} />
        <InputOTPSlot index={4} />
        <InputOTPSlot index={5} />
      </InputOTPGroup>
    </InputOTP>
  )
}
