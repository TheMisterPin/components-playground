"use client"

import { useEffect, useMemo, useState } from "react"

import { DynamicTable } from "@/components/shared/table/dynamic-table"
import { Actions, can } from "@/features/auth/permissions"
import { useAuth } from "@/features/auth/hooks/use-auth"
import { useError } from "@/features/errors"
import { listActivities } from "@/features/logging/actions/activity-actions"
import {
  activityTableColumns,
  toActivityTableRow,
} from "@/features/logging/components/tables/activity-table-columns"
import type { UserActivityItem } from "@/features/logging/types/activity-types"

export function ActivityListPageComponent() {
  const { run } = useError()
  const { me } = useAuth()
  const [items, setItems] = useState<UserActivityItem[]>([])
  const [loaded, setLoaded] = useState(false)

  const canRead = me ? can(me.role, Actions.logging.read) : false

  useEffect(() => {
    if (!canRead) {
      setLoaded(true)
      return
    }

    let cancelled = false
    void (async () => {
      const data = await run(listActivities())
      if (!cancelled) {
        setItems(data ?? [])
        setLoaded(true)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [canRead, run])

  const rows = useMemo(() => items.map(toActivityTableRow), [items])

  if (!loaded) {
    return <p className="p-4 text-sm text-muted-foreground">Loading…</p>
  }

  if (!canRead) {
    return (
      <p className="p-4 text-sm text-muted-foreground">
        You do not have permission to view activity logs.
      </p>
    )
  }

  if (items.length === 0) {
    return (
      <p className="p-4 text-sm text-muted-foreground">No activity yet.</p>
    )
  }

  return (
    <DynamicTable
      data={rows}
      columns={activityTableColumns}
      pageSize={20}
      searchable
      sortable
      filterable
    />
  )
}
