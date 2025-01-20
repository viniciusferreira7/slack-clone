import { z } from 'zod'

export const createWorkspaceFormSchema = z.object({
  workspace_name: z
    .string()
    .min(3, { message: 'The workspace name must be longer than 3 characters' }),
})

export type CreateWorkspaceFormSchemaInput = z.input<
  typeof createWorkspaceFormSchema
>

export type CreateWorkspaceFormSchemaOutput = z.output<
  typeof createWorkspaceFormSchema
>
