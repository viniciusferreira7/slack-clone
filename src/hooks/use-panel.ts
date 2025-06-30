'use client'

import { useProfileMemberId } from '@/features/members/store/use-profile-member-id'
import { useParentMessageId } from '@/features/messages/store/use-parent-message-id'

export const usePanel = () => {
  const [profileMemberId, setProfileMemberId] = useProfileMemberId()
  const [parentMessageId, setParentMessageId] = useParentMessageId()

  function onOpenProfileMember(profileMemberId: string) {
    setProfileMemberId(profileMemberId)
    setParentMessageId(null)
  }

  function onCloseProfileMember() {
    setProfileMemberId(null)
  }

  function onOpenChange(messageId: string) {
    setParentMessageId(messageId)
    setProfileMemberId(null)
  }

  function onClose() {
    setParentMessageId(null)
  }

  return {
    profileMemberId,
    onOpenProfileMember,
    onCloseProfileMember,
    parentMessageId,
    onOpenChange,
    onClose,
  }
}
