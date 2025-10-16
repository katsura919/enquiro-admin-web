"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertTriangle, Clock, User, Mail } from "lucide-react"
import api from "@/utils/api"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"

interface CaseOwner {
  _id: string
  firstName: string
  lastName: string
  email: string
}

interface Escalation {
  _id: string
  caseNumber: string
  customerName: string
  customerEmail: string
  customerPhone?: string
  concern?: string
  description?: string
  status: 'escalated' | 'resolved' | 'pending'
  caseOwner?: CaseOwner
  createdAt: string
  updatedAt: string
}

interface LatestEscalationsProps {
  businessId: string
}

export function LatestEscalations({ businessId }: LatestEscalationsProps) {
  const [escalations, setEscalations] = useState<Escalation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchLatestEscalations = async () => {
      if (!businessId) return

      try {
        setLoading(true)
        setError(null)
        const response = await api.get(`/analytics/escalations/${businessId}/latest`)
        
        if (response.data.success) {
          setEscalations(response.data.data.escalations)
        }
      } catch (err) {
        console.error("Error fetching latest escalations:", err)
        setError("Failed to load escalations")
      } finally {
        setLoading(false)
      }
    }

    fetchLatestEscalations()
  }, [businessId])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'escalated':
        return 'bg-red-500/10 text-red-500 border-red-500/20'
      case 'pending':
        return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
      case 'resolved':
        return 'bg-green-500/10 text-green-500 border-green-500/20'
      default:
        return 'bg-gray-500/10 text-gray-500 border-gray-500/20'
    }
  }

  const getStatusText = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1)
  }

  if (loading) {
    return (
      <Card className="border-muted-gray shadow-none">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Latest Escalations
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="space-y-2">
              <div className="flex items-start justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-5 w-16" />
              </div>
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-3/4" />
              <Skeleton className="h-3 w-20" />
            </div>
          ))}
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="border-muted-gray shadow-none">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Latest Escalations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            {error}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!escalations || escalations.length === 0) {
    return (
      <Card className="border-muted-gray shadow-none b-card">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2 text-secondary-foreground">
            <AlertTriangle className="h-5 w-5" />
            Latest Escalations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            No escalations found
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-muted-gray shadow-none bg-card">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold flex items-center gap-2 text-secondary-foreground">
          <AlertTriangle className="h-5 w-5" />
          Latest Escalations
        </CardTitle>
        <Link 
          href="/dashboard/escalations"
          className="text-sm text-secondary-foreground hover:underline"
        >
          View all
        </Link>
      </CardHeader>
      <CardContent className="space-y-4">
        {escalations.map((escalation) => (
          <Link
            key={escalation._id}
            href={`/dashboard/escalations/${escalation._id}`}
            className="block"
          >
            <div className="p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors cursor-pointer space-y-2">
              {/* Header: Case Number and Status */}
              <div className="flex items-start justify-between gap-2">
                <span className="font-semibold text-sm text-foreground">
                  {escalation.caseNumber}
                </span>
                <Badge 
                  variant="outline" 
                  className={`${getStatusColor(escalation.status)} text-xs`}
                >
                  {getStatusText(escalation.status)}
                </Badge>
              </div>

              {/* Customer Info */}
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-foreground">
                  <User className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="font-medium">{escalation.customerName}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Mail className="h-3.5 w-3.5" />
                  <span>{escalation.customerEmail}</span>
                </div>
              </div>

              {/* Concern */}
              {escalation.concern && (
                <p className="text-sm text-muted-foreground line-clamp-1">
                  {escalation.concern}
                </p>
              )}

              {/* Case Owner and Time */}
              <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>
                    {formatDistanceToNow(new Date(escalation.createdAt), { addSuffix: true })}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </CardContent>
    </Card>
  )
}
