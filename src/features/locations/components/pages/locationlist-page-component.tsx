"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { Pencil, Plus, Trash2 } from "lucide-react"
import { toast } from "sonner"
import type { UseFormReturn } from "react-hook-form"

import { applyServerErrors } from "@/components/shared/forms/lib/apply-server-errors"
import { useModal } from "@/components/shared/modals"
import { DynamicTable } from "@/components/shared/table/dynamic-table"
import { Button } from "@/components/ui/button"
import { hasPermission } from "@/features/auth/permissions"
import { useAuth } from "@/features/auth/hooks/use-auth"
import { useError } from "@/features/errors"
import {
  createLocation,
  deleteLocation,
  listLocations,
  updateLocation,
} from "@/features/locations/actions/location-actions"
import { LocationForm } from "@/features/locations/components/forms/location-form"
import {
  locationTableColumns,
  toLocationTableRow,
} from "@/features/locations/components/tables/location-table-columns"
import type {
  Location,
  LocationFormValues,
} from "@/features/locations/types/location-types"

function toLocationFormValues(location: Location): Partial<LocationFormValues> {
  return {
    name: location.name,
    description: location.description ?? "",
    managerId: location.managerId ?? "",
    isActive: location.isActive,
  }
}

export function LocationListPageComponent() {
  const { run } = useError()
  const { me } = useAuth()
  const { openModal, closeModal, setDirty, confirm } = useModal()
  const [locations, setLocations] = useState<Location[]>([])
  const [loaded, setLoaded] = useState(false)

  const canWrite = me ? hasPermission(me.role, "locations:write") : false

  const load = useCallback(async () => {
    const data = await run(listLocations())
    setLocations(data ?? [])
    setLoaded(true)
  }, [run])

  useEffect(() => {
    let cancelled = false
    void (async () => {
      const data = await run(listLocations())
      if (!cancelled) {
        setLocations(data ?? [])
        setLoaded(true)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [run])

  const rows = useMemo(() => locations.map(toLocationTableRow), [locations])

  const openLocationForm = useCallback(
    (mode: "create" | "edit", location?: Location) => {
      let formId = ""
      formId = openModal({
        type: "form",
        title: mode === "create" ? "New location" : "Edit location",
        size: "lg",
        component: (
          <LocationForm
            isEdit={mode === "edit"}
            initialValues={
              location ? toLocationFormValues(location) : undefined
            }
            onDirtyChange={(isDirty) => setDirty(formId, isDirty)}
            onSubmit={async (
              values: LocationFormValues,
              form: UseFormReturn<LocationFormValues>,
            ) => {
              const data =
                mode === "create"
                  ? await run(createLocation(values), {
                      onFieldErrors: (fe) => applyServerErrors(form, fe),
                    })
                  : await run(
                      updateLocation({ ...values, id: location!.id }),
                      {
                        onFieldErrors: (fe) => applyServerErrors(form, fe),
                      },
                    )
              if (data) {
                toast.success(
                  mode === "create" ? "Location created" : "Location saved",
                )
                closeModal(formId)
                await load()
              }
            }}
          />
        ),
      })
    },
    [closeModal, load, openModal, run, setDirty],
  )

  const handleDelete = useCallback(
    async (location: Location) => {
      const ok = await confirm({
        title: "Delete this location?",
        message: `${location.name} will be soft-deleted and marked inactive.`,
        variant: "destructive",
        confirmLabel: "Delete",
      })
      if (!ok) return
      const result = await run(deleteLocation(location.id))
      if (result) {
        toast.success("Location deleted")
        await load()
      }
    },
    [confirm, load, run],
  )

  const createButton = canWrite ? (
    <Button size="sm" onClick={() => openLocationForm("create")}>
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
                    onClick={() => openLocationForm("edit", location)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label={`Delete ${location.name}`}
                    onClick={() => void handleDelete(location)}
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
