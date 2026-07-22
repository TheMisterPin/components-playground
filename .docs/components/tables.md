# DynamicTable

Shared searchable / sortable / filterable / groupable table for ERP list pages.

Implementation: `src/components/shared/table/dynamic-table.tsx`  
List wiring: [List pages](./list-pages.md)

---

## Props

| Prop | Purpose |
|------|---------|
| `data` | `Record<string, unknown>[]` (flattened rows) |
| `columns` | Optional `ColumnConfig[]` (else auto-detect keys) |
| `pageSize` | Default page size |
| `searchable` / `sortable` / `filterable` / `groupable` | Toolbar features |
| `toolbarActions` | Right-side toolbar slot (e.g. Create button) |
| `rowActions` | Per data-row Actions column renderer |

```ts
export type ColumnConfig = {
  key: string
  label: string
  type?: DataType
  format?: (value: unknown) => ReactNode
  sortable?: boolean
}
```

---

## Feature pattern

```tsx
// tables/user-table-columns.tsx
export const userTableColumns: ColumnConfig[] = [ /* … */ ]

export function toUserTableRow(user: User): Record<string, unknown> {
  return {
    id: user.id,
    fullName: user.fullName,
    departmentName: user.departmentName ?? null,
    // …
  }
}
```

```tsx
const rows = useMemo(() => users.map(toUserTableRow), [users])

<DynamicTable
  data={rows}
  columns={userTableColumns}
  toolbarActions={createButton}
  rowActions={({ row }) => {
    const user = users.find((u) => u.id === row.id)
    if (!user) return null
    return (/* icon buttons */)
  }}
/>
```

---

## Constraints

- Prefer `toolbarActions` / `rowActions` over action columns in `format`
- Keep domain entities in React state; table rows are a projection
- Soft-deleted rows should not appear (`listX` filters `deletedAt: null`)
- Named exports; no `any` on public column helpers

---

## Related

| File | Role |
|------|------|
| `.cursor/rules/dynamic-table.mdc` | Agent rule |
| `.docs/components/list-pages.md` | Full list CRUD |
| `src/features/users/components/tables/user-table-columns.tsx` | Reference columns |
