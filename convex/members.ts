import { getAuthUserId } from '@convex-dev/auth/server'
import { v } from 'convex/values'

import { query } from './_generated/server'

export const currentMember = query({
  args: {
    workspaceId: v.id('workspaces'),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)

    if (!userId) {
      return null
    }

    const members = await ctx.db
      .query('members')
      .withIndex('by_workspace_id_user_id', (q) =>
        q.eq('workspaceId', args.workspaceId).eq('userId', userId),
      )
      .collect()

    if (!members.length) {
      return null
    }

    return { members }
  },
})
