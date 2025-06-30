'use client'

import { useQueryState } from 'nuqs'

export const useProfileMemberId = () => {
  return useQueryState('profile_member_id')
}
