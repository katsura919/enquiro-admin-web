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
  selectedIds?: string[]
  onSelectionChange?: (selectedIds: string[]) => void
}

const statusColors = {
  escalated: "bg-orange-100 text-orange-700",
  pending: "bg-yellow-100 text-yellow-700",
  resolved: "bg-green-100 text-green-700",
}

export function EscalationTable({ escalations, onRowClick, loading, selectedIds = [], onSelectionChange }: EscalationTableProps) {
    console.log(escalations)
  
  const isAllSelected = escalations.length > 0 && selectedIds.length === escalations.length
  const isIndeterminate = selectedIds.length > 0 && selectedIds.length < escalations.length

  const handleSelectAll = () => {
    if (isAllSelected) {
      onSelectionChange?.([])
    } else {
      onSelectionChange?.(escalations.map(e => e._id))
    }
  }

  const handleSelectItem = (id: string) => {
    if (selectedIds.includes(id)) {
      onSelectionChange?.(selectedIds.filter(selectedId => selectedId !== id))
    } else {
      onSelectionChange?.([...selectedIds, id])
    }
  }
  
  if (loading) {
    return (
      <div className="w-full min-w-full">
        <div className="rounded-md border bg-card">
          <table className="w-full table-auto divide-y divide-border">            <thead className="bg-muted">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-semibold text-muted-foreground w-12">
                  <div className="h-4 bg-muted rounded w-4"></div>
                </th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-muted-foreground">Case #</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-muted-foreground">Customer</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-muted-foreground">Email</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-muted-foreground">Concern</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-muted-foreground">Status</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-muted-foreground">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">              {[...Array(5)].map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td className="px-4 py-4 w-12">
                    <div className="h-4 bg-muted rounded w-4"></div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="h-4 bg-muted rounded w-16"></div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="h-4 bg-muted rounded w-24"></div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="h-4 bg-muted rounded w-32"></div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="h-4 bg-muted rounded w-40"></div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="h-5 bg-muted rounded-full w-16"></div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="h-4 bg-muted rounded w-20"></div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  }
  return (
    <DataTable
      columns={[
        {
          id: "select",
          header: ({ table }) => (
            <input
              type="checkbox"
              checked={isAllSelected}
              ref={(el) => {
                if (el) el.indeterminate = isIndeterminate
              }}
              onChange={handleSelectAll}
              className="rounded border border-input bg-background"
            />
          ),
          cell: ({ row }) => (
            <input
              type="checkbox"
              checked={selectedIds.includes(row.original._id)}
              onChange={() => handleSelectItem(row.original._id)}
              onClick={(e) => e.stopPropagation()}
              className="rounded border border-input bg-background"
            />
          ),
        },
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
