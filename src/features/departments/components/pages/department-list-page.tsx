"use client"

import { Pencil, Plus, Trash2 } from "lucide-react"

import { DynamicTable } from "@/components/shared/table/dynamic-table"
import { Button } from "@/components/ui/button"
import {
  departmentTableColumns,
  toDepartmentTableRow,
} from "@/features/departments/components/tables/department-table-columns"
import type { Department } from "@/features/departments/types/department-types"

export type DepartmentListPageProps = {
  loaded: boolean
  departments: Department[]
  rows: ReturnType<typeof toDepartmentTableRow>[]
  canWrite: boolean
  onCreate: () => void
  onEdit: (department: Department) => void
  onDelete: (department: Department) => void
}

/** Stateless departments list view — state from `useDepartmentListPage`. */
export function DepartmentListPage({
  loaded,
  departments,
  rows,
  canWrite,
  onCreate,
  onEdit,
  onDelete,
}: DepartmentListPageProps) {
  const createButton = canWrite ? (
    <Button size="sm" onClick={onCreate}>
      <Plus className="mr-2 h-4 w-4" />
      New department
    </Button>
  ) : null

  if (!loaded) {
    return (
      <div className="table-shell">
        <div className="table-body-region">
          <p className="text-sm text-muted-foreground">Loading departments…</p>
        </div>
      </div>
    )
  }

  if (departments.length === 0) {
    return (
      <div className="table-shell">
        <header className="table-toolbar">
          <div />
          <div className="flex flex-wrap items-center gap-2">{createButton}</div>
        </header>
        <div className="table-body-region">
          <p className="text-sm text-muted-foreground">No departments found.</p>
        </div>
      </div>
    )
  }

  return (
    <DynamicTable
      data={rows}
      columns={departmentTableColumns}
      pageSize={10}
      searchable
      sortable
      filterable
      groupable
      toolbarActions={createButton}
      rowActions={
        canWrite
          ? ({ row }) => {
              const department = departments.find((item) => item.id === row.id)
              if (!department) return null
              return (
                <>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label={`Edit ${department.name}`}
                    onClick={() => onEdit(department)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label={`Delete ${department.name}`}
                    onClick={() => void onDelete(department)}
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
