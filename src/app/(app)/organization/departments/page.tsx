"use client"

import { DepartmentListPage } from "@/features/departments/components/pages/department-list-page"
import { useDepartmentListPage } from "@/features/departments/hooks/use-department-list-page"

export default function OrganizationDepartmentsPage() {
  const page = useDepartmentListPage()

  return (
    <div className="-m-4 flex h-[calc(100svh-4rem)] min-h-0 w-[calc(100%+2rem)] flex-col overflow-hidden">
      <DepartmentListPage {...page} />
    </div>
  )
}
