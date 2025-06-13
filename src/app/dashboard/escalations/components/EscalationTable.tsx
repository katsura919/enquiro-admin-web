"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { DataTable } from "@/components/ui/data-table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export interface Escalation {
  _id: string
  caseNumber: string
  customerName: string
  customerEmail: string
  concern: string
  status: "escalated" | "pending" | "resolved"
  createdAt: string
}

interface EscalationTableProps {
  escalations: Escalation[]
  onRowClick: (id: string) => void
  loading: boolean
}

const statusColors = {
  escalated: "bg-orange-100 text-orange-700",
  pending: "bg-yellow-100 text-yellow-700",
  resolved: "bg-green-100 text-green-700",
}

export function EscalationTable({ escalations, onRowClick, loading }: EscalationTableProps) {
    console.log(escalations)
  return (
    <DataTable
      columns={[
        {
          accessorKey: "caseNumber",
          header: "Case #",
        },
        {
          accessorKey: "customerName",
          header: "Customer",
        },
        {
          accessorKey: "customerEmail",
          header: "Email",
        },
        {
          accessorKey: "concern",
          header: "Concern",
        },
        {
          accessorKey: "status",
          header: "Status",
          cell: ({ row }) => (
            <Badge className={statusColors[row.original.status]}>{row.original.status.charAt(0).toUpperCase() + row.original.status.slice(1)}</Badge>
          ),
        },
        {
          accessorKey: "createdAt",
          header: "Created",
          cell: ({ row }) => new Date(row.original.createdAt).toLocaleString(),
        },      ]}
      data={escalations}
      loading={loading}
      onRowClick={(row) => onRowClick(row._id)}
      className="w-full min-w-full"
    />
  )
}
