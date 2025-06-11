"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { useAuth } from "@/lib/auth"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import EscalationList from "./components/EscalationList"
import EscalationDetails from "./components/EscalationDetails"

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

const API_URL = process.env.NEXT_PUBLIC_API_URL

export default function EscalationsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user } = useAuth()
  const [escalations, setEscalations] = useState<Escalation[]>([])
  const [selectedEscalationId, setSelectedEscalationId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
  const businessId = user?.businessId

  // Mock data for now - replace with actual API calls
  const mockEscalations: Escalation[] = [
    {
      _id: "esc_001",
      sessionId: "session_001",
      businessId: businessId || "",
      customerDetails: {
        name: "John Doe",
        email: "john.doe@example.com",
        phoneNumber: "+1234567890"
      },
      issue: "Unable to process refund request",
      priority: "high",
      status: "pending",
      assignedTo: "Agent Smith",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messages: [
        {
          _id: "msg_001",
          content: "I need help with my refund request. The chatbot couldn't process it.",
          sender: "user",
          timestamp: new Date().toISOString()
        },
        {
          _id: "msg_002",
          content: "I apologize for the inconvenience. Let me help you with your refund request.",
          sender: "bot",
          timestamp: new Date().toISOString()
        }
      ]
    },
    {
      _id: "esc_002",
      sessionId: "session_002",
      businessId: businessId || "",
      customerDetails: {
        name: "Jane Smith",
        email: "jane.smith@example.com",
        phoneNumber: "+0987654321"
      },
      issue: "Product quality complaint",
      priority: "medium",
      status: "in-progress",
      assignedTo: "Agent Johnson",
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      updatedAt: new Date().toISOString(),
      messages: [
        {
          _id: "msg_003",
          content: "The product I received doesn't match the description.",
          sender: "user",
          timestamp: new Date(Date.now() - 86400000).toISOString()
        }
      ]
    },
    {
      _id: "esc_003",
      sessionId: "session_003",
      businessId: businessId || "",
      customerDetails: {
        name: "Bob Wilson",
        email: "bob.wilson@example.com",
        phoneNumber: "+1122334455"
      },
      issue: "Account access issues",
      priority: "urgent",
      status: "resolved",
      assignedTo: "Agent Davis",
      createdAt: new Date(Date.now() - 172800000).toISOString(),
      updatedAt: new Date(Date.now() - 3600000).toISOString(),
      messages: [
        {
          _id: "msg_004",
          content: "I can't access my account and need immediate assistance.",
          sender: "user",
          timestamp: new Date(Date.now() - 172800000).toISOString()
        },
        {
          _id: "msg_005",
          content: "Your account has been restored. Please try logging in again.",
          sender: "agent",
          timestamp: new Date(Date.now() - 3600000).toISOString()
        }
      ]
    }
  ]

  // Fetch escalations for the business
  useEffect(() => {
    if (!businessId || !token) return

    const fetchEscalations = async () => {
      setLoading(true)
      try {
        // TODO: Replace with actual API call
        // const response = await axios.get(`${API_URL}/escalations/business/${businessId}`, {
        //   headers: { Authorization: `Bearer ${token}` }
        // })
        // setEscalations(response.data)
        
        // For now, use mock data
        setEscalations(mockEscalations)
      } catch (error) {
        console.error('Error fetching escalations:', error)
        setEscalations(mockEscalations) // Fallback to mock data
      } finally {
        setLoading(false)
      }
    }

    fetchEscalations()
  }, [businessId, token])

  const selectedEscalation = escalations.find(esc => esc._id === selectedEscalationId)

  const handleUpdateStatus = async (escalationId: string, newStatus: string) => {
    try {
      // TODO: Replace with actual API call
      // await axios.patch(`${API_URL}/escalations/${escalationId}`, 
      //   { status: newStatus },
      //   { headers: { Authorization: `Bearer ${token}` } }
      // )
      
      // Update local state
      setEscalations(prev => prev.map(esc => 
        esc._id === escalationId 
          ? { ...esc, status: newStatus as any, updatedAt: new Date().toISOString() }
          : esc
      ))
    } catch (error) {
      console.error('Error updating escalation status:', error)
    }
  }

  const handleAssignAgent = async (escalationId: string, agentName: string) => {
    try {
      // TODO: Replace with actual API call
      setEscalations(prev => prev.map(esc => 
        esc._id === escalationId 
          ? { ...esc, assignedTo: agentName, updatedAt: new Date().toISOString() }
          : esc
      ))
    } catch (error) {
      console.error('Error assigning agent:', error)
    }
  }
  return (
    <div className="h-full flex">
      <ResizablePanelGroup direction="horizontal" className="flex-1">
        <ResizablePanel defaultSize={35} minSize={25} maxSize={50}>
          <EscalationList
            escalations={escalations}
            selectedEscalationId={selectedEscalationId}
            onSelectEscalation={setSelectedEscalationId}
            loading={loading}
          />
        </ResizablePanel>
        
        <ResizableHandle className="w-1 bg-white/10 hover:bg-white/20 transition-colors" />
        
        <ResizablePanel defaultSize={65}>
          {selectedEscalation ? (
            <EscalationDetails
              escalation={selectedEscalation}
              onUpdateStatus={handleUpdateStatus}
              onAssignAgent={handleAssignAgent}
            />
          ) : (
            children
          )}
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}
