"use client"

import { ModalProvider } from "@/components/shared/modals"
import { Toaster } from "@/components/ui/sonner"
import { AuthProvider } from "@/features/auth/hooks/auth-context"

/** Root providers shared by authenticated app and login. */
export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ModalProvider>
      <AuthProvider>
        {children}
        <Toaster />
      </AuthProvider>
    </ModalProvider>
  )
}
