"use client"

import type { UseFormReturn } from "react-hook-form"

import { DynamicForm } from "@/components/shared/forms/templates"
import { LayoutMode } from "@/components/shared/forms/types"
import { userFormFields } from "@/features/users/components/forms/user-form-fields"
import type { User } from "@/features/users/types/user-types"

type UserFormProps = {
  isEdit?: boolean
  initialValues?: Partial<User>
  onSubmit: (values: User, form: UseFormReturn<User>) => void | Promise<void>
  submitLabel?: string
  onDirtyChange?: (isDirty: boolean) => void
  /** Demo/testing only — bypass client Zod so server field errors can be verified */
  skipClientValidation?: boolean
}

export function UserForm({
  isEdit = false,
  initialValues,
  onSubmit,
  submitLabel,
  onDirtyChange,
  skipClientValidation,
}: UserFormProps) {
  return (
    <DynamicForm<User>
      fields={userFormFields}
      layout={{ mode: LayoutMode.Single, columns: 2 }}
      isEdit={isEdit}
      initialValues={initialValues}
      onSubmit={onSubmit}
      submitLabel={submitLabel ?? (isEdit ? "Save changes" : "Create user")}
      onDirtyChange={onDirtyChange}
      skipClientValidation={skipClientValidation}
    />
  )
}
