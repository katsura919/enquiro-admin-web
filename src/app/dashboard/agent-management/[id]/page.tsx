"use client"

import * as React from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Mail, 
  Phone, 
  Calendar, 
  User, 
  MessageSquare, 
  Clock,
  CheckCircle,
  XCircle,
  TrendingUp,
  Users,
  Star,
  MapPin
} from "lucide-react"
import { formatDistanceToNow, format } from "date-fns"
import { useAuth } from "@/lib/auth"
import { toast } from "@/hooks/useToast"
import api from "@/utils/api"

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

export default function AgentDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const agentId = params.id as string

  const [agent, setAgent] = React.useState<Agent | null>(null)
  console.log("Agent:", agent)
  const [stats, setStats] = React.useState<AgentStats | null>(null)
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
    }
  }, [agentId, user?.businessId])

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

  const getInitials = (name: string) => {
    if (!name || typeof name !== 'string') {
      return 'NA'
    }
    return name
      .trim()
      .split(" ")
      .filter(word => word.length > 0)
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || 'NA'
  }

  const getStatusColor = (agent: Agent) => {
    if (agent.deletedAt) {
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
    }
    return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
  }

  const getStatusText = (agent: Agent) => {
    return agent.deletedAt ? "Inactive" : "Active"
  }

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading agent details...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !agent) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
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
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-semibold">Agent Details</h1>
            <p className="text-muted-foreground">View and manage agent information</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleEdit}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Agent Profile Card */}
        <div className="lg:col-span-4">
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              {/* Profile Header */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 px-6 py-8">
                <div className="flex flex-col items-center text-center">
                  <Avatar className="h-32 w-32 border-4 border-white shadow-lg">
                    <AvatarImage src={agent.profilePic} alt={agent.name || 'Agent'} />
                    <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                      {getInitials(agent.name || '')}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="mt-4">
                    {isEditing ? (
                      <Input
                        value={editForm.name}
                        onChange={(e) => handleFormChange('name', e.target.value)}
                        className="text-center text-lg font-semibold bg-white dark:bg-gray-800"
                        placeholder="Agent name"
                      />
                    ) : (
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                        {agent.name || 'Unknown Agent'}
                      </h2>
                    )}
                    <p className="text-sm text-gray-600 dark:text-gray-300 capitalize mt-1">
                      {agent.role || 'Product Designer'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="px-6 py-4">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wide mb-3">
                  Contact Information
                </h3>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <div className="flex-1">
                      <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Phone:</p>
                      {isEditing ? (
                        <Input
                          type="tel"
                          value={editForm.phone}
                          onChange={(e) => handleFormChange('phone', e.target.value)}
                          className="text-sm mt-1"
                          placeholder="+1 555 666 7890"
                        />
                      ) : (
                        <p className="text-sm text-gray-900 dark:text-white">
                          {agent.phone || '+1 555 666 7890'}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <div className="flex-1">
                      <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Address:</p>
                      <p className="text-sm text-gray-900 dark:text-white">
                        525 E 68th Street<br />
                        New York, NY 10021-5-308-69
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <div className="flex-1">
                      <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">E-mail:</p>
                      {isEditing ? (
                        <Input
                          type="email"
                          value={editForm.email}
                          onChange={(e) => handleFormChange('email', e.target.value)}
                          className="text-sm mt-1"
                          placeholder="hello@jeremyrose.com"
                        />
                      ) : (
                        <p className="text-sm text-blue-600 hover:text-blue-700 cursor-pointer">
                          {agent.email || 'hello@jeremyrose.com'}
                        </p>
                      )}
                    </div>
                  </div>
                </div>


                
                {/* Edit Profile Button */}
                {!isEditing && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleProfileEdit}
                    className="w-full mt-4"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
          
          {/* Edit Profile Buttons - Below Card */}
          {isEditing && (
            <div className="flex gap-2 mt-4">
              <Button size="sm" onClick={handleProfileSave} className="flex-1">
                Save Changes
              </Button>
              <Button size="sm" variant="outline" onClick={handleProfileCancel} className="flex-1">
                Cancel
              </Button>
            </div>
          )}
        </div>

        {/* Right Column - Performance & Details */}
        <div className="lg:col-span-8 space-y-6">
          {/* Performance Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-xl">
                    <MessageSquare className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats?.totalSessions || 42}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Sessions</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-100 dark:bg-green-900 rounded-xl">
                    <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats?.resolvedSessions || 38}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Resolved Cases</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-xl">
                    <Star className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {stats?.customerRating ? stats.customerRating.toFixed(1) : '8.6'}
                      </p>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-4 w-4 ${
                              star <= Math.floor(stats?.customerRating || 4.3)
                                ? 'text-yellow-400 fill-yellow-400'
                                : 'text-gray-300 dark:text-gray-600'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Customer Rating</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Performance Overview */}
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Performance Overview
                </CardTitle>
                <Badge variant="outline" className="text-green-600 bg-green-50 dark:bg-green-900/20">
                  Excellent Performance
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span className="text-sm font-medium">Active Sessions</span>
                    </div>
                    <span className="text-sm font-bold text-blue-600">{stats?.activeSessions || 4}</span>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm font-medium">Resolution Rate</span>
                    </div>
                    <span className="text-sm font-bold text-green-600">
                      {stats?.totalSessions 
                        ? `${Math.round((stats.resolvedSessions / stats.totalSessions) * 100)}%`
                        : '90%'
                      }
                    </span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                      <span className="text-sm font-medium">Total Messages</span>
                    </div>
                    <span className="text-sm font-bold text-purple-600">{stats?.totalMessages || 1247}</span>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <span className="text-sm font-medium">Customer Rating</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-yellow-600">
                        {stats?.customerRating ? `${stats.customerRating.toFixed(1)}` : '8.6'}
                      </span>
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-3 w-3 ${
                              star <= Math.floor(stats?.customerRating || 4.3)
                                ? 'text-yellow-400 fill-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span className="text-sm font-medium">Last Activity</span>
                    </div>
                    <span className="text-sm font-bold text-red-600">
                      {agent.createdAt ? formatDistanceToNow(new Date(agent.createdAt), { addSuffix: true }) : '2 hours ago'}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-teal-500 rounded-full"></div>
                      <span className="text-sm font-medium">Agent ID</span>
                    </div>
                    <span className="text-sm font-mono text-teal-600">#{agent._id.slice(-6)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Agent Escalations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Recent Escalations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-card border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Case #</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Concern</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {/* Dummy escalation data */}
                    <TableRow className="cursor-pointer hover:bg-muted/50">
                      <TableCell className="font-mono text-sm font-medium">
                        ESC-2024-001
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">John Doe</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-[300px] truncate">
                          <span className="font-medium">Product delivery issue - missing items</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 border-red-200 dark:border-red-800">
                          Escalated
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">Oct 5, 2025</span>
                        </div>
                      </TableCell>
                    </TableRow>
                    <TableRow className="cursor-pointer hover:bg-muted/50">
                      <TableCell className="font-mono text-sm font-medium">
                        ESC-2024-002
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">Sarah Wilson</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-[300px] truncate">
                          <span className="font-medium">Billing discrepancy - overcharged amount</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 border-yellow-200 dark:border-yellow-800">
                          Pending
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">Oct 4, 2025</span>
                        </div>
                      </TableCell>
                    </TableRow>
                    <TableRow className="cursor-pointer hover:bg-muted/50">
                      <TableCell className="font-mono text-sm font-medium">
                        ESC-2024-003
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">Mike Johnson</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-[300px] truncate">
                          <span className="font-medium">Service complaint - poor customer support</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 border-green-200 dark:border-green-800">
                          Resolved
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">Oct 3, 2025</span>
                        </div>
                      </TableCell>
                    </TableRow>
                    <TableRow className="cursor-pointer hover:bg-muted/50">
                      <TableCell className="font-mono text-sm font-medium">
                        ESC-2024-004
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">Emily Davis</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-[300px] truncate">
                          <span className="font-medium">Technical issue - website login problems</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 border-yellow-200 dark:border-yellow-800">
                          Pending
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">Oct 2, 2025</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
              
              {/* View All Button */}
              <div className="flex justify-center mt-4">
                <Button variant="outline" onClick={() => router.push('/dashboard/escalations')}>
                  View All Escalations
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}