import { DepartmentListPageComponent } from "@/features/departments/components/pages/departmentlist-page-component"

export default function OrganizationDepartmentsPage() {
  return (
    <div className="-m-4 flex h-[calc(100svh-4rem)] min-h-0 w-[calc(100%+2rem)] flex-col overflow-hidden">
      <DepartmentListPageComponent />
    </div>
  )
}
