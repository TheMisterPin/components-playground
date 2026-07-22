import { Suspense } from "react"

import LoginPage from "./login-client"

export default function LoginRoute() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto flex w-full max-w-md px-4 py-16 text-sm text-muted-foreground">
          Loading…
        </div>
      }
    >
      <LoginPage />
    </Suspense>
  )
}
