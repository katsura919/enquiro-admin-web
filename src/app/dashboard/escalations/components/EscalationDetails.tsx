"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  AlertTriangle, 
  CheckCircle, 
  User, 
  Mail, 
  Phone,
  Calendar,
  MessageSquare,
  Bot,
  UserCircle,
  Clock,
  ExternalLink,
  RefreshCw
} from "lucide-react"

interface Escalation {
  _id: string
  sessionId: string
  businessId: string
  caseNumber: string
  customerDetails: {
    name: string
    email: string
    phoneNumber?: string
  }
  concern: string
  description?: string
  status: "escalated" | "resolved"
  assignedTo?: string
  createdAt: string
  updatedAt: string
}

interface ChatMessage {
  _id: string
  businessId: string
  sessionId: string
  query: string
  response: string
  isGoodResponse?: boolean | null
  createdAt: string
  updatedAt: string
}

interface EscalationDetailsProps {
  escalation: Escalation
  onUpdateStatus: (escalationId: string, newStatus: string) => void
}

const API_URL = process.env.NEXT_PUBLIC_API_URL

const statusIcons = {
  escalated: AlertTriangle,
  resolved: CheckCircle
}

const statusColors = {
  escalated: "text-orange-400",
  resolved: "text-green-400"
}

export default function EscalationDetails({
  escalation,
  onUpdateStatus
}: EscalationDetailsProps) {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [loadingChats, setLoadingChats] = useState(false)
  const [refreshing, setRefreshing] = useState(false)

  const StatusIcon = statusIcons[escalation.status]
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null

  // Fetch chat messages for the session
  useEffect(() => {
    if (!escalation.sessionId || !token) return

    const fetchChatMessages = async () => {
      setLoadingChats(true)
      try {
        const response = await axios.get(`${API_URL}/chat/session/${escalation.sessionId}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        setChatMessages(response.data)
      } catch (error) {
        console.error('Error fetching chat messages:', error)
        setChatMessages([])
      } finally {
        setLoadingChats(false)
      }
    }

    fetchChatMessages()
  }, [escalation.sessionId, token])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }
  
  const handleStatusChange = async (newStatus: string) => {
    try {
      const response = await axios.patch(
        `${API_URL}/escalation/${escalation._id}/status`,
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )
      
      // Call the parent component's update function
      onUpdateStatus(escalation._id, newStatus)
    } catch (error) {
      console.error('Error updating escalation status:', error)
      // You might want to show a toast notification here
    }
  }

  const handleRefreshChats = async () => {
    setRefreshing(true)
    try {
      const response = await axios.get(`${API_URL}/chat/session/${escalation.sessionId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setChatMessages(response.data)
    } catch (error) {
      console.error('Error refreshing chat messages:', error)
    } finally {
      setRefreshing(false)
    }
  }

  return (
    <div className="h-full bg-background">
      {/* Header Section */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="p-6">
          <div className="flex items-start justify-between mb-6">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-foreground tracking-tight">
                  Escalation Details
                </h1>
                <Badge variant="outline" className="text-xs font-mono">
                  #{escalation.caseNumber}
                </Badge>
              </div>
              <p className="text-muted-foreground text-sm">
                Session ID: {escalation.sessionId}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <StatusIcon className={cn("h-4 w-4", statusColors[escalation.status])} />
                <select
                  value={escalation.status}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  className="px-3 py-2 bg-background border border-input rounded-lg text-sm font-medium capitalize focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="escalated">Escalated</option>
                  <option value="resolved">Resolved</option>
                </select>
              </div>
            </div>
          </div>

          {/* Customer Info Card */}
          <Card className="p-4 bg-background/50">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 text-sm">
                <div className="h-8 w-8 rounded-md bg-primary/5 flex items-center justify-center">
                  <UserCircle className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-muted-foreground">Name</p>
                  <p className="font-medium">{escalation.customerDetails.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="h-8 w-8 rounded-md bg-primary/5 flex items-center justify-center">
                  <Mail className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-muted-foreground">Email</p>
                  <p className="font-medium break-all">{escalation.customerDetails.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="h-8 w-8 rounded-md bg-primary/5 flex items-center justify-center">
                  <Phone className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-muted-foreground">Phone</p>
                  <p className="font-medium">{escalation.customerDetails.phoneNumber || 'Not provided'}</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Main Content */}
      <ScrollArea className="h-[calc(100vh-280px)]">
        <div className="p-6 space-y-6">
          {/* Issue Description */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              <h2 className="text-lg font-semibold">Issue Details</h2>
            </div>
            <Card className="p-4">
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium text-foreground mb-2">Concern</h4>
                  <p className="text-muted-foreground leading-relaxed">{escalation.concern}</p>
                </div>
                {escalation.description && (
                  <div>
                    <h4 className="font-medium text-foreground mb-2">Additional Description</h4>
                    <p className="text-muted-foreground leading-relaxed">{escalation.description}</p>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Chat Conversation */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-blue-500" />
                <h2 className="text-lg font-semibold">Conversation History</h2>
                <Badge variant="secondary" className="text-xs">
                  {chatMessages.length} messages
                </Badge>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefreshChats}
                disabled={refreshing}
                className="gap-2"
              >
                <RefreshCw className={cn("h-4 w-4", refreshing && "animate-spin")} />
                Refresh
              </Button>
            </div>

            <Card className="p-0 overflow-hidden">
              {loadingChats ? (
                <div className="p-8 text-center">
                  <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Loading conversation...</p>
                </div>
              ) : chatMessages.length === 0 ? (
                <div className="p-8 text-center">
                  <MessageSquare className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                  <p className="text-muted-foreground">No conversation found for this session</p>
                </div>
              ) : (
                <ScrollArea className="h-96">
                  <div className="p-4 space-y-4">
                    {chatMessages.map((message) => (
                      <div key={message._id} className="space-y-3">
                        {/* Customer Query */}
                        <div className="flex gap-3">
                          <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                            <UserCircle className="h-4 w-4 text-blue-600" />
                          </div>
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium">Customer</span>
                              <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {formatTime(message.createdAt)}
                              </span>
                            </div>
                            <div className="bg-gray-800 rounded-lg p-3 border-l-2 ">
                              <p className="text-sm leading-relaxed">{message.query}</p>
                            </div>
                          </div>
                        </div>

                        {/* Bot Response */}
                        <div className="flex gap-3 ml-6">
                          <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                            <Bot className="h-4 w-4 text-green-600" />
                          </div>
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium">AI Assistant</span>
                              {message.isGoodResponse !== null && (
                                <Badge variant={message.isGoodResponse ? "default" : "destructive"} className="text-xs">
                                  {message.isGoodResponse ? "Helpful" : "Not Helpful"}
                                </Badge>
                              )}
                            </div>
                            <div className="bg-gray-800 rounded-lg p-3 border-l-2 ">
                              <p className="text-sm leading-relaxed">{message.response}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </Card>
          </div>          
          
          {/* Timestamps */}
          <div className="grid grid-cols-1 gap-6">
            <Card className="p-4">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center">
                    <Calendar className="h-4 w-4 text-primary" />
                  </div>
                  <h3 className="font-semibold">Timeline</h3>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>Created: {formatDate(escalation.createdAt)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>Updated: {formatDate(escalation.updatedAt)}</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>        </div>
      </ScrollArea>
    </div>
  )
}
