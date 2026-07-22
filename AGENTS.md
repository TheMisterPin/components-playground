<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Components Playground — agent guide

ERP UI boilerplate. Prefer existing shared systems over one-off patterns. Human docs: `.docs/components/`. Glob-scoped Cursor rules: `.cursor/rules/`.

## Before you write code

1. Read the relevant guide under `.docs/components/` (and the matching `.cursor/rules/*.mdc` when editing those globs).
2. Mirror the **users** vertical for new features (`src/features/users/`).
3. Do not invent parallel form, modal, or error pipelines.

## Systems (do not reinvent)

| System | Import / path | Docs | Rule |
|--------|---------------|------|------|
| Dynamic forms | `@/components/shared/forms/…` | `.docs/components/forms.md` | `dynamic-forms.mdc` |
| Modals | `@/components/shared/modals` → `useModal()` | `.docs/components/modals.md` | `universal-modals.mdc` |
| Errors (client) | `@/features/errors` → `useError()` | `.docs/components/error-handling.md` | `error-handling.mdc` |
| Errors (server) | `@/features/errors/server` + `dto` | same | same |
| Toasts | `sonner` (`toast`) | error-handling + modals docs | — |
| Shared zod | `src/lib/schemas/<model>.ts` | forms + error-handling | — |
| Auth / RBAC | `permissions.ts` (`Actions`, `can`) + `session.ts` (`authorize`) | `.docs/components/auth.md` | `auth-rbac.mdc` |
| DynamicTable | `@/components/shared/table/dynamic-table` | `.docs/components/tables.md` | `dynamic-table.mdc` |
| List-page CRUD | feature `*list-page-component.tsx` | `.docs/components/list-pages.md` | `list-page-crud.mdc` |
| Logging / audit | `@/features/logging/server` → `logActivity` | `.docs/components/logging.md` | `logging.mdc` |

## Hard conventions

- **Server actions** always return `ActionResult<T>` via `withErrorBoundary`. Never throw across the wire. Known failures: `throw new AppError({ kind, code, message })`.
- **Client actions** use only `useError().run()` — no try/catch UI in feature components. Map Zod field errors with `applyServerErrors(form, fe)`.
- **RBAC**: server `await authorize(Actions.<feature>.read|write)`; client `can(me.role, Actions.<feature>.write)`. Matrix + catalog in `permissions.ts`. Never import `session.ts` from client.
- **Forms**: FieldDef arrays + thin `*Form` wrappers around `DynamicForm`. `onSubmit(values, form)`. Shared validators from `src/lib/schemas/`.
- **Modals**: `confirm` / `notify` / `openModal({ type: "form" })`. Transient feedback → toast, not `notify`. Modal package must not import form types.
- **Tables**: `DynamicTable` + `toXTableRow` + `toolbarActions` / `rowActions` (not action cells in `format`).
- **Layout**: Error Boundary wraps content only inside `AppShell` — leave sidebar/header outside. Providers in `AppProviders` (Modal → Auth → Error → ModalRoot).
- **Import hygiene**: client may import `@/features/errors` (barrel). Never import `@/features/errors/server` from client code. Same for `@/features/logging` vs `@/features/logging/server`.
- **Audit trail**: server `logActivity({ userId, activity, activityData? })` — never raw `prisma.userActivity.create`.
- Named exports; strict TypeScript; no `any` on public APIs.

## Canonical snippets

```ts
// Server
export async function updateX(input: unknown): Promise<ActionResult<T>> {
  return withErrorBoundary(async () => {
    await authorize(Actions.users.write)
    return schema.parse(input)
  })
}
```

```ts
// Client
const data = await run(updateX(values), {
  onFieldErrors: (fe) => applyServerErrors(form, fe),
})
if (data) toast.success("Saved")
```

## Demos

| Route | What it proves |
|-------|----------------|
| `/` | Home landing — links to list CRUD + activity demos |
| `/login` | Auth gate entry + `SESSION_EXPIRED` acknowledge target |
| `/team/members` | List-page CRUD (forms + modals + `run()`) |
| `/team/activity` | Audit trail list (`logActivity` + ADMIN `logging:read`) |
| `/organization/departments` | Org vertical + list CRUD |
| `/organization/locations` | Org vertical + manager select + list CRUD |

## Adding a feature vertical

1. `src/features/<feature>/types/` — model types
2. `src/lib/schemas/<model>.ts` — shared zod
3. Extend RBAC: `Permission`, `ROLE_PERMISSIONS`, `Actions.<feature>` in `permissions.ts`
4. `components/forms/*-form-fields.ts` + thin `*Form`
5. `components/tables/*-table-columns.tsx` + `toXTableRow`
6. `actions/*-actions.ts` — `"use server"` + `withErrorBoundary` + `authorize` + soft-delete (`deletedAt`)
7. `components/pages/*list-page-component.tsx` — table + modal CRUD + `can(...)`
8. Thin route under `src/app/(app)/…/page.tsx` + entry in `src/lib/navigation.ts`
9. Update `.docs` / rules only when conventions change

Auth uses jose cookie sessions (`src/features/auth/utils.ts`) + Prisma users. Guards live in `src/features/auth/session.ts` and throw `AppError` with stable kinds/codes so the client channel table stays stable.
