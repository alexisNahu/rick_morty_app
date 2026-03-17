import { z } from 'zod'

export const LoginSchema = z.object({
  email: z.email(),
  password: z.string().min(6)
})

export const RegisterSchema = z.object({
    password: z.string(),
    name: z.string(),
    email: z.email(),
    repeat_password: z.string()
})

export type LoginSchemaType = z.infer<typeof LoginSchema>
export type RegisterSchemaType = z.infer<typeof RegisterSchema>
