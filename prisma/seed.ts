import "dotenv/config"
import { PrismaPg } from "@prisma/adapter-pg"
import { PrismaClient } from "../src/generated/prisma/client"
import bcrypt from "bcryptjs"

const connectionString = process.env.DATABASE_URL
if (!connectionString) {
  throw new Error("DATABASE_URL is not set")
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
})

async function upsertUser(input: {
  email: string
  firstName: string
  lastName: string
  role: "ADMIN" | "USER"
  password: string
  departmentId?: string | null
  locationId?: string | null
}) {
  const password = await bcrypt.hash(input.password, 10)
  const fullName = `${input.firstName} ${input.lastName}`

  return prisma.user.upsert({
    where: { email: input.email },
    update: {
      firstName: input.firstName,
      lastName: input.lastName,
      fullName,
      role: input.role,
      password,
      isActive: true,
      deletedAt: null,
      departmentId: input.departmentId ?? null,
      locationId: input.locationId ?? null,
    },
    create: {
      email: input.email,
      firstName: input.firstName,
      lastName: input.lastName,
      fullName,
      role: input.role,
      password,
      isActive: true,
      departmentId: input.departmentId ?? null,
      locationId: input.locationId ?? null,
    },
  })
}

async function ensureDepartment(input: {
  name: string
  description: string
}) {
  const existing = await prisma.department.findFirst({
    where: { name: input.name, deletedAt: null },
  })
  if (existing) {
    return prisma.department.update({
      where: { id: existing.id },
      data: {
        description: input.description,
        isActive: true,
        deletedAt: null,
      },
    })
  }
  return prisma.department.create({
    data: {
      name: input.name,
      description: input.description,
      isActive: true,
    },
  })
}

async function ensureLocation(input: {
  name: string
  description: string
  managerId?: string | null
}) {
  const existing = await prisma.location.findFirst({
    where: { name: input.name, deletedAt: null },
  })
  if (existing) {
    return prisma.location.update({
      where: { id: existing.id },
      data: {
        description: input.description,
        managerId: input.managerId ?? null,
        isActive: true,
        deletedAt: null,
      },
    })
  }
  return prisma.location.create({
    data: {
      name: input.name,
      description: input.description,
      managerId: input.managerId ?? null,
      isActive: true,
    },
  })
}

async function main() {
  const engineering = await ensureDepartment({
    name: "Engineering",
    description: "Product engineering and platform",
  })
  const operations = await ensureDepartment({
    name: "Operations",
    description: "Business operations and support",
  })

  const admin = await upsertUser({
    email: "admin@example.com",
    firstName: "Admin",
    lastName: "User",
    role: "ADMIN",
    password: "password123",
    departmentId: engineering.id,
  })

  const hq = await ensureLocation({
    name: "Headquarters",
    description: "Main office",
    managerId: admin.id,
  })
  await ensureLocation({
    name: "Remote",
    description: "Distributed / remote workforce",
  })

  await upsertUser({
    email: "admin@example.com",
    firstName: "Admin",
    lastName: "User",
    role: "ADMIN",
    password: "password123",
    departmentId: engineering.id,
    locationId: hq.id,
  })

  await upsertUser({
    email: "user@example.com",
    firstName: "Demo",
    lastName: "User",
    role: "USER",
    password: "password123",
    departmentId: operations.id,
    locationId: hq.id,
  })

  console.log(
    "Seeded users, departments (Engineering, Operations), and locations (Headquarters, Remote)",
  )
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
