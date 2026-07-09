/* eslint-disable react-hooks/static-components */
"use client"

import { usePathname } from "next/navigation"

import { getPageIcon, getPageTitle } from "@/lib/navigation"

export function AppHeader() {
  const pathname = usePathname()
  const Icon = getPageIcon(pathname)

  return (
    <div className="flex items-center gap-2">
      <Icon className="size-5 shrink-0 text-sidebar-primary" />
      <h1 className="font-heading text-lg font-semibold">{getPageTitle(pathname)}</h1>
    </div>
  )
}
