"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { useAuth } from "@/lib/auth"
import api from "@/utils/api"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { 
  Star, 
  TrendingUp, 
  Users, 
  MessageSquare, 
  Filter,
  Search,
  Calendar,
  Download,
  ChevronLeft,
  ChevronRight
} from "lucide-react"
import { format } from "date-fns"
import EmptyState from "./components/EmptyState"
import { RatingStatsLoader, RatingDistributionLoader, RatingTableLoader } from "./components/LoadingStates"

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

// Calculate stats
const calculateStats = (ratings: Rating[]) => {
  const totalRatings = ratings.length
  const averageRating = totalRatings > 0 ? ratings.reduce((sum, r) => sum + r.rating, 0) / totalRatings : 0
  
  const ratingDistribution = {
    5: ratings.filter(r => r.rating === 5).length,
    4: ratings.filter(r => r.rating === 4).length,
    3: ratings.filter(r => r.rating === 3).length,
    2: ratings.filter(r => r.rating === 2).length,
    1: ratings.filter(r => r.rating === 1).length,
  }

  return {
    totalRatings,
    averageRating: averageRating.toFixed(2),
    ratingDistribution
  }
}

export default function RatingsPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [filterRating, setFilterRating] = useState<string>("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [ratings, setRatings] = useState<Rating[]>([])
  const [ratingDistribution, setRatingDistribution] = useState<{rating: number, count: number}[]>([])
  const [loading, setLoading] = useState(true)
  const [distributionLoading, setDistributionLoading] = useState(true)
  const itemsPerPage = 10
  console.log(ratings)
  // Fetch ratings from API
  useEffect(() => {
    const fetchRatings = async () => {
      if (!user?.businessId) return

      try {
        setLoading(true)
        const response = await api.get(`/agent-rating?businessId=${user.businessId}&limit=100`)
        if (response.data.success) {
          // Transform the data to match our expected format
          const transformedRatings = response.data.data.map((rating: any) => ({
            _id: rating._id,
            businessId: rating.businessId._id || rating.businessId,
            sessionId: rating.sessionId._id || rating.sessionId,
            agentId: rating.agentId._id || rating.agentId,
            agentName: rating.agentId?.name || "Unknown Agent",
            agentEmail: rating.agentId?.email || "",
            caseNumber: rating.caseNumber || "N/A",
            rating: rating.rating,
            feedback: rating.feedback,
            ratedAt: new Date(rating.ratedAt),
            createdAt: new Date(rating.createdAt)
          }))
          setRatings(transformedRatings)
        }
      } catch (error) {
        console.error("Error fetching ratings:", error)
        setRatings([])
      } finally {
        setLoading(false)
      }
    }

    fetchRatings()
  }, [user?.businessId])

  // Fetch rating distribution from API
  useEffect(() => {
    const fetchDistribution = async () => {
      if (!user?.businessId) return

      try {
        setDistributionLoading(true)
        const response = await api.get(`/agent-rating/business/${user.businessId}/distribution`)
        if (response.data.success) {
          setRatingDistribution(response.data.data)
        }
      } catch (error) {
        console.error("Error fetching rating distribution:", error)
        setRatingDistribution([])
      } finally {
        setDistributionLoading(false)
      }
    }

    fetchDistribution()
  }, [user?.businessId])

  // Calculate stats from real data
  const stats = calculateStats(ratings)

  // Filter ratings
  const filteredRatings = ratings.filter(rating => {
    const matchesSearch = 
      rating.agentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rating.caseNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rating.feedback?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesFilter = filterRating === "all" || rating.rating === parseInt(filterRating)
    
    return matchesSearch && matchesFilter
  })

  // Pagination
  const totalPages = Math.ceil(filteredRatings.length / itemsPerPage)
  const paginatedRatings = filteredRatings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
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

  // Show empty state if not loading and no ratings
  if (!loading && ratings.length === 0) {
    return (
      <div className="w-full mx-auto p-6 space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Customer Ratings</h1>
            <p className="text-muted-foreground">Monitor and analyze customer satisfaction ratings</p>
          </div>
        </div>
        <EmptyState />
      </div>
    )
  }

  return (
    <div className="w-full mx-auto p-6 space-y-6">
      {/* Filters and Search */}
      {loading ? (
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>All Ratings</CardTitle>
            <CardDescription>View and filter customer feedback</CardDescription>
          </CardHeader>
          <CardContent>
            <RatingTableLoader />
          </CardContent>
        </Card>
      ) : (
      <Card className="bg-card border-muted-gray shadow-none">
        <CardHeader>
          <CardTitle className="text-secondary-foreground">All Ratings</CardTitle>
          <CardDescription>View and filter customer feedback</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by agent, case number, or feedback..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-card shadow-none"
              />
            </div>
            <div className="flex gap-2">
              <Select value={filterRating} onValueChange={setFilterRating}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by rating" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Ratings</SelectItem>
                  <SelectItem value="5">5 Stars</SelectItem>
                  <SelectItem value="4">4 Stars</SelectItem>
                  <SelectItem value="3">3 Stars</SelectItem>
                  <SelectItem value="2">2 Stars</SelectItem>
                  <SelectItem value="1">1 Star</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Ratings Table */}
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Case Number</TableHead>
                  <TableHead>Agent</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Feedback</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      Loading ratings...
                    </TableCell>
                  </TableRow>
                ) : paginatedRatings.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      No ratings found
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedRatings.map((rating) => (
                    <TableRow 
                      key={rating._id}
                      className="cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => router.push(`/dashboard/ratings/${rating._id}`)}
                    >
                      <TableCell className="font-medium">
                        <div className="flex flex-col">
                          <span className="text-sm">{rating.caseNumber}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">{rating.agentName}</span>
                          <span className="text-xs text-muted-foreground">{rating.agentEmail}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          {renderStars(rating.rating)}
                          <Badge className={`w-fit ${getRatingBadgeColor(rating.rating)}`}>
                            {rating.rating}/5
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-md">
                        <p className="text-sm text-muted-foreground line-clamp-2 truncate">
                          {rating.feedback || "No feedback provided"}
                        </p>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          {format(rating.ratedAt, "MMM dd, yyyy")}
                          <br />
                          <span className="text-xs">{format(rating.ratedAt, "h:mm a")}</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredRatings.length)} of {filteredRatings.length} ratings
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                      className="w-8 h-8 p-0"
                    >
                      {page}
                    </Button>
                  ))}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      )}

      {/* Rating Distribution */}
      {distributionLoading ? (
        <RatingDistributionLoader />
      ) : (
      <Card className="bg-card border-muted-gray shadow-none">
        <CardHeader>
          <CardTitle className="text-secondary-foreground">Rating Distribution</CardTitle>
          <CardDescription>Breakdown of ratings by star count</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[5, 4, 3, 2, 1].map((stars) => {
              const distItem = ratingDistribution.find(d => d.rating === stars)
              const count = distItem?.count || 0
              const totalCount = ratingDistribution.reduce((sum, d) => sum + d.count, 0) || 1
              const percentage = (count / totalCount) * 100
              
              return (
                <div key={stars} className="flex items-center gap-4">
                  <div className="flex items-center gap-2 w-24">
                    <span className="text-sm font-medium">{stars}</span>
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  </div>
                  <div className="flex-1">
                    <div className="h-8 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-yellow-400 to-yellow-500 transition-all"
                        style={{
                          width: `${percentage}%`
                        }}
                      />
                    </div>
                  </div>
                  <div className="text-sm font-medium w-16 text-right">
                    {count} ({percentage.toFixed(0)}%)
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
      )}

      
    </div>
  )
}
