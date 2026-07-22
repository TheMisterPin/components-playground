import { UserListPageComponent } from "@/features/users/components/pages/userlist-page-component"

export default function TeamMembersPage() {
  return (
    <div className="-m-4 flex h-[calc(100svh-4rem)] min-h-0 w-[calc(100%+2rem)] flex-col overflow-hidden">
      <UserListPageComponent />
    </div>
  )
}
