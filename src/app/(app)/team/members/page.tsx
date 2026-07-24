"use client"

import { UserListPage } from "@/features/users/components/pages/user-list-page"
import { useUserListPage } from "@/features/users/hooks/use-user-list-page"

export default function TeamMembersPage() {
  const page = useUserListPage()

  return (
    <div className="-m-4 flex h-[calc(100svh-4rem)] min-h-0 w-[calc(100%+2rem)] flex-col overflow-hidden">
      <UserListPage {...page} />
    </div>
  )
}
