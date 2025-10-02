import { createFileRoute } from '@tanstack/react-router'
import { SignupForm } from '@/pages/signup'

export const Route = createFileRoute('/_public-only/signup')({
  component: SignupForm,
})
