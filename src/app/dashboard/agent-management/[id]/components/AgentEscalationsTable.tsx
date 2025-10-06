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
  Calendar
} from "lucide-react"

export function AgentEscalationsTable() {
  const router = useRouter()

  return (
    <Card className="bg-card shadow-none border-muted-gray">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Recent Escalations
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="bg-card border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Case #</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Concern</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* Dummy escalation data */}
              <TableRow className="cursor-pointer hover:bg-muted/50">
                <TableCell className="font-mono text-sm font-medium">
                  ESC-2024-001
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">John Doe</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="max-w-[300px] truncate">
                    <span className="font-medium">Product delivery issue - missing items</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 border-red-200 dark:border-red-800">
                    Escalated
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Oct 5, 2025</span>
                  </div>
                </TableCell>
              </TableRow>
              <TableRow className="cursor-pointer hover:bg-muted/50">
                <TableCell className="font-mono text-sm font-medium">
                  ESC-2024-002
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Sarah Wilson</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="max-w-[300px] truncate">
                    <span className="font-medium">Billing discrepancy - overcharged amount</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 border-yellow-200 dark:border-yellow-800">
                    Pending
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Oct 4, 2025</span>
                  </div>
                </TableCell>
              </TableRow>
              <TableRow className="cursor-pointer hover:bg-muted/50">
                <TableCell className="font-mono text-sm font-medium">
                  ESC-2024-003
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Mike Johnson</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="max-w-[300px] truncate">
                    <span className="font-medium">Service complaint - poor customer support</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 border-green-200 dark:border-green-800">
                    Resolved
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Oct 3, 2025</span>
                  </div>
                </TableCell>
              </TableRow>
              <TableRow className="cursor-pointer hover:bg-muted/50">
                <TableCell className="font-mono text-sm font-medium">
                  ESC-2024-004
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Emily Davis</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="max-w-[300px] truncate">
                    <span className="font-medium">Technical issue - website login problems</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 border-yellow-200 dark:border-yellow-800">
                    Pending
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Oct 2, 2025</span>
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
        
        {/* View All Button */}
        <div className="flex justify-center mt-4">
          <Button variant="outline" onClick={() => router.push('/dashboard/escalations')}>
            View All Escalations
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}