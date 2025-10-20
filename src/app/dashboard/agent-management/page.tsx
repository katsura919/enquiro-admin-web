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
  const [selectedIds, setSelectedIds] = React.useState<string[]>([])
  const [searchQuery, setSearchQuery] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState<"all" | "active" | "inactive">("all")
  const [roleFilter, setRoleFilter] = React.useState<"all" | "admin" | "supervisor" | "agent">("all")
  const [loading, setLoading] = React.useState(false)
  const [initialLoading, setInitialLoading] = React.useState(true)
  // Pagination state
  const [currentPage, setCurrentPage] = React.useState(1)
  const [itemsPerPage, setItemsPerPage] = React.useState(10)
  const [totalPages, setTotalPages] = React.useState(0)
  const [totalItems, setTotalItems] = React.useState(0)
  const [totalAgentsInBusiness, setTotalAgentsInBusiness] = React.useState(0)

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
      loadAgents(1) // Load first page
    }
  }, [user?.businessId])

  // Trigger search when searchQuery changes (with debounce)
  React.useEffect(() => {
    // Skip if this is the initial load (no search query and items per page is default)
    if (!searchQuery && itemsPerPage === 11) {
      return;
    }

    const timeoutId = setTimeout(() => {
      if (user?.businessId) {
        loadAgents(1, itemsPerPage, searchQuery) // Reset to page 1 when searching
      }
    }, 500) // 500ms debounce

    return () => clearTimeout(timeoutId)
  }, [searchQuery, itemsPerPage])

  const loadAgents = async (page: number = currentPage, limit: number = itemsPerPage, search: string = searchQuery) => {
    try {
      setInitialLoading(page === 1 && !search)
      setLoading(page !== 1 || !!search)
      
      if (!user?.businessId) {
        toast.error("Business ID not found. Please log in again.")
        return
      }

      // Use the new paginated endpoint
      const params = {
        page: page.toString(),
        limit: limit.toString(),
        ...(search.trim() && { search: search.trim() })
      }
      
      const response = await api.get(`/agent/${user.businessId}`, { params })
      
      // Update states with paginated response
      setAgents(response.data.agents)
      setCurrentPage(response.data.pagination.currentPage)
      setTotalPages(response.data.pagination.totalPages)
      setTotalItems(response.data.pagination.totalItems)
      setTotalAgentsInBusiness(response.data.totalAgentsInBusiness)
    } catch (error: any) {
      toast.error(getErrorMessage(error, "Failed to load agents"))
    } finally {
      setInitialLoading(false)
      setLoading(false)
    }
  }

  // Calculate stats - now using total from backend
  const stats = React.useMemo(() => {
    const activeAgents = agents.filter(agent => !agent.deletedAt)
    const inactiveAgents = agents.filter(agent => agent.deletedAt)
    const adminCount = agents.filter(agent => agent.role === "admin" && !agent.deletedAt)

    return {
      totalAgents: totalAgentsInBusiness, // Use total from backend
      activeAgents: activeAgents.length,
      inactiveAgents: inactiveAgents.length,
      adminCount: adminCount.length,
      currentPageItems: agents.length
    }
  }, [agents, totalAgentsInBusiness])

  // Selection handlers
  const handleSelectAll = (checked: boolean) => {
    setSelectedIds(checked ? agents.map((agent: Agent) => agent._id) : [])
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
    } catch (error: any) {
      toast.error(getErrorMessage(error, "Failed to create agent"))
    } finally {
      setLoading(false)
      // Close dialog after a small delay to ensure proper cleanup
      setTimeout(() => {
        closeDialogs()
      }, 100)
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
    } catch (error: any) {
      toast.error(getErrorMessage(error, "Failed to update agent"))
    } finally {
      setLoading(false)
      // Close dialog after a small delay to ensure proper cleanup
      setTimeout(() => {
        closeDialogs()
      }, 100)
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
    } catch (error: any) {
      toast.error(getErrorMessage(error, "Failed to delete agent"))
    } finally {
      setLoading(false)
      // Close dialog after a small delay to ensure proper cleanup
      setTimeout(() => {
        closeDialogs()
      }, 100)
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

  // Export agents to CSV (current page only for now)
  const handleExportAgents = () => {
    try {
      // Prepare CSV data
      const csvHeaders = ['Name', 'Email', 'Phone', 'Role', 'Status', 'Created At']
      const csvData = agents.map((agent: Agent) => [
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
        ...csvData.map((row: any[]) => row.map((field: any) => `"${field}"`).join(','))
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

      {/* Top Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold">
          Agent Management
        </h1>
        <p className="text-sm text-muted-foreground">
          Create and manage your support team. Agents can log in at{' '}
          <a 
            href="https://agent-enquiro.vercel.app" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-muted-foreground hover:underline font-medium underline"
          >
            agent-enquiro.vercel.app
          </a>
          .
        </p>
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
          <Button onClick={openCreateDialog} size="sm" className="gap-2 cursor-pointer">
            <Plus className="h-4 w-4" />
            Add agent
          </Button>
        </div>
      </div>

      {/* Table */}
      <AgentTable
        agents={agents}
        onEdit={openEditDialog}
        onDelete={openDeleteDialog}
        loading={loading || initialLoading}
        pagination={{
          currentPage,
          totalPages,
          totalItems,
          itemsPerPage,
          onPageChange: (page: number) => loadAgents(page)
        }}
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
      {showAgentForm && (
        <AgentForm
          key={editingAgent?._id || 'new'}
          open={showAgentForm}
          onClose={closeDialogs}
          onSubmit={editingAgent ? handleEditAgent : handleCreateAgent}
          agent={editingAgent}
          loading={loading}
        />
      )}

      {showDeleteDialog && (
        <DeleteAgentDialog
          key={deletingAgent?._id}
          open={showDeleteDialog}
          onClose={closeDialogs}
          onConfirm={handleDeleteAgent}
          agent={deletingAgent}
          loading={loading}
        />
      )}
    </div>
  )
}