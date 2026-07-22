import { NextResponse } from "next/server"

import { prisma } from "@/lib/db"
import { getSession, clearSession } from "@/features/auth/utils"
import { toMe } from "@/features/auth/types"

export async function GET() {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const user = await prisma.user.findFirst({
    where: {
      id: session.userId,
      deletedAt: null,
      isActive: true,
    },
  })

  if (!user) {
    await clearSession()
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  return NextResponse.json(toMe(user))
}
