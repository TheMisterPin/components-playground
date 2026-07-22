import type { Role } from "@/generated/prisma/client"

/** Role → permission strings. Safe for client and server. */
export const ROLE_PERMISSIONS: Record<Role, readonly string[]> = {
  ADMIN: [
    "users:read",
    "users:write",
    "departments:read",
    "departments:write",
    "locations:read",
    "locations:write",
  ],
  USER: ["users:read", "departments:read", "locations:read"],
}

export function permissionsForRole(role: Role): readonly string[] {
  return ROLE_PERMISSIONS[role] ?? []
}

export function hasPermission(role: Role, permission: string): boolean {
  return permissionsForRole(role).includes(permission)
}
