import { SignJWT, jwtVerify } from "jose";
import type { Role } from "@/generated/prisma/client";
import { getJwtSecret, getSessionMaxAgeSeconds } from "@/lib/env";
import type { JwtPayload } from "@/features/auth/types/auth-types";

function getSecretKey() {
  return new TextEncoder().encode(getJwtSecret());
}

export async function signAccessToken(input: {
  userId: number;
  email: string;
  role: Role;
  sessionId: string;
  expiresAt: Date;
}): Promise<string> {
  return new SignJWT({
    email: input.email,
    role: input.role,
    sid: input.sessionId,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(String(input.userId))
    .setIssuedAt()
    .setExpirationTime(input.expiresAt)
    .sign(getSecretKey());
}

export async function verifyAccessToken(
  token: string,
): Promise<JwtPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey(), {
      algorithms: ["HS256"],
    });

    if (
      typeof payload.sub !== "string" ||
      typeof payload.email !== "string" ||
      typeof payload.role !== "string" ||
      typeof payload.sid !== "string"
    ) {
      return null;
    }

    return {
      sub: payload.sub,
      email: payload.email,
      role: payload.role as Role,
      sid: payload.sid,
    };
  } catch {
    return null;
  }
}

export function getSessionExpirationDate(): Date {
  const maxAgeSeconds = getSessionMaxAgeSeconds();
  return new Date(Date.now() + maxAgeSeconds * 1000);
}
