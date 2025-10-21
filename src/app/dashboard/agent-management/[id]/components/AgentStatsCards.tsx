"use client"

import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { 
  MessageSquare, 
  CheckCircle,
  Star
} from "lucide-react"

interface AgentStats {
  totalSessions: number
  activeSessions: number
  resolvedSessions: number
  averageResponseTime: number
  customerRating: number
  totalMessages: number
}

interface CountData {
  totalCases: number
  totalResolvedCases: number
}

interface RatingStats {
  averageRating: number
  totalRatings: number
}

interface AgentStatsCardsProps {
  stats: AgentStats | null
  counts?: CountData | null
  ratingStats?: RatingStats | null
}

export function AgentStatsCards({ stats, counts, ratingStats }: AgentStatsCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      <Card className="bg-card shadow-none border-muted-gray hover:shadow-sm transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <MessageSquare className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{counts?.totalCases || 0}</p>
              <p className="text-xs text-muted-foreground">Total Cases</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card shadow-none border-muted-gray hover:shadow-sm transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{counts?.totalResolvedCases || 0}</p>
              <p className="text-xs text-muted-foreground">Resolved</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card shadow-none border-muted-gray hover:shadow-sm transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
              <Star className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline gap-1.5">
                <p className="text-2xl font-bold text-foreground">
                  {ratingStats?.averageRating ? ratingStats.averageRating.toFixed(1) : '0.0'}
                </p>
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-3 w-3 ${
                        star <= Math.floor(ratingStats?.averageRating || 0)
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-gray-300 dark:text-gray-600'
                      }`}
                    />
                  ))}
                </div>
              </div>
              <p className="text-xs text-muted-foreground truncate">
                Rating {ratingStats?.totalRatings ? `(${ratingStats.totalRatings})` : '(0)'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}