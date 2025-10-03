"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search, Filter, Download, Trash2 } from "lucide-react"
import { toast } from "@/hooks/useToast"
import { useAuth } from "@/lib/auth"
import api from "@/utils/api"
import { 
  AgentTable,
  AgentForm, 
  DeleteAgentDialog
} from "./components"

// Agent interface
interface Agent {
  _id: string;
  businessId: string;
  name: string;
  email: string;
  phone?: string;
  profilePic?: string;
  role: string;
  createdAt: string;
  deletedAt?: string | null;
}

interface CreateAgentData {
  name: string;
  email: string;
  phone?: string;
  profilePic?: string;
  role: string;
  password: string;
  businessId: string;
}

interface UpdateAgentData {
  name?: string;
  email?: string;
  phone?: string;
  profilePic?: string;
  role?: string;
}

export default function AgentManagementPage() {
  const { user, isLoading: authLoading } = useAuth()
  const [agents, setAgents] = React.useState<Agent[]>([])
  const [filteredAgents, setFilteredAgents] = React.useState<Agent[]>([])
  const [selectedIds, setSelectedIds] = React.useState<string[]>([])
  const [searchQuery, setSearchQuery] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState<"all" | "active" | "inactive">("all")
  const [roleFilter, setRoleFilter] = React.useState<"all" | "admin" | "supervisor" | "agent">("all")
  const [loading, setLoading] = React.useState(false)
  const [initialLoading, setInitialLoading] = React.useState(true)

  // Helper function for consistent error handling
  const getErrorMessage = (error: any, defaultMessage: string) => {
    if (error.code === 'NETWORK_ERROR' || !error.response) {
      return "Network error. Please check your connection and try again.";
    } else if (error.response?.status === 403) {
      return "You don't have permission to perform this action.";
    } else if (error.response?.status === 401) {
      return "Session expired. Please log in again.";
    } else if (error.response?.data?.error) {
      return error.response.data.error;
    }
    return defaultMessage;
  }
  
  // Dialog states
  const [showAgentForm, setShowAgentForm] = React.useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false)
  const [editingAgent, setEditingAgent] = React.useState<Agent | null>(null)
  const [deletingAgent, setDeletingAgent] = React.useState<Agent | null>(null)

  // Show loading while auth is being checked
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    )
  }


  // Load agents when component mounts or user changes
  React.useEffect(() => {
    if (user?.businessId) {
      loadAgents()
    }
  }, [user?.businessId])

  const loadAgents = async () => {
    try {
      setInitialLoading(true)
      // Load agents for the current user's business
      let response;
      if (user?.businessId) {
        // Get agents by business using query parameter
        response = await api.get('/agent', { params: { businessId: user.businessId } });
      } else {
        // Get all agents
        response = await api.get('/agent');
      }
      setAgents(response.data)
    } catch (error: any) {
      toast.error(getErrorMessage(error, "Failed to load agents"))
    } finally {
      setInitialLoading(false)
    }
  }

  // Filter agents based on search, status, and role
  React.useEffect(() => {
    let filtered = agents

    // Search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(agent =>
        agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        agent.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        agent.phone?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Status filter
    if (statusFilter === "active") {
      filtered = filtered.filter(agent => !agent.deletedAt)
    } else if (statusFilter === "inactive") {
      filtered = filtered.filter(agent => agent.deletedAt)
    }

    // Role filter
    if (roleFilter !== "all") {
      filtered = filtered.filter(agent => agent.role === roleFilter)
    }

    setFilteredAgents(filtered)
  }, [agents, searchQuery, statusFilter, roleFilter])

  // Calculate stats
  const stats = React.useMemo(() => {
    const activeAgents = agents.filter(agent => !agent.deletedAt)
    const inactiveAgents = agents.filter(agent => agent.deletedAt)
    const adminCount = agents.filter(agent => agent.role === "admin" && !agent.deletedAt)

    return {
      totalAgents: agents.length,
      activeAgents: activeAgents.length,
      inactiveAgents: inactiveAgents.length,
      adminCount: adminCount.length
    }
  }, [agents])

  // Selection handlers
  const handleSelectAll = (checked: boolean) => {
    setSelectedIds(checked ? filteredAgents.map(agent => agent._id) : [])
  }

  const handleSelectItem = (id: string, checked: boolean) => {
    setSelectedIds(prev =>
      checked
        ? [...prev, id]
        : prev.filter(selectedId => selectedId !== id)
    )
  }

  // CRUD operations
  const handleCreateAgent = async (data: any) => {
    if (!user?.businessId) {
      toast.error("Business ID not found. Please log in again.")
      return
    }

    setLoading(true)
    try {
      const createData: CreateAgentData = {
        name: data.name,
        email: data.email,
        password: data.password,
        businessId: user.businessId,
        // Set default values for optional fields
        phone: data.phone || "",
        role: data.role || "agent",
        profilePic: data.profilePic || ""
      }
      
      const response = await api.post('/agent', createData)
      setAgents(prev => [response.data, ...prev])
      toast.success("Agent created successfully")
      closeDialogs()
    } catch (error: any) {
      toast.error(getErrorMessage(error, "Failed to create agent"))
    } finally {
      setLoading(false)
    }
  }

  const handleEditAgent = async (data: any) => {
    if (!editingAgent) return

    setLoading(true)
    try {
      const updateData: UpdateAgentData = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        role: data.role,
        profilePic: data.profilePic
      }
      
      const response = await api.put(`/agent/${editingAgent._id}`, updateData)
      setAgents(prev =>
        prev.map(agent =>
          agent._id === editingAgent._id ? response.data : agent
        )
      )
      toast.success("Agent updated successfully")
      closeDialogs()
    } catch (error: any) {
      toast.error(getErrorMessage(error, "Failed to update agent"))
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteAgent = async () => {
    if (!deletingAgent) return

    setLoading(true)
    try {
      await api.delete(`/agent/${deletingAgent._id}`)
      // Soft delete - update the deletedAt field
      setAgents(prev =>
        prev.map(agent =>
          agent._id === deletingAgent._id
            ? { ...agent, deletedAt: new Date().toISOString() }
            : agent
        )
      )
      toast.success("Agent deleted successfully")
      closeDialogs()
    } catch (error: any) {
      toast.error(getErrorMessage(error, "Failed to delete agent"))
    } finally {
      setLoading(false)
    }
  }

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return

    setLoading(true)
    try {
      // Delete each selected agent
      await Promise.all(selectedIds.map(id => api.delete(`/agent/${id}`)))
      
      // Update local state
      setAgents(prev =>
        prev.map(agent =>
          selectedIds.includes(agent._id)
            ? { ...agent, deletedAt: new Date().toISOString() }
            : agent
        )
      )
      setSelectedIds([])
      toast.success(`${selectedIds.length} agent(s) deleted successfully`)
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to delete agents")
    } finally {
      setLoading(false)
    }
  }

  // Restore deleted agent
  const handleRestoreAgent = async (agentId: string) => {
    setLoading(true)
    try {
      const response = await api.patch(`/agent/${agentId}/restore`)
      // Update local state to remove deletedAt
      setAgents(prev =>
        prev.map(agent =>
          agent._id === agentId
            ? { ...agent, deletedAt: null }
            : agent
        )
      )
      toast.success("Agent restored successfully")
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to restore agent")
    } finally {
      setLoading(false)
    }
  }

  // Search agents
  const searchAgents = async (searchQuery: string) => {
    try {
      const params: any = { search: searchQuery }
      if (user?.businessId) {
        params.businessId = user.businessId
      }
      const response = await api.get('/agent/search', { params })
      return response.data
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to search agents")
      return []
    }
  }

  // Export agents to CSV
  const handleExportAgents = () => {
    try {
      // Prepare CSV data
      const csvHeaders = ['Name', 'Email', 'Phone', 'Role', 'Status', 'Created At']
      const csvData = filteredAgents.map(agent => [
        agent.name,
        agent.email,
        agent.phone || '',
        agent.role,
        agent.deletedAt ? 'Inactive' : 'Active',
        new Date(agent.createdAt).toLocaleDateString()
      ])

      // Create CSV content
      const csvContent = [
        csvHeaders.join(','),
        ...csvData.map(row => row.map(field => `"${field}"`).join(','))
      ].join('\n')

      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = `agents_export_${new Date().toISOString().split('T')[0]}.csv`
      link.click()
      
      toast.success("Agents exported successfully")
    } catch (error) {
      toast.error("Failed to export agents")
    }
  }

  // Get agent statistics
  const getAgentStats = async (agentId: string) => {
    try {
      const response = await api.get(`/agent/${agentId}/stats`)
      return response.data
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to get agent statistics")
      return null
    }
  }

  // Dialog handlers
  const openCreateDialog = () => {
    setEditingAgent(null)
    setShowAgentForm(true)
  }

  const openEditDialog = (agent: Agent) => {
    setEditingAgent(agent)
    setShowAgentForm(true)
  }

  const openDeleteDialog = (agent: Agent) => {
    setDeletingAgent(agent)
    setShowDeleteDialog(true)
  }

  const closeDialogs = () => {
    setShowAgentForm(false)
    setShowDeleteDialog(false)
    setEditingAgent(null)
    setDeletingAgent(null)
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header Section */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Agent management</h1>
        <p className="text-muted-foreground mt-1">Manage your team members and their permissions here.</p>
      </div>

      {/* Top Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold">All agents {stats.totalAgents}</h2>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-card pl-10 w-64 shadow-none"
            />
          </div>
          
          {/* Add Agent */}
          <Button onClick={openCreateDialog} size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            Add agent
          </Button>
        </div>
      </div>

      {/* Table */}
      <AgentTable
        agents={filteredAgents}
        onEdit={openEditDialog}
        onDelete={openDeleteDialog}
        loading={loading || initialLoading}
      />

      {/* Bottom Actions */}
      {selectedIds.length > 0 && (
        <div className="flex items-center justify-between bg-primary/10 border border-primary/20 rounded-lg p-4">
          <div className="text-sm text-primary">
            {selectedIds.length} agent{selectedIds.length > 1 ? 's' : ''} selected
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportAgents}
              disabled={loading}
              className="gap-2"
            >
              <Download className="h-4 w-4" />
              Export
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleBulkDelete}
              disabled={loading}
              className="gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>
      )}

      {/* Dialogs */}
      <AgentForm
        open={showAgentForm}
        onClose={closeDialogs}
        onSubmit={editingAgent ? handleEditAgent : handleCreateAgent}
        agent={editingAgent}
        loading={loading}
      />

      <DeleteAgentDialog
        open={showDeleteDialog}
        onClose={closeDialogs}
        onConfirm={handleDeleteAgent}
        agent={deletingAgent}
        loading={loading}
      />
    </div>
  )
}