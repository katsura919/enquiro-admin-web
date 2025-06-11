"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, AlertTriangle, Clock, CheckCircle, XCircle, User } from "lucide-react"

interface Escalation {
  _id: string
  sessionId: string
  businessId: string
  customerDetails: {
    name: string
    email: string
    phoneNumber: string
  }
  issue: string
  priority: "low" | "medium" | "high" | "urgent"
  status: "pending" | "in-progress" | "resolved" | "closed"
  assignedTo?: string
  createdAt: string
  updatedAt: string
  messages: Array<{
    _id: string
    content: string
    sender: "user" | "bot" | "agent"
    timestamp: string
  }>
}

interface EscalationListProps {
  escalations: Escalation[]
  selectedEscalationId: string | null
  onSelectEscalation: (id: string) => void
  loading: boolean
}

const priorityColors = {
  low: "bg-green-500/20 text-green-300 border-green-500/30",
  medium: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
  high: "bg-orange-500/20 text-orange-300 border-orange-500/30",
  urgent: "bg-red-500/20 text-red-300 border-red-500/30"
}

const statusIcons = {
  pending: Clock,
  "in-progress": AlertTriangle,
  resolved: CheckCircle,
  closed: XCircle
}

const statusColors = {
  pending: "text-yellow-400",
  "in-progress": "text-blue-400",
  resolved: "text-green-400",
  closed: "text-gray-400"
}

export default function EscalationList({
  escalations,
  selectedEscalationId,
  onSelectEscalation,
  loading
}: EscalationListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [priorityFilter, setPriorityFilter] = useState<string>("all")

  const filteredEscalations = escalations.filter(escalation => {
    const matchesSearch = 
      escalation.customerDetails.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      escalation.issue.toLowerCase().includes(searchTerm.toLowerCase()) ||
      escalation.customerDetails.email.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === "all" || escalation.status === statusFilter
    const matchesPriority = priorityFilter === "all" || escalation.priority === priorityFilter
    
    return matchesSearch && matchesStatus && matchesPriority
  })

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMs = now.getTime() - date.getTime()
    const diffInHours = diffInMs / (1000 * 60 * 60)
    
    if (diffInHours < 1) {
      return "Just now"
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`
    } else {
      return `${Math.floor(diffInHours / 24)}d ago`
    }
  }
  if (loading) {
    return (
      <div className="h-full bg-card border-r border-border">
        <div className="p-4">
          <div className="animate-pulse space-y-4">
            <div className="h-10 bg-muted rounded"></div>
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }
  return (
    <div className="h-full bg-card border-r border-border flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        
        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search escalations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-background border-border text-foreground placeholder-muted-foreground"
          />
        </div>        {/* Filters */}
        <div className="space-y-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground text-sm"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
          
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground text-sm"
          >
            <option value="all">All Priorities</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>      {/* Escalation List */}
      <div className="flex-1 overflow-y-auto">
        {filteredEscalations.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground">
            <AlertTriangle className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>No escalations found</p>
          </div>
        ) : (
          <div className="space-y-1 p-2">
            {filteredEscalations.map((escalation) => {
              const StatusIcon = statusIcons[escalation.status]
              const isSelected = selectedEscalationId === escalation._id
              
              return (
                <div
                  key={escalation._id}
                  onClick={() => onSelectEscalation(escalation._id)}
                  className={cn(
                    "p-3 rounded-lg cursor-pointer transition-all duration-200 hover:bg-accent",
                    isSelected && "bg-primary/20 border border-primary/30"
                  )}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <StatusIcon className={cn("h-4 w-4", statusColors[escalation.status])} />
                      <span className="text-foreground font-medium text-sm">
                        {escalation.customerDetails.name}
                      </span>
                    </div>
                    <Badge className={cn("text-xs px-2 py-1", priorityColors[escalation.priority])}>
                      {escalation.priority}
                    </Badge>
                  </div>
                  
                  <p className="text-muted-foreground text-sm mb-2 line-clamp-2">
                    {escalation.issue}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      {escalation.assignedTo && (
                        <>
                          <User className="h-3 w-3" />
                          <span>{escalation.assignedTo}</span>
                        </>
                      )}
                    </div>
                    <span>{formatDate(escalation.createdAt)}</span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
