"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { 
  AlertTriangle, 
  Clock, 
  CheckCircle, 
  XCircle, 
  User, 
  Mail, 
  Phone,
  Calendar,
  MessageSquare,
  Send
} from "lucide-react"

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

interface EscalationDetailsProps {
  escalation: Escalation
  onUpdateStatus: (escalationId: string, newStatus: string) => void
  onAssignAgent: (escalationId: string, agentName: string) => void
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

export default function EscalationDetails({
  escalation,
  onUpdateStatus,
  onAssignAgent
}: EscalationDetailsProps) {
  const [newMessage, setNewMessage] = useState("")
  const [newAgentName, setNewAgentName] = useState(escalation.assignedTo || "")

  const StatusIcon = statusIcons[escalation.status]

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  const handleSendMessage = () => {
    if (!newMessage.trim()) return
    
    // TODO: Implement message sending
    console.log("Sending message:", newMessage)
    setNewMessage("")
  }

  const handleStatusChange = (newStatus: string) => {
    onUpdateStatus(escalation._id, newStatus)
  }
  const handleAgentAssignment = () => {
    if (newAgentName.trim()) {
      onAssignAgent(escalation._id, newAgentName)
    }
  }

  return (
    <div className="h-full bg-background flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Escalation Details
            </h1>
            <p className="text-muted-foreground">#{escalation._id}</p>
          </div>
          <div className="flex items-center gap-2">
            <StatusIcon className={cn("h-5 w-5", statusColors[escalation.status])} />
            <Badge className={cn("text-sm", priorityColors[escalation.priority])}>
              {escalation.priority} priority
            </Badge>
          </div>
        </div>

        {/* Customer Info */}
        <Card className="bg-card border-border p-4">
          <h3 className="text-foreground font-semibold mb-3">Customer Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <User className="h-4 w-4" />
              <span>{escalation.customerDetails.name}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Mail className="h-4 w-4" />
              <span>{escalation.customerDetails.email}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Phone className="h-4 w-4" />
              <span>{escalation.customerDetails.phoneNumber}</span>
            </div>
          </div>
        </Card>
      </div>      {/* Main Content */}
      <div className="flex-1 p-6 space-y-6 overflow-y-auto">
        {/* Issue Description */}
        <Card className="bg-card border-border p-4">
          <h3 className="text-foreground font-semibold mb-3">Issue Description</h3>
          <p className="text-muted-foreground">{escalation.issue}</p>
        </Card>

        {/* Status & Assignment */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-card border-border p-4">
            <h3 className="text-foreground font-semibold mb-3">Status Management</h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Current Status</label>
                <select
                  value={escalation.status}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground"
                >
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
              <div className="text-xs text-muted-foreground">
                <Calendar className="h-3 w-3 inline mr-1" />
                Created: {formatDate(escalation.createdAt)}
              </div>
              <div className="text-xs text-muted-foreground">
                <Calendar className="h-3 w-3 inline mr-1" />
                Updated: {formatDate(escalation.updatedAt)}
              </div>
            </div>
          </Card>

          <Card className="bg-card border-border p-4">
            <h3 className="text-foreground font-semibold mb-3">Agent Assignment</h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Assigned Agent</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newAgentName}
                    onChange={(e) => setNewAgentName(e.target.value)}
                    placeholder="Enter agent name"
                    className="flex-1 px-3 py-2 bg-background border border-border rounded-md text-foreground placeholder-muted-foreground"
                  />
                  <Button
                    onClick={handleAgentAssignment}
                    size="sm"
                    className="bg-primary hover:bg-primary/90"
                  >
                    Assign
                  </Button>
                </div>
              </div>
              {escalation.assignedTo && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <User className="h-4 w-4" />
                  <span>Currently assigned to: {escalation.assignedTo}</span>
                </div>
              )}
            </div>
          </Card>
        </div>        {/* Messages */}
        <Card className="bg-card border-border p-4">
          <h3 className="text-foreground font-semibold mb-4 flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Conversation History
          </h3>
          <div className="space-y-4 mb-4 max-h-60 overflow-y-auto">
            {escalation.messages.map((message) => (
              <div
                key={message._id}
                className={cn(
                  "p-3 rounded-lg",
                  message.sender === "user" && "bg-primary/20 ml-4",
                  message.sender === "bot" && "bg-muted ml-4",
                  message.sender === "agent" && "bg-secondary/50 mr-4"
                )}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground capitalize">
                    {message.sender === "user" ? "Customer" : message.sender}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {formatDate(message.timestamp)}
                  </span>
                </div>
                <p className="text-muted-foreground text-sm">{message.content}</p>
              </div>
            ))}
          </div>

        </Card>
      </div>
    </div>
  )
}
