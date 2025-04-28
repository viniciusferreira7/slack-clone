'use client'

import { useMutation } from 'convex/react'
import { useCallback, useMemo, useState } from 'react'

import { api } from '../../../../convex/_generated/api'

type GenerateUploadUrlResponse = string

interface Options {
  onSuccess?: (data: GenerateUploadUrlResponse) => void
  onError?: (err: unknown) => void
  onSettled?: VoidFunction
  throwError?: boolean
}

type Status = 'pending' | 'error' | 'success' | 'settled' | null

export const useGenerateUploadUrl = () => {
  const [data, setData] = useState<GenerateUploadUrlResponse | null>(null)
  const [error, setError] = useState<null | unknown>()

  const [status, setStatus] = useState<Status>(null)

  const isPending = useMemo(() => status === 'pending', [status])
  const isError = useMemo(() => status === 'error', [status])
  const isSuccess = useMemo(() => status === 'success', [status])
  const isSettled = useMemo(() => status === 'settled', [status])

  const mutation = useMutation(api.upload.generateUploadUrl)

  const mutate = useCallback(
    async (options?: Options) => {
      try {
        setData(null)

        setStatus('pending')

        const response = await mutation()

        if ((response as unknown) instanceof Error) return

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
