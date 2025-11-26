"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Search, Filter, Download, Trash2 } from "lucide-react";
import { toast } from "@/hooks/useToast";
import { useAuth } from "@/lib/auth";
import api from "@/utils/api";
import { AgentTable, CreateAgentDialog, AgentStatsCards } from "./components";

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
  const { user, isLoading: authLoading } = useAuth();
  const [agents, setAgents] = React.useState<Agent[]>([]);
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<
    "all" | "active" | "inactive"
  >("active");
  const [roleFilter, setRoleFilter] = React.useState<
    "all" | "admin" | "supervisor" | "agent"
  >("all");
  const [loading, setLoading] = React.useState(false);
  const [initialLoading, setInitialLoading] = React.useState(true);
  // Pagination state
  const [currentPage, setCurrentPage] = React.useState(1);
  const [itemsPerPage, setItemsPerPage] = React.useState(10);
  const [totalPages, setTotalPages] = React.useState(0);
  const [totalItems, setTotalItems] = React.useState(0);

  const [agentStats, setAgentStats] = React.useState({
    totalAgents: 0,
    activeAgents: 0,
    inactiveAgents: 0,
  });

  // Helper function for consistent error handling
  const getErrorMessage = (error: any, defaultMessage: string) => {
    if (error.code === "NETWORK_ERROR" || !error.response) {
      return "Network error. Please check your connection and try again.";
    } else if (error.response?.status === 403) {
      return "You don't have permission to perform this action.";
    } else if (error.response?.status === 401) {
      return "Session expired. Please log in again.";
    } else if (error.response?.data?.error) {
      return error.response.data.error;
    }
    return defaultMessage;
  };

  // Dialog states
  const [showCreateDialog, setShowCreateDialog] = React.useState(false);

  // Show loading while auth is being checked
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  // Load agents when component mounts or user changes
  React.useEffect(() => {
    if (user?.businessId) {
      loadAgents(1); // Load first page
    }
  }, [user?.businessId]);

  // Trigger search when searchQuery changes (with debounce)
  React.useEffect(() => {
    // Skip if this is the initial load (no search query and items per page is default)
    if (!searchQuery && itemsPerPage === 11) {
      return;
    }

    const timeoutId = setTimeout(() => {
      if (user?.businessId) {
        loadAgents(1, itemsPerPage, searchQuery); // Reset to page 1 when searching
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(timeoutId);
  }, [searchQuery, itemsPerPage]);

  // Reload when status filter changes
  React.useEffect(() => {
    if (user?.businessId) {
      loadAgents(1);
    }
  }, [statusFilter]);

  const loadAgents = async (
    page: number = currentPage,
    limit: number = itemsPerPage,
    search: string = searchQuery
  ) => {
    try {
      setInitialLoading(page === 1 && !search);
      setLoading(page !== 1 || !!search);

      if (!user?.businessId) {
        toast.error("Business ID not found. Please log in again.");
        return;
      }

      // Use the new paginated endpoint
      const params = {
        page: page.toString(),
        limit: limit.toString(),
        status: statusFilter,
        ...(search.trim() && { search: search.trim() }),
      };

      const response = await api.get(`/agent/business/${user.businessId}`, {
        params,
      });

      // Update states with paginated response
      setAgents(response.data.agents);
      setCurrentPage(response.data.pagination.currentPage);
      setTotalPages(response.data.pagination.totalPages);
      setTotalItems(response.data.pagination.totalItems);

      if (response.data.stats) {
        setAgentStats(response.data.stats);
      }
    } catch (error: any) {
      toast.error(getErrorMessage(error, "Failed to load agents"));
    } finally {
      setInitialLoading(false);
      setLoading(false);
    }
  };

  // Selection handlers
  const handleSelectAll = (checked: boolean) => {
    setSelectedIds(checked ? agents.map((agent: Agent) => agent._id) : []);
  };

  const handleSelectItem = (id: string, checked: boolean) => {
    setSelectedIds((prev) =>
      checked ? [...prev, id] : prev.filter((selectedId) => selectedId !== id)
    );
  };

  // CRUD operations
  const handleCreateAgent = async (data: any) => {
    if (!user?.businessId) {
      toast.error("Business ID not found. Please log in again.");
      return;
    }

    setLoading(true);
    try {
      const createData: CreateAgentData = {
        name: data.name,
        email: data.email,
        password: data.password,
        businessId: user.businessId,
        // Set default values for optional fields
        phone: data.phone || "",
        role: data.role || "agent",
        profilePic: data.profilePic || "",
      };

      const response = await api.post("/agent", createData);
      toast.success("Agent created successfully");
      // Close dialog on success
      setTimeout(() => {
        closeDialogs();
      }, 100);
    } catch (error: any) {
      // Check if it's a duplicate email error (409 status)
      if (
        error.response?.status === 409 &&
        error.response?.data?.error?.includes("Email address is already taken")
      ) {
        // Don't show toast for email validation errors - let the form handle it
        throw error; // Re-throw to let CreateAgentDialog handle it
      } else {
        toast.error(getErrorMessage(error, "Failed to create agent"));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEditAgent = async (data: any) => {
    // This function is no longer used - edit is handled on the details page
    return;
  };

  const handleDeleteAgent = async () => {
    // This function is no longer used - delete is handled on the details page
    return;
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;

    setLoading(true);
    try {
      // Delete each selected agent
      await Promise.all(selectedIds.map((id) => api.delete(`/agent/${id}`)));

      setSelectedIds([]);
      toast.success(`${selectedIds.length} agent(s) deleted successfully`);
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to delete agents");
    } finally {
      setLoading(false);
    }
  };

  // Restore deleted agent
  const handleRestoreAgent = async (agentId: string) => {
    setLoading(true);
    try {
      const response = await api.patch(`/agent/${agentId}/restore`);
      toast.success("Agent restored successfully");
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to restore agent");
    } finally {
      setLoading(false);
    }
  };

  // Search agents
  const searchAgents = async (searchQuery: string) => {
    try {
      const params: any = { search: searchQuery };
      if (user?.businessId) {
        params.businessId = user.businessId;
      }
      const response = await api.get("/agent/search", { params });
      return response.data;
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to search agents");
      return [];
    }
  };

  // Export agents to CSV (current page only for now)
  const handleExportAgents = () => {
    try {
      // Prepare CSV data
      const csvHeaders = [
        "Name",
        "Email",
        "Phone",
        "Role",
        "Status",
        "Created At",
      ];
      const csvData = agents.map((agent: Agent) => [
        agent.name,
        agent.email,
        agent.phone || "",
        agent.role,
        agent.deletedAt ? "Inactive" : "Active",
        new Date(agent.createdAt).toLocaleDateString(),
      ]);

      // Create CSV content
      const csvContent = [
        csvHeaders.join(","),
        ...csvData.map((row: any[]) =>
          row.map((field: any) => `"${field}"`).join(",")
        ),
      ].join("\n");

      // Create and download file
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `agents_export_${
        new Date().toISOString().split("T")[0]
      }.csv`;
      link.click();

      toast.success("Agents exported successfully");
    } catch (error) {
      toast.error("Failed to export agents");
    }
  };

  // Get agent statistics
  const getAgentStats = async (agentId: string) => {
    try {
      const response = await api.get(`/agent/${agentId}/stats`);
      return response.data;
    } catch (error: any) {
      toast.error(
        error.response?.data?.error || "Failed to get agent statistics"
      );
      return null;
    }
  };

  // Dialog handlers
  const openCreateDialog = () => {
    setShowCreateDialog(true);
  };

  const closeDialogs = () => {
    setShowCreateDialog(false);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Top Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold">Agent Management</h1>
          <p className="text-sm text-muted-foreground">
            Create and manage your support team. Agents can log in at{" "}
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
          {/* Add Agent */}
          <Button
            onClick={openCreateDialog}
            size="sm"
            className="gap-2 cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            Add agent
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <AgentStatsCards
        totalAgents={agentStats.totalAgents}
        activeAgents={agentStats.activeAgents}
        inactiveAgents={agentStats.inactiveAgents}
        loading={initialLoading}
      />

      {/* Table Header with Search and Filter */}
      <div className="flex items-center justify-between gap-3">
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
        </div>

        {/* Status Filter */}
        <Select
          value={statusFilter}
          onValueChange={(value: "all" | "active" | "inactive") =>
            setStatusFilter(value)
          }
        >
          <SelectTrigger className="w-[130px] bg-card shadow-none">
            <div className="flex items-center gap-2">
              <Filter className="h-3.5 w-3.5 text-muted-foreground" />
              <SelectValue placeholder="Status" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="all">All Agents</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <AgentTable
        agents={agents}
        loading={loading || initialLoading}
        pagination={{
          currentPage,
          totalPages,
          totalItems,
          itemsPerPage,
          onPageChange: (page: number) => loadAgents(page),
        }}
      />

      {/* Bottom Actions */}
      {selectedIds.length > 0 && (
        <div className="flex items-center justify-between bg-primary/10 border border-primary/20 rounded-lg p-4">
          <div className="text-sm text-primary">
            {selectedIds.length} agent{selectedIds.length > 1 ? "s" : ""}{" "}
            selected
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
      <CreateAgentDialog
        open={showCreateDialog}
        onClose={closeDialogs}
        onSubmit={handleCreateAgent}
        loading={loading}
      />
    </div>
  );
}
