import type { Doc } from '../../../../../../../convex/_generated/dataModel'

interface HeaderProps {
  channel: Doc<'channels'>
}

export function Header({ channel }: HeaderProps) {
  return <header>{channel.name}</header>
}
