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
  console.log(escalations)
  // Fetch escalations for the business
  useEffect(() => {
    if (!businessId || !token) return

    const fetchEscalations = async () => {
      setLoading(true)
      try {
        const response = await axios.get(`${API_URL}/escalation/business/${businessId}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        
        // Transform the data to match the frontend interface
        const transformedEscalations = response.data.map((escalation: any) => ({
          _id: escalation._id,
          sessionId: escalation.sessionId,
          businessId: escalation.businessId,
          caseNumber: escalation.caseNumber,
          customerDetails: {
            name: escalation.customerName,
            email: escalation.customerEmail,
            phoneNumber: escalation.customerPhone || ''
          },
          concern: escalation.concern,
          description: escalation.description,
          status: escalation.status, // Default status since backend doesn't have status field
          assignedTo: undefined, // Backend doesn't have this field
          createdAt: escalation.createdAt,
          updatedAt: escalation.updatedAt
        }))
        
        setEscalations(transformedEscalations)
      } catch (error) {
        console.error('Error fetching escalations:', error)
        setEscalations([]) // Set empty array on error
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
      ))    } catch (error) {
      console.error('Error updating escalation status:', error)
    }
  }
  
  return (
    <div className="h-full flex bg-background">
      <ResizablePanelGroup direction="horizontal" className="flex-1">
        <ResizablePanel defaultSize={30} minSize={25} maxSize={45}>
          <EscalationList
            escalations={escalations}
            selectedEscalationId={selectedEscalationId}
            onSelectEscalation={setSelectedEscalationId}
            loading={loading}
          />
        </ResizablePanel>
        
        <ResizableHandle className="w-1 bg-border hover:bg-primary/20 transition-colors" />
        
        <ResizablePanel defaultSize={70}>          {selectedEscalation ? (
            <EscalationDetails
              escalation={selectedEscalation}
              onUpdateStatus={handleUpdateStatus}
            />
          ) : (
            <div className="h-full flex flex-col items-center justify-center bg-background text-center p-8">
              <div className="mx-auto w-32 h-32 bg-muted/20 rounded-full flex items-center justify-center mb-6">
                <svg
                  className="w-16 h-16 text-muted-foreground/50"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-foreground mb-2">
                Select an Escalation
              </h2>
              <p className="text-muted-foreground max-w-md">
                Choose an escalation from the list to view its details, conversation history, and manage its status.
              </p>
            </div>
          )}
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}
