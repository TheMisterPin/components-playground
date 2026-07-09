"use client"
import { Search } from "lucide-react"

import { SidebarGroup, SidebarGroupContent, SidebarInput } from "@/components/ui/sidebar"

export function SearchForm() {
  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="group-data-[collapsible=icon]:hidden"
    >
      <SidebarGroup className="py-0">
        <SidebarGroupContent className="relative">
          <SidebarInput placeholder="Search..." className="pl-8" />
          <Search className="pointer-events-none absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 select-none opacity-50" />
        </SidebarGroupContent>
      </SidebarGroup>
    </form>
  )
}
