import { z } from 'zod'

export const createWorkspaceFormSchema = z.object({
  workspace_name: z.string().min(3),
})

export type CreateWorkspaceFormSchemaInput = z.input<
  typeof createWorkspaceFormSchema
>

export type CreateWorkspaceFormSchemaOutput = z.output<
  typeof createWorkspaceFormSchema
>
