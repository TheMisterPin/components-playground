import type { Role } from "@/generated/prisma/client";
import {
  AGENT_DASHBOARD_PATH,
  USER_DASHBOARD_PATH,
} from "@/lib/constants";

export const SESSION_COOKIE_NAME = "session";

export const USER_PROTECTED_PATH_PREFIXES = ["/dashboard"] as const;
export const AGENT_PROTECTED_PATH_PREFIXES = ["/agents/dashboard"] as const;

export const STAFF_ROLES: Role[] = ["ADMIN", "AGENT"];

export function isStaffRole(role: Role): boolean {
  return STAFF_ROLES.includes(role);
}

export function getDashboardPathForRole(role: Role): string {
  return isStaffRole(role) ? AGENT_DASHBOARD_PATH : USER_DASHBOARD_PATH;
}
