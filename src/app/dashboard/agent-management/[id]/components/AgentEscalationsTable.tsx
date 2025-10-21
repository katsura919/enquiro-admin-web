"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { 
  MessageSquare, 
  User, 
  Calendar,
  Mail
} from "lucide-react"
import { format } from "date-fns"

interface Escalation {
  _id: string
  caseNumber: string
  customerName: string
  customerEmail: string
  concern: string
  status: "escalated" | "pending" | "resolved"
  createdAt: string
}

interface AgentEscalationsTableProps {
  escalations: Escalation[]
  loading: boolean
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function AgentEscalationsTable({ escalations, loading, currentPage, totalPages, onPageChange }: AgentEscalationsTableProps) {
  const router = useRouter()

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM d, yyyy")
    } catch {
      return dateString
    }
  }

  const getStatusInfo = (status: Escalation['status']) => {
    switch (status) {
      case 'escalated':
        return { 
          text: 'Escalated', 
          className: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 border-red-200 dark:border-red-800' 
        }
      case 'pending':
        return { 
          text: 'Pending', 
          className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 border-yellow-200 dark:border-yellow-800' 
        }
      case 'resolved':
        return { 
          text: 'Resolved', 
          className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 border-green-200 dark:border-green-800' 
        }
      default:
        return { 
          text: status, 
          className: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200 border-gray-200 dark:border-gray-800' 
        }
    }
  }

  return (
    <Card className="bg-card shadow-none border-muted-gray">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base text-secondary-foreground">
          <MessageSquare className="h-4 w-4" />
          Recent Escalations
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-4">
        <div className="bg-card border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="h-9 text-xs">Case #</TableHead>
                <TableHead className="h-9 text-xs">Customer</TableHead>
                <TableHead className="h-9 text-xs">Concern</TableHead>
                <TableHead className="h-9 text-xs">Status</TableHead>
                <TableHead className="h-9 text-xs">Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-[300px]">
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
                        <span className="mt-2 text-xs text-muted-foreground block">Loading...</span>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : escalations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-[300px]">
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center">
                        <Mail className="h-8 w-8 text-muted-foreground mx-auto mb-2 opacity-50" />
                        <span className="text-sm text-muted-foreground">No escalations assigned</span>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                escalations.map((escalation) => {
                  const statusInfo = getStatusInfo(escalation.status)
                  return (
                    <TableRow 
                      key={escalation._id}
                      className="cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => router.push(`/dashboard/escalations/${escalation._id}`)}
                    >
                      <TableCell className="font-mono text-xs font-medium py-3">
                        #{escalation.caseNumber}
                      </TableCell>
                      <TableCell className="py-3">
                        <div className="flex items-center gap-2 min-w-0">
                          <User className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                          <span className="font-medium text-sm truncate">{escalation.customerName}</span>
                        </div>
                      </TableCell>
                      <TableCell className="py-3">
                        <div className="max-w-[250px] truncate">
                          <span className="text-sm">{escalation.concern || 'No concern'}</span>
                        </div>
                      </TableCell>
                      <TableCell className="py-3">
                        <div className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${statusInfo.className}`}>
                          {statusInfo.text}
                        </div>
                      </TableCell>
                      <TableCell className="py-3">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                          <span className="text-xs text-muted-foreground">{formatDate(escalation.createdAt)}</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </div>
        
        {/* Compact Pagination */}
        {escalations.length > 0 && totalPages > 1 && (
          <div className="flex items-center justify-between mt-3 px-1">
            <div className="text-xs text-muted-foreground">
              Page {currentPage} of {totalPages}
            </div>
            <div className="flex items-center gap-1.5">
              <Button 
                variant="outline" 
                size="sm"
                disabled={currentPage <= 1}
                onClick={() => onPageChange(currentPage - 1)}
                className="h-7 px-2 text-xs"
              >
                Previous
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                disabled={currentPage >= totalPages}
                onClick={() => onPageChange(currentPage + 1)}
                className="h-7 px-2 text-xs"
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}