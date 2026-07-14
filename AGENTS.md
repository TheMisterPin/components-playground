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
| Mock auth | `src/lib/auth/mock.ts` | error-handling | — |

## Hard conventions

- **Server actions** always return `ActionResult<T>` via `withErrorBoundary`. Never throw across the wire. Known failures: `throw new AppError({ kind, code, message })`.
- **Client actions** use only `useError().run()` — no try/catch UI in feature components. Map Zod field errors with `applyServerErrors(form, fe)`.
- **Forms**: FieldDef arrays + thin `*Form` wrappers around `DynamicForm`. `onSubmit(values, form)`. Shared validators from `src/lib/schemas/`.
- **Modals**: `confirm` / `notify` / `openModal({ type: "form" })`. Transient feedback → toast, not `notify`. Modal package must not import form types.
- **Layout**: Error Boundary wraps content only inside `AppShell` — leave sidebar/header outside.
- **Import hygiene**: client may import `@/features/errors` (barrel). Never import `@/features/errors/server` from client code.
- Named exports; strict TypeScript; no `any` on public APIs.

## Canonical snippets

```ts
// Server
export async function updateX(input: unknown): Promise<ActionResult<T>> {
  return withErrorBoundary(async () => {
    requireSession()
    requirePermission("…")
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
| `/forms` | DynamicForm create/edit, `run()` submit, server validation bypass, error channels, Error Boundary |
| `/modals` | notify / confirm / form + dirty guard |
| `/login` | `SESSION_EXPIRED` acknowledge target + mock session restore |

## Adding a feature vertical

1. `src/features/<feature>/types/` — model types
2. `src/lib/schemas/<model>.ts` — shared zod
3. `components/forms/*-form-fields.ts` + thin `*Form`
4. `actions/*-actions.ts` — `"use server"` + `withErrorBoundary`
5. Wire UI with `useError().run()` + `applyServerErrors`
6. Update `.docs` / rules only when conventions change

Auth is mocked (`src/lib/auth/mock.ts`). When a real backend lands, replace that module but keep `AppError` kinds/codes so the client channel table stays stable.
