import { AppError } from "@/features/errors/server"
import {
  hasPermission,
  permissionsForRole,
} from "@/features/auth/permissions"
import { getSession, type SessionPayload } from "@/features/auth/utils"

export type AppSession = SessionPayload

export { hasPermission, permissionsForRole }

export async function requireSession(): Promise<AppSession> {
  const session = await getSession()
  if (!session) {
    throw new AppError({
      kind: "auth",
      code: "SESSION_EXPIRED",
      message: "Your session has expired. Please sign in again.",
    })
  }
  return session
}

export async function requirePermission(
  permission: string,
): Promise<AppSession> {
  const session = await requireSession()
  if (!hasPermission(session.role, permission)) {
    throw new AppError({
      kind: "permission",
      code: "FORBIDDEN",
      message: "You do not have permission to perform this action.",
    })
  }
  return session
}
