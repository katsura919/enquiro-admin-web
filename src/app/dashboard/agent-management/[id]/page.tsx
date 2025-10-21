"use client"

import * as React from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { 
  ChevronLeft, 
  Edit, 
  Trash2, 
  XCircle
} from "lucide-react"
import { useAuth } from "@/lib/auth"
import { toast } from "@/hooks/useToast"
import api from "@/utils/api"

// Import components
import { AgentProfileCard } from "./components/AgentProfileCard"
import { AgentStatsCards } from "./components/AgentStatsCards"
import { AgentEscalationsTable } from "./components/AgentEscalationsTable"
import { AgentProfileSkeleton } from "./components/AgentProfileSkeleton"

interface Agent {
  _id: string
  businessId: string
  name: string
  email: string
  phone?: string
  profilePic?: string
  role: string
  createdAt: string
  deletedAt?: string | null
}

interface AgentStats {
  totalSessions: number
  activeSessions: number
  resolvedSessions: number
  averageResponseTime: number
  customerRating: number
  totalMessages: number
}

interface Escalation {
  _id: string
  caseNumber: string
  customerName: string
  customerEmail: string
  concern: string
  status: "escalated" | "pending" | "resolved"
  createdAt: string
}

interface CountData {
  totalCases: number
  totalResolvedCases: number
}

interface RatingStats {
  averageRating: number
  totalRatings: number
}

export default function AgentDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const agentId = params.id as string

  const [agent, setAgent] = React.useState<Agent | null>(null)
  const [stats, setStats] = React.useState<AgentStats | null>(null)
  const [escalations, setEscalations] = React.useState<Escalation[]>([])
  const [counts, setCounts] = React.useState<CountData | null>(null)
  const [ratingStats, setRatingStats] = React.useState<RatingStats | null>(null)
  const [escalationsLoading, setEscalationsLoading] = React.useState(false)
  const [escalationsPage, setEscalationsPage] = React.useState(1)
  const [escalationsTotalPages, setEscalationsTotalPages] = React.useState(1)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [isEditing, setIsEditing] = React.useState(false)
  const [editForm, setEditForm] = React.useState({
    name: '',
    email: '',
    phone: ''
  })

  React.useEffect(() => {
    if (agentId && user?.businessId) {
      loadAgentDetails()
      loadAgentRatings()
    }
  }, [agentId, user?.businessId])

  React.useEffect(() => {
    if (agentId) {
      loadAgentEscalations()
    }
  }, [agentId, escalationsPage])

  const loadAgentDetails = async () => {
    try {
      setLoading(true)
      setError(null)

      console.log('Fetching agent details for ID:', agentId)

      // Fetch agent details - need to find a specific route or use a different approach
      // Since /:businessId conflicts with /:id, we'll try the business route first
      let agentResponse;
      try {
        // Try to get the specific agent from the business agents list
        if (user?.businessId) {
          const businessAgentsResponse = await api.get(`/agent/${user.businessId}`, {
            params: { limit: 1000 } // Get all agents to find the specific one
          })
          const foundAgent = businessAgentsResponse.data.agents?.find((agent: Agent) => agent._id === agentId)
          if (foundAgent) {
            agentResponse = { data: foundAgent }
          } else {
            throw new Error('Agent not found in business')
          }
        } else {
          throw new Error('Business ID not available')
        }
      } catch (businessError) {
        // Fallback: try direct agent endpoint (might work if route order is fixed)
        console.log('Trying direct agent endpoint...')
        agentResponse = await api.get(`/agent/single/${agentId}`) // Using a different path
      }

      if (!agentResponse?.data) {
        throw new Error('Agent not found')
      }

      setAgent(agentResponse.data)
      // Initialize edit form with current data
      setEditForm({
        name: agentResponse.data.name || '',
        email: agentResponse.data.email || '',
        phone: agentResponse.data.phone || ''
      })
      console.log('Agent data loaded:', agentResponse.data)

      // Fetch agent statistics (if endpoint exists)
      try {
        const statsResponse = await api.get(`/agent/${agentId}/stats`)
        setStats(statsResponse.data)
        console.log('Agent stats loaded:', statsResponse.data)
      } catch (statsError) {
        console.log('Stats endpoint not available, using defaults')
        // If stats endpoint doesn't exist, set default stats
        setStats({
          totalSessions: 0,
          activeSessions: 0,
          resolvedSessions: 0,
          averageResponseTime: 0,
          customerRating: 0,
          totalMessages: 0
        })
      }
    } catch (err: any) {
      console.error('Failed to load agent details:', err)
      setError(err.response?.data?.error || err.message || "Failed to load agent details")
    } finally {
      setLoading(false)
    }
  }

  const loadAgentEscalations = async () => {
    try {
      setEscalationsLoading(true)
      console.log('Fetching escalations for agent ID:', agentId, 'page:', escalationsPage)
      
      const response = await api.get(`/escalation/agent/${agentId}`, {
        params: { 
          limit: 10, // Show 10 escalations per page
          page: escalationsPage,
          status: 'all' 
        }
      })
      
      setEscalations(response.data.escalations || [])
      setCounts(response.data.counts || null)
      setEscalationsTotalPages(response.data.totalPages || 1)
      console.log('Agent escalations loaded:', response.data.escalations)
      console.log('Agent counts loaded:', response.data.counts)
    } catch (err: any) {
      console.error('Failed to load agent escalations:', err)
      // Don't show error for escalations, just keep empty array
      setEscalations([])
    } finally {
      setEscalationsLoading(false)
    }
  }

  const handleEscalationsPageChange = (newPage: number) => {
    setEscalationsPage(newPage)
  }

  const loadAgentRatings = async () => {
    try {
      console.log('Fetching ratings for agent ID:', agentId)
      
      const response = await api.get(`/agent-rating/agent/${agentId}`, {
        params: { 
          limit: 1 // We only need the stats, not all ratings
        }
      })
      
      if (response.data.success && response.data.stats) {
        setRatingStats(response.data.stats)
        console.log('Agent ratings loaded:', response.data.stats)
      }
    } catch (err: any) {
      console.error('Failed to load agent ratings:', err)
      // Don't show error for ratings, just keep null
      setRatingStats(null)
    }
  }

  const handleEdit = () => {
    // Navigate back to main page with edit mode
    router.push(`/dashboard/agent-management?edit=${agentId}`)
  }

  const handleProfileEdit = () => {
    if (agent) {
      setEditForm({
        name: agent.name || '',
        email: agent.email || '',
        phone: agent.phone || ''
      })
      setIsEditing(true)
    }
  }

  const handleProfileSave = async () => {
    if (!agent) return

    try {
      const response = await api.put(`/agent/${agentId}`, editForm)
      setAgent(response.data)
      setIsEditing(false)
      toast.success("Profile updated successfully")
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to update profile")
    }
  }

  const handleProfileCancel = () => {
    if (agent) {
      setEditForm({
        name: agent.name || '',
        email: agent.email || '',
        phone: agent.phone || ''
      })
    }
    setIsEditing(false)
  }

  const handleFormChange = (field: string, value: string) => {
    setEditForm(prev => ({ ...prev, [field]: value }))
  }

  const handleDelete = async () => {
    if (!agent) return

    const confirmed = window.confirm(
      `Are you sure you want to delete ${agent.name || 'this agent'}? This action cannot be undone.`
    )
    
    if (!confirmed) return

    try {
      await api.delete(`/agent/${agentId}`)
      toast.success("Agent deleted successfully")
      router.push("/dashboard/agent-management")
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to delete agent")
    }
  }

  if (loading) {
    return <AgentProfileSkeleton />
  }

  if (error || !agent) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <XCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Agent Not Found</h3>
            <p className="text-muted-foreground mb-4">
              {error || "The agent you're looking for doesn't exist or may have been deleted."}
            </p>
            <Button onClick={() => router.push("/dashboard/agent-management")}>
              Back to Agent Management
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-6 space-y-4">
      {/* Compact Header with Back Button */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
          className="h-8 w-8 cursor-pointer"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Agent Profile</h1>
        </div>
      </div>

      {/* Two Column Layout - 1/3 and 2/3 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left Sidebar - Agent Profile Card (1/3 width) */}
        <div className="lg:col-span-1">
          <AgentProfileCard
            agent={agent}
            isEditing={isEditing}
            editForm={editForm}
            onEdit={handleProfileEdit}
            onSave={handleProfileSave}
            onCancel={handleProfileCancel}
            onFormChange={handleFormChange}
          />
        </div>

        {/* Right Column - Stats & Escalations (2/3 width) */}
        <div className="lg:col-span-2 space-y-4">
          {/* Performance Stats */}
          <AgentStatsCards stats={stats} counts={counts} ratingStats={ratingStats} />

          {/* Agent Escalations */}
          <AgentEscalationsTable 
            escalations={escalations}
            loading={escalationsLoading}
            currentPage={escalationsPage}
            totalPages={escalationsTotalPages}
            onPageChange={handleEscalationsPageChange}
          />
        </div>
      </div>
    </div>
  )
}