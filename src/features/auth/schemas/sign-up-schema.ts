import { z } from 'zod'

export const signUpSchema = z
  .object({
    email: z.string().email(),
    password: z
      .string()
      .min(6, {
        message: 'Password must be longer than or equal to 6 characters',
      })
      .regex(/[A-Z]/, {
        message: 'Password must contain at least one uppercase letter',
      })
      .regex(/[^a-zA-Z0-9]/, {
        message: 'Password must contain at least one special character',
      }),
    confirmPassword: z.string().min(6, {
      message: 'Password must be longer than or equal to 6 characters',
    }),
  })
  .superRefine((arg, ctx) => {
    if (arg.password !== arg.confirmPassword) {
      ctx.addIssue({
        code: 'custom',
        message: 'Passwords do not match',
        path: ['confirmPassword'],
      })
    }
  })

export type SignUpSchemaInput = z.input<typeof signUpSchema>
export type SignUpSchemaOutput = z.output<typeof signUpSchema>
