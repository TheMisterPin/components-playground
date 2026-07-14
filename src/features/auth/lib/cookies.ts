import { cookies } from "next/headers";
import { SESSION_COOKIE_NAME } from "@/features/auth/lib/constants";
import { getSessionMaxAgeSeconds } from "@/lib/env";

export async function getSessionCookie(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(SESSION_COOKIE_NAME)?.value;
}

export async function setSessionCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  const maxAge = getSessionMaxAgeSeconds();

  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge,
  });
}

export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

export { SESSION_COOKIE_NAME };
