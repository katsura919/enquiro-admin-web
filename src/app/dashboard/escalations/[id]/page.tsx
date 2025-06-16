"use client"

import * as React from "react"
import { useRouter, useParams } from "next/navigation"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { 
  ChevronLeft , 
  AlertTriangle, 
  Clock, 
  Check,
  ChevronDown,
  Copy
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import {
  ActivityFeed,
  CaseNotes,
  ConversationHistory,
  CustomerIssueCard,
} from "./components"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem
} from "@/components/ui/dropdown-menu"
import { useState } from "react"

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
  resolved: Check
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
  const [copiedCaseNumber, setCopiedCaseNumber] = useState(false);
  const [copiedSessionId, setCopiedSessionId] = useState(false);

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
  <div className="bg-background min-h-screen flex flex-col">
    {/* Header Section - Responsive and Compact */}
    <div className="border-b border-border bg-card/50 w-full">
      <div className="px-4 py-3 md:px-6 md:py-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="space-y-0.5">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-lg md:text-2xl font-bold text-foreground tracking-tight">
                Case 
                </h1>
               <h2 className="text-lg md:text-2xl font-bold text-foreground tracking-tight">
                  #{escalation.caseNumber}
                  <button
                    type="button"
                    className="ml-1 p-0.5 rounded hover:bg-accent"
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
                </h2>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-muted-foreground text-xs md:text-sm break-all">
                Session ID: {escalation.sessionId}
                </span>
                <button
                type="button"
                className="ml-1 p-0.5 rounded hover:bg-accent"
                title="Copy Session ID"
                onClick={() => {
                  navigator.clipboard.writeText(escalation.sessionId);
                  setCopiedSessionId(true);
                  setTimeout(() => setCopiedSessionId(false), 1500);
                }}
                >
                <span className="sr-only">Copy Session ID</span>
                {copiedSessionId ? (
                  <Check className="h-3.5 w-3.5 text-green-500" />
                ) : (
                  <Copy className="h-3.5 w-3.5 text-muted-foreground" />
                )}
                </button>
              </div>
              </div>
            </div>
          <div className="flex items-center gap-2 md:gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <StatusIcon className={cn("h-4 w-4", statusColors[escalation.status])} />
                  <span className="capitalize">{escalation.status}</span>
                  <ChevronDown className="h-4 w-4 ml-1 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleStatusChange('escalated')}>
                  <span className={cn("flex items-center gap-2", escalation.status === 'escalated' && 'font-bold')}>Escalated</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleStatusChange('pending')}>
                  <span className={cn("flex items-center gap-2", escalation.status === 'pending' && 'font-bold')}>Pending</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleStatusChange('resolved')}>
                  <span className={cn("flex items-center gap-2", escalation.status === 'resolved' && 'font-bold')}>Resolved</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>

    {/* Main Content */}
    <div className="flex-1 overflow-y-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 md:p-6">
        {/* Left Column */}
        <div className="col-span-2 space-y-6">
          <CustomerIssueCard
            customerName={escalation.customerName}
            customerEmail={escalation.customerEmail}
            customerPhone={escalation.customerPhone}
            concern={escalation.concern}
            description={escalation.description}
            status={escalation.status}
          />

          <ConversationHistory
            chatMessages={chatMessages}
            loadingChats={loadingChats}
            refreshing={refreshing}
            handleRefreshChats={handleRefreshChats}
            formatTime={formatTime}
          />

        </div>

        {/* Right Column */}
        <div className="md:border-l md:border-border/40">
          <div className="p-0 md:p-6 space-y-8">
            <CaseNotes 
              notes={caseNotes}
              onAddNote={addCaseNote}
              onDeleteNote={deleteNote}
              formatDate={formatDate}
            />

            <ActivityFeed 
              activities={activities}
              formatDate={formatDate}
            />
          </div>
        </div>
      </div>
    </div>
  </div>
)

}
