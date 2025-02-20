'use client'

import { useMutation } from 'convex/react'
import { useCallback, useMemo, useState } from 'react'

import { api } from '../../../../convex/_generated/api'
import type { Id } from '../../../../convex/_generated/dataModel'

interface UpdateWorkspaceRequest {
  workspace_id: Id<'workspaces'>
  workspace_name: string
}
interface UpdateWorkspaceResponse {
  workspaceId: Id<'workspaces'>
}

interface Options {
  onSuccess?: (data: UpdateWorkspaceResponse) => void
  onError?: (err: unknown) => void
  onSettled?: VoidFunction
}

type Status = 'pending' | 'error' | 'success' | 'settled' | null

export const useUpdateWorkspace = () => {
  const [data, setData] = useState<UpdateWorkspaceResponse | null>(null)
  const [error, setError] = useState<null | unknown>()

  const [status, setStatus] = useState<Status>(null)

  const isPending = useMemo(() => status === 'pending', [status])
  const isError = useMemo(() => status === 'error', [status])
  const isSuccess = useMemo(() => status === 'success', [status])
  const isSettled = useMemo(() => status === 'settled', [status])

  const mutation = useMutation(api.workspaces.update)

  const mutate = useCallback(
    async (values: UpdateWorkspaceRequest, options?: Options) => {
      try {
        setData(null)

        setStatus('pending')

        const response = await mutation({
          id: values.workspace_id,
          name: values.workspace_name,
        })

        if (response instanceof Error) return

        options?.onSuccess?.(response)
        setData(response)
        setStatus('success')
      } catch (err) {
        setStatus('error')
        options?.onError?.(err)
        setError(err)
      } finally {
        options?.onSettled?.()
        setStatus('settled')
      }
    },
    [mutation],
  )

  return { mutate, data, error, isPending, isError, isSuccess, isSettled }
}
