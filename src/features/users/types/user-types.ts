export type UserRole = "admin" | "editor" | "viewer"

export type User = {
  email: string
  name: string
  role: UserRole
  department?: string
  bio?: string
  notify: boolean
  phone?: string
  createdAt?: Date
  updatedAt?: Date
}
