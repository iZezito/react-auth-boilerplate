import { createFileRoute, redirect, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/_public-only')({
  beforeLoad: ({ context }) => {
    const { auth } = context
    console.log("user nao public: ", auth.user)
    if (auth.user) {
      throw redirect({
        to: '/home',
      })
    }
  },
  component: PublicOnlyLayout,
})

function PublicOnlyLayout() {
  return <Outlet />
}
