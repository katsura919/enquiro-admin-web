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
        <Card className="border-0 shadow-sm bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/20 dark:to-blue-800/20">
          <CardHeader className="pb-3 px-6 pt-6">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Avg Response Time
            </CardTitle>
          </CardHeader>
          <CardContent className="px-6 pb-6">
            <div className="text-2xl font-bold text-foreground">{dashboardData.performance.avgResponseTime}</div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/20 dark:to-green-800/20">
          <CardHeader className="pb-3 px-6 pt-6">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Customer Satisfaction
            </CardTitle>
          </CardHeader>
          <CardContent className="px-6 pb-6">
            <div className="text-2xl font-bold text-foreground">{dashboardData.performance.customerSatisfaction}/5</div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/20 dark:to-purple-800/20">
          <CardHeader className="pb-3 px-6 pt-6">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Resolution Rate
            </CardTitle>
          </CardHeader>
          <CardContent className="px-6 pb-6">
            <div className="text-2xl font-bold text-foreground">{dashboardData.performance.resolutionRate}%</div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-900/20 dark:to-orange-800/20">
          <CardHeader className="pb-3 px-6 pt-6">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Zap className="h-4 w-4" />
              First Contact Resolution
            </CardTitle>
          </CardHeader>
          <CardContent className="px-6 pb-6">
            <div className="text-2xl font-bold text-foreground">{dashboardData.performance.firstContactResolution}%</div>
          </CardContent>
        </Card>
      </div>

      {/* Escalations Chart */}
      {businessData._id && (
        <div className="mb-8">
          <ChartAreaInteractive businessId={businessData._id} />
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3 mb-8">
        {/* Chat Interface */}
        <QR 
          key={businessData._id} // Force re-render when business data changes
          businessSlug={businessData.slug} 
          businessLogo={businessData.logo}
          businessName={businessData.name}
        />

        {/* Agent Status */}
        <Card className="border-0 shadow-sm bg-card/50 backdrop-blur">
          <CardHeader className="pb-4 px-6 pt-6">
            <CardTitle className="text-foreground flex items-center gap-2">
              <UserCheck className="h-5 w-5" />
              Agent Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 px-6 pb-6">
            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border border-border/50">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium">Available</span>
              </div>
              <Badge variant="outline">{dashboardData.agents.available}</Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border border-border/50">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm font-medium">In Chat</span>
              </div>
              <Badge variant="outline">{dashboardData.agents.inChat}</Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border border-border/50">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span className="text-sm font-medium">Away</span>
              </div>
              <Badge variant="outline">{dashboardData.agents.away}</Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border border-border/50">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                <span className="text-sm font-medium">Offline</span>
              </div>
              <Badge variant="outline">{dashboardData.agents.offline}</Badge>
            </div>

            <Button asChild variant="outline" className="w-full mt-4">
              <Link href="/dashboard/realtime-dashboard">
                <BarChart3 className="h-4 w-4 mr-2" />
                View Details
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity & Knowledge Base */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Activity */}
        <Card className="border-0 shadow-sm bg-card/50 backdrop-blur">
          <CardHeader className="pb-4 px-6 pt-6">
            <CardTitle className="text-foreground flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 px-6 pb-6">
            {dashboardData.recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg border border-border/50">
                <div className={`w-2 h-2 rounded-full mt-2 ${getStatusColor(activity.status)}`}></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {activity.message}
                  </p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            ))}
            <Button asChild variant="outline" className="w-full mt-4">
              <Link href="/dashboard/sessions">
                <Calendar className="h-4 w-4 mr-2" />
                View All Sessions
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Knowledge Base Overview */}
        <Card className="border-0 shadow-sm bg-card/50 backdrop-blur">
          <CardHeader className="pb-4 px-6 pt-6">
            <CardTitle className="text-foreground flex items-center gap-2">
              <Brain className="h-5 w-5" />
              Knowledge Base
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 px-6 pb-6">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-muted/30 rounded-lg border border-border/50 text-center">
                <div className="text-lg font-bold text-foreground">{dashboardData.knowledge.products}</div>
                <div className="text-xs text-muted-foreground">Products</div>
              </div>
              <div className="p-3 bg-muted/30 rounded-lg border border-border/50 text-center">
                <div className="text-lg font-bold text-foreground">{dashboardData.knowledge.services}</div>
                <div className="text-xs text-muted-foreground">Services</div>
              </div>
              <div className="p-3 bg-muted/30 rounded-lg border border-border/50 text-center">
                <div className="text-lg font-bold text-foreground">{dashboardData.knowledge.policies}</div>
                <div className="text-xs text-muted-foreground">Policies</div>
              </div>
              <div className="p-3 bg-muted/30 rounded-lg border border-border/50 text-center">
                <div className="text-lg font-bold text-foreground">{dashboardData.knowledge.faqs}</div>
                <div className="text-xs text-muted-foreground">FAQs</div>
              </div>
            </div>
            <Button asChild variant="outline" className="w-full mt-4">
              <Link href="/dashboard/knowledge">
                <Brain className="h-4 w-4 mr-2" />
                Manage Knowledge
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 