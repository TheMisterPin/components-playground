"use client"

import { DynamicTable } from "@/components/shared/table/dynamic-table"
import {
  activityTableColumns,
  toActivityTableRow,
} from "@/features/logging/components/tables/activity-table-columns"
import type { UserActivityItem } from "@/features/logging/types/activity-types"

export type ActivityListPageProps = {
  loaded: boolean
  canRead: boolean
  items: UserActivityItem[]
  rows: ReturnType<typeof toActivityTableRow>[]
}

/** Stateless activity list view — state from `useActivityListPage`. */
export function ActivityListPage({
  loaded,
  canRead,
  items,
  rows,
}: ActivityListPageProps) {
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
