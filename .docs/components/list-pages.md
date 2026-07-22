# List pages

Feature list CRUD: `DynamicTable` + form/confirm modals + `useError().run()` + RBAC `can` / `authorize`.

Canonical reference: `src/features/users/components/pages/userlist-page-component.tsx`  
Also: departments + locations under `src/features/*/components/pages/`.

---

## Responsibilities

| Layer | Job |
|-------|-----|
| `app/(app)/…/page.tsx` | Thin shell; mount `*ListPageComponent` |
| `*list-page-component.tsx` | Load, table, modals, delete confirm, reload |
| `*-table-columns.tsx` | `ColumnConfig` + `toXTableRow` |
| `*-form.tsx` | Thin `DynamicForm` wrapper |
| `*-actions.ts` | Server CRUD + `authorize(Actions.*)` |

---

## Write gating

```ts
import { Actions, can } from "@/features/auth/permissions"
import { useAuth } from "@/features/auth/hooks/use-auth"

const { me } = useAuth()
const canWrite = me ? can(me.role, Actions.users.write) : false
```

Pass Create / Edit / Delete only when `canWrite`. Server still enforces via `authorize`.

---

## Table slots

```tsx
<DynamicTable
  data={rows}
  columns={userTableColumns}
  toolbarActions={canWrite ? createButton : null}
  rowActions={
    canWrite
      ? ({ row }) => {
          const entity = items.find((i) => i.id === row.id)
          if (!entity) return null
          return (/* Edit + Delete icon buttons */)
        }
      : undefined
  }
/>
```

Do not put action buttons in `ColumnConfig.format` — use `rowActions`.

---

## Form modal

Capture `formId` from `openModal` synchronously. Bridge dirty + submit:

```tsx
let formId = ""
formId = openModal({
  type: "form",
  title: "New member",
  size: "lg",
  component: (
    <UserForm
      onDirtyChange={(d) => setDirty(formId, d)}
      onSubmit={async (values, form) => {
        const data = await run(createUser(values), {
          onFieldErrors: (fe) => applyServerErrors(form, fe),
        })
        if (data) {
          toast.success("Member created")
          closeModal(formId)
          await load()
        }
      }}
    />
  ),
})
```

Update payloads include `id` from the selected row (`updateUser({ ...values, id })`).

---

## Delete

```ts
const ok = await confirm({
  title: "Delete this member?",
  message: "…",
  variant: "destructive",
  confirmLabel: "Delete",
})
if (!ok) return
const result = await run(deleteUser(id))
if (result) {
  toast.success("Member deleted")
  await load()
}
```

Soft-delete is the server convention (`deletedAt` + `isActive: false`).

---

## Related

| Doc / rule | Role |
|------------|------|
| `.cursor/rules/list-page-crud.mdc` | Agent rule |
| `.docs/components/tables.md` | DynamicTable API |
| `.docs/components/modals.md` | Form / confirm APIs |
| `.docs/components/auth.md` | `Actions` / `can` |
| `.docs/components/error-handling.md` | `run` / channels |
