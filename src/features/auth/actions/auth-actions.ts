"use server";

import { Role } from "@/generated/prisma/client";
import { prisma } from "@/lib/db";
import { hashPassword, verifyPassword } from "@/features/auth/lib/password";
import {
  createSession,
  destroySession,
  getSession,
} from "@/features/auth/lib/session";
import {
  loginSchema,
  registerSchema,
  type LoginInput,
  type RegisterInput,
} from "@/features/auth/schema/auth-schema";
import {
  AuthError,
  type AuthSession,
} from "@/features/auth/types/auth-types";

function toSessionUser(user: {
  id: number;
  email: string;
  name: string | null;
  role: AuthSession["user"]["role"];
}) {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  };
}

export async function registerAction(
  input: RegisterInput,
): Promise<{ session: AuthSession }> {
  const parsed = registerSchema.safeParse(input);

  if (!parsed.success) {
    throw new AuthError(
      parsed.error.issues[0]?.message ?? "Invalid input",
      "UNAUTHORIZED",
    );
  }

  const { email, password, name } = parsed.data;

  const existingUser = await prisma.user.findUnique({
    where: { email },
    select: { id: true, role: true },
  });

  if (existingUser) {
    if (existingUser.role !== Role.CUSTOMER) {
      throw new AuthError(
        "This email is registered as staff. Use the agent portal.",
        "CONFLICT",
      );
    }

    throw new AuthError("An account with this email already exists", "CONFLICT");
  }

  const passwordHash = await hashPassword(password);

  const user = await prisma.user.create({
    data: {
      email,
      password: passwordHash,
      name,
      role: Role.CUSTOMER,
    },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
    },
  });

  const session = await createSession(toSessionUser(user));

  return { session };
}

export async function loginAction(
  input: LoginInput,
): Promise<{ session: AuthSession }> {
  const parsed = loginSchema.safeParse(input);

  if (!parsed.success) {
    throw new AuthError(
      parsed.error.issues[0]?.message ?? "Invalid input",
      "UNAUTHORIZED",
    );
  }

  const { email, password } = parsed.data;

  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      password: true,
    },
  });

  if (!user) {
    throw new AuthError("Invalid email or password", "INVALID_CREDENTIALS");
  }

  if (user.role !== Role.CUSTOMER) {
    throw new AuthError(
      "Staff accounts must sign in through the agent portal.",
      "INVALID_CREDENTIALS",
    );
  }

  const isValidPassword = await verifyPassword(password, user.password);

  if (!isValidPassword) {
    throw new AuthError("Invalid email or password", "INVALID_CREDENTIALS");
  }

  const session = await createSession(toSessionUser(user));

  return { session };
}

export async function logoutAction(): Promise<void> {
  await destroySession();
}

export async function getCurrentSessionAction(): Promise<AuthSession | null> {
  return getSession();
}
