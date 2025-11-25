"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Edit, Trash2, XCircle } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { toast } from "@/hooks/useToast";
import api from "@/utils/api";

// Import components
import { AgentProfileCard } from "./components/AgentProfileCard";
import { AgentStatsCards } from "./components/AgentStatsCards";
import { AgentEscalationsTable } from "./components/AgentEscalationsTable";
import { AgentProfileSkeleton } from "./components/AgentProfileSkeleton";
import { EditAgentDialog } from "../components/EditAgentDialog";
import { DeleteAgentDialog } from "../components/DeleteAgentDialog";

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

interface AgentStats {
  totalSessions: number;
  activeSessions: number;
  resolvedSessions: number;
  averageResponseTime: number;
  customerRating: number;
  totalMessages: number;
}

interface Escalation {
  _id: string;
  caseNumber: string;
  customerName: string;
  customerEmail: string;
  concern: string;
  status: "escalated" | "pending" | "resolved";
  createdAt: string;
}

interface CountData {
  totalCases: number;
  totalResolvedCases: number;
}

interface RatingStats {
  averageRating: number;
  totalRatings: number;
}

export default function AgentDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const agentId = params.id as string;

  const [agent, setAgent] = React.useState<Agent | null>(null);
  const [stats, setStats] = React.useState<AgentStats | null>(null);
  const [escalations, setEscalations] = React.useState<Escalation[]>([]);
  const [counts, setCounts] = React.useState<CountData | null>(null);
  const [ratingStats, setRatingStats] = React.useState<RatingStats | null>(
    null
  );
  const [escalationsLoading, setEscalationsLoading] = React.useState(false);
  const [escalationsPage, setEscalationsPage] = React.useState(1);
  const [escalationsTotalPages, setEscalationsTotalPages] = React.useState(1);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [isEditOpen, setIsEditOpen] = React.useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = React.useState(false);

  React.useEffect(() => {
    if (agentId && user?.businessId) {
      loadAgentDetails();
      loadAgentRatings();
    }
  }, [agentId, user?.businessId]);

  React.useEffect(() => {
    if (agentId) {
      loadAgentEscalations();
    }
  }, [agentId, escalationsPage]);

  const loadAgentDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("Fetching agent details for ID:", agentId);

      // Fetch agent details directly by ID (includes deleted agents)
      const agentResponse = await api.get(`/agent/${agentId}`);

      if (!agentResponse?.data) {
        throw new Error("Agent not found");
      }

      setAgent(agentResponse.data);
      console.log("Agent data loaded:", agentResponse.data);

      // Fetch agent statistics (if endpoint exists)
      try {
        const statsResponse = await api.get(`/agent/${agentId}/stats`);
        setStats(statsResponse.data);
        console.log("Agent stats loaded:", statsResponse.data);
      } catch (statsError) {
        console.log("Stats endpoint not available, using defaults");
        // If stats endpoint doesn't exist, set default stats
        setStats({
          totalSessions: 0,
          activeSessions: 0,
          resolvedSessions: 0,
          averageResponseTime: 0,
          customerRating: 0,
          totalMessages: 0,
        });
      }
    } catch (err: any) {
      console.error("Failed to load agent details:", err);
      setError(
        err.response?.data?.error ||
          err.message ||
          "Failed to load agent details"
      );
    } finally {
      setLoading(false);
    }
  };

  const loadAgentEscalations = async () => {
    try {
      setEscalationsLoading(true);
      console.log(
        "Fetching escalations for agent ID:",
        agentId,
        "page:",
        escalationsPage
      );

      const response = await api.get(`/escalation/agent/${agentId}`, {
        params: {
          limit: 10, // Show 10 escalations per page
          page: escalationsPage,
          status: "all",
        },
      });

      setEscalations(response.data.escalations || []);
      setCounts(response.data.counts || null);
      setEscalationsTotalPages(response.data.totalPages || 1);
      console.log("Agent escalations loaded:", response.data.escalations);
      console.log("Agent counts loaded:", response.data.counts);
    } catch (err: any) {
      console.error("Failed to load agent escalations:", err);
      // Don't show error for escalations, just keep empty array
      setEscalations([]);
    } finally {
      setEscalationsLoading(false);
    }
  };

  const handleEscalationsPageChange = (newPage: number) => {
    setEscalationsPage(newPage);
  };

  const loadAgentRatings = async () => {
    try {
      console.log("Fetching ratings for agent ID:", agentId);

      const response = await api.get(`/agent-rating/agent/${agentId}`, {
        params: {
          limit: 1, // We only need the stats, not all ratings
        },
      });

      if (response.data.success && response.data.stats) {
        setRatingStats(response.data.stats);
        console.log("Agent ratings loaded:", response.data.stats);
      }
    } catch (err: any) {
      console.error("Failed to load agent ratings:", err);
      // Don't show error for ratings, just keep null
      setRatingStats(null);
    }
  };

  const handleEditAgent = () => {
    setIsEditOpen(true);
  };

  const handleDeleteAgent = () => {
    setIsDeleteOpen(true);
  };

  const handleEditSubmit = async (data: any) => {
    if (!agent) return;

    try {
      const response = await api.put(`/agent/${agentId}`, data);
      setAgent(response.data);
      setIsEditOpen(false);
      toast.success("Agent updated successfully");
      loadAgentDetails();
    } catch (err: any) {
      throw err;
    }
  };

  const handleDeleteConfirm = async () => {
    if (!agent) return;

    try {
      await api.delete(`/agent/${agentId}`);
      toast.success("Agent deleted successfully");
      router.push("/dashboard/agent-management");
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to delete agent");
      throw err;
    }
  };

  if (loading) {
    return <AgentProfileSkeleton />;
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
              {error ||
                "The agent you're looking for doesn't exist or may have been deleted."}
            </p>
            <Button onClick={() => router.push("/dashboard/agent-management")}>
              Back to Agent Management
            </Button>
          </div>
        </div>
      </div>
    );
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
            onEdit={handleEditAgent}
            onDelete={handleDeleteAgent}
          />
        </div>

        {/* Right Column - Stats & Escalations (2/3 width) */}
        <div className="lg:col-span-2 space-y-4">
          {/* Performance Stats */}
          <AgentStatsCards
            stats={stats}
            counts={counts}
            ratingStats={ratingStats}
          />

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

      <EditAgentDialog
        agent={agent}
        open={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        onSubmit={handleEditSubmit}
      />

      <DeleteAgentDialog
        agent={agent}
        open={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
