import { createFileRoute } from '@tanstack/react-router'
import EmailValidation from '@/pages/validate-email'

export const Route = createFileRoute('/_public-only/validate-email')({
  component: EmailValidation,
})
