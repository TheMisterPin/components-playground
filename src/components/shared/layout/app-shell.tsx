import { AppHeader } from "./app-header"
import { AppSidebar } from "./app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { ErrorBoundary, ErrorProvider } from "@/features/errors"

/** Authenticated app chrome — sidebar + header. Providers live in root layout. */
export default function AppShell({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <SidebarProvider className="h-svh overflow-hidden">
      <AppSidebar />
      <SidebarInset className="h-svh min-h-0 overflow-hidden bg-transparent">
        <header className="surface-header flex h-16 shrink-0 items-center border-b border-sidebar-border px-4 text-sidebar-foreground">
          <AppHeader />
        </header>
        <div className="min-h-0 flex-1 overflow-y-auto bg-background p-4">
          <ErrorBoundary>
            <ErrorProvider>{children}</ErrorProvider>
          </ErrorBoundary>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
