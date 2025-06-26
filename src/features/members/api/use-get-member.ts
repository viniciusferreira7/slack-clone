import { useQuery } from 'convex/react'

import { api } from '../../../../convex/_generated/api'
import type { Id } from '../../../../convex/_generated/dataModel'

interface UseGetMemberProps {
  workspaceId: Id<'workspaces'>
  memberId: Id<'members'>
}

export const useGetMember = ({ workspaceId, memberId }: UseGetMemberProps) => {
  const data = useQuery(api.members.getById, {
    workspaceId,
    id: memberId,
  })
  const isLoading = data === undefined

  return { data, isLoading }
}
