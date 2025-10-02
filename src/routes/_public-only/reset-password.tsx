import { createFileRoute } from '@tanstack/react-router'
import ResetPasswordForm from '@/pages/reset-password'

export const Route = createFileRoute('/_public-only/reset-password')({
  component: ResetPasswordForm,
})
