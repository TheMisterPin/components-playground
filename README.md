# Components Playground

Next.js (App Router) ERP boilerplate / component playground. Shared UI systems live under `src/components/shared`; feature verticals under `src/features`. Auth uses jose cookie sessions + Prisma; middleware requires login for all app routes.

## Stack

- **Next.js 15** App Router + TypeScript
- **shadcn/ui** + Tailwind
- **react-hook-form** + **zod**
- **sonner** toasts
- Package manager: **pnpm**

## Getting started

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

| Script | Command |
|--------|---------|
| Dev | `pnpm dev` |
| Build | `pnpm build` |
| Lint | `pnpm lint` |
| Start | `pnpm start` |

## What’s implemented

| System | Where to see it | Docs | Cursor rule |
|--------|-----------------|------|-------------|
| **Dynamic forms** — FieldDef registry, layouts, conditional fields | Feature forms (e.g. member create/edit modal) | [`.docs/components/forms.md`](.docs/components/forms.md) | [`.cursor/rules/dynamic-forms.mdc`](.cursor/rules/dynamic-forms.mdc) |
| **Universal modals** — stack of notify / confirm / form | List-page create/edit/delete | [`.docs/components/modals.md`](.docs/components/modals.md) | [`.cursor/rules/universal-modals.mdc`](.cursor/rules/universal-modals.mdc) |
| **Error handling** — `ActionResult`, `withErrorBoundary`, `useError().run()` | Server actions + list CRUD | [`.docs/components/error-handling.md`](.docs/components/error-handling.md) | [`.cursor/rules/error-handling.mdc`](.cursor/rules/error-handling.mdc) |
| **Auth** — jose cookie session + middleware gate | `/login`, sidebar user/logout | — | — |

### Layout

`AppShell` (`src/components/shared/layout/app-shell.tsx`) provides sidebar + header for authenticated routes. Root `AppProviders` mounts `ModalProvider`, `AuthProvider`, `ErrorProvider`, `ModalRoot`, and Sonner. Login lives under `(auth)` without the sidebar.

### Users vertical (reference)

- Forms: `src/features/users/components/forms/`
- Shared schema: `src/lib/schemas/user.ts`
- Server actions: `src/features/users/actions/user-actions.ts`
- Session / RBAC: `src/features/auth/permissions.ts` (`Actions`, `can`) + `session.ts` (`authorize`)

Canonical client submit:

```ts
const data = await run(updateUser(values), {
  onFieldErrors: (fe) => applyServerErrors(form, fe),
})
if (data) toast.success("Saved")
```

## Project layout

```
src/
  app/                      Routes (forms, modals, login, stubs…)
  components/
    shared/forms/           DynamicForm system
    shared/modals/          Modal stack
    shared/layout/          AppShell, sidebar, header
    ui/                     shadcn primitives
  features/
    errors/                 Error DTO, boundary, useError (client barrel)
    users/                  Reference vertical
  lib/
    auth/mock.ts            Stub session / permissions
    schemas/                Shared zod (FieldDefs + server)
    navigation.ts           Sidebar nav

.docs/components/           Human guides
.cursor/rules/              Agent rules (glob-scoped)
AGENTS.md                   Agent entrypoint (Next.js + this repo)
```

## Documentation

Human guides live in **`.docs/components/`**. Cursor rules in **`.cursor/rules/`** mirror those conventions for agents. Start with:

1. [Forms](.docs/components/forms.md)
2. [Modals](.docs/components/modals.md)
3. [Error handling](.docs/components/error-handling.md)

Agent instructions: [`AGENTS.md`](AGENTS.md) (also referenced by `CLAUDE.md`).

## Notes

- Prefer **pnpm**.
- This Next.js version may differ from training data — see `AGENTS.md` and `node_modules/next/dist/docs/` before inventing APIs.
- Auth uses jose cookie sessions + Prisma; `authorize(Actions.*)` / `can(role, Actions.*)` use the permission matrix and throw/gate with stable `AppError` kinds/codes.
