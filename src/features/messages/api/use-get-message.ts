import { useQuery } from 'convex/react'

import { api } from '../../../../convex/_generated/api'
import type { Id } from '../../../../convex/_generated/dataModel'

interface UseGetMessageProps {
  messageId: Id<'messages'> | null
}

export const useGetMessage = ({ messageId }: UseGetMessageProps) => {
  const data = useQuery(
    api.messages.getById,
    messageId ? { id: messageId } : 'skip',
  )
  const isLoading = data === undefined

  return { data, isLoading }
}
