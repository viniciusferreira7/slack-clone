import { convexAuthNextjsToken } from '@convex-dev/auth/nextjs/server'
import { preloadQuery } from 'convex/nextjs'
import type { Metadata } from 'next'

import { api } from '../../../../../../convex/_generated/api'
import type { Doc, Id } from '../../../../../../convex/_generated/dataModel'
import { Conversation } from './components/conversation'

interface Props {
  params: Promise<{ id: string; memberId: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id: workspaceId, memberId } = await params

  const preloadedMember = await preloadQuery(
    api.members.getById,
    {
      id: memberId as Id<'members'>,
      workspaceId: workspaceId as Id<'workspaces'>,
    },
    { token: await convexAuthNextjsToken() },
  )

  const memberData = preloadedMember._valueJSON as unknown as Doc<'members'>

  const preloadedUser = await preloadQuery(
    api.users.getById,
    {
      id: memberData.userId,
    },
    { token: await convexAuthNextjsToken() },
  )

  const userData = preloadedUser._valueJSON as unknown as Doc<'users'>

  return {
    title: `${userData?.name}`,
  }
}

export default async function MemberIdPage(props: Props) {
  const params = await props.params

  return <Conversation workspaceId={params.id} memberId={params.memberId} />
}
