'use client'

import dayjs from 'dayjs'
import dynamic from 'next/dynamic'
import { toast } from 'sonner'

import { useDeleteMessage } from '@/features/messages/api/use-delete-message'
import type { UseGetMessagesReturnType } from '@/features/messages/api/use-get-message'
import { useUpdateMessage } from '@/features/messages/api/use-update-message'
import { useToggleReaction } from '@/features/reactions/api/use-toggle-reaction'
import { useConfirm } from '@/hooks/use-confirm'
import { usePanel } from '@/hooks/use-panel'
import { cn } from '@/lib/utils'
import { isToday } from '@/utils/date/is-today'
import { isYesterday } from '@/utils/date/is-yesterday'

import type { Id } from '../../../convex/_generated/dataModel'
import { Hint } from '../hint'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { MessageToolbar } from './message-toolbar'
import { Reactions } from './reactions'
import { Thumbnail } from './thumbnail'

const Renderer = dynamic(() => import('./renderer'), { ssr: false })
const Editor = dynamic(() => import('../editor'), { ssr: false })

type MessageProps = UseGetMessagesReturnType[number] & {
  isEditing: boolean
  onEditingId: (id: Id<'messages'> | null) => void
  isCompact: boolean
  hideThreadButton: boolean
  isAuthor: boolean
}

export function Message(props: MessageProps) {
  const { parentMessageId, onOpenChange, onClose } = usePanel()

  const { mutate: updateMessage, isPending: isUpdatingMessage } =
    useUpdateMessage()

  const [ConfirmDialog, confim] = useConfirm({
    title: 'Delete message',
    message: 'Are you sure want to delete this message? This cannot be undone',
  })
  const { mutate: deleteMessage, isPending: isDeletingMessage } =
    useDeleteMessage()

  const { mutate: toggleReaction, isPending: isTogglingReaction } =
    useToggleReaction()

  function formatFullTime(date: Date) {
    const formattedDate = dayjs(date).format('MMM d, YYYY [ at ] hh:mm:ss A')

    if (isToday(date)) return `Today ${dayjs(date).format('[ at ] hh:mm:ss A')}`

    if (isYesterday(date))
      return `Yesterday ${dayjs(date).format('[ at ] hh:mm:ss A')}`

    return formattedDate
  }

  const isPending = isUpdatingMessage || isDeletingMessage || isTogglingReaction

  async function handleUpdateMessage({ body }: { body: string }) {
    const ok = await confim()

    if (!ok) return

    await updateMessage(
      {
        id: props._id,
        body,
      },
      {
        onSuccess: () => {
          toast.success('Message was updated')
          props.onEditingId(null)
        },
        onError: () => {
          toast.error('Failed to update message')
        },
      },
    )
  }

  async function handleDeleteMessage() {
    await deleteMessage(
      {
        id: props._id,
      },
      {
        onSuccess: () => {
          toast.success('Message was deleted')

          if (parentMessageId === props._id) {
            onClose()
          }
        },
        onError: () => {
          toast.error('Failed to delete message')
        },
      },
    )
  }

  async function handleToggleReaction(value: string) {
    await toggleReaction(
      {
        messageId: props._id,
        value,
      },
      {
        onError: () => {
          toast.error('Failed to toggle reaction')
        },
      },
    )
  }

  if (props.isCompact) {
    return (
      <>
        <div
          className={cn(
            'group relative flex flex-col gap-2 px-5 hover:bg-gray-100/60',
            props.isEditing && 'bg-slack-yellow-100 hover:bg-slack-yellow-100',
          )}
        >
          <div className="flex items-start gap-2">
            <Hint label={formatFullTime(new Date(props._creationTime))}>
              <button className="w-[40px] text-center text-xs leading-[22px] text-muted-foreground opacity-0 hover:underline group-hover:opacity-100">
                {dayjs(new Date(props._creationTime)).format('HH:mm')}
              </button>
            </Hint>
            {props.isEditing ? (
              <div className="h-full w-full">
                <Editor
                  variant="update"
                  onSubmit={handleUpdateMessage}
                  disabled={isPending}
                  defaultValue={JSON.parse(props.body)}
                  onCancel={() => props.onEditingId(null)}
                />
              </div>
            ) : (
              <div className="flex w-full flex-col">
                <Renderer value={props.body} />
                <Thumbnail url={props.image} />
                {props.updatedAt && (
                  <span className="text-xs text-muted-foreground">
                    (Edited)
                  </span>
                )}
                <Reactions
                  reactions={props.reactions}
                  onReactionChange={handleToggleReaction}
                />
              </div>
            )}
          </div>
          {!props.isEditing && (
            <MessageToolbar
              isAuthor={props.isAuthor}
              isPending={isPending}
              onEdit={() => props.onEditingId(props._id)}
              onThread={() => onOpenChange(props._id)}
              onDelete={handleDeleteMessage}
              onReaction={handleToggleReaction}
              hideThreadButton={props.hideThreadButton}
            />
          )}
        </div>
        <ConfirmDialog />
      </>
    )
  }

  const avatarFallback = (props.user.name ?? 'Member').charAt(0).toUpperCase()

  return (
    <>
      <div
        className={cn(
          'group relative flex flex-col gap-2 px-5 hover:bg-gray-100/60',
          props.isEditing && 'bg-slack-yellow-100 hover:bg-slack-yellow-100',
          isDeletingMessage &&
            'origin-bottom scale-y-0 transform bg-rose-500/50 transition-all duration-200',
        )}
      >
        <div className="flex items-start gap-2">
          <button>
            <Avatar>
              <AvatarFallback className="rounded-md bg-sky-500 text-white">
                {avatarFallback}
              </AvatarFallback>
              <AvatarImage src={props.user.image} />
            </Avatar>
          </button>
          {props.isEditing ? (
            <div className="h-full w-full">
              <Editor
                variant="update"
                onSubmit={handleUpdateMessage}
                disabled={isPending}
                defaultValue={JSON.parse(props.body)}
                onCancel={() => props.onEditingId(null)}
              />
            </div>
          ) : (
            <div className="flex w-full flex-col overflow-hidden">
              <div className="text-sm">
                <button className="font-bold text-primary">
                  {props.user.name}
                </button>
                <span>&nbsp;&nbsp;</span>
                <Hint label={formatFullTime(new Date(props._creationTime))}>
                  <button className="text-sm text-muted-foreground hover:underline">
                    {dayjs(new Date(props._creationTime)).format('hh:mm A')}
                  </button>
                </Hint>
              </div>
              <Renderer value={props.body} />
              <Thumbnail url={props.image} />
              {props.updatedAt && (
                <span className="text-xs text-muted-foreground">(Edited)</span>
              )}
              <Reactions
                reactions={props.reactions}
                onReactionChange={handleToggleReaction}
              />
            </div>
          )}
        </div>
        {!props.isEditing && (
          <MessageToolbar
            isAuthor={props.isAuthor}
            isPending={isPending}
            onEdit={() => props.onEditingId(props._id)}
            onThread={() => onOpenChange(props._id)}
            onDelete={handleDeleteMessage}
            onReaction={handleToggleReaction}
            hideThreadButton={props.hideThreadButton}
          />
        )}
      </div>
      <ConfirmDialog />
    </>
  )
}
