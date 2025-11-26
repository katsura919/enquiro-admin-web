"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MessageSquare, User, Calendar, Mail } from "lucide-react";
import { format } from "date-fns";

interface Escalation {
  _id: string;
  caseNumber: string;
  customerName: string;
  customerEmail: string;
  concern: string;
  status: "escalated" | "pending" | "resolved";
  createdAt: string;
}

interface AgentEscalationsTableProps {
  escalations: Escalation[];
  loading: boolean;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function AgentEscalationsTable({
  escalations,
  loading,
  currentPage,
  totalPages,
  onPageChange,
}: AgentEscalationsTableProps) {
  const router = useRouter();

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM d, yyyy");
    } catch {
      return dateString;
    }
  };

  const getStatusInfo = (status: Escalation["status"]) => {
    switch (status) {
      case "escalated":
        return {
          text: "Escalated",
          className:
            "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 border-red-200 dark:border-red-800",
        };
      case "pending":
        return {
          text: "Pending",
          className:
            "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 border-yellow-200 dark:border-yellow-800",
        };
      case "resolved":
        return {
          text: "Resolved",
          className:
            "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 border-green-200 dark:border-green-800",
        };
      default:
        return {
          text: status,
          className:
            "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200 border-gray-200 dark:border-gray-800",
        };
    }
  };

  return (
    <Card className="bg-card border-muted-gray shadow-none">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg font-semibold text-foreground">
            <MessageSquare className="h-5 w-5" />
            Recent Escalations
          </CardTitle>
          {escalations.length > 0 && (
            <span className="text-xs text-muted-foreground font-normal">
              {escalations.length} {escalations.length === 1 ? "case" : "cases"}
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent className="px-6 pb-6">
        <div className="bg-card border rounded-lg overflow-hidden">
          <Table className="bg-card">
            <TableHeader>
              <TableRow className="hover:bg-transparent bg-card">
                <TableHead className="h-11 text-xs font-semibold">
                  Case Number
                </TableHead>
                <TableHead className="h-11 text-xs font-semibold">
                  Customer
                </TableHead>
                <TableHead className="h-11 text-xs font-semibold">
                  Concern
                </TableHead>
                <TableHead className="h-11 text-xs font-semibold">
                  Status
                </TableHead>
                <TableHead className="h-11 text-xs font-semibold">
                  Date
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-[300px] bg-card">
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center space-y-3">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                        <span className="text-sm text-muted-foreground block">
                          Loading escalations...
                        </span>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : escalations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-[300px] bg-card">
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center space-y-3">
                        <div className="p-4 bg-muted rounded-full w-fit mx-auto">
                          <Mail className="h-8 w-8 text-muted-foreground opacity-50" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            No escalations found
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            This agent has no assigned escalations
                          </p>
                        </div>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                escalations.map((escalation) => {
                  const statusInfo = getStatusInfo(escalation.status);
                  return (
                    <TableRow
                      key={escalation._id}
                      className="cursor-pointer hover:bg-muted/30 transition-colors bg-card"
                      onClick={() =>
                        router.push(`/dashboard/escalations/${escalation._id}`)
                      }
                    >
                      <TableCell className="font-mono text-xs font-semibold py-4">
                        <span className="text-primary">
                          #{escalation.caseNumber}
                        </span>
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="p-1.5 bg-muted rounded-full">
                            <User className="h-3.5 w-3.5 text-muted-foreground" />
                          </div>
                          <span className="font-medium text-sm truncate">
                            {escalation.customerName}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="max-w-[280px] truncate">
                          <span className="text-sm text-muted-foreground">
                            {escalation.concern || "No concern provided"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <div
                          className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${statusInfo.className}`}
                        >
                          {statusInfo.text}
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                          <span className="text-xs text-muted-foreground font-medium">
                            {formatDate(escalation.createdAt)}
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>

        {/* Enhanced Pagination */}
        {escalations.length > 0 && totalPages > 1 && (
          <div className="flex items-center justify-between mt-4 px-2">
            <div className="text-sm text-muted-foreground font-medium">
              Page {currentPage} of {totalPages}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage <= 1}
                onClick={() => onPageChange(currentPage - 1)}
                className="h-8 px-3 text-xs font-medium"
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage >= totalPages}
                onClick={() => onPageChange(currentPage + 1)}
                className="h-8 px-3 text-xs font-medium"
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
