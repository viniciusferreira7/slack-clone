import { usePaginatedQuery } from 'convex/react'

import { api } from '../../../../convex/_generated/api'
import type { Id } from '../../../../convex/_generated/dataModel'

const BATCH_SIZE = 20

interface UseGetMessagesProps {
  channelId?: Id<'channels'>
  conversationId?: Id<'conversations'>
  parentMessageId?: Id<'messages'>
}

export type UseGetMessagesReturnType =
  (typeof api.messages.get._returnType)['page']

export const useGetMessages = ({ ...props }: UseGetMessagesProps) => {
  const { results, status, loadMore, isLoading } = usePaginatedQuery(
    api.messages.get,
    props,
    {
      initialNumItems: BATCH_SIZE,
    },
  )

  return { results, status, loadMore: () => loadMore(BATCH_SIZE), isLoading }
}
