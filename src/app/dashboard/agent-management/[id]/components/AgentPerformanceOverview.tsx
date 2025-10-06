"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Star } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface Agent {
  _id: string
  businessId: string
  name: string
  email: string
  phone?: string
  profilePic?: string
  role: string
  createdAt: string
  deletedAt?: string | null
}

interface AgentStats {
  totalSessions: number
  activeSessions: number
  resolvedSessions: number
  averageResponseTime: number
  customerRating: number
  totalMessages: number
}

interface AgentPerformanceOverviewProps {
  agent: Agent
  stats: AgentStats | null
}

export function AgentPerformanceOverview({ agent, stats }: AgentPerformanceOverviewProps) {
  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Performance Overview
          </CardTitle>
          <Badge variant="outline" className="text-green-600 bg-green-50 dark:bg-green-900/20">
            Excellent Performance
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm font-medium">Active Sessions</span>
              </div>
              <span className="text-sm font-bold text-blue-600">{stats?.activeSessions || 4}</span>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium">Resolution Rate</span>
              </div>
              <span className="text-sm font-bold text-green-600">
                {stats?.totalSessions 
                  ? `${Math.round((stats.resolvedSessions / stats.totalSessions) * 100)}%`
                  : '90%'
                }
              </span>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span className="text-sm font-medium">Total Messages</span>
              </div>
              <span className="text-sm font-bold text-purple-600">{stats?.totalMessages || 1247}</span>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="text-sm font-medium">Customer Rating</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-yellow-600">
                  {stats?.customerRating ? `${stats.customerRating.toFixed(1)}` : '8.6'}
                </span>
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-3 w-3 ${
                        star <= Math.floor(stats?.customerRating || 4.3)
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-sm font-medium">Last Activity</span>
              </div>
              <span className="text-sm font-bold text-red-600">
                {agent.createdAt ? formatDistanceToNow(new Date(agent.createdAt), { addSuffix: true }) : '2 hours ago'}
              </span>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-teal-500 rounded-full"></div>
                <span className="text-sm font-medium">Agent ID</span>
              </div>
              <span className="text-sm font-mono text-teal-600">#{agent._id.slice(-6)}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}