import { getAuthUserId } from '@convex-dev/auth/server'
import { v } from 'convex/values'

import type { Id } from './_generated/dataModel'
import { mutation, type QueryCtx } from './_generated/server'

const getMember = async (
  ctx: QueryCtx,
  workspaceId: Id<'workspaces'>,
  userId: Id<'users'>,
) => {
  return ctx.db
    .query('members')
    .withIndex('by_workspace_id_user_id', (q) =>
      q.eq('workspaceId', workspaceId).eq('userId', userId),
    )
    .unique()
}

export const create = mutation({
  args: {
    body: v.string(),
    image: v.optional(v.id('_storage')),
    memberId: v.id('members'),
    workspacesId: v.id('workspaces'),
    channelId: v.optional(v.id('channels')),
    parentMessageId: v.optional(v.id('messages')),
    // TODO: Add conversation id here
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)

    if (!userId) {
      throw new Error('Unauthorized')
    }

    const member = await getMember(ctx, args.workspacesId, userId)

    if (!member) {
      throw new Error('Unauthorized')
    }

    // TODO: Handle conversation id

    const messageId = ctx.db.insert('messages', {
      memberId: member._id,
      image: args.image,
      body: args.body,
      workspacesId: args.workspacesId,
      channelId: args.channelId,
      parentMessageId: args.parentMessageId,
      updatedAt: Date.now(),
    })

    return { messageId }
  },
})
