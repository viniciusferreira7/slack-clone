import dynamic from 'next/dynamic'

import type { UseGetMessagesReturnType } from '@/features/messages/api/use-get-message'

import type { Id } from '../../../convex/_generated/dataModel'

const Renderer = dynamic(() => import('./renderer'), { ssr: false })

type MessageProps = UseGetMessagesReturnType[number] & {
  isEditing: boolean
  onEditingId: (id: Id<'messages'>) => void
  isCompact: boolean
  hideThreadButton: boolean
  isAuthor: boolean
}

export function Message(props: MessageProps) {
  return (
    <div>
      <Renderer value={props.body} />
    </div>
  )
}
