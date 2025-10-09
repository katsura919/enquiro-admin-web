"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  MessageSquare, 
  Users, 
  Brain, 
  AlertTriangle, 
  Clock, 
  CheckCircle, 
  TrendingUp,
  Activity,
  UserCheck,
  Zap,
  BarChart3,
  Calendar
} from "lucide-react"
import { useAuth } from "@/lib/auth"
import Link from "next/link"
import QR from "@/components/dashboard/QR"
import api from "@/utils/api"
import { ChartAreaInteractive } from "@/components/dashboard/dashboard-escalation-chart"

interface BusinessData {
  _id: string
  name: string
  slug: string
  description: string
  category: string
  address: string
  logo?: string
  createdAt: string
  updatedAt: string
}

// Mock data - replace with actual data from your backend
const dashboardData = {
  // Chat & Sessions
  sessions: {
    total: 1284,
    today: 47,
    active: 12,
    avgDuration: "8m 32s"
  },
  
  // Agent Metrics
  agents: {
    total: 8,
    online: 6,
    available: 4,
    inChat: 2,
    away: 1,
    offline: 2
  },
  
  // Knowledge Base
  knowledge: {
    products: 45,
    services: 23,
    policies: 12,
    faqs: 38,
    total: 118
  },
  
  // Cases/Escalations
  cases: {
    total: 156,
    open: 23,
    pending: 8,
    resolved: 125,
    todayNew: 5
  },
  
  // Recent Activity
  recentActivity: [
    { type: "session", message: "New chat session started", time: "2 min ago", status: "active" },
    { type: "escalation", message: "Case #123456 escalated to support", time: "15 min ago", status: "pending" },
    { type: "agent", message: "Agent Sarah went online", time: "1 hour ago", status: "online" },
    { type: "knowledge", message: "FAQ updated: Payment Issues", time: "2 hours ago", status: "updated" }
  ],
  
  // Performance Metrics
  performance: {
    avgResponseTime: "2m 14s",
    customerSatisfaction: 4.7,
    resolutionRate: 89,
    firstContactResolution: 76
  }
}

export default function DashboardPage() {
  const { user } = useAuth()
  console.log(user)
  const [businessData, setBusinessData] = useState<BusinessData | null>(null)
  const [loading, setLoading] = useState(true)
  const [averageRating, setAverageRating] = useState<number | null>(null)
  const [escalatedCount, setEscalatedCount] = useState<number>(0)
  const [sessionsCount, setSessionsCount] = useState<number>(0)
  const [agentsCount, setAgentsCount] = useState<number>(0)
  const [ratingLoading, setRatingLoading] = useState(true)
  const [escalatedLoading, setEscalatedLoading] = useState(true)
  const [sessionsLoading, setSessionsLoading] = useState(true)
  const [agentsLoading, setAgentsLoading] = useState(true)

  // Fetch business data
  useEffect(() => {
    const fetchBusinessData = async () => {
      if (!user?.businessId) return

      try {
        setLoading(true)
        const response = await api.get(`/business/${user.businessId}`)
        setBusinessData(response.data)
      } catch (error) {
        console.error("Error fetching business data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchBusinessData()
  }, [user?.businessId])

  // Fetch average rating
  useEffect(() => {
    const fetchAverageRating = async () => {
      if (!user?.businessId) return

      try {
        setRatingLoading(true)
        const response = await api.get(`/analytics/business-ratings/${user.businessId}/average`)
        if (response.data.success) {
          setAverageRating(response.data.data.averageRating)
        }
      } catch (error) {
        console.error("Error fetching average rating:", error)
        setAverageRating(null)
      } finally {
        setRatingLoading(false)
      }
    }

    fetchAverageRating()
  }, [user?.businessId])

  // Fetch escalated count
  useEffect(() => {
    const fetchEscalatedCount = async () => {
      if (!user?.businessId) return

      try {
        setEscalatedLoading(true)
        const response = await api.get(`/analytics/escalations/${user.businessId}/count`)
        if (response.data.success) {
          setEscalatedCount(response.data.data.escalatedCount)
        }
      } catch (error) {
        console.error("Error fetching escalated count:", error)
        setEscalatedCount(0)
      } finally {
        setEscalatedLoading(false)
      }
    }

    fetchEscalatedCount()
  }, [user?.businessId])

  // Fetch sessions count
  useEffect(() => {
    const fetchSessionsCount = async () => {
      if (!user?.businessId) return

      try {
        setSessionsLoading(true)
        const response = await api.get(`/analytics/sessions/${user.businessId}/count`)
        if (response.data.success) {
          setSessionsCount(response.data.data.sessionsCount)
        }
      } catch (error) {
        console.error("Error fetching sessions count:", error)
        setSessionsCount(0)
      } finally {
        setSessionsLoading(false)
      }
    }

    fetchSessionsCount()
  }, [user?.businessId])

  // Fetch agents count
  useEffect(() => {
    const fetchAgentsCount = async () => {
      if (!user?.businessId) return

      try {
        setAgentsLoading(true)
        const response = await api.get(`/analytics/agents/${user.businessId}/count`)
        if (response.data.success) {
          setAgentsCount(response.data.data.agentsCount)
        }
      } catch (error) {
        console.error("Error fetching agents count:", error)
        setAgentsCount(0)
      } finally {
        setAgentsLoading(false)
      }
    }

    fetchAgentsCount()
  }, [user?.businessId])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': case 'online': case 'updated': return 'bg-green-500'
      case 'pending': case 'away': return 'bg-yellow-500'
      case 'offline': return 'bg-gray-500'
      default: return 'bg-blue-500'
    }
  }

  if (loading) {
    return (
      <div className="w-full mx-auto p-6 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (!businessData) {
    return (
      <div className="w-full mx-auto p-6 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-muted-foreground">Unable to load business data</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full mx-auto p-6 space-y-8">

      {/* Performance Metrics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Link href="/dashboard/escalations">
          <Card className="border-0 shadow-sm bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900/20 dark:to-red-800/20 cursor-pointer transition-all hover:shadow-md hover:scale-[1.02]">
            <CardHeader className="pb-3 px-6 pt-6">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                Escalated Cases
              </CardTitle>
            </CardHeader>
            <CardContent className="px-6 pb-6">
              {escalatedLoading ? (
                <div className="text-xl font-bold text-muted-foreground">Loading...</div>
              ) : (
                <div className="text-2xl font-bold text-foreground">{escalatedCount}</div>
              )}
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/ratings">
          <Card className="border-0 shadow-sm bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/20 dark:to-green-800/20 cursor-pointer transition-all hover:shadow-md hover:scale-[1.02]">
            <CardHeader className="pb-3 px-6 pt-6">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Customer Satisfaction
              </CardTitle>
            </CardHeader>
            <CardContent className="px-6 pb-6">
              {ratingLoading ? (
                <div className="text-xl font-bold text-muted-foreground">Loading...</div>
              ) : averageRating !== null ? (
                <div className="text-2xl font-bold text-foreground">{averageRating}/5</div>
              ) : (
                <div className="text-xl font-bold text-muted-foreground">No ratings yet</div>
              )}
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/sessions">
          <Card className="border-0 shadow-sm bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/20 dark:to-purple-800/20 cursor-pointer transition-all hover:shadow-md hover:scale-[1.02]">
            <CardHeader className="pb-3 px-6 pt-6">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Chat Sessions
              </CardTitle>
            </CardHeader>
            <CardContent className="px-6 pb-6">
              {sessionsLoading ? (
                <div className="text-xl font-bold text-muted-foreground">Loading...</div>
              ) : (
                <div className="text-2xl font-bold text-foreground">{sessionsCount}</div>
              )}
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/agent-management">
          <Card className="border-0 shadow-sm bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-900/20 dark:to-orange-800/20 cursor-pointer transition-all hover:shadow-md hover:scale-[1.02]">
            <CardHeader className="pb-3 px-6 pt-6">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Users className="h-4 w-4" />
                Total Agents
              </CardTitle>
            </CardHeader>
            <CardContent className="px-6 pb-6">
              {agentsLoading ? (
                <div className="text-xl font-bold text-muted-foreground">Loading...</div>
              ) : (
                <div className="text-2xl font-bold text-foreground">{agentsCount}</div>
              )}
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Escalations Chart */}
      {businessData._id && (
        <div className="mb-8">
          <ChartAreaInteractive businessId={businessData._id} />
        </div>
      )}

      <div className="mb-8">
        {/* Chat Interface */}
        <QR 
          key={businessData._id} // Force re-render when business data changes
          businessSlug={businessData.slug} 
          businessLogo={businessData.logo}
          businessName={businessData.name}
        />
      </div>
    </div>
  )
} 