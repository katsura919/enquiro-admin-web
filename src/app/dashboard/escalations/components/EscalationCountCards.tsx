"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { FileText, AlertTriangle, Clock, CheckCircle } from "lucide-react"
import api from "@/utils/api"

interface EscalationCounts {
  total: number
  escalated: number
  resolved: number
  pending: number
}

interface EscalationCountCardsProps {
  businessId: string
  onCountClick?: (status: "all" | "escalated" | "pending" | "resolved") => void
  activeStatus?: "all" | "escalated" | "pending" | "resolved"
}

export function EscalationCountCards({ 
  businessId, 
  onCountClick,
  activeStatus = "all" 
}: EscalationCountCardsProps) {
  const [counts, setCounts] = React.useState<EscalationCounts>({
    total: 0,
    escalated: 0,
    resolved: 0,
    pending: 0
  })
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState(false)

  React.useEffect(() => {
    if (!businessId) return

    const fetchCounts = async () => {
      try {
        setLoading(true)
        setError(false)
        const response = await api.get(`/escalation/business/${businessId}/count`)
        setCounts(response.data)
      } catch (err) {
        console.error("Error fetching escalation counts:", err)
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    fetchCounts()
  }, [businessId])

  const cards = [
    {
      title: "Total Cases",
      count: counts.total,
      status: "all" as const,
      icon: FileText,
      cardClass: "bg-card border-muted-gray shadow-none",
      badgeColor: "bg-blue-200 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
    },
    {
      title: "Escalated",
      count: counts.escalated,
      status: "escalated" as const,
      icon: AlertTriangle,
      cardClass: "bg-card border-muted-gray shadow-none",
      badgeColor: "bg-red-200 text-red-800 dark:bg-red-900 dark:text-red-200"
    },
    {
      title: "Pending",
      count: counts.pending,
      status: "pending" as const,
      icon: Clock,
      cardClass: "bg-card border-muted-gray shadow-none",
      badgeColor: "bg-yellow-200 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
    },
    {
      title: "Resolved",
      count: counts.resolved,
      status: "resolved" as const,
      icon: CheckCircle,
      cardClass: "bg-card border-muted-gray shadow-none",
      badgeColor: "bg-green-200 text-green-800 dark:bg-green-900 dark:text-green-200"
    }
  ]


  if (error) {
    return (
      <Card className="mb-6 border-destructive/50 w-full">
        <CardContent className="p-4 text-center text-muted-foreground">
          <p>Unable to load escalation counts. Please try again.</p>
        </CardContent>
      </Card>
    )
  }

  if (loading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index} className="border-0 shadow-sm">
            <CardHeader className="pb-3 px-6 pt-6">
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-24" />
              </div>
            </CardHeader>
            <CardContent className="px-6 pb-6">
              <div className="flex items-center justify-between">
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-5 w-20" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
      {cards.map((card) => (
        <Card
          key={card.status}
          className={`border-muted-gray shadow-none ${card.cardClass} cursor-pointer transition-all duration-200 hover:shadow-md`}
          onClick={() => onCountClick?.(card.status)}
        >
          <CardHeader className="pb-3 px-6 pt-6">
            <CardTitle className="text-sm font-medium text-foreground flex items-center gap-2">
              <card.icon className="h-4 w-4" />
              {card.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="px-6 pb-6">
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-foreground">{card.count.toLocaleString()}</div>
              {card.status !== "all" && counts.total > 0 && (
                <div className="flex items-center gap-1 text-foreground">
                  <span className="text-xs">↗</span>
                  <span className="text-sm font-medium">
                    {((card.count / counts.total) * 100).toFixed(1)}%
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
