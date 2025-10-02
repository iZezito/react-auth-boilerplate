import { createFileRoute } from '@tanstack/react-router'
import { LoginForm } from '@/pages/login'
import { z } from 'zod'

const loginSearchSchema = z.object({
  redirect: z.string().optional(),
})

export const Route = createFileRoute('/_public-only/login')({
  validateSearch: loginSearchSchema,
  component: LoginForm,
})
