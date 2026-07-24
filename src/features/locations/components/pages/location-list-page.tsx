"use client"

import { Pencil, Plus, Trash2 } from "lucide-react"

import { DynamicTable } from "@/components/shared/table/dynamic-table"
import { Button } from "@/components/ui/button"
import {
  locationTableColumns,
  toLocationTableRow,
} from "@/features/locations/components/tables/location-table-columns"
import type { Location } from "@/features/locations/types/location-types"

export type LocationListPageProps = {
  loaded: boolean
  locations: Location[]
  rows: ReturnType<typeof toLocationTableRow>[]
  canWrite: boolean
  onCreate: () => void
  onEdit: (location: Location) => void
  onDelete: (location: Location) => void
}

/** Stateless locations list view — state from `useLocationListPage`. */
export function LocationListPage({
  loaded,
  locations,
  rows,
  canWrite,
  onCreate,
  onEdit,
  onDelete,
}: LocationListPageProps) {
  const createButton = canWrite ? (
    <Button size="sm" onClick={onCreate}>
      <Plus className="mr-2 h-4 w-4" />
      New location
    </Button>
  ) : null

  if (!loaded) {
    return (
      <div className="table-shell">
        <div className="table-body-region">
          <p className="text-sm text-muted-foreground">Loading locations…</p>
        </div>
      </div>
    )
  }

  if (locations.length === 0) {
    return (
      <div className="table-shell">
        <header className="table-toolbar">
          <div />
          <div className="flex flex-wrap items-center gap-2">{createButton}</div>
        </header>
        <div className="table-body-region">
          <p className="text-sm text-muted-foreground">No locations found.</p>
        </div>
      </div>
    )
  }

  return (
    <DynamicTable
      data={rows}
      columns={locationTableColumns}
      pageSize={10}
      searchable
      sortable
      filterable
      groupable
      toolbarActions={createButton}
      rowActions={
        canWrite
          ? ({ row }) => {
              const location = locations.find((item) => item.id === row.id)
              if (!location) return null
              return (
                <>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label={`Edit ${location.name}`}
                    onClick={() => onEdit(location)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label={`Delete ${location.name}`}
                    onClick={() => void onDelete(location)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </>
              )
            }
          : undefined
      }
    />
  )
}
