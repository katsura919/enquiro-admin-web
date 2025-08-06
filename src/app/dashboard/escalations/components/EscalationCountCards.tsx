"use client"

import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
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
      textColor: "text-blue-700 dark:text-blue-300",
      badgeColor: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
    },
    {
      title: "Escalated",
      count: counts.escalated,
      status: "escalated" as const,
      icon: AlertTriangle,
      textColor: "text-red-700 dark:text-red-300",
      badgeColor: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
    },
    {
      title: "Pending",
      count: counts.pending,
      status: "pending" as const,
      icon: Clock,
      textColor: "text-yellow-700 dark:text-yellow-300",
      badgeColor: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
    },
    {
      title: "Resolved",
      count: counts.resolved,
      status: "resolved" as const,
      icon: CheckCircle,
      textColor: "text-green-700 dark:text-green-300",
      badgeColor: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
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

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 w-full">
      {cards.map((card) => (
        <Card
          key={card.status}
          className="bg-card border-1g transition-all duration-200 cursor-pointer flex-1"
          onClick={() => onCountClick?.(card.status)}
        >
          <CardContent className="p-5">
            <div className="flex items-start justify-between mb-3">
              <span className={`text-sm font-medium ${card.textColor}`}>
                {card.title}
              </span>
              <card.icon className={`h-6 w-6 ${card.textColor} flex-shrink-0`} />
            </div>
            
            <div className="space-y-2">
              <div className={`text-4xl font-bold leading-none ${card.textColor}`}>
                {card.count.toLocaleString()}
              </div>
              
              {card.status !== "all" && counts.total > 0 && (
                <Badge variant="secondary" className={`text-xs ${card.badgeColor}`}>
                  {((card.count / counts.total) * 100).toFixed(1)}% of total
                </Badge>
              )}
            </div>
            
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
