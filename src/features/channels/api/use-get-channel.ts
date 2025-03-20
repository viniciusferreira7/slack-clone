import { useQuery } from 'convex/react'

import { api } from '../../../../convex/_generated/api'
import type { Id } from '../../../../convex/_generated/dataModel'

interface UseGetChannelProps {
  workspaceId: Id<'workspaces'>
  channelId: Id<'channels'>
}

export const useGetChannel = ({
  workspaceId,
  channelId,
}: UseGetChannelProps) => {
  const data = useQuery(api.channels.getById, {
    workspaceId,
    channelId,
  })
  const isLoading = data === undefined

  return { data, isLoading }
}
