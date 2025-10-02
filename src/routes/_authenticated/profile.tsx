import { createFileRoute } from '@tanstack/react-router'
import Profile from '@/pages/profile'
import { Roles } from '@/types'

export const Route = createFileRoute('/_authenticated/profile')({
  beforeLoad: ({ context }) => {
    const { auth } = context

    if (auth.user && !auth.user.role) {
      throw new Error('Usuário sem role definida')
    }
    console.log("auth.user in profile: ", auth.user)

    // Aqui você pode adicionar verificação de roles específicas se necessário
    // Por exemplo: if (!auth.user || ![Roles.DEFAULT, Roles.ADMIN].includes(auth.user.role))
  },
  component: Profile,
})
