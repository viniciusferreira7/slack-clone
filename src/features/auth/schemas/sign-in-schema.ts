import { z } from 'zod'

export const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, {
    message: 'password must be longer than or equal to 6 characters',
  }),
})

export type SignInSchemaInput = z.input<typeof signInSchema>
export type SignInSchemaOutput = z.output<typeof signInSchema>
