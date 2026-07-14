import { AppError } from "@/features/errors/server"

/**
 * Mock session / RBAC for the playground until a real backend lands.
 * Server-only — do not import from client components.
 */

export type MockSession = {
  userId: string
  permissions: string[]
}

let mockSession: MockSession | null = {
  userId: "user_demo",
  permissions: ["users:write", "users:read"],
}

export function getSession(): MockSession | null {
  return mockSession
}

export function setMockSession(session: MockSession | null): void {
  mockSession = session
}

export function clearMockSession(): void {
  mockSession = null
}

export function requireSession(): MockSession {
  const session = getSession()
  if (!session) {
    throw new AppError({
      kind: "auth",
      code: "SESSION_EXPIRED",
      message: "Your session has expired. Please sign in again.",
    })
  }
  return session
}

export function requirePermission(permission: string): MockSession {
  const session = requireSession()
  if (!session.permissions.includes(permission)) {
    throw new AppError({
      kind: "permission",
      code: "FORBIDDEN",
      message: "You do not have permission to perform this action.",
    })
  }
  return session
}
