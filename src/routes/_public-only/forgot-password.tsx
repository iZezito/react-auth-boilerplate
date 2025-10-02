import { createFileRoute } from '@tanstack/react-router'
import ForgotPasswordForm from '@/pages/forgot-password'

export const Route = createFileRoute('/_public-only/forgot-password')({
  component: ForgotPasswordForm,
})
