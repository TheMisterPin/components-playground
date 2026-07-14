"use client"

import { useRouter } from "next/navigation"
import { toast } from "sonner"

import PageWrapper from "@/components/shared/layout/page-wrapper"
import { Button } from "@/components/ui/button"
import { useError } from "@/features/errors"
import { demoRestoreSession } from "@/features/users/actions/user-actions"

export default function LoginPage() {
  const router = useRouter()
  const { run } = useError()

  return (
    <PageWrapper>
      <div className="mx-auto flex w-full max-w-md flex-col gap-6 px-4 py-16">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold">Sign in</h1>
          <p className="text-sm text-muted-foreground">
            Stub login page for SESSION_EXPIRED demos. Restore the mock session
            to continue exercising server actions.
          </p>
        </div>
        <Button
          type="button"
          onClick={async () => {
            const ok = await run(demoRestoreSession())
            if (ok) {
              toast.success("Signed in (mock)")
              router.push("/forms")
            }
          }}
        >
          Restore mock session
        </Button>
      </div>
    </PageWrapper>
  )
}
