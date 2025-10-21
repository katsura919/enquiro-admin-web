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
  ArrowLeft, 
  Star, 
  Calendar, 
  User, 
  MessageSquare, 
  Mail,
  Briefcase,
  Clock
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

export default function RatingDetailPage() {
  const router = useRouter()
  const params = useParams()
  const { user } = useAuth()
  const [rating, setRating] = useState<Rating | null>(null)
  const [loading, setLoading] = useState(true)

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

  if (loading) {
    return (
      <div className="w-full mx-auto p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
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
            <ArrowLeft className="h-4 w-4 mr-2" />
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
    <div className="w-full mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Rating Details</h1>
            <p className="text-muted-foreground">Case #{rating.caseNumber}</p>
          </div>
        </div>
      </div>

      {/* Rating Overview Card */}
      <Card className="bg-card border-muted-gray shadow-none">
        <CardHeader>
          <CardTitle className="text-secondary-foreground">Rating Overview</CardTitle>
          <CardDescription>Customer satisfaction rating for this case</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
            <div className="flex flex-col items-center gap-2 p-6 bg-muted/50 rounded-lg">
              <div className="text-6xl font-bold text-foreground">{rating.rating}.0</div>
              <div className="flex gap-1">
                {renderStars(rating.rating)}
              </div>
              <Badge className={`${getRatingBadgeColor(rating.rating)} text-sm px-3 py-1`}>
                {getRatingText(rating.rating)}
              </Badge>
            </div>

            <Separator orientation="vertical" className="hidden md:block h-32" />

            <div className="flex-1 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-muted rounded-lg">
                    <Briefcase className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Case Number</p>
                    <p className="font-medium">{rating.caseNumber}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-muted rounded-lg">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Rated On</p>
                    <p className="font-medium">{format(rating.ratedAt, "MMM dd, yyyy")}</p>
                    <p className="text-xs text-muted-foreground">{format(rating.ratedAt, "h:mm a")}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-muted rounded-lg">
                    <User className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Agent</p>
                    <p className="font-medium">{rating.agentName}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-muted rounded-lg">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Agent Email</p>
                    <p className="font-medium text-sm">{rating.agentEmail}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Feedback Card */}
      <Card className="bg-card border-muted-gray shadow-none">
        <CardHeader>
          <div className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            <CardTitle className="text-secondary-foreground">Customer Feedback</CardTitle>
          </div>
          <CardDescription>Additional comments from the customer</CardDescription>
        </CardHeader>
        <CardContent>
          {rating.feedback ? (
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-foreground whitespace-pre-wrap">{rating.feedback}</p>
            </div>
          ) : (
            <div className="p-8 text-center text-muted-foreground">
              <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No feedback provided by the customer</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Additional Information Card */}
      <Card className="bg-card border-muted-gray shadow-none">
        <CardHeader>
          <CardTitle className="text-secondary-foreground">Additional Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-muted rounded-lg">
                <Clock className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Created At</p>
                <p className="font-medium">{format(rating.createdAt, "MMM dd, yyyy h:mm a")}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 bg-muted rounded-lg">
                <Briefcase className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Session ID</p>
                <p className="font-medium text-sm font-mono">{rating.sessionId}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
