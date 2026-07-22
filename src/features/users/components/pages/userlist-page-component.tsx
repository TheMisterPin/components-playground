"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { Pencil, Plus, Trash2 } from "lucide-react"
import { toast } from "sonner"
import type { UseFormReturn } from "react-hook-form"

import { applyServerErrors } from "@/components/shared/forms/lib/apply-server-errors"
import { useModal } from "@/components/shared/modals"
import { DynamicTable } from "@/components/shared/table/dynamic-table"
import { Button } from "@/components/ui/button"
import { Actions, can } from "@/features/auth/permissions"
import { useAuth } from "@/features/auth/hooks/use-auth"
import { useError } from "@/features/errors"
import {
  createUser,
  deleteUser,
  listUsers,
  updateUser,
} from "@/features/users/actions/user-actions"
import { UserForm } from "@/features/users/components/forms/user-form"
import {
  toUserTableRow,
  userTableColumns,
} from "@/features/users/components/tables/user-table-columns"
import type { User, UserFormValues } from "@/features/users/types/user-types"

function toUserFormValues(user: User): Partial<UserFormValues> {
  return {
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role,
    departmentId: user.departmentId ?? "",
    locationId: user.locationId ?? "",
    pictureUrl: user.pictureUrl ?? "",
    isActive: user.isActive,
  }
}

export function UserListPageComponent() {
  const { run } = useError()
  const { me } = useAuth()
  const { openModal, closeModal, setDirty, confirm } = useModal()
  const [users, setUsers] = useState<User[]>([])
  const [loaded, setLoaded] = useState(false)

  const canWrite = me ? can(me.role, Actions.users.write) : false

  const load = useCallback(async () => {
    const data = await run(listUsers())
    setUsers(data ?? [])
    setLoaded(true)
  }, [run])

  useEffect(() => {
    let cancelled = false
    void (async () => {
      const data = await run(listUsers())
      if (!cancelled) {
        setUsers(data ?? [])
        setLoaded(true)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [run])

  const rows = useMemo(() => users.map(toUserTableRow), [users])

  const openUserForm = useCallback(
    (mode: "create" | "edit", user?: User) => {
      let formId = ""
      formId = openModal({
        type: "form",
        title: mode === "create" ? "New member" : "Edit member",
        size: "lg",
        component: (
          <UserForm
            isEdit={mode === "edit"}
            initialValues={user ? toUserFormValues(user) : undefined}
            onDirtyChange={(isDirty) => setDirty(formId, isDirty)}
            onSubmit={async (
              values: UserFormValues,
              form: UseFormReturn<UserFormValues>,
            ) => {
              const data =
                mode === "create"
                  ? await run(createUser(values), {
                      onFieldErrors: (fe) => applyServerErrors(form, fe),
                    })
                  : await run(
                      updateUser({ ...values, id: user!.id }),
                      {
                        onFieldErrors: (fe) => applyServerErrors(form, fe),
                      },
                    )
              if (data) {
                toast.success(
                  mode === "create" ? "Member created" : "Member saved",
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
    async (user: User) => {
      const ok = await confirm({
        title: "Delete this member?",
        message: `${user.fullName} will be soft-deleted and marked inactive.`,
        variant: "destructive",
        confirmLabel: "Delete",
      })
      if (!ok) return
      const result = await run(deleteUser(user.id))
      if (result) {
        toast.success("Member deleted")
        await load()
      }
    },
    [confirm, load, run],
  )

  const createButton = canWrite ? (
    <Button size="sm" onClick={() => openUserForm("create")}>
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
                    onClick={() => openUserForm("edit", user)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label={`Delete ${user.fullName}`}
                    onClick={() => void handleDelete(user)}
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
