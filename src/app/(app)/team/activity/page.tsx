import { ActivityListPageComponent } from "@/features/logging/components/pages/activitylist-page-component"

export default function TeamActivityPage() {
  return (
    <div className="-m-4 flex h-[calc(100svh-4rem)] min-h-0 w-[calc(100%+2rem)] flex-col overflow-hidden">
      <ActivityListPageComponent />
    </div>
  )
}
