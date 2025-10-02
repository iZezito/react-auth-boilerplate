import { createFileRoute, redirect, Outlet } from '@tanstack/react-router'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/app-sidebar'

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: ({ context, location }) => {
    const { auth } = context

    if (!auth.user && !auth.loading) {
      throw redirect({
        to: '/login',
        search: {
          redirect: location.href,
        },
      })
    }
    console.log("passou aqui")
    console.log("user: ", auth.user)
    console.log("loading: ", auth.loading)
  },
  component: AuthenticatedLayout,
})

function AuthenticatedLayout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  )
}
