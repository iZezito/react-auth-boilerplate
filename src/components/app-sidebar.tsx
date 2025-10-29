import * as React from "react";
import {
  AudioWaveform,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Home,
  FileText,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Grupo Alvares",
      logo: GalleryVerticalEnd,
      plan: "Empresa",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Home",
      url: "/home",
      icon: Home,
    },
    {
      title: "Posts",
      url: "/posts",
      icon: FileText,
    },
    // {
    //   title: "Tickets",
    //   url: "#",
    //   icon: Ticket,
    //   items: [
    //     {
    //       title: "Abrir Ticket",
    //       url: "/abrir-ticket",
    //     },
    //     {
    //       title: "Listar Tickets",
    //       url: "/tasks",
    //     },
    //   ],
    // },
    // {
    //   title: "Rede Social",
    //   url: "#",
    //   icon: Share2,
    //   items: [],
    // },
    // {
    //   title: "Treinamentos",
    //   url: "#",
    //   icon: BookOpen,
    //   items: [
    //     {
    //       title: "Comercial",
    //       url: "/treinamento",
    //     },
    //     {
    //       title: "Logistica",
    //       url: "#",
    //     },
    //     {
    //       title: "Financeiro",
    //       url: "#",
    //     },
    //     {
    //       title: "Faturamento",
    //       url: "#",
    //     },
    // ],
    // },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        {/* <TeamSwitcher teams={data.teams} /> */}
        <SidebarMenuItem>
          <SidebarMenuButton
            asChild
            className="data-[slot=sidebar-menu-button]:!p-1.5"
          >
            <span className="text-lg font-semibold text-primary">
              REACT-AUTH
            </span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        {/* <NavProjects projects={data.projects} /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser  />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
