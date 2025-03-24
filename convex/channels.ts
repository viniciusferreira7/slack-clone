import { getAuthUserId } from '@convex-dev/auth/server'
import { v } from 'convex/values'

import { mutation, query } from './_generated/server'

export const update = mutation({
  args: {
    name: v.string(),
    channelId: v.id('channels'),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)

    if (!userId) {
      throw new Error('Unauthorized')
    }

    const channel = await ctx.db.get(args.channelId)

    if (!channel) {
      throw new Error('Channel not found')
    }

    const member = await ctx.db
      .query('members')
      .withIndex('by_workspace_id_user_id', (q) =>
        q.eq('workspaceId', channel.workspaceId).eq('userId', userId),
      )
      .unique()

    if (!member || member?.role !== 'admin') {
      throw new Error('Unauthorized')
    }

    await ctx.db.patch(args.channelId, {
      name: args.name,
    })

    return { channelId: channel._id, workspaceId: channel.workspaceId }
  },
})

export const create = mutation({
  args: {
    name: v.string(),
    workspaceId: v.id('workspaces'),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)

    if (!userId) {
      throw new Error('Unauthorized')
    }

    const member = await ctx.db
      .query('members')
      .withIndex('by_workspace_id_user_id', (q) =>
        q.eq('workspaceId', args.workspaceId).eq('userId', userId),
      )
      .unique()

    if (!member || member?.role !== 'admin') {
      throw new Error('Unauthorized')
    }

    const workspace = await ctx.db.get(args.workspaceId)

    if (!workspace) {
      throw new Error('Unauthorized')
    }

    const parseName = args.name
      .normalize('NFKD')
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '')
      .replace(/_/g, '-')
      .replace(/--+/g, '-')
      .replace(/-$/g, '')

    const createdChannelId = await ctx.db.insert('channels', {
      name: parseName,
      workspaceId: args.workspaceId,
    })

    return { channelId: createdChannelId, workspaceId: args.workspaceId }
  },
})

export const getById = query({
  args: {
    workspaceId: v.id('workspaces'),
    channelId: v.id('channels'),
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
      return null
    }

    const channel = await ctx.db.get(args.channelId)

    return channel
  },
})

export const get = query({
  args: {
    workspaceId: v.id('workspaces'),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)

    if (!userId) {
      return []
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

    const channels = ctx.db
      .query('channels')
      .withIndex('by_workspace_id', (q) =>
        q.eq('workspaceId', args.workspaceId),
      )
      .collect()

    return channels
  },
})
