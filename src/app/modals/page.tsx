"use client"

import { useState } from "react"

import PageWrapper from "@/components/shared/layout/page-wrapper"
import { useModal } from "@/components/shared/modals"
import { Button } from "@/components/ui/button"
import { UserForm } from "@/features/users"
import type { User } from "@/features/users"

type UserFormModalWrapperProps = {
  onDirty: (isDirty: boolean) => void
  onSuccess: (values: User) => void
}

function UserFormModalWrapper({
  onDirty,
  onSuccess,
}: UserFormModalWrapperProps) {
  return (
    <UserForm
      isEdit={false}
      onDirtyChange={onDirty}
      onSubmit={(values) => {
        onSuccess(values)
      }}
    />
  )
}

export default function ModalsPage() {
  const { openModal, closeModal, setDirty, closeAll, confirm, notify } =
    useModal()
  const [lastConfirm, setLastConfirm] = useState<boolean | null>(null)
  const [createdUser, setCreatedUser] = useState<User | null>(null)

  const handleNotify = () => {
    // In real usage, prefer a toast for transient success feedback.
    // This path exists to prove the notification modal works end-to-end.
    notify({
      variant: "success",
      title: "Saved",
      message: "Your changes were saved successfully.",
    })
  }

  const handleDelete = async () => {
    const ok = await confirm({
      title: "Delete this item?",
      message: "This action cannot be undone. The item will be permanently removed.",
      variant: "destructive",
      confirmLabel: "Delete",
    })
    setLastConfirm(ok)
  }

  const handleNewUser = () => {
    // openModal assigns formId synchronously before the child mounts/effects,
    // so closures below safely capture the returned id.
    let formId = ""
    formId = openModal({
      type: "form",
      title: "New User",
      size: "lg",
      component: (
        <UserFormModalWrapper
          onDirty={(isDirty) => setDirty(formId, isDirty)}
          onSuccess={(values) => {
            setCreatedUser(values)
            closeModal(formId)
          }}
        />
      ),
    })
  }

  return (
    <PageWrapper>
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-10 px-4 py-10">
        <section className="space-y-4 rounded-lg border bg-background p-6 shadow-sm">
          <div className="space-y-1">
            <h2 className="text-xl font-semibold">Notification modal</h2>
            <p className="text-sm text-muted-foreground">
              Opens a success notification dialog. Prefer toasts for this in
              production.
            </p>
          </div>
          <Button type="button" onClick={handleNotify}>
            Show success notification
          </Button>
        </section>

        <section className="space-y-4 rounded-lg border bg-background p-6 shadow-sm">
          <div className="space-y-1">
            <h2 className="text-xl font-semibold">Confirm modal</h2>
            <p className="text-sm text-muted-foreground">
              Promise-based confirm — branches on the resolved boolean.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button type="button" variant="destructive" onClick={handleDelete}>
              Delete item
            </Button>
            <Button type="button" variant="outline" onClick={() => closeAll()}>
              Close all modals
            </Button>
          </div>
          {lastConfirm !== null ? (
            <p className="text-sm text-muted-foreground">
              Last confirm result:{" "}
              <span className="font-medium text-foreground">
                {lastConfirm ? "confirmed" : "cancelled"}
              </span>
            </p>
          ) : null}
        </section>

        <section className="space-y-4 rounded-lg border bg-background p-6 shadow-sm">
          <div className="space-y-1">
            <h2 className="text-xl font-semibold">Form modal + dirty guard</h2>
            <p className="text-sm text-muted-foreground">
              Opens a UserForm in a modal. Edit a field, then try to close (ESC
              or X) to stack the discard warning.
            </p>
          </div>
          <Button type="button" onClick={handleNewUser}>
            New user
          </Button>
          {createdUser ? (
            <pre className="overflow-x-auto rounded-md bg-muted p-3 text-xs">
              {JSON.stringify(createdUser, null, 2)}
            </pre>
          ) : null}
        </section>
      </div>
    </PageWrapper>
  )
}
