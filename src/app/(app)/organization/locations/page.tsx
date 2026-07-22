import { LocationListPageComponent } from "@/features/locations/components/pages/locationlist-page-component"

export default function OrganizationLocationsPage() {
  return (
    <div className="-m-4 flex h-[calc(100svh-4rem)] min-h-0 w-[calc(100%+2rem)] flex-col overflow-hidden">
      <LocationListPageComponent />
    </div>
  )
}
