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
  createDepartment,
  deleteDepartment,
  listDepartments,
  updateDepartment,
} from "@/features/departments/actions/department-actions"
import { DepartmentForm } from "@/features/departments/components/forms/department-form"
import {
  departmentTableColumns,
  toDepartmentTableRow,
} from "@/features/departments/components/tables/department-table-columns"
import type {
  Department,
  DepartmentFormValues,
} from "@/features/departments/types/department-types"

function toDepartmentFormValues(
  department: Department,
): Partial<DepartmentFormValues> {
  return {
    name: department.name,
    description: department.description ?? "",
    isActive: department.isActive,
  }
}

export function DepartmentListPageComponent() {
  const { run } = useError()
  const { me } = useAuth()
  const { openModal, closeModal, setDirty, confirm } = useModal()
  const [departments, setDepartments] = useState<Department[]>([])
  const [loaded, setLoaded] = useState(false)

  const canWrite = me
    ? hasPermission(me.role, "departments:write")
    : false

  const load = useCallback(async () => {
    const data = await run(listDepartments())
    setDepartments(data ?? [])
    setLoaded(true)
  }, [run])

  useEffect(() => {
    let cancelled = false
    void (async () => {
      const data = await run(listDepartments())
      if (!cancelled) {
        setDepartments(data ?? [])
        setLoaded(true)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [run])

  const rows = useMemo(
    () => departments.map(toDepartmentTableRow),
    [departments],
  )

  const openDepartmentForm = useCallback(
    (mode: "create" | "edit", department?: Department) => {
      let formId = ""
      formId = openModal({
        type: "form",
        title: mode === "create" ? "New department" : "Edit department",
        size: "lg",
        component: (
          <DepartmentForm
            isEdit={mode === "edit"}
            initialValues={
              department ? toDepartmentFormValues(department) : undefined
            }
            onDirtyChange={(isDirty) => setDirty(formId, isDirty)}
            onSubmit={async (
              values: DepartmentFormValues,
              form: UseFormReturn<DepartmentFormValues>,
            ) => {
              const data =
                mode === "create"
                  ? await run(createDepartment(values), {
                      onFieldErrors: (fe) => applyServerErrors(form, fe),
                    })
                  : await run(
                      updateDepartment({ ...values, id: department!.id }),
                      {
                        onFieldErrors: (fe) => applyServerErrors(form, fe),
                      },
                    )
              if (data) {
                toast.success(
                  mode === "create"
                    ? "Department created"
                    : "Department saved",
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
    async (department: Department) => {
      const ok = await confirm({
        title: "Delete this department?",
        message: `${department.name} will be soft-deleted and marked inactive.`,
        variant: "destructive",
        confirmLabel: "Delete",
      })
      if (!ok) return
      const result = await run(deleteDepartment(department.id))
      if (result) {
        toast.success("Department deleted")
        await load()
      }
    },
    [confirm, load, run],
  )

  const createButton = canWrite ? (
    <Button size="sm" onClick={() => openDepartmentForm("create")}>
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
                    onClick={() => openDepartmentForm("edit", department)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label={`Delete ${department.name}`}
                    onClick={() => void handleDelete(department)}
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
