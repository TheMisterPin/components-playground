"use client"

import { useMemo, useState } from "react"

import { DynamicTable } from "@/components/shared/table/dynamic-table"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import {
  userTableColumns,
  toUserTableRow,
} from "@/features/users/components/tables/user-table-columns"
import type { User } from "@/features/users/types/user-types"

const sampleUsers: User[] = [
  {
    id: "11111111-1111-1111-1111-111111111111",
    email: "ada@example.com",
    firstName: "Ada",
    lastName: "Lovelace",
    fullName: "Ada Lovelace",
    role: "ADMIN",
    departmentName: "Engineering",
    locationName: "Headquarters",
    isActive: true,
    isVerified: true,
    createdAt: new Date("2023-01-15T10:30:00Z"),
    updatedAt: new Date("2024-06-01T12:00:00Z"),
  },
  {
    id: "22222222-2222-2222-2222-222222222222",
    email: "grace@example.com",
    firstName: "Grace",
    lastName: "Hopper",
    fullName: "Grace Hopper",
    role: "ADMIN",
    departmentName: "Engineering",
    locationName: "Remote",
    isActive: true,
    isVerified: true,
    createdAt: new Date("2022-11-20T14:45:00Z"),
  },
  {
    id: "33333333-3333-3333-3333-333333333333",
    email: "alan@example.com",
    firstName: "Alan",
    lastName: "Turing",
    fullName: "Alan Turing",
    role: "USER",
    departmentName: "Operations",
    locationName: "Headquarters",
    isActive: false,
    isVerified: true,
    createdAt: new Date("2023-03-05T09:15:00Z"),
  },
  {
    id: "44444444-4444-4444-4444-444444444444",
    email: "katherine@example.com",
    firstName: "Katherine",
    lastName: "Johnson",
    fullName: "Katherine Johnson",
    role: "USER",
    departmentName: "Operations",
    locationName: "Remote",
    isActive: true,
    isVerified: false,
    createdAt: new Date("2023-02-18T16:20:00Z"),
  },
  {
    id: "55555555-5555-5555-5555-555555555555",
    email: "tim@example.com",
    firstName: "Tim",
    lastName: "Berners-Lee",
    fullName: "Tim Berners-Lee",
    role: "USER",
    departmentName: "Engineering",
    locationName: "Headquarters",
    isActive: true,
    isVerified: true,
    createdAt: new Date("2022-12-10T11:00:00Z"),
  },
  {
    id: "66666666-6666-6666-6666-666666666666",
    email: "margaret@example.com",
    firstName: "Margaret",
    lastName: "Hamilton",
    fullName: "Margaret Hamilton",
    role: "ADMIN",
    departmentName: "Engineering",
    locationName: "Remote",
    isActive: true,
    isVerified: true,
    createdAt: new Date("2023-04-22T13:40:00Z"),
  },
]

export default function TableDemo() {
  const [jsonInput, setJsonInput] = useState("")
  const [users, setUsers] = useState<User[]>(sampleUsers)
  const [error, setError] = useState("")
  const [useCustomColumns, setUseCustomColumns] = useState(true)

  const tableData = useMemo(() => users.map(toUserTableRow), [users])

  const handleLoadJson = () => {
    try {
      const parsedData = JSON.parse(jsonInput) as unknown
      if (!Array.isArray(parsedData)) {
        throw new Error("Data must be an array of objects")
      }
      setUsers(parsedData as User[])
      setError("")
    } catch (err) {
      setError(
        "JSON parse error: " +
          (err instanceof Error ? err.message : String(err)),
      )
    }
  }

  const handleResetData = () => {
    setUsers(sampleUsers)
    setJsonInput("")
    setError("")
  }

  return (
    <div className="container mx-auto space-y-8 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Dynamic table — users</CardTitle>
          <CardDescription>
            Demo of DynamicTable with the User model: sort, filter, paginate, and
            group.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="table">
            <TabsList className="mb-4">
              <TabsTrigger value="table">Table</TabsTrigger>
              <TabsTrigger value="data">Data</TabsTrigger>
            </TabsList>

            <TabsContent value="table" className="space-y-4">
              <div className="mb-4 flex items-center space-x-2">
                <Button
                  variant={useCustomColumns ? "default" : "outline"}
                  onClick={() => setUseCustomColumns(true)}
                >
                  User columns
                </Button>
                <Button
                  variant={!useCustomColumns ? "default" : "outline"}
                  onClick={() => setUseCustomColumns(false)}
                >
                  Auto-detect
                </Button>
              </div>

              <DynamicTable
                data={tableData}
                columns={useCustomColumns ? userTableColumns : undefined}
                pageSize={5}
                filterable
                groupable
              />
            </TabsContent>

            <TabsContent value="data" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="jsonInput">JSON data (array of User objects)</Label>
                <div className="grid gap-4">
                  <textarea
                    id="jsonInput"
                    className="min-h-50 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder='[{"id":"…","email":"ada@example.com","firstName":"Ada","lastName":"Lovelace","fullName":"Ada Lovelace","role":"ADMIN","isActive":true,"isVerified":true}]'
                    value={jsonInput}
                    onChange={(e) => setJsonInput(e.target.value)}
                  />
                  {error ? <p className="text-sm text-red-500">{error}</p> : null}
                  <div className="flex space-x-2">
                    <Button onClick={handleLoadJson}>Load JSON</Button>
                    <Button variant="outline" onClick={handleResetData}>
                      Reset sample users
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
