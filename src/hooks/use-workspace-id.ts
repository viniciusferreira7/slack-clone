'use client'

import { useParams } from 'next/navigation'

import type { Id } from '../../convex/_generated/dataModel'

export const useWorkspaceId = () => {
  const params = useParams<{ id: string }>()

  return params.id as Id<'workspaces'>
}
