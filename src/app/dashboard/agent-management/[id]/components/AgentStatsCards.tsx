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

interface AgentStatsCardsProps {
  stats: AgentStats | null
  counts?: CountData | null
}

export function AgentStatsCards({ stats, counts }: AgentStatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="bg-card shadow-none border-muted-gray hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-xl">
              <MessageSquare className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{counts?.totalCases || 42}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Cases</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card shadow-none border-muted-gray hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 dark:bg-green-900 rounded-xl">
              <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{counts?.totalResolvedCases || 0}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Resolved Cases</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card shadow-none border-muted-gray hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-xl">
              <Star className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats?.customerRating ? stats.customerRating.toFixed(1) : '8.6'}
                </p>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-4 w-4 ${
                        star <= Math.floor(stats?.customerRating || 4.3)
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-gray-300 dark:text-gray-600'
                      }`}
                    />
                  ))}
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Customer Rating</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}