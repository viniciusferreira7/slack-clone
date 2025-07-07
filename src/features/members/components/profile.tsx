'use client'

import {
  AlertTriangle,
  ChevronDownIcon,
  Loader,
  MailIcon,
  XIcon,
} from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { ResizableHandle, ResizablePanel } from '@/components/ui/resizable'
import { Separator } from '@/components/ui/separator'
import { usePanel } from '@/hooks/use-panel'
import { useWorkspaceId } from '@/hooks/use-workspace-id'

import type { Id } from '../../../../convex/_generated/dataModel'
import { useCurrentMember } from '../api/use-current-member'
import { useGetMember } from '../api/use-get-member'
import { useRemoveMember } from '../api/use-remove-member copy'
import { useUpdateMember } from '../api/use-update-member'

export function Profile() {
  const workspaceId = useWorkspaceId()

  const { data: currentMember, isLoading: isLoadingCurrentMember } =
    useCurrentMember({
      workspaceId,
    })
  const { profileMemberId, parentMessageId, onCloseProfileMember } = usePanel()

  const { mutate: removeMember, isPending: isRemovingMember } =
    useRemoveMember()
  const { mutate: updateMember, isPending: isUpdatingMember } =
    useUpdateMember()

  const { data: member, isLoading: isMemberLoading } = useGetMember({
    workspaceId: workspaceId as Id<'workspaces'>,
    memberId: profileMemberId as Id<'members'>,
  })

  if (!profileMemberId || !!parentMessageId) {
    return null
  }

  const isLoading = isMemberLoading || isLoadingCurrentMember

  const showPanel = !isLoading && !!profileMemberId && !parentMessageId

  const avatarFallback = member?.user?.name?.charAt(0).toUpperCase()

  function handleRemove() {
    if (!member?._id) return

    removeMember(
      {
        id: member?._id,
      },
      {
        onSuccess: () => {
          toast.success('Member was removed')
        },
      },
    )
  }

  function handleUpdate() {
    if (!member?._id) return

    updateMember(
      {
        id: member?._id,
        role: 'member',
      },
      {
        onSuccess: () => {
          toast.success('Member was updated')
        },
      },
    )
  }
  return (
    <>
      <ResizableHandle withHandle />
      <ResizablePanel minSize={20} defaultSize={20}>
        {!member && !isLoading && (
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
            <div className="flex flex-col items-center justify-center p-4">
              <Avatar className="size-full max-h-[256px] max-w-[256px]">
                <AvatarImage src={member?.user?.image} />
                <AvatarFallback className="aspect-square bg-sky-500 text-6xl text-white">
                  {avatarFallback ?? 'M'}
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="flex flex-col p-4">
              <div className="flex flex-col p-4">
                <p className="text-xl font-bold">{member?.user?.name}</p>
                {currentMember?.role === 'admin' &&
                currentMember._id !== member?._id ? (
                  <div className="mt-4 flex items-center gap-2">
                    <Button
                      variant="outline"
                      className="w-full capitalize"
                      onClick={handleUpdate}
                      disabled={isRemovingMember || isUpdatingMember}
                    >
                      {member?.role} <ChevronDownIcon />
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={handleRemove}
                      disabled={isRemovingMember || isUpdatingMember}
                    >
                      Remove
                    </Button>
                  </div>
                ) : (
                  currentMember?._id === member?._id &&
                  currentMember?.role !== 'admin' && (
                    <div className="mt-4">
                      <Button variant="outline" className="w-full">
                        Leave
                      </Button>
                    </div>
                  )
                )}
              </div>
              <Separator />
              <div className="flex flex-col p-4">
                <p className="mb-4 text-sm font-bold">Contact information</p>
                <div className="flex items-center gap-2">
                  <div className="flex size-9 items-center justify-center rounded-md bg-muted">
                    <MailIcon className="size-4" />
                  </div>
                  <div className="flex flex-col">
                    <p className="text-[13px] font-semibold text-muted-foreground">
                      Email address
                    </p>
                    <Link
                      href={`mailto:${member?.user?.email}`}
                      className="text-sm text-slack-blue-200 hover:underline"
                    >
                      {member?.user?.email}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
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
            <div className="flex h-full flex-col items-center justify-center gap-y-2">
              <Loader className="size-5 animate-spin text-muted-foreground" />
            </div>
          </div>
        )}
      </ResizablePanel>
    </>
  )
}
