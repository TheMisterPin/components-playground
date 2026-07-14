import { AppHeader } from "./app-header"
import { AppSidebar } from "./app-sidebar"
import { ModalProvider } from "@/components/shared/modals"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Toaster } from "@/components/ui/sonner"
import { ErrorBoundary, ErrorProvider } from "@/features/errors"

export default function AppShell({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ModalProvider>
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
      <Toaster />
    </ModalProvider>
  )
}
