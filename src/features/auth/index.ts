export {
  getCurrentSessionAction,
  loginAction,
  logoutAction,
  registerAction,
} from "@/features/auth/actions/auth-actions";
export {
  AGENT_PROTECTED_PATH_PREFIXES,
  SESSION_COOKIE_NAME,
  STAFF_ROLES,
  USER_PROTECTED_PATH_PREFIXES,
  getDashboardPathForRole,
  isStaffRole,
} from "@/features/auth/lib/constants";
export {
  createSession,
  destroySession,
  getSession,
  requireRole,
  requireSession,
} from "@/features/auth/lib/session";
export { hashPassword, verifyPassword } from "@/features/auth/lib/password";
export { loginSchema, registerSchema } from "@/features/auth/schema/auth-schema";
export type { LoginInput, RegisterInput } from "@/features/auth/schema/auth-schema";
export { AuthError } from "@/features/auth/types/auth-types";
export type { AuthSession, JwtPayload, SessionUser } from "@/features/auth/types/auth-types";
