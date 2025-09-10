"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search, Filter, Download, Trash2 } from "lucide-react"
import { toast } from "@/hooks/useToast"
import { useAuth } from "@/lib/auth"
import { agentService, type Agent, type CreateAgentData, type UpdateAgentData } from "@/services/agentService"
import { 
  AgentTable, 
  AgentForm, 
  AgentStatsCards, 
  DeleteAgentDialog
} from "./components"

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

  // Redirect if not authenticated (this should be handled by layout, but just in case)
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-500">Please log in to access this page.</p>
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
      const data = user?.businessId 
        ? await agentService.getAgentsByBusiness(user.businessId)
        : await agentService.getAgents()
      setAgents(data)
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to load agents")
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
        phone: "",
        role: "agent",
        profilePic: ""
      }
      
      const newAgent = await agentService.createAgent(createData)
      setAgents(prev => [newAgent, ...prev])
      toast.success("Agent created successfully")
      closeDialogs()
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to create agent")
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
      
      const updatedAgent = await agentService.updateAgent(editingAgent._id, updateData)
      setAgents(prev =>
        prev.map(agent =>
          agent._id === editingAgent._id ? updatedAgent : agent
        )
      )
      toast.success("Agent updated successfully")
      closeDialogs()
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to update agent")
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteAgent = async () => {
    if (!deletingAgent) return

    setLoading(true)
    try {
      await agentService.deleteAgent(deletingAgent._id)
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
      toast.error(error.response?.data?.error || "Failed to delete agent")
    } finally {
      setLoading(false)
    }
  }

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return

    setLoading(true)
    try {
      // Delete each selected agent
      await Promise.all(selectedIds.map(id => agentService.deleteAgent(id)))
      
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
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Agent Management</h1>
          <p className="text-muted-foreground">
            Manage your team members and their permissions
          </p>
        </div>
        <Button onClick={openCreateDialog} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Agent
        </Button>
      </div>

      {/* Stats Cards */}
      <AgentStatsCards
        totalAgents={stats.totalAgents}
        activeAgents={stats.activeAgents}
        inactiveAgents={stats.inactiveAgents}
        adminCount={stats.adminCount}
        loading={loading}
      />

      {/* Filters and Actions */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search agents by name, email, or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Filters */}
        <div className="flex gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3 py-2 border border-input bg-background rounded-md text-sm"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value as any)}
            className="px-3 py-2 border border-input bg-background rounded-md text-sm"
          >
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="supervisor">Supervisor</option>
            <option value="agent">Agent</option>
          </select>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          {selectedIds.length > 0 && (
            <Button
              variant="destructive"
              size="sm"
              onClick={handleBulkDelete}
              disabled={loading}
              className="gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Delete ({selectedIds.length})
            </Button>
          )}
          
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Table */}
      <AgentTable
        agents={filteredAgents}
        selectedIds={selectedIds}
        onSelectAll={handleSelectAll}
        onSelectItem={handleSelectItem}
        onEdit={openEditDialog}
        onDelete={openDeleteDialog}
        loading={loading || initialLoading}
      />

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