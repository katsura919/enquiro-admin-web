"use client"

import * as React from "react"
import { useRouter, useParams } from "next/navigation"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  ArrowLeft, 
  AlertTriangle, 
  Clock, 
  CheckCircle
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import {
  ActivityFeed,
  CaseNotes,
  ConversationHistory,
  CustomerInfoCard,
  IssueDetails,
  Timeline
} from "./components"

interface Escalation {
  _id: string
  sessionId: string
  businessId: string
  caseNumber: string
  customerName: string
  customerEmail: string
  customerPhone?: string
  concern: string
  description?: string
  status: "escalated" | "pending" | "resolved"
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

// Import types from our component files
import type { CaseNote } from './components/CaseNotes'
import type { ActivityItem as Activity } from './components/ActivityFeed'

const API_URL = process.env.NEXT_PUBLIC_API_URL

const statusIcons = {
  escalated: AlertTriangle,
  pending: Clock,
  resolved: CheckCircle
}

const statusColors = {
  escalated: "text-orange-400",
  pending: "text-yellow-400",
  resolved: "text-green-400"
}

export default function EscalationDetailsPage() {
  const router = useRouter()
  const params = useParams()
  const { id } = params as { id: string }
  const [escalation, setEscalation] = React.useState<Escalation | null>(null)
  const [chatMessages, setChatMessages] = React.useState<ChatMessage[]>([])
  const [loading, setLoading] = React.useState(false)
  const [loadingChats, setLoadingChats] = React.useState(false)
  const [refreshing, setRefreshing] = React.useState(false)
  const [noteText, setNoteText] = React.useState("")
  const [caseNotes, setCaseNotes] = React.useState<CaseNote[]>([
    {
      id: "note-1",
      content: "Initial assessment: Customer reported issues with login functionality after the recent update.",
      author: "Jane Smith",
      createdAt: "2025-06-13T15:30:00Z"
    },
    {
      id: "note-2",
      content: "Checked account settings and found no permissions issues. Customer was advised to clear browser cache.",
      author: "John Doe",
      createdAt: "2025-06-14T09:15:00Z"
    }
  ])
  const [activities, setActivities] = React.useState<Activity[]>([
    {
      id: "act-1",
      action: "Status Changed",
      user: "Jane Smith",
      timestamp: "2025-06-13T16:45:00Z",
      details: "Status changed from Escalated to Pending"
    },
    {
      id: "act-2",
      action: "Note Added",
      user: "Jane Smith",
      timestamp: "2025-06-13T15:30:00Z"
    },
    {
      id: "act-3",
      action: "Ticket Created",
      user: "System",
      timestamp: "2025-06-13T14:22:00Z",
      details: "Escalation automatically created from chat session"
    }
  ])
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null

  const addCaseNote = () => {
    if (!noteText.trim()) return;
    
    const newNote: CaseNote = {
      id: `note-${Date.now()}`,
      content: noteText,
      author: "Current User", // In a real app, get the current user's name
      createdAt: new Date().toISOString()
    };
    
    setCaseNotes([newNote, ...caseNotes]);
    
    // Add to activities
    const newActivity: Activity = {
      id: `act-${Date.now()}`,
      action: "Note Added",
      user: "Current User",
      timestamp: new Date().toISOString()
    };
    
    setActivities([newActivity, ...activities]);
    setNoteText("");
    
    // In a real app, you would save this to the backend
    // Example:
    // axios.post(`${API_URL}/escalation/${id}/notes`, newNote, {
    //   headers: { Authorization: `Bearer ${token}` }
    // });
  };

  const deleteNote = (noteId: string) => {
    setCaseNotes(caseNotes.filter(note => note.id !== noteId));
    
    // Add to activities
    const newActivity: Activity = {
      id: `act-${Date.now()}`,
      action: "Note Deleted",
      user: "Current User",
      timestamp: new Date().toISOString()
    };
    
    setActivities([newActivity, ...activities]);
    
    // In a real app, you would delete this from the backend
  };

  React.useEffect(() => {
    if (!id || !token) return
    setLoading(true)
    axios.get(`${API_URL}/escalation/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        setEscalation(res.data)
        // Fetch chat messages after getting escalation
        if (res.data.sessionId) {
          fetchChatMessages(res.data.sessionId)
        }
      })
      .catch(() => setEscalation(null))
      .finally(() => setLoading(false))
  }, [id, token])

  const fetchChatMessages = async (sessionId: string) => {
    setLoadingChats(true)
    try {
      const response = await axios.get(`${API_URL}/chat/session/${sessionId}`, {
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

  const handleStatusChange = async (newStatus: string) => {
    if (!escalation) return
    
    try {
      await axios.patch(
        `${API_URL}/escalation/${escalation._id}/status`,
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )
      
      const newUpdatedAt = new Date().toISOString();
      
      // Add status change to activities
      const newActivity: Activity = {
        id: `act-${Date.now()}`,
        action: "Status Changed",
        user: "Current User", // In a real app, get the current user's name
        timestamp: newUpdatedAt,
        details: `Status changed from ${escalation.status} to ${newStatus}`
      };
      
      setActivities([newActivity, ...activities]);
      setEscalation(prev => prev ? { ...prev, status: newStatus as any, updatedAt: newUpdatedAt } : null)
    } catch (error) {
      console.error('Error updating escalation status:', error)
    }
  }

  const handleRefreshChats = async () => {
    if (!escalation?.sessionId) return
    
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  if (loading) return <div className="p-8 text-center">Loading...</div>
  if (!escalation) return <div className="p-8 text-center">Escalation not found.</div>

  const StatusIcon = statusIcons[escalation.status]

  return (
    <div className="h-full bg-background">
      {/* Header Section */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="p-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" onClick={() => router.back()}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
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
                  <option value="pending">Pending</option>
                  <option value="resolved">Resolved</option>
                </select>
              </div>
            </div>
          </div>

          {/* Customer Info Card */}
          <CustomerInfoCard 
            customerName={escalation.customerName} 
            customerEmail={escalation.customerEmail} 
            customerPhone={escalation.customerPhone} 
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[calc(100vh-200px)]">
        {/* Left Column - Issue Details & Conversation History */}
        <div className="col-span-2">
          <ScrollArea className="h-full pr-4">
            <div className="p-6 space-y-6">
              {/* Issue Details */}
              <IssueDetails 
                concern={escalation.concern}
                description={escalation.description}
                status={escalation.status}
              />

              {/* Chat Conversation */}
              <ConversationHistory
                chatMessages={chatMessages}
                loadingChats={loadingChats}
                refreshing={refreshing}
                handleRefreshChats={handleRefreshChats}
                formatTime={formatTime}
              />
              
              {/* Timeline */}
              <Timeline 
                createdAt={escalation.createdAt}
                updatedAt={escalation.updatedAt}
                formatDate={formatDate}
              />
            </div>
          </ScrollArea>
        </div>
        
        {/* Right Column - Case Notes and Activity */}
        <div className="border-l border-border/40 h-full">
          <ScrollArea className="h-full">
            <div className="p-6 space-y-8">
              {/* Case Notes Section */}
              <CaseNotes 
                notes={caseNotes}
                onAddNote={addCaseNote}
                onDeleteNote={deleteNote}
                formatDate={formatDate}
              />
              
              {/* Recent Activity Section */}
              <ActivityFeed 
                activities={activities}
                formatDate={formatDate}
              />
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  )
}
