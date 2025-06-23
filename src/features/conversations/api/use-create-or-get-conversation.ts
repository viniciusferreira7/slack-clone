'use client'

import { useMutation } from 'convex/react'
import { useCallback, useMemo, useState } from 'react'

import { api } from '../../../../convex/_generated/api'
import type { Doc, Id } from '../../../../convex/_generated/dataModel'

interface CreateOrGetConversationRequest {
  workspaceId: Id<'workspaces'>
  memberId: Id<'members'>
}

interface CreateOrGetConversationResponse {
  conversation: Doc<'conversations'>
}

interface Options {
  onSuccess?: (data: CreateOrGetConversationResponse) => void
  onError?: (err: unknown) => void
  onSettled?: VoidFunction
  throwError?: boolean
}

type Status = 'pending' | 'error' | 'success' | 'settled' | null

export const useCreateOrGetConversation = () => {
  const [data, setData] = useState<CreateOrGetConversationResponse | null>(null)
  const [error, setError] = useState<null | unknown>()

  const [status, setStatus] = useState<Status>(null)

  const isPending = useMemo(() => status === 'pending', [status])
  const isError = useMemo(() => status === 'error', [status])
  const isSuccess = useMemo(() => status === 'success', [status])
  const isSettled = useMemo(() => status === 'settled', [status])

  const mutation = useMutation(api.conversations.createOrGet)

  const mutate = useCallback(
    async (values: CreateOrGetConversationRequest, options?: Options) => {
      try {
        setData(null)

        setStatus('pending')

        const response = await mutation(values)

        if (response instanceof Error) return

        options?.onSuccess?.(response)
        setData(response)
        setStatus('success')
      } catch (err) {
        setStatus('error')
        options?.onError?.(err)
        setError(err)

        if (options?.throwError) {
          throw err
        }
      } finally {
        options?.onSettled?.()
        setStatus('settled')
      }
    },
    [mutation],
  )

  return { mutate, data, error, isPending, isError, isSuccess, isSettled }
}
