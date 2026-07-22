import { NextResponse } from "next/server"

import { prisma } from "@/lib/db"
import { authenticateUser } from "@/features/auth/password"
import { createSession } from "@/features/auth/utils"
import { toMe } from "@/features/auth/types"
import { AppError } from "@/features/errors/server"

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      email?: unknown
      password?: unknown
    }
    const email = typeof body.email === "string" ? body.email.trim() : ""
    const password = typeof body.password === "string" ? body.password : ""

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 },
      )
    }

    const user = await authenticateUser(email, password)
    await createSession(user)

    await prisma.userActivity.create({
      data: {
        userId: user.id,
        activity: "LOGIN",
      },
    })

    return NextResponse.json(toMe(user))
  } catch (error) {
    if (error instanceof AppError) {
      return NextResponse.json(
        {
          error: error.message,
          code: error.dto.code,
          kind: error.dto.kind,
        },
        { status: error.dto.kind === "auth" ? 401 : 400 },
      )
    }
    return NextResponse.json({ error: "Login failed" }, { status: 500 })
  }
}
