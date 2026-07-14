# Error Handling

A single pipeline for server-action failures and client presentation. Every vertical uses the same contract, boundary, and `useError().run()` call shape — no bespoke try/catch or ad-hoc error UI.

Live demo: [`/forms`](/forms) (create/edit via `run()`, server-validation bypass, channel force buttons). Session stub: [`/login`](/login).

---

## When to use this

| Need | Use |
|------|-----|
| Server action return type | `ActionResult<T>` — never throw across the wire |
| Known business / auth failure inside an action | `throw new AppError({ … })` |
| Wrap an action body | `withErrorBoundary(async () => { … })` |
| Call a server action from the client | `useError().run(actionPromise, opts?)` |
| Map server Zod field errors onto a form | `applyServerErrors(form, fieldErrors)` |
| Transient success / soft failure feedback | Sonner `toast` (via `run` channel table or explicit success toast) |
| Blocking auth / permission message | `run` → modal channel (`notify`) — do not hand-roll |
| Crash outside React’s catch (rejected promise) | `run` → `reportFatal` → content `ErrorBoundary` |

Do **not** toast rejected promises — a rejection means the DTO contract broke and must hit the Error Boundary. Do **not** import `@/features/errors/server` from client components.

---

## Folder map

```
src/features/errors/
  dto.ts                 ErrorKind, ErrorDTO, ActionResult (isomorphic)
  server.ts              AppError, withErrorBoundary (server only)
  error-boundary.tsx     Fixed content fallback
  error-provider.tsx     reportFatal → throw during render
  use-error.ts           handle, run, DEFAULT_ERROR_CHANNELS
  index.ts               Client-safe barrel (excludes server.ts)

src/lib/auth/mock.ts     Stub session / requireSession / requirePermission
src/lib/schemas/<model>.ts   Shared zod used by FieldDefs + server parse

src/components/shared/forms/lib/apply-server-errors.ts
```

Mounted in `AppShell`: content-only `ErrorBoundary` → `ErrorProvider` → `{children}`; Sonner `<Toaster />` beside the modal stack.

---

## Contract

```ts
// src/features/errors/dto.ts — safe on server and client
type ErrorKind =
  | "validation"
  | "auth"
  | "permission"
  | "not_found"
  | "conflict"
  | "network"
  | "internal"

type ErrorDTO = {
  kind: ErrorKind
  code: string // SCREAMING_SNAKE, e.g. SESSION_EXPIRED
  message: string // always user-safe — never raw Error.message / stacks
  fieldErrors?: Record<string, string[]> // zod flatten().fieldErrors
}

type ActionResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: ErrorDTO }
```

**Hard rule:** server actions always return `ActionResult<T>`. Throwing is legal *inside* the action; `withErrorBoundary` normalizes it.

---

## Channel table

`DEFAULT_ERROR_CHANNELS` is the single presentation policy:

| Kind | Channel | UI |
|------|---------|-----|
| `validation` | `silent` | Inline via `applyServerErrors` (form owns it) |
| `auth` | `modal` | `notify({ variant: "error" })`; `SESSION_EXPIRED` → `/login` on acknowledge |
| `permission` | `modal` | Blocking notification |
| `conflict` | `toast` | `toast.error(message)` |
| `not_found` | `toast` | same |
| `network` | `toast` | same |
| `internal` | `toast` | same |

Per-call override:

```ts
await run(action, { overrides: { conflict: "modal" } })
```

---

## Quick start — server action

```ts
"use server"

import type { ActionResult } from "@/features/errors/dto"
import { AppError, withErrorBoundary } from "@/features/errors/server"
import { requirePermission, requireSession } from "@/lib/auth/mock"
import { userSchema } from "@/lib/schemas/user"
import type { User } from "@/features/users/types/user-types"

export async function updateUser(input: unknown): Promise<ActionResult<User>> {
  return withErrorBoundary(async () => {
    requireSession()
    requirePermission("users:write")
    const parsed = userSchema.parse(input)
    // persist…
    return parsed
  })
}

// Known failure (thrown inside the boundary):
throw new AppError({
  kind: "conflict",
  code: "DUPLICATE_EMAIL",
  message: "A user with this email already exists.",
})
```

`withErrorBoundary` maps:

| Thrown | Result |
|--------|--------|
| `ZodError` | `kind: "validation"`, `code: "VALIDATION_FAILED"`, `fieldErrors` |
| `AppError` | Its DTO (pass-through) |
| Anything else | `console.error` server-side; client gets `kind: "internal"`, `code: "INTERNAL"`, generic message |

User-facing strings belong on the DTO / `AppError` construction site — not in the UI switch.

---

## Quick start — client call

```tsx
"use client"

import { applyServerErrors } from "@/components/shared/forms/lib/apply-server-errors"
import { useError } from "@/features/errors"
import { updateUser } from "@/features/users/actions/user-actions"
import { toast } from "sonner"

function EditForm() {
  const { run } = useError()

  return (
    <UserForm
      isEdit
      onSubmit={async (values, form) => {
        const data = await run(updateUser(values), {
          onFieldErrors: (fe) => applyServerErrors(form, fe),
        })
        if (data) {
          toast.success("Saved")
        }
      }}
    />
  )
}
```

### `run()` behavior

1. Await the promise.
2. **Reject** → `reportFatal(error)` → content Error Boundary; return `null`. No toast.
3. `{ ok: false, error }` with `kind === "validation"` and `onFieldErrors` → call it; return `null`.
4. Other `{ ok: false }` → `handle(error, overrides)`; return `null`.
5. `{ ok: true }` → return `data`.

No try/catch in feature client components — `run()` is the only invocation pattern.

---

## Shared schemas

Put zod used by both FieldDefs and server actions in `src/lib/schemas/<model>.ts`. Feature `*-form-fields.ts` imports those validators; the action calls `schema.parse(input)`.

```ts
// FieldDef
validation: userEmailSchema

// Server
const parsed = userSchema.parse(input)
```

---

## Layout / providers

```
AppShell
  ModalProvider
    Sidebar + Header          ← outside ErrorBoundary
    content scroll region
      ErrorBoundary           ← fixed fallback only
        ErrorProvider         ← reportFatal throws here
          {children}
    Toaster (sonner)
```

A crash in one page leaves navigation alive. `useError` needs both `ModalProvider` (ancestor) and `ErrorProvider` (content).

---

## Auth stubs

`src/lib/auth/mock.ts` is playground-only until a real backend lands:

- `getSession` / `setMockSession` / `clearMockSession`
- `requireSession()` → `AppError` `SESSION_EXPIRED`
- `requirePermission(perm)` → `AppError` `FORBIDDEN`

Replace that module with real session/RBAC; keep throwing `AppError` with the same kinds/codes so the client channel table stays stable.

---

## Demo checklist (`/forms`)

| Control | Expected |
|---------|----------|
| Server validation (client bypassed) form | Inline field errors from server Zod |
| Permission modal | Blocking `notify` |
| Session expired → login | Modal; OK → `/login` |
| Conflict / not found / internal | Error toast; internal also `console.error` on server |
| Rejected promise → boundary | Content fallback; sidebar still works |
| Clear / revoke / restore session | Mock auth helpers for real action paths |

`skipClientValidation` on `DynamicForm` / `UserForm` is **demo/testing only**.

---

## Constraints

- Named exports; strict TypeScript; no `any` on the public API.
- Client barrel: `@/features/errors` — never re-export `server.ts`.
- Server imports: `@/features/errors/server` and `@/features/errors/dto` only.
- Modal package must not import the form or error systems for presentation policy — `useError` composes `useModal` + toast.
- Do not customize the Error Boundary fallback per vertical.
- Prefer Sonner for transient feedback; reserve `notify` for must-acknowledge cases (`auth` / `permission`).

---

## Related

| File | Role |
|------|------|
| `.cursor/rules/error-handling.mdc` | Agent rule |
| `.docs/components/forms.md` | DynamicForm + `applyServerErrors` |
| `.docs/components/modals.md` | `notify` for blocking errors |
| `src/features/users/actions/user-actions.ts` | Reference server actions |
| `src/app/forms/page.tsx` | End-to-end demos |
