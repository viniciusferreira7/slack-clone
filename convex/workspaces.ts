import { getAuthUserId } from '@convex-dev/auth/server'
import { v } from 'convex/values'

import { mutation, query } from './_generated/server'

const generateCode = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let code = ''
  for (let i = 0; i < 8; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length)
    code += chars[randomIndex]
  }
  return code
}

export const getInfoById = query({
  args: {
    id: v.id('workspaces'),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)

    if (!userId) {
      return null
    }

    const member = await ctx.db
      .query('members')
      .withIndex('by_workspace_id_user_id', (q) =>
        q.eq('workspaceId', args.id).eq('userId', userId),
      )
      .unique()

    const workspace = await ctx.db.get(args.id)

    return {
      name: workspace?.name,
      isMember: !!member,
    }
  },
})

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

export const join = mutation({
  args: {
    joinCode: v.string(),
    workspaceId: v.id('workspaces'),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) {
      throw new Error('Unauthorized')
    }

    const workspace = await ctx.db.get(args.workspaceId)

    if (!workspace) {
      throw new Error('Workspace not found')
    }

    if (workspace.joinCode !== args.joinCode) {
      throw new Error('Invalid join code')
    }

    const userAlreadyIsMember = await ctx.db
      .query('members')
      .withIndex('by_workspace_id_user_id', (q) =>
        q.eq('workspaceId', args.workspaceId).eq('userId', userId),
      )
      .unique()

    if (userAlreadyIsMember) {
      throw new Error('Already a member of this workspace')
    }

    await ctx.db.insert('members', {
      userId,
      role: 'member',
      workspaceId: workspace?._id,
    })

    return { workspaceId: workspace?._id }
  },
})

export const newJoinCode = mutation({
  args: {
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

    if (!member || member.role !== 'admin') {
      throw new Error('Unauthorized')
    }

    await ctx.db.patch(args.workspaceId, {
      joinCode: generateCode(),
    })

    return { workspaceId: args.workspaceId }
  },
})

export const create = mutation({
  args: { workspace_name: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) {
      throw new Error('Unauthorized')
    }

    const joinCode = generateCode()

    const newWorkspaceId = await ctx.db.insert('workspaces', {
      name: args.workspace_name,
      userId,
      joinCode,
    })

    const [memberId, channelId] = await Promise.all([
      ctx.db.insert('members', {
        role: 'admin',
        userId,
        workspaceId: newWorkspaceId,
      }),
      ctx.db.insert('channels', {
        name: 'general',
        workspaceId: newWorkspaceId,
      }),
    ])

    return { workspaceId: newWorkspaceId, memberId, channelId }
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

    const [members, channels, reactions, conversations, messages] =
      await Promise.all([
        ctx.db
          .query('members')
          .withIndex('by_workspace_id_user_id', (q) =>
            q.eq('workspaceId', args.id),
          )
          .collect(),
        ctx.db
          .query('channels')
          .withIndex('by_workspace_id', (q) => q.eq('workspaceId', args.id))
          .collect(),
        ctx.db
          .query('reactions')
          .withIndex('by_workspace_id', (q) => q.eq('workspaceId', args.id))
          .collect(),
        ctx.db
          .query('conversations')
          .withIndex('by_workspace_id', (q) => q.eq('workspaceId', args.id))
          .collect(),
        ctx.db
          .query('messages')
          .withIndex('by_workspace_id', (q) => q.eq('workspaceId', args.id))
          .collect(),
      ])

    await Promise.all([
      members.map((member) => ctx.db.delete(member._id)),
      channels.map((channel) => ctx.db.delete(channel._id)),
      reactions.map((reaction) => ctx.db.delete(reaction._id)),
      conversations.map((conversation) => ctx.db.delete(conversation._id)),
      messages.map((message) => ctx.db.delete(message._id)),
    ])

    await ctx.db.delete(args.id)

    return { workspaceId: args.id }
  },
})
