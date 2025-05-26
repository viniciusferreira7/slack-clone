import { useQuery } from 'convex/react'

import { api } from '../../../../convex/_generated/api'
import type { Id } from '../../../../convex/_generated/dataModel'

interface UseGetMessageProps {
  messageId: Id<'messages'>
}

export const useGetMessage = ({ messageId }: UseGetMessageProps) => {
  const data = useQuery(api.messages.getById, {
    id: messageId,
  })
  const isLoading = data === undefined

  return { data, isLoading }
}
