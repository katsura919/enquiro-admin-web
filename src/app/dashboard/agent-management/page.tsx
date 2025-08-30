"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search, Filter, Download, Trash2 } from "lucide-react"
import { 
  AgentTable, 
  AgentForm, 
  AgentStatsCards, 
  DeleteAgentDialog,
  type Agent 
} from "./components"

// Dummy data for development
const dummyAgents: Agent[] = [
  {
    _id: "1",
    businessId: "bus1",
    name: "John Smith",
    email: "john.smith@company.com",
    phone: "+1 (555) 123-4567",
    profilePic: "",
    role: "admin",
    createdAt: "2024-01-15T08:30:00Z",
    deletedAt: null
  },
  {
    _id: "2",
    businessId: "bus1",
    name: "Sarah Johnson",
    email: "sarah.johnson@company.com",
    phone: "+1 (555) 234-5678",
    profilePic: "",
    role: "supervisor",
    createdAt: "2024-02-10T14:20:00Z",
    deletedAt: null
  },
  {
    _id: "3",
    businessId: "bus1",
    name: "Mike Chen",
    email: "mike.chen@company.com",
    phone: "+1 (555) 345-6789",
    profilePic: "",
    role: "agent",
    createdAt: "2024-03-05T10:15:00Z",
    deletedAt: null
  },
  {
    _id: "4",
    businessId: "bus1",
    name: "Emily Davis",
    email: "emily.davis@company.com",
    phone: "+1 (555) 456-7890",
    profilePic: "",
    role: "agent",
    createdAt: "2024-03-20T16:45:00Z",
    deletedAt: null
  },
  {
    _id: "5",
    businessId: "bus1",
    name: "David Wilson",
    email: "david.wilson@company.com",
    phone: "",
    profilePic: "",
    role: "agent",
    createdAt: "2024-04-01T09:30:00Z",
    deletedAt: "2024-04-15T12:00:00Z" // Soft deleted
  }
]

export default function AgentManagementPage() {
  const [agents, setAgents] = React.useState<Agent[]>(dummyAgents)
  const [filteredAgents, setFilteredAgents] = React.useState<Agent[]>(dummyAgents)
  const [selectedIds, setSelectedIds] = React.useState<string[]>([])
  const [searchQuery, setSearchQuery] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState<"all" | "active" | "inactive">("all")
  const [roleFilter, setRoleFilter] = React.useState<"all" | "admin" | "supervisor" | "agent">("all")
  const [loading, setLoading] = React.useState(false)
  
  // Dialog states
  const [showAgentForm, setShowAgentForm] = React.useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false)
  const [editingAgent, setEditingAgent] = React.useState<Agent | null>(null)
  const [deletingAgent, setDeletingAgent] = React.useState<Agent | null>(null)

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
    setLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const newAgent: Agent = {
        _id: Date.now().toString(),
        businessId: "bus1",
        name: data.name,
        email: data.email,
        phone: data.phone,
        profilePic: data.profilePic,
        role: data.role,
        createdAt: new Date().toISOString(),
        deletedAt: null
      }

      setAgents(prev => [newAgent, ...prev])
      console.log('Created agent:', newAgent)
    } catch (error) {
      console.error('Error creating agent:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEditAgent = async (data: any) => {
    if (!editingAgent) return

    setLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      const updatedAgent: Agent = {
        ...editingAgent,
        name: data.name,
        email: data.email,
        phone: data.phone,
        profilePic: data.profilePic,
        role: data.role
      }

      setAgents(prev =>
        prev.map(agent =>
          agent._id === editingAgent._id ? updatedAgent : agent
        )
      )
      console.log('Updated agent:', updatedAgent)
    } catch (error) {
      console.error('Error updating agent:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteAgent = async () => {
    if (!deletingAgent) return

    setLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Soft delete
      setAgents(prev =>
        prev.map(agent =>
          agent._id === deletingAgent._id
            ? { ...agent, deletedAt: new Date().toISOString() }
            : agent
        )
      )
      console.log('Deleted agent:', deletingAgent._id)
    } catch (error) {
      console.error('Error deleting agent:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return

    setLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      setAgents(prev =>
        prev.map(agent =>
          selectedIds.includes(agent._id)
            ? { ...agent, deletedAt: new Date().toISOString() }
            : agent
        )
      )
      setSelectedIds([])
      console.log('Bulk deleted agents:', selectedIds)
    } catch (error) {
      console.error('Error bulk deleting agents:', error)
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
        loading={loading}
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