import { ErrorBoundary, ErrorProvider } from "@/features/errors"

/** Minimal chrome for unauthenticated routes (login). */
export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="flex h-svh min-h-0 flex-col overflow-y-auto bg-background">
      <ErrorBoundary>
        <ErrorProvider>{children}</ErrorProvider>
      </ErrorBoundary>
    </div>
  )
}
