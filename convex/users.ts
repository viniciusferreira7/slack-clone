import { getAuthUserId } from '@convex-dev/auth/server'
import { v } from 'convex/values'

import { query } from './_generated/server'

export const currentUser = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) {
      return null
    }
    return await ctx.db.get(userId)
  },
})

export const getById = query({
  args: {
    id: v.id('users'),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) {
      return null
    }
    return await ctx.db.get(args.id)
  },
})
