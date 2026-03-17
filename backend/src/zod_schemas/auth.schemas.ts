import { z } from 'zod'

export const LoginSchema = z.object({
  params: z.object({}).optional(),
  body: z.object({
    email: z.string(),
    password: z.string()
  }),
  query: z.object({}).optional()
})

export const RegisterSchema = z.object({
  params: z.object({}).optional(),
  body: z.object({
    password: z.string(),
    name: z.string(),
    email: z.email(),
    repeat_password: z.string(),
  }).refine((data: any) => data.repeat_password === data.password, {
    message: "Las contraseñas no coinciden",
    path: ['repeat_password']
  }),
  query: z.object({}).optional()
})

export type LoginSchemaType = z.infer<typeof LoginSchema>['body']
export type RegisterSchemaType = z.infer<typeof RegisterSchema>['body']
