"use client"

import * as React from "react"
import { useRouter, useParams } from "next/navigation"
import axios from "axios"
import { 
  AlertTriangle, 
  Clock, 
  Check,
} from "lucide-react"
import {
  ActivityFeed,
  CaseNotes,
  ConversationHistory,
  CustomerIssueCard,
} from "./components"
import { useState } from "react"
import { EscalationHeader } from "./components/EscalationHeader"

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
      createdAt: "2025-06-13T15:30:00Z"    },
    ])
  const [activities, setActivities] = React.useState<Activity[]>([])
  const [loadingActivities, setLoadingActivities] = React.useState(false)
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
  const [copiedCaseNumber, setCopiedCaseNumber] = useState(false);
  const [copiedSessionId, setCopiedSessionId] = useState(false);
  console.log(activities)
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
        // Fetch activities for this escalation
        fetchActivities(res.data._id)
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

  const fetchActivities = async (escalationId: string) => {
    setLoadingActivities(true)
    try {
      const response = await axios.get(`${API_URL}/activity/escalation/${escalationId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      // Transform server response to match client-side Activity interface
      const transformedActivities = response.data.map((activity: any) => ({
        id: activity._id,
        action: activity.action,
        timestamp: activity.timestamp,
        details: activity.details
      }))
      setActivities(transformedActivities)
    } catch (error) {
      console.error('Error fetching activities:', error)
      setActivities([])
    } finally {
      setLoadingActivities(false)
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
      
      // Update escalation state
      setEscalation(prev => prev ? { ...prev, status: newStatus as any, updatedAt: newUpdatedAt } : null)
      
      // Refresh activities to show the new status change activity
      fetchActivities(escalation._id)
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
    })  }
  
  const StatusIcon = escalation ? statusIcons[escalation.status] : AlertTriangle
  
return (
  <div className="bg-background min-h-screen flex flex-col">
    {escalation && (
      <EscalationHeader
        escalation={{
          caseNumber: escalation.caseNumber,
          sessionId: escalation.sessionId,
          status: escalation.status,
        }}
        statusColors={statusColors}
        StatusIcon={StatusIcon}
        copiedCaseNumber={copiedCaseNumber}
        copiedSessionId={copiedSessionId}
        setCopiedCaseNumber={setCopiedCaseNumber}
        setCopiedSessionId={setCopiedSessionId}
        handleStatusChange={handleStatusChange}
      />
    )}
    {/* Main Content */}
    <div className="flex-1 overflow-y-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 md:p-6">        
        {/* Left Column */}
        <div className="col-span-2 space-y-4">
          <CustomerIssueCard
            customerName={escalation?.customerName || ''}
            customerEmail={escalation?.customerEmail || ''}
            customerPhone={escalation?.customerPhone}
            concern={escalation?.concern || ''}
            description={escalation?.description}
            status={escalation?.status || 'escalated'}
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
          <div className="p-0 md:p-4 space-y-8">
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
