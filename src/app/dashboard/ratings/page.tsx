"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
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

// Dummy data based on agent-rating-model
const dummyRatings = [
  {
    _id: "1",
    businessId: "bus123",
    sessionId: "ses001",
    agentId: "agent001",
    agentName: "Sarah Johnson",
    agentEmail: "sarah@company.com",
    caseNumber: "CASE-2024-001",
    rating: 5,
    feedback: "Excellent service! Very helpful and resolved my issue quickly.",
    ratedAt: new Date("2024-10-05T14:30:00"),
    createdAt: new Date("2024-10-05T14:30:00")
  },
  {
    _id: "2",
    businessId: "bus123",
    sessionId: "ses002",
    agentId: "agent002",
    agentName: "Michael Chen",
    agentEmail: "michael@company.com",
    caseNumber: "CASE-2024-002",
    rating: 4,
    feedback: "Good experience overall, took a bit longer than expected but resolved successfully.",
    ratedAt: new Date("2024-10-05T13:15:00"),
    createdAt: new Date("2024-10-05T13:15:00")
  },
  {
    _id: "3",
    businessId: "bus123",
    sessionId: "ses003",
    agentId: "agent001",
    agentName: "Sarah Johnson",
    agentEmail: "sarah@company.com",
    caseNumber: "CASE-2024-003",
    rating: 5,
    feedback: "Outstanding! Sarah was very professional and knowledgeable.",
    ratedAt: new Date("2024-10-05T11:45:00"),
    createdAt: new Date("2024-10-05T11:45:00")
  },
  {
    _id: "4",
    businessId: "bus123",
    sessionId: "ses004",
    agentId: "agent003",
    agentName: "Emily Rodriguez",
    agentEmail: "emily@company.com",
    caseNumber: "CASE-2024-004",
    rating: 3,
    feedback: "Average service, could have been more responsive.",
    ratedAt: new Date("2024-10-05T10:20:00"),
    createdAt: new Date("2024-10-05T10:20:00")
  },
  {
    _id: "5",
    businessId: "bus123",
    sessionId: "ses005",
    agentId: "agent002",
    agentName: "Michael Chen",
    agentEmail: "michael@company.com",
    caseNumber: "CASE-2024-005",
    rating: 5,
    feedback: "Perfect! Michael understood my problem immediately and provided a great solution.",
    ratedAt: new Date("2024-10-04T16:30:00"),
    createdAt: new Date("2024-10-04T16:30:00")
  },
  {
    _id: "6",
    businessId: "bus123",
    sessionId: "ses006",
    agentId: "agent004",
    agentName: "David Kim",
    agentEmail: "david@company.com",
    caseNumber: "CASE-2024-006",
    rating: 4,
    feedback: "Very satisfied with the help I received.",
    ratedAt: new Date("2024-10-04T14:10:00"),
    createdAt: new Date("2024-10-04T14:10:00")
  },
  {
    _id: "7",
    businessId: "bus123",
    sessionId: "ses007",
    agentId: "agent003",
    agentName: "Emily Rodriguez",
    agentEmail: "emily@company.com",
    caseNumber: "CASE-2024-007",
    rating: 2,
    feedback: "Not very helpful, had to repeat my issue multiple times.",
    ratedAt: new Date("2024-10-04T11:25:00"),
    createdAt: new Date("2024-10-04T11:25:00")
  },
  {
    _id: "8",
    businessId: "bus123",
    sessionId: "ses008",
    agentId: "agent001",
    agentName: "Sarah Johnson",
    agentEmail: "sarah@company.com",
    caseNumber: "CASE-2024-008",
    rating: 5,
    feedback: "Absolutely wonderful experience! Highly recommend.",
    ratedAt: new Date("2024-10-03T15:40:00"),
    createdAt: new Date("2024-10-03T15:40:00")
  },
  {
    _id: "9",
    businessId: "bus123",
    sessionId: "ses009",
    agentId: "agent004",
    agentName: "David Kim",
    agentEmail: "david@company.com",
    caseNumber: "CASE-2024-009",
    rating: 4,
    feedback: "Great service, very professional approach.",
    ratedAt: new Date("2024-10-03T13:20:00"),
    createdAt: new Date("2024-10-03T13:20:00")
  },
  {
    _id: "10",
    businessId: "bus123",
    sessionId: "ses010",
    agentId: "agent002",
    agentName: "Michael Chen",
    agentEmail: "michael@company.com",
    caseNumber: "CASE-2024-010",
    rating: 5,
    feedback: "Exceeded expectations! Very thorough and patient.",
    ratedAt: new Date("2024-10-03T09:50:00"),
    createdAt: new Date("2024-10-03T09:50:00")
  }
]

// Calculate stats
const calculateStats = (ratings: typeof dummyRatings) => {
  const totalRatings = ratings.length
  const averageRating = ratings.reduce((sum, r) => sum + r.rating, 0) / totalRatings
  
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
  const [searchTerm, setSearchTerm] = useState("")
  const [filterRating, setFilterRating] = useState<string>("all")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const stats = calculateStats(dummyRatings)

  // Filter ratings
  const filteredRatings = dummyRatings.filter(rating => {
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

  return (
    <div className="w-full mx-auto p-6 space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-0 shadow-sm bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/20 dark:to-blue-800/20">
          <CardHeader className="pb-3 px-6 pt-6">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Star className="h-4 w-4" />
              Average Rating
            </CardTitle>
          </CardHeader>
          <CardContent className="px-6 pb-6">
            <div className="text-2xl font-bold text-foreground">{stats.averageRating}/5</div>
            <div className="flex gap-1 mt-2">
              {renderStars(Math.round(parseFloat(stats.averageRating)))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/20 dark:to-green-800/20">
          <CardHeader className="pb-3 px-6 pt-6">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Total Ratings
            </CardTitle>
          </CardHeader>
          <CardContent className="px-6 pb-6">
            <div className="text-2xl font-bold text-foreground">{stats.totalRatings}</div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/20 dark:to-purple-800/20">
          <CardHeader className="pb-3 px-6 pt-6">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              5-Star Ratings
            </CardTitle>
          </CardHeader>
          <CardContent className="px-6 pb-6">
            <div className="text-2xl font-bold text-foreground">{stats.ratingDistribution[5]}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {((stats.ratingDistribution[5] / stats.totalRatings) * 100).toFixed(1)}% of total
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-900/20 dark:to-orange-800/20">
          <CardHeader className="pb-3 px-6 pt-6">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Users className="h-4 w-4" />
              Unique Agents
            </CardTitle>
          </CardHeader>
          <CardContent className="px-6 pb-6">
            <div className="text-2xl font-bold text-foreground">
              {new Set(dummyRatings.map(r => r.agentId)).size}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Rating Distribution */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle>Rating Distribution</CardTitle>
          <CardDescription>Breakdown of ratings by star count</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[5, 4, 3, 2, 1].map((stars) => (
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
                        width: `${(stats.ratingDistribution[stars as keyof typeof stats.ratingDistribution] / stats.totalRatings) * 100}%`
                      }}
                    />
                  </div>
                </div>
                <div className="text-sm font-medium w-16 text-right">
                  {stats.ratingDistribution[stars as keyof typeof stats.ratingDistribution]} ({((stats.ratingDistribution[stars as keyof typeof stats.ratingDistribution] / stats.totalRatings) * 100).toFixed(0)}%)
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Filters and Search */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle>All Ratings</CardTitle>
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
                className="pl-10"
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
                {paginatedRatings.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      No ratings found
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedRatings.map((rating) => (
                    <TableRow key={rating._id}>
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
                        <p className="text-sm text-muted-foreground line-clamp-2">
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
    </div>
  )
}
