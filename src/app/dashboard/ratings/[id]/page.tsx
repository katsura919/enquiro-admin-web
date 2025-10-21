"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/lib/auth"
import api from "@/utils/api"
import { 
  ChevronLeft, 
  Star, 
  Calendar, 
  User, 
  MessageSquare, 
  Mail,
  Briefcase,
  Clock,
  Phone,
  ExternalLink
} from "lucide-react"
import { format } from "date-fns"

// Type definition for rating
type Rating = {
  _id: string
  businessId: string
  sessionId: string
  agentId: string
  agentName: string
  agentEmail: string
  caseNumber: string
  rating: number
  feedback: string | null
  ratedAt: Date
  createdAt: Date
}

// Type definition for escalation/case
type Escalation = {
  _id: string
  businessId: string
  sessionId: string
  caseNumber: string
  caseOwner: {
    _id: string
    name: string
  } | null
  customerName: string
  customerEmail: string
  customerPhone?: string
  concern: string
  description?: string
  status: 'escalated' | 'resolved' | 'pending'
  createdAt: Date
  updatedAt: Date
}

export default function RatingDetailPage() {
  const router = useRouter()
  const params = useParams()
  const { user } = useAuth()
  const [rating, setRating] = useState<Rating | null>(null)
  const [escalation, setEscalation] = useState<Escalation | null>(null)
  const [loading, setLoading] = useState(true)
  const [escalationLoading, setEscalationLoading] = useState(false)

  useEffect(() => {
    const fetchRating = async () => {
      if (!params.id || !user?.businessId) return

      try {
        setLoading(true)
        const response = await api.get(`/agent-rating/${params.id}`)
        if (response.data.success) {
          const ratingData = response.data.data
          setRating({
            _id: ratingData._id,
            businessId: ratingData.businessId._id || ratingData.businessId,
            sessionId: ratingData.sessionId._id || ratingData.sessionId,
            agentId: ratingData.agentId._id || ratingData.agentId,
            agentName: ratingData.agentId?.name || "Unknown Agent",
            agentEmail: ratingData.agentId?.email || "",
            caseNumber: ratingData.caseNumber || "N/A",
            rating: ratingData.rating,
            feedback: ratingData.feedback,
            ratedAt: new Date(ratingData.ratedAt),
            createdAt: new Date(ratingData.createdAt)
          })
        }
      } catch (error) {
        console.error("Error fetching rating:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchRating()
  }, [params.id, user?.businessId])

  // Fetch escalation/case details using case number
  useEffect(() => {
    const fetchEscalation = async () => {
      if (!rating?.caseNumber || !user?.businessId) return

      try {
        setEscalationLoading(true)
        const response = await api.get(`/escalation/case/${rating.caseNumber}?businessId=${user.businessId}`)
        if (response.data) {
          setEscalation({
            ...response.data,
            createdAt: new Date(response.data.createdAt),
            updatedAt: new Date(response.data.updatedAt)
          })
        }
      } catch (error) {
        console.error("Error fetching escalation:", error)
        setEscalation(null)
      } finally {
        setEscalationLoading(false)
      }
    }

    fetchEscalation()
  }, [rating?.caseNumber, user?.businessId])

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-6 w-6 ${
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            }`}
          />
        ))}
      </div>
    )
  }

  const getRatingBadgeColor = (rating: number) => {
    if (rating >= 4) return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
    if (rating === 3) return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
    return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
  }

  const getRatingText = (rating: number) => {
    if (rating === 5) return "Excellent"
    if (rating === 4) return "Good"
    if (rating === 3) return "Average"
    if (rating === 2) return "Below Average"
    return "Poor"
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'resolved':
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
      case 'pending':
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
      case 'escalated':
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
    }
  }

  if (loading) {
    return (
      <div className="w-full mx-auto p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="text-center py-8 text-muted-foreground">
              Loading rating details...
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!rating) {
    return (
      <div className="w-full mx-auto p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="text-center py-8 text-muted-foreground">
              Rating not found
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="w-full mx-auto p-4 md:p-6 space-y-4">
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
          <h1 className="text-2xl font-bold text-foreground">Rating Details</h1>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left Column - Rating & Feedback (2/3 width) */}
        <div className="lg:col-span-2 space-y-4">
          {/* Compact Rating Card */}
          <Card className="bg-card border-muted-gray shadow-none">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                {/* Rating Display */}
                <div className="flex flex-col items-center gap-2 px-6 py-4 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20 rounded-xl border border-yellow-200 dark:border-yellow-900/30">
                  <div className="text-5xl font-bold text-foreground">{rating.rating}.0</div>
                  {renderStars(rating.rating)}
                  <Badge className={`${getRatingBadgeColor(rating.rating)} text-xs px-2 py-0.5 font-medium`}>
                    {getRatingText(rating.rating)}
                  </Badge>
                </div>

                <Separator orientation="vertical" className="hidden sm:block h-24" />

                {/* Rating Details */}
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <div className="min-w-0">
                      <p className="text-xs text-muted-foreground">Agent</p>
                      <p className="text-sm font-medium truncate">{rating.agentName}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Rated On</p>
                      <p className="text-sm font-medium">{format(rating.ratedAt, "MMM dd, yyyy")}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <div className="min-w-0">
                      <p className="text-xs text-muted-foreground">Agent Email</p>
                      <p className="text-sm font-medium truncate">{rating.agentEmail}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Time</p>
                      <p className="text-sm font-medium">{format(rating.ratedAt, "h:mm a")}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Compact Feedback Card */}
          <Card className="bg-card border-muted-gray shadow-none">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
                <CardTitle className="text-base text-secondary-foreground">Customer Feedback</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              {rating.feedback ? (
                <div className="p-3 bg-muted/30 rounded-lg border border-muted">
                  <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">{rating.feedback}</p>
                </div>
              ) : (
                <div className="py-6 text-center text-muted-foreground">
                  <MessageSquare className="h-10 w-10 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">No feedback provided</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Case Details (1/3 width) */}
        <div className="lg:col-span-1">
          {escalationLoading ? (
            <Card className="bg-card border-muted-gray shadow-none">
              <CardContent className="p-6">
                <div className="text-center py-8 text-sm text-muted-foreground">
                  Loading case...
                </div>
              </CardContent>
            </Card>
          ) : escalation ? (
            <Card className="bg-card border-muted-gray shadow-none sticky top-4">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base text-secondary-foreground">Case Information</CardTitle>
                  <Badge className={getStatusBadgeColor(escalation.status)}>
                    {escalation.status.charAt(0).toUpperCase() + escalation.status.slice(1)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Case Number */}
                <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <span className="text-xs text-muted-foreground">Case Number</span>
                  <span className="text-sm font-mono font-semibold">{escalation.caseNumber}</span>
                </div>

                <Separator />

                {/* Customer Details */}
                <div className="space-y-3">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Customer</p>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <User className="h-3.5 w-3.5 text-muted-foreground mt-0.5" />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium truncate">{escalation.customerName}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Mail className="h-3.5 w-3.5 text-muted-foreground mt-0.5" />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs text-muted-foreground truncate">{escalation.customerEmail}</p>
                      </div>
                    </div>
                    {escalation.customerPhone && (
                      <div className="flex items-start gap-2">
                        <Phone className="h-3.5 w-3.5 text-muted-foreground mt-0.5" />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs text-muted-foreground">{escalation.customerPhone}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <Separator />

                {/* Case Owner */}
                {escalation.caseOwner && (
                  <>
                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Assigned To</p>
                      <div className="flex items-center gap-2 p-2 bg-muted/30 rounded-md">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="h-4 w-4 text-primary" />
                        </div>
                        <p className="text-sm font-medium">{escalation.caseOwner.name}</p>
                      </div>
                    </div>
                    <Separator />
                  </>
                )}

                {/* Concern */}
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Concern</p>
                  <p className="text-sm text-foreground leading-relaxed">{escalation.concern}</p>
                </div>

                {escalation.description && (
                  <>
                    <Separator />
                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Description</p>
                      <p className="text-xs text-muted-foreground leading-relaxed">{escalation.description}</p>
                    </div>
                  </>
                )}

                <Separator />

                {/* Timestamps */}
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Created</span>
                    <span className="font-medium">{format(escalation.createdAt, "MMM dd, yyyy")}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Updated</span>
                    <span className="font-medium">{format(escalation.updatedAt, "MMM dd, yyyy")}</span>
                  </div>
                </div>

                {/* View Full Case Button */}
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => router.push(`/dashboard/escalations/${escalation._id}`)}
                >
                  <ExternalLink className="h-3.5 w-3.5 mr-2" />
                  View Full Case
                </Button>
              </CardContent>
            </Card>
          ) : null}
        </div>
      </div>
    </div>
  )
}
