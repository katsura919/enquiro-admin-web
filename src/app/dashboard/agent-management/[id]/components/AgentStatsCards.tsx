"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { MessageSquare, CheckCircle, Star } from "lucide-react";

interface AgentStats {
  totalSessions: number;
  activeSessions: number;
  resolvedSessions: number;
  averageResponseTime: number;
  customerRating: number;
  totalMessages: number;
}

interface CountData {
  totalCases: number;
  totalResolvedCases: number;
}

interface RatingStats {
  averageRating: number;
  totalRatings: number;
}

interface AgentStatsCardsProps {
  stats: AgentStats | null;
  counts?: CountData | null;
  ratingStats?: RatingStats | null;
}

export function AgentStatsCards({
  stats,
  counts,
  ratingStats,
}: AgentStatsCardsProps) {
  const resolutionRate = counts?.totalCases
    ? ((counts.totalResolvedCases / counts.totalCases) * 100).toFixed(0)
    : 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">
          Performance Overview
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/30 dark:to-blue-900/20 border-blue-200 dark:border-blue-900/50 hover:shadow-md transition-all border-muted-gray shadow-none">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div className="space-y-3 flex-1">
                <div className="flex items-center gap-2">
                  <div className="p-2.5 bg-blue-500/10 dark:bg-blue-500/20 rounded-lg ring-1 ring-blue-500/20">
                    <MessageSquare className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-xs font-semibold text-blue-900 dark:text-blue-300 uppercase tracking-wider">
                    Total Cases
                  </h3>
                </div>
                <div>
                  <p className="text-3xl font-bold text-blue-900 dark:text-blue-100">
                    {counts?.totalCases || 0}
                  </p>
                  <p className="text-xs text-blue-700 dark:text-blue-400 mt-1">
                    All time
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-950/30 dark:to-green-900/20 border-green-200 dark:border-green-900/50 shadow-sm hover:shadow-md transition-all">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div className="space-y-3 flex-1">
                <div className="flex items-center gap-2">
                  <div className="p-2.5 bg-green-500/10 dark:bg-green-500/20 rounded-lg ring-1 ring-green-500/20">
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-xs font-semibold text-green-900 dark:text-green-300 uppercase tracking-wider">
                    Resolved
                  </h3>
                </div>
                <div>
                  <div className="flex items-baseline gap-2">
                    <p className="text-3xl font-bold text-green-900 dark:text-green-100">
                      {counts?.totalResolvedCases || 0}
                    </p>
                    <span className="text-sm font-semibold text-green-700 dark:text-green-400">
                      ({resolutionRate}%)
                    </span>
                  </div>
                  <p className="text-xs text-green-700 dark:text-green-400 mt-1">
                    Resolution rate
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100/50 dark:from-yellow-950/30 dark:to-yellow-900/20 border-yellow-200 dark:border-yellow-900/50 shadow-sm hover:shadow-md transition-all">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div className="space-y-3 flex-1">
                <div className="flex items-center gap-2">
                  <div className="p-2.5 bg-yellow-500/10 dark:bg-yellow-500/20 rounded-lg ring-1 ring-yellow-500/20">
                    <Star className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <h3 className="text-xs font-semibold text-yellow-900 dark:text-yellow-300 uppercase tracking-wider">
                    Rating
                  </h3>
                </div>
                <div>
                  <div className="flex items-baseline gap-2">
                    <p className="text-3xl font-bold text-yellow-900 dark:text-yellow-100">
                      {ratingStats?.averageRating
                        ? ratingStats.averageRating.toFixed(1)
                        : "0.0"}
                    </p>
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-3.5 w-3.5 ${
                            star <= Math.floor(ratingStats?.averageRating || 0)
                              ? "text-yellow-500 fill-yellow-500"
                              : "text-gray-300 dark:text-gray-600"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-yellow-700 dark:text-yellow-400 mt-1">
                    {ratingStats?.totalRatings
                      ? `${ratingStats.totalRatings} reviews`
                      : "No reviews yet"}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
