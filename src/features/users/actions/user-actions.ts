"use server"

import {
  clearMockSession,
  requirePermission,
  requireSession,
  setMockSession,
} from "@/lib/auth/mock"
import { userSchema } from "@/lib/schemas/user"
import type { ActionResult } from "@/features/errors/dto"
import { AppError, withErrorBoundary } from "@/features/errors/server"
import type { User } from "@/features/users/types/user-types"

/** Demo-only force flags — strip before real backends ship. */
export type ForceErrorKind =
  | "auth"
  | "permission"
  | "internal"
  | "conflict"
  | "not_found"

function applyForce(force?: ForceErrorKind): void {
  if (!force) return

  switch (force) {
    case "auth":
      throw new AppError({
        kind: "auth",
        code: "SESSION_EXPIRED",
        message: "Your session has expired. Please sign in again.",
      })
    case "permission":
      throw new AppError({
        kind: "permission",
        code: "FORBIDDEN",
        message: "You do not have permission to perform this action.",
      })
    case "conflict":
      throw new AppError({
        kind: "conflict",
        code: "DUPLICATE_EMAIL",
        message: "A user with this email already exists.",
      })
    case "not_found":
      throw new AppError({
        kind: "not_found",
        code: "USER_NOT_FOUND",
        message: "That user could not be found.",
      })
    case "internal":
      throw new Error("Simulated unexpected failure (logged server-side only)")
  }
}

function toUser(data: ReturnType<typeof userSchema.parse>): User {
  return {
    email: data.email,
    name: data.name,
    role: data.role,
    department: data.department,
    bio: data.bio,
    notify: data.notify,
    phone: data.phone,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt ?? new Date(),
  }
}

export async function createUser(
  input: unknown,
  force?: ForceErrorKind,
): Promise<ActionResult<User>> {
  return withErrorBoundary(async () => {
    applyForce(force)
    requireSession()
    requirePermission("users:write")
    const parsed = userSchema.parse(input)
    return toUser(parsed)
  })
}

export async function updateUser(
  input: unknown,
  force?: ForceErrorKind,
): Promise<ActionResult<User>> {
  return withErrorBoundary(async () => {
    applyForce(force)
    requireSession()
    requirePermission("users:write")
    const parsed = userSchema.parse(input)
    return toUser({
      ...parsed,
      updatedAt: new Date(),
    })
  })
}

/** Demo helpers for session state (playground only). */

export async function demoClearSession(): Promise<ActionResult<true>> {
  return withErrorBoundary(async () => {
    clearMockSession()
    return true as const
  })
}

export async function demoRestoreSession(): Promise<ActionResult<true>> {
  return withErrorBoundary(async () => {
    setMockSession({
      userId: "user_demo",
      permissions: ["users:write", "users:read"],
    })
    return true as const
  })
}

export async function demoRevokeWritePermission(): Promise<ActionResult<true>> {
  return withErrorBoundary(async () => {
    setMockSession({
      userId: "user_demo",
      permissions: ["users:read"],
    })
    return true as const
  })
}
