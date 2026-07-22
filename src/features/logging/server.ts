import type { Activity, Prisma } from "@/generated/prisma/client"
import { prisma } from "@/lib/db"

/**
 * Append a row to the audit trail. Call from server actions / route handlers only.
 * Never import this module from client code.
 */
export async function logActivity(input: {
  userId: string
  activity: Activity
  activityData?: Prisma.InputJsonValue
}): Promise<void> {
  await prisma.userActivity.create({
    data: {
      userId: input.userId,
      activity: input.activity,
      activityData: input.activityData ?? undefined,
    },
  })
}
