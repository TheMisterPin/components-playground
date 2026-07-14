"use client"

import { useState } from "react"
import { toast } from "sonner"

import { applyServerErrors } from "@/components/shared/forms/lib/apply-server-errors"
import PageWrapper from "@/components/shared/layout/page-wrapper"
import { Button } from "@/components/ui/button"
import { useError } from "@/features/errors"
import {
  createUser,
  demoClearSession,
  demoRestoreSession,
  demoRevokeWritePermission,
  updateUser,
  type ForceErrorKind,
} from "@/features/users/actions/user-actions"
import { UserForm } from "@/features/users"
import type { User } from "@/features/users"

const sampleUser: User = {
  email: "ada@example.com",
  name: "Ada Lovelace",
  role: "editor",
  department: "engineering",
  bio: "Mathematician and early computing pioneer.",
  notify: true,
  phone: "+1 555 0100",
  createdAt: new Date("2024-01-15"),
  updatedAt: new Date("2024-06-01"),
}

const invalidPayload: Partial<User> = {
  email: "not-an-email",
  name: "",
  role: "editor",
  notify: true,
  phone: "",
}

export default function FormsPage() {
  const { run } = useError()
  const [createResult, setCreateResult] = useState<User | null>(null)
  const [editResult, setEditResult] = useState<User | null>(null)

  const forceAction = async (force: ForceErrorKind) => {
    await run(createUser(sampleUser, force))
  }

  return (
    <PageWrapper>
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-10 px-4 py-10">
        <section className="space-y-4 rounded-lg border bg-background p-6 shadow-sm">
          <div className="space-y-1">
            <h2 className="text-xl font-semibold">Create user</h2>
            <p className="text-sm text-muted-foreground">
              Create mode — email is editable, department hides for viewers,
              phone becomes required when notifications are on. Submits through{" "}
              <code className="text-xs">useError().run()</code>.
            </p>
          </div>
          <UserForm
            isEdit={false}
            onSubmit={async (values, form) => {
              const data = await run(createUser(values), {
                onFieldErrors: (fe) => applyServerErrors(form, fe),
              })
              if (data) {
                toast.success("User created")
                setCreateResult(data)
              }
            }}
          />
          {createResult ? (
            <pre className="overflow-x-auto rounded-md bg-muted p-3 text-xs">
              {JSON.stringify(createResult, null, 2)}
            </pre>
          ) : null}
        </section>

        <section className="space-y-4 rounded-lg border bg-background p-6 shadow-sm">
          <div className="space-y-1">
            <h2 className="text-xl font-semibold">Edit user</h2>
            <p className="text-sm text-muted-foreground">
              Edit mode — email is locked (`canEdit: false`), other fields remain
              editable with the same conditional rules.
            </p>
          </div>
          <UserForm
            isEdit
            initialValues={sampleUser}
            onSubmit={async (values, form) => {
              const data = await run(updateUser(values), {
                onFieldErrors: (fe) => applyServerErrors(form, fe),
              })
              if (data) {
                toast.success("Saved")
                setEditResult(data)
              }
            }}
          />
          {editResult ? (
            <pre className="overflow-x-auto rounded-md bg-muted p-3 text-xs">
              {JSON.stringify(editResult, null, 2)}
            </pre>
          ) : null}
        </section>

        <section className="space-y-4 rounded-lg border bg-background p-6 shadow-sm">
          <div className="space-y-1">
            <h2 className="text-xl font-semibold">
              Server validation (client bypassed)
            </h2>
            <p className="text-sm text-muted-foreground">
              Client Zod is skipped so submit hits the server schema. Invalid
              defaults should produce inline field errors via{" "}
              <code className="text-xs">applyServerErrors</code>.
            </p>
          </div>
          <UserForm
            isEdit={false}
            initialValues={invalidPayload}
            skipClientValidation
            submitLabel="Submit to server"
            onSubmit={async (values, form) => {
              const data = await run(createUser(values), {
                onFieldErrors: (fe) => applyServerErrors(form, fe),
              })
              if (data) {
                toast.success("Unexpected success — fix the invalid defaults")
              }
            }}
          />
        </section>

        <section className="space-y-4 rounded-lg border bg-background p-6 shadow-sm">
          <div className="space-y-1">
            <h2 className="text-xl font-semibold">Error demos</h2>
            <p className="text-sm text-muted-foreground">
              Force each channel without try/catch —{" "}
              <code className="text-xs">run()</code> only. Sidebar stays usable
              when the content Error Boundary trips.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => forceAction("permission")}
            >
              Permission modal
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => forceAction("auth")}
            >
              Session expired → login
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => forceAction("conflict")}
            >
              Conflict toast
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => forceAction("not_found")}
            >
              Not found toast
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => forceAction("internal")}
            >
              Internal toast
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={async () => {
                await run(
                  Promise.reject(
                    new Error("Simulated rejected action promise"),
                  ),
                )
              }}
            >
              Rejected promise → boundary
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 border-t pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={async () => {
                await run(demoClearSession())
                toast.message("Mock session cleared")
              }}
            >
              Clear mock session
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={async () => {
                await run(demoRevokeWritePermission())
                toast.message("Write permission revoked")
              }}
            >
              Revoke users:write
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={async () => {
                await run(demoRestoreSession())
                toast.success("Mock session restored")
              }}
            >
              Restore session
            </Button>
          </div>
        </section>
      </div>
    </PageWrapper>
  )
}
