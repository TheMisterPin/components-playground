import type { Role } from "@/generated/prisma/client";

export type SessionUser = {
  id: number;
  email: string;
  name: string | null;
  role: Role;
};

export type AuthSession = {
  id: string;
  user: SessionUser;
  expiresAt: Date;
};

export type JwtPayload = {
  sub: string;
  email: string;
  role: Role;
  sid: string;
};

export class AuthError extends Error {
  constructor(
    message: string,
    public readonly code: "INVALID_CREDENTIALS" | "UNAUTHORIZED" | "CONFLICT",
  ) {
    super(message);
    this.name = "AuthError";
  }
}
