import { getAuthUserId } from '@convex-dev/auth/server'
import { v } from 'convex/values'

import type { Id } from './_generated/dataModel'
import { query, type QueryCtx } from './_generated/server'

const getUserById = async (ctx: QueryCtx, userId: Id<'users'>) => {
  return await ctx.db.get(userId)
}

export const get = query({
  args: {
    workspaceId: v.id('workspaces'),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)

    if (!userId) {
      return null
    }

    const member = await ctx.db
      .query('members')
      .withIndex('by_workspace_id_user_id', (q) =>
        q.eq('workspaceId', args.workspaceId).eq('userId', userId),
      )
      .unique()

    if (!member) {
      return []
    }

    const data = await ctx.db
      .query('members')
      .withIndex('by_workspace_id_user_id', (q) =>
        q.eq('workspaceId', args.workspaceId),
      )
      .collect()

    const members = await Promise.all(
      data.map(async (item) => {
        const user = await getUserById(ctx, item.userId)
        return {
          ...member,
          user,
        }
      }),
    )

    return members.filter((item) => !!item?._id)
  },
})

export const currentMember = query({
  args: {
    workspaceId: v.id('workspaces'),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)

    if (!userId) {
      return null
    }

    const member = await ctx.db
      .query('members')
      .withIndex('by_workspace_id_user_id', (q) =>
        q.eq('workspaceId', args.workspaceId).eq('userId', userId),
      )
      .unique()

    return member
  },
})
