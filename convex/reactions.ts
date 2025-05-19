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

export const toggle = mutation({
  args: {
    messageId: v.id('messages'),
    value: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)

    if (!userId) {
      throw new Error('Unauthorized')
    }

    const message = await ctx.db.get(args.messageId)

    if (!message) {
      throw new Error('Message not found')
    }

    const member = await getMember(ctx, message.workspaceId, userId)

    if (!member) {
      throw new Error('Unauthorized')
    }

    const existingMessageReactionsFromUser = await ctx.db
      .query('reactions')
      .filter((q) =>
        q.and(
          q.eq(q.field('messageId'), message._id),
          q.eq(q.field('memberId'), member._id),
          q.eq(q.field('value'), args.value),
        ),
      )
      .first()

    if (existingMessageReactionsFromUser) {
      await ctx.db.delete(existingMessageReactionsFromUser._id)

      return { reaction: existingMessageReactionsFromUser }
    } else {
      const newReaction = await ctx.db.insert('reactions', {
        value: args.value,
        memberId: member._id,
        messageId: message._id,
        workspaceId: member.workspaceId,
      })

      return { reaction: newReaction }
    }
  },
})
