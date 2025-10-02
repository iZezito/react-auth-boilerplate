import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  beforeLoad: ({ context }) => {
    const { auth } = context

    // Se o usuário estiver autenticado, redireciona para /home
    if (auth.user) {
      throw redirect({
        to: '/home',
      })
    }

    // Se não estiver autenticado, redireciona para login
    throw redirect({
      to: '/login',
    })
  },
})
