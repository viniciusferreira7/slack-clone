'use client'

import { AlertTriangle, Loader, XIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { ResizableHandle, ResizablePanel } from '@/components/ui/resizable'
import { usePanel } from '@/hooks/use-panel'
import { useWorkspaceId } from '@/hooks/use-workspace-id'

import type { Id } from '../../../../convex/_generated/dataModel'
import { useGetMember } from '../api/use-get-member'

export function Profile() {
  const { profileMemberId, parentMessageId, onCloseProfileMember } = usePanel()

  const workspaceId = useWorkspaceId()

  const { data: member, isLoading: isMemberLoading } = useGetMember({
    workspaceId: workspaceId as Id<'workspaces'>,
    memberId: profileMemberId as Id<'members'>,
  })

  if (!profileMemberId && !!parentMessageId) {
    return null
  }

  const isLoading = isMemberLoading

  const showPanel = !isLoading && !!profileMemberId && !parentMessageId

  return (
    <>
      <ResizableHandle withHandle />
      <ResizablePanel minSize={20} defaultSize={20}>
        {!member && !isLoading && (
          <div className="flex h-full flex-col">
            <div className="flex min-h-[49px] items-center justify-between border-b px-4">
              <p className="text-lg font-bold">Thread</p>
              <Button
                variant="ghost"
                size="iconSm"
                onClick={onCloseProfileMember}
              >
                <XIcon className="size-5 stroke-[1.5]" />
              </Button>
            </div>
            <div className="flex h-full flex-col items-center justify-center gap-y-2">
              <AlertTriangle className="size-5 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Member not found</p>
            </div>
          </div>
        )}
        {showPanel ? (
          <div className="flex h-full flex-col">
            <div className="flex min-h-[49px] items-center justify-between border-b px-4">
              <p className="text-lg font-bold">Profile</p>
              <Button
                variant="ghost"
                size="iconSm"
                onClick={onCloseProfileMember}
              >
                <XIcon className="size-5 stroke-[1.5]" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid h-full place-items-center">
            <Loader className="size-5 animate-spin text-muted-foreground" />
          </div>
        )}
      </ResizablePanel>
    </>
  )
}
