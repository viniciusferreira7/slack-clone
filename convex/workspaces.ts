import { getAuthUserId } from '@convex-dev/auth/server'
import { v } from 'convex/values'

import { mutation, query } from './_generated/server'

export const getById = query({
  args: {
    id: v.id('workspaces'),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)

    if (!userId) {
      throw new Error('Unauthorized')
    }

    return ctx.db.get(args.id)
  },
})

export const get = query({
  args: {},
  handler: async (ctx) => {
    return ctx.db.query('workspaces').collect()
  },
})

export const create = mutation({
  args: { workspace_name: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)
    if (userId === null) {
      return new Error('Unauthorized')
    }

    // TODO: Create proper method later.
    const joinCode = '123456'

    const newWorkspaceId = await ctx.db.insert('workspaces', {
      name: args.workspace_name,
      userId,
      joinCode,
    })

    return { workspaceId: newWorkspaceId }
  },
})
