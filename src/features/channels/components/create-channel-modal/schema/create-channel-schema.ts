import { z } from 'zod'

import { createSlug } from '@/utils/create-slug'

export const createChannelSchema = z.object({
  name: z
    .string()
    .min(3, {
      message: 'The channel name must be longer than 3 characters',
    })
    .max(80, {
      message: 'The channel name must be smaller or equal than 80 characters',
    })
    .transform((value) => createSlug(value)),
})

export type CreateChannelSchema = z.input<typeof createChannelSchema>
