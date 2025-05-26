'use client'

import { useQueryState } from 'nuqs'

export const useParentMessageId = () => {
  return useQueryState('parent_message_id')
}
