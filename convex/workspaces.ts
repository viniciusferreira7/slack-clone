import { getAuthUserId } from '@convex-dev/auth/server'
import { v } from 'convex/values'

import { mutation, query } from './_generated/server'

const generateCode = () => {
  const timestamp = new Date().getTime()
  const randomPart = Math.random().toString(36).substring(2, 8)
  const code = `${timestamp}${randomPart}`
  return code
}

export const getById = query({
  args: {
    id: v.id('workspaces'),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)

    if (!userId) {
      throw new Error('Unauthorized')
    }

    const member = await ctx.db
      .query('members')
      .withIndex('by_workspace_id_user_id', (q) =>
        q.eq('workspaceId', args.id).eq('userId', userId),
      )
      .unique()

    if (!member) {
      return null
    }

    return ctx.db.get(args.id)
  },
})

export const get = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx)

    if (!userId) {
      return []
    }

    const members = await ctx.db
      .query('members')
      .withIndex('by_user_id', (q) => q.eq('userId', userId))
      .collect()

    const workspaceIds = members.map((member) => member.workspaceId)

    const workspaces = await Promise.all(
      workspaceIds.map((workspaceId) => {
        return ctx.db.get(workspaceId)
      }),
    )

    return workspaces.filter((workspace) => !!workspace)
  },
})

export const create = mutation({
  args: { workspace_name: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)
    if (userId === null) {
      return new Error('Unauthorized')
    }

    const joinCode = generateCode()

    const newWorkspaceId = await ctx.db.insert('workspaces', {
      name: args.workspace_name,
      userId,
      joinCode,
    })

    const memberId = await ctx.db.insert('members', {
      role: 'admin',
      userId,
      workspaceId: newWorkspaceId,
    })

    return { workspaceId: newWorkspaceId, memberId }
  },
})

export const update = mutation({
  args: {
    id: v.id('workspaces'),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)

    if (!userId) {
      throw new Error('Unauthorized')
    }

    const member = await ctx.db
      .query('members')
      .withIndex('by_workspace_id_user_id', (q) =>
        q.eq('workspaceId', args.id).eq('userId', userId),
      )
      .unique()

    if (!member || member.role !== 'admin') {
      throw new Error('Unauthorized')
    }

    await ctx.db.patch(args.id, {
      name: args.name,
    })

    return { workspaceId: args.id }
  },
})

export const remove = mutation({
  args: {
    id: v.id('workspaces'),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)

    if (!userId) {
      throw new Error('Unauthorized')
    }

    const member = await ctx.db
      .query('members')
      .withIndex('by_workspace_id_user_id', (q) =>
        q.eq('workspaceId', args.id).eq('userId', userId),
      )
      .unique()

    if (!member || member.role !== 'admin') {
      throw new Error('Unauthorized')
    }

    const [members] = await Promise.all([
      ctx.db
        .query('members')
        .withIndex('by_workspace_id_user_id', (q) =>
          q.eq('workspaceId', args.id),
        )
        .collect(),
    ])

    await Promise.all(
      members.map((member) => {
        return ctx.db.delete(member._id)
      }),
    )

    await ctx.db.delete(args.id)

    return { workspaceId: args.id }
  },
})
