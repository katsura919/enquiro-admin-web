import React from "react";
import { Button } from "@/components/ui/button";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";
import { CaseOwnerCombobox } from "./CaseOwnerCombobox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface EscalationHeaderProps {
  escalation: {
    caseNumber: string;
    sessionId: string;
    status: "escalated" | "pending" | "resolved";
    caseOwner?: {
      _id: string;
      name: string;
      email: string;
    };
  };
  statusColors: Record<string, string>;
  StatusIcon: React.ElementType;
  copiedCaseNumber: boolean;
  copiedSessionId: boolean;
  setCopiedCaseNumber: (v: boolean) => void;
  setCopiedSessionId: (v: boolean) => void;
  handleStatusChange: (status: string) => void;
  handleCaseOwnerChange?: (agentId: string) => void;
  businessId?: string; // Add businessId for filtering agents
  currentOwnerName?: string; // Current case owner name for placeholder
}

export const EscalationHeader: React.FC<EscalationHeaderProps> = ({
  escalation,
  statusColors,
  // StatusIcon,
  copiedCaseNumber,
  copiedSessionId,
  setCopiedCaseNumber,
  setCopiedSessionId,
  handleStatusChange,
  handleCaseOwnerChange,
  businessId,
  currentOwnerName,
}) => (
  <div className="border-b border-border bg-card w-full">
    <div className="px-4 py-3 md:px-6 md:py-3">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl md:text-2xl font-bold text-foreground tracking-tight">
                Case: {escalation.caseNumber}
                <button
                  type="button"
                  className="ml-2 p-1 rounded-md hover:bg-accent transition-colors"
                  title="Copy Case Number"
                  onClick={() => {
                    navigator.clipboard.writeText(escalation.caseNumber);
                    setCopiedCaseNumber(true);
                    setTimeout(() => setCopiedCaseNumber(false), 1500);
                  }}
                >
                  <span className="sr-only">Copy Case Number</span>
                  {copiedCaseNumber ? (
                    <Check className="h-3.5 w-3.5 text-green-500" />
                  ) : (
                    <Copy className="h-3.5 w-3.5 text-muted-foreground" />
                  )}
                </button>
              </h1>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-muted-foreground">
                Session: {escalation.sessionId}
              </span>
              <button
                type="button"
                className="p-1 rounded-md hover:bg-accent transition-colors"
                title="Copy Session ID"
                onClick={() => {
                  navigator.clipboard.writeText(escalation.sessionId);
                  setCopiedSessionId(true);
                  setTimeout(() => setCopiedSessionId(false), 1500);
                }}
              >
                <span className="sr-only">Copy Session ID</span>
                {copiedSessionId ? (
                  <Check className="h-3 w-3 text-green-500" />
                ) : (
                  <Copy className="h-3 w-3 text-muted-foreground" />
                )}
              </button>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
          {/* Status Section */}
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-muted-foreground">Status</span>
            <Select
              value={escalation.status}
              onValueChange={handleStatusChange}
            >
              <SelectTrigger className="w-full sm:w-[160px] h-9 bg-card text-sm cursor-pointer">
                <SelectValue>
                  <span className="capitalize">{escalation.status}</span>
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="escalated">
                  <span className={cn(escalation.status === 'escalated' && 'font-bold')}>Escalated</span>
                </SelectItem>
                <SelectItem value="pending">
                  <span className={cn(escalation.status === 'pending' && 'font-bold')}>Pending</span>
                </SelectItem>
                <SelectItem value="resolved">
                  <span className={cn(escalation.status === 'resolved' && 'font-bold')}>Resolved</span>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Case Owner Section */}
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-muted-foreground">Case Owner</span>
            <CaseOwnerCombobox
              value={escalation.caseOwner?._id || ""}
              onValueChange={handleCaseOwnerChange || (() => {})}
              businessId={businessId}
              placeholder="Assign agent..."
              currentAgentName={currentOwnerName}
              className="w-full sm:w-[180px] h-9 text-sm cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
);
