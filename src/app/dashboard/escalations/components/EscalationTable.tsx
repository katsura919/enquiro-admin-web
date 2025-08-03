"use client"

import * as React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { 
  Edit, 
  Trash2, 
  Eye,
  MoreVertical,
  ArrowUpDown,
  Calendar,
  User,
  Mail
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Spinner } from "@/components/ui/spinner"

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
  onEdit?: (escalation: Escalation) => void
  onDelete?: (id: string) => void
}

type SortField = 'caseNumber' | 'customerName' | 'customerEmail' | 'concern' | 'status' | 'createdAt'
type SortDirection = 'asc' | 'desc'

const statusColors = {
  escalated: "destructive" as const,
  pending: "secondary" as const,
  resolved: "default" as const,
}

export function EscalationTable({ 
  escalations, 
  onRowClick, 
  loading, 
  selectedIds = [], 
  onSelectionChange,
  onEdit,
  onDelete
}: EscalationTableProps) {

  // Show all escalations by default (no status filter)
  const [sortField, setSortField] = useState<SortField>('createdAt')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  const getStatusInfo = (status: Escalation['status']) => {
    switch (status) {
      case 'escalated':
        return { text: 'Escalated', variant: 'destructive' as const }
      case 'pending':
        return { text: 'Pending', variant: 'secondary' as const }
      case 'resolved':
        return { text: 'Resolved', variant: 'default' as const }
      default:
        return { text: status, variant: 'secondary' as const }
    }
  }

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const sortedEscalations = [...escalations].sort((a, b) => {
    let aValue: any = a[sortField]
    let bValue: any = b[sortField]

    if (sortField === 'createdAt') {
      aValue = new Date(a.createdAt).getTime()
      bValue = new Date(b.createdAt).getTime()
    }

    if (typeof aValue === 'string') {
      aValue = aValue.toLowerCase()
      bValue = bValue.toLowerCase()
    }

    if (sortDirection === 'asc') {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
    }
  })

  const SortableHeader = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <TableHead 
      className="cursor-pointer hover:bg-muted/50 select-none"
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center gap-2">
        {children}
        <ArrowUpDown className="h-4 w-4" />
      </div>
    </TableHead>
  )

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
      <div className="flex items-center justify-center min-h-[400px] p-12">
        <div className="text-center">
          <Spinner size="lg" className="mx-auto mb-6 bg-blue-600 w-12 h-12" />
        </div>
      </div>
    )
  }

  return (
    <TooltipProvider>
      <div className="bg-card border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[60px]">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  ref={(el) => {
                    if (el) el.indeterminate = isIndeterminate
                  }}
                  onChange={handleSelectAll}
                  className="rounded border border-input bg-background"
                />
              </TableHead>
              <SortableHeader field="caseNumber">Case #</SortableHeader>
              <SortableHeader field="customerName">Customer</SortableHeader>
              <SortableHeader field="customerEmail">Email</SortableHeader>
              <SortableHeader field="concern">Concern</SortableHeader>
              <SortableHeader field="status">Status</SortableHeader>
              <SortableHeader field="createdAt">Created</SortableHeader>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedEscalations.map((escalation, index) => {
              const statusInfo = getStatusInfo(escalation.status)
              return (
                <TableRow 
                  key={escalation._id} 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => onRowClick(escalation._id)}
                >
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(escalation._id)}
                      onChange={() => handleSelectItem(escalation._id)}
                      className="rounded border border-input bg-background"
                    />
                  </TableCell>
                  <TableCell className="font-mono text-sm font-medium">
                    {escalation.caseNumber}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{escalation.customerName}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{escalation.customerEmail}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-[300px] truncate">
                      <span className="font-medium">{escalation.concern}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusInfo.variant}>
                      {statusInfo.text}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{formatDate(escalation.createdAt)}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => onRowClick(escalation._id)}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        {onEdit && (
                          <DropdownMenuItem onClick={() => onEdit(escalation)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        {onDelete && (
                          <DropdownMenuItem 
                            onClick={() => onDelete(escalation._id)}
                            className="text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </TooltipProvider>
  )
}
