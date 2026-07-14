import { z } from "zod"

/** Shared field validators — used by FieldDefs and the server schema. */

export const userEmailSchema = z
  .string()
  .min(1, "Required")
  .email("Enter a valid email")

export const userNameSchema = z.string().min(1, "Required")

export const userRoleSchema = z.enum(["admin", "editor", "viewer"], {
  required_error: "Required",
})

export const userDepartmentSchema = z.string().optional()

export const userBioSchema = z.string().optional()

export const userNotifySchema = z.boolean()

export const userPhoneSchema = z.string().optional()

export const userCreatedAtSchema = z.date().optional()

export const userUpdatedAtSchema = z.date().optional()

/**
 * Full user payload schema for server actions.
 * Phone is required when notify is true (mirrors FieldDef requiredWhen).
 */
export const userSchema = z
  .object({
    email: userEmailSchema,
    name: userNameSchema,
    role: userRoleSchema,
    department: userDepartmentSchema,
    bio: userBioSchema,
    notify: userNotifySchema,
    phone: userPhoneSchema,
    createdAt: userCreatedAtSchema,
    updatedAt: userUpdatedAtSchema,
  })
  .superRefine((data, ctx) => {
    if (data.notify && (!data.phone || data.phone.trim() === "")) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Required",
        path: ["phone"],
      })
    }
  })

export type UserInput = z.infer<typeof userSchema>
