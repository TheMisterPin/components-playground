import { prisma } from "@/lib/db";

export async function createDbSession(userId: number, expiresAt: Date) {
  return prisma.session.create({
    data: {
      userId,
      expiresAt,
    },
  });
}

export async function findValidSession(sessionId: string) {
  return prisma.session.findFirst({
    where: {
      id: sessionId,
      expiresAt: {
        gt: new Date(),
      },
    },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
        },
      },
    },
  });
}

export async function deleteSession(sessionId: string) {
  return prisma.session.deleteMany({
    where: { id: sessionId },
  });
}

export async function deleteExpiredSessions() {
  return prisma.session.deleteMany({
    where: {
      expiresAt: {
        lte: new Date(),
      },
    },
  });
}

export async function deleteUserSessions(userId: number) {
  return prisma.session.deleteMany({
    where: { userId },
  });
}

export async function listUserSessions(userId: number) {
  return prisma.session.findMany({
    where: {
      userId,
      expiresAt: {
        gt: new Date(),
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      expiresAt: true,
      createdAt: true,
    },
  });
}
