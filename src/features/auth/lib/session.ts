import type { Role } from "@/generated/prisma/client";
import {
  clearSessionCookie,
  getSessionCookie,
  setSessionCookie,
} from "@/features/auth/lib/cookies";
import {
  getSessionExpirationDate,
  signAccessToken,
  verifyAccessToken,
} from "@/features/auth/lib/jwt";
import {
  createDbSession,
  deleteSession,
  findValidSession,
} from "@/features/auth/queries/session-queries";
import type { AuthSession, SessionUser } from "@/features/auth/types/auth-types";

export async function createSession(user: SessionUser): Promise<AuthSession> {
  const expiresAt = getSessionExpirationDate();
  const dbSession = await createDbSession(user.id, expiresAt);

  const token = await signAccessToken({
    userId: user.id,
    email: user.email,
    role: user.role,
    sessionId: dbSession.id,
    expiresAt,
  });

  await setSessionCookie(token);

  return {
    id: dbSession.id,
    expiresAt: dbSession.expiresAt,
    user,
  };
}

export async function getSession(): Promise<AuthSession | null> {
  const token = await getSessionCookie();

  if (!token) {
    return null;
  }

  const payload = await verifyAccessToken(token);

  if (!payload) {
    await clearSessionCookie();
    return null;
  }

  const session = await findValidSession(payload.sid);

  if (!session) {
    await clearSessionCookie();
    return null;
  }

  return {
    id: session.id,
    expiresAt: session.expiresAt,
    user: session.user,
  };
}

export async function destroySession(): Promise<void> {
  const token = await getSessionCookie();

  if (token) {
    const payload = await verifyAccessToken(token);

    if (payload?.sid) {
      await deleteSession(payload.sid);
    }
  }

  await clearSessionCookie();
}

export async function requireSession(): Promise<AuthSession> {
  const session = await getSession();

  if (!session) {
    throw new Error("Unauthorized");
  }

  return session;
}

export async function requireRole(roles: Role[]): Promise<AuthSession> {
  const session = await requireSession();

  if (!roles.includes(session.user.role)) {
    throw new Error("Forbidden");
  }

  return session;
}
