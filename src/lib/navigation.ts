import type { LucideIcon } from "lucide-react"
import {
  ClipboardList,
  Home,
  LayoutDashboard,
  Settings,
  SquareStack,
  Users,
} from "lucide-react"

export type NavigationSubItem = {
  title: string
  url: string
}

export type NavigationItem = {
  title: string
  icon: LucideIcon
  url: string
  items?: NavigationSubItem[]
}

export const navigationItems: NavigationItem[] = [
  {
    title: "Home",
    icon: Home,
    url: "/",
  },
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    url: "/dashboard",
  },
  {
    title: "Settings",
    icon: Settings,
    url: "/settings",
  },
  {
    title: "Forms",
    icon: ClipboardList,
    url: "/forms",
  },
  {
    title: "Modals",
    icon: SquareStack,
    url: "/modals",
  },
  {
    title: "Team",
    icon: Users,
    url: "/team",
    items: [
      { title: "Members", url: "/team/members" },
      { title: "Permissions", url: "/team/permissions" },
      { title: "Invitations", url: "/team/invitations" },
    ],
  },
]

export function getPageTitle(pathname: string): string {
  for (const item of navigationItems) {
    if (item.items) {
      const subItem = item.items.find((sub) => sub.url === pathname)
      if (subItem) return subItem.title
    }
    if (item.url === pathname) return item.title
  }

  if (pathname === "/") return "Home"

  const segment = pathname.split("/").filter(Boolean).pop()
  if (!segment) return "Home"

  return segment.charAt(0).toUpperCase() + segment.slice(1)
}

export function getPageIcon(pathname: string): LucideIcon {
  for (const item of navigationItems) {
    if (item.items) {
      const subItem = item.items.find((sub) => sub.url === pathname)
      if (subItem) return item.icon
      if (isNavItemActive(pathname, item.url)) return item.icon
    }
    if (item.url === pathname) return item.icon
  }

  return Home
}

export function isNavItemActive(pathname: string, url: string): boolean {
  if (url === "/") return pathname === "/"
  return pathname === url || pathname.startsWith(`${url}/`)
}
