"use client"

import { ActivityListPage } from "@/features/logging/components/pages/activity-list-page"
import { useActivityListPage } from "@/features/logging/hooks/use-activity-list-page"

export default function TeamActivityPage() {
  const page = useActivityListPage()

  return (
    <div className="-m-4 flex h-[calc(100svh-4rem)] min-h-0 w-[calc(100%+2rem)] flex-col overflow-hidden">
      <ActivityListPage {...page} />
    </div>
  )
}
