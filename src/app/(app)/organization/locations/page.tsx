"use client"

import { LocationListPage } from "@/features/locations/components/pages/location-list-page"
import { useLocationListPage } from "@/features/locations/hooks/use-location-list-page"

export default function OrganizationLocationsPage() {
  const page = useLocationListPage()

  return (
    <div className="-m-4 flex h-[calc(100svh-4rem)] min-h-0 w-[calc(100%+2rem)] flex-col overflow-hidden">
      <LocationListPage {...page} />
    </div>
  )
}
