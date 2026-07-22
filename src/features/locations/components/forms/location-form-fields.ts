import type { FieldDef } from "@/components/shared/forms/types"
import type { LocationFormValues } from "@/features/locations/types/location-types"
import {
  locationDescriptionSchema,
  locationIsActiveSchema,
  locationManagerIdSchema,
  locationNameSchema,
} from "@/lib/schemas/location"

export type SelectOption = { label: string; value: string }

const noneOption: SelectOption = { label: "None", value: "" }

export function buildLocationFormFields(
  managerOptions: SelectOption[] = [],
): FieldDef<LocationFormValues>[] {
  return [
    {
      name: "name",
      type: "text",
      label: "Name",
      placeholder: "Headquarters",
      validation: locationNameSchema,
    },
    {
      name: "description",
      type: "textarea",
      label: "Description",
      placeholder: "Optional description",
      validation: locationDescriptionSchema,
    },
    {
      name: "managerId",
      type: "select",
      label: "Manager",
      placeholder: "Select a manager",
      validation: locationManagerIdSchema,
      options: [noneOption, ...managerOptions],
    },
    {
      name: "isActive",
      type: "switch",
      label: "Active",
      validation: locationIsActiveSchema,
      defaultValue: true,
    },
  ]
}

/** Static fields without manager options — prefer buildLocationFormFields. */
export const locationFormFields = buildLocationFormFields()
