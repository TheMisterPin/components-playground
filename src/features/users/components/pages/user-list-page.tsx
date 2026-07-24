"use client"

import { Pencil, Plus, Trash2 } from "lucide-react"

import { DynamicTable } from "@/components/shared/table/dynamic-table"
import { Button } from "@/components/ui/button"
import {
  toUserTableRow,
  userTableColumns,
} from "@/features/users/components/tables/user-table-columns"
import type { User } from "@/features/users/types/user-types"

export type UserListPageProps = {
  loaded: boolean
  users: User[]
  rows: ReturnType<typeof toUserTableRow>[]
  canWrite: boolean
  onCreate: () => void
  onEdit: (user: User) => void
  onDelete: (user: User) => void
}

/** Stateless members list view — state comes from `useUserListPage`. */
export function UserListPage({
  loaded,
  users,
  rows,
  canWrite,
  onCreate,
  onEdit,
  onDelete,
}: UserListPageProps) {
  const createButton = canWrite ? (
    <Button size="sm" onClick={onCreate}>
      <Plus className="mr-2 h-4 w-4" />
      New member
    </Button>
  ) : null

  if (!loaded) {
    return (
      <div className="table-shell">
        <div className="table-body-region">
          <p className="text-sm text-muted-foreground">Loading members…</p>
        </div>
      </div>
    )
  }

  if (users.length === 0) {
    return (
      <div className="table-shell">
        <header className="table-toolbar">
          <div />
          <div className="flex flex-wrap items-center gap-2">{createButton}</div>
        </header>
        <div className="table-body-region">
          <p className="text-sm text-muted-foreground">No users found.</p>
        </div>
      </div>
    )
  }

  return (
    <DynamicTable
      data={rows}
      columns={userTableColumns}
      pageSize={10}
      searchable
      sortable
      filterable
      groupable
      toolbarActions={createButton}
      rowActions={
        canWrite
          ? ({ row }) => {
              const user = users.find((item) => item.id === row.id)
              if (!user) return null
              return (
                <>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label={`Edit ${user.fullName}`}
                    onClick={() => onEdit(user)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label={`Delete ${user.fullName}`}
                    onClick={() => void onDelete(user)}
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
