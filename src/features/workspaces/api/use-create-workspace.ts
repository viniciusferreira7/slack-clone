'use client'

import { useMutation } from 'convex/react'
import { useCallback, useState } from 'react'

import { api } from '../../../../convex/_generated/api'
import type { Id } from '../../../../convex/_generated/dataModel'

interface CreateWorkspaceRequest {
  workspace_name: string
}
interface CreateWorkspaceResponse {
  workspaceId: Id<'workspaces'>
}

interface Options {
  onSuccess?: (data: CreateWorkspaceResponse) => void
  onError?: (err: unknown) => void
  onSettled?: () => void
}

export const useCreateWorkspace = () => {
  const [data, setData] = useState<CreateWorkspaceResponse | null>(null)
  const [error, setError] = useState<null | unknown>()

  const [isPending, setIsPending] = useState(false)
  const [isError, setIsError] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [isSettled, setIsSettled] = useState(false)

  const mutation = useMutation(api.workspaces.create)

  const mutate = useCallback(
    async (values: CreateWorkspaceRequest, options?: Options) => {
      try {
        setData(null)
        setError(null)

        setIsPending(true)
        setIsError(false)
        setIsSuccess(false)
        setIsSettled(false)

        const response = await mutation(values)

        if (response instanceof Error) return

        options?.onSuccess?.(response)
        setData(response)
        setIsError(false)
        setIsSuccess(true)
      } catch (err) {
        options?.onError?.(err)
        setError(err)

        setIsError(true)
        setIsSuccess(false)
      } finally {
        options?.onSettled?.()
        setIsPending(false)
      }
    },
    [mutation],
  )

  return { mutate, data, error, isPending, isError, isSuccess, isSettled }
}
