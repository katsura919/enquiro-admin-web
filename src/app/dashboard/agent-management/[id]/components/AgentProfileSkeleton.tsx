"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function AgentProfileSkeleton() {
  return (
    <div className="p-6 space-y-6">
      {/* Header Skeleton */}
      <div className="flex items-center gap-4">
        <Skeleton className="h-8 w-8" /> {/* Back button */}
        <Skeleton className="h-6 w-32" /> {/* "Agent Profile" text */}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column - Profile Card Skeleton */}
        <div className="lg:col-span-4">
          <Card className="bg-card shadow-none border-muted-gray">
            {/* Profile Header with gradient */}
            <div className="relative h-32 bg-gradient-to-r from-blue-500 to-purple-600 rounded-t-lg">
              <div className="absolute -bottom-12 left-1/2 -translate-x-1/2">
                <Skeleton className="h-24 w-24 rounded-full border-4 border-background" />
              </div>
            </div>

            <CardContent className="pt-16 pb-6">
              {/* Name and Role */}
              <div className="text-center mb-6">
                <Skeleton className="h-7 w-32 mx-auto mb-2" />
                <Skeleton className="h-4 w-16 mx-auto" />
              </div>

              {/* Contact Information */}
              <div className="space-y-4 mb-6">
                <Skeleton className="h-5 w-40 mb-4" />
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                </div>
              </div>

              {/* Edit Button */}
              <Skeleton className="h-10 w-full" />
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Stats and Table */}
        <div className="lg:col-span-8 space-y-6">
          {/* Stats Cards Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="bg-card shadow-none border-muted-gray">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <Skeleton className="h-12 w-12 rounded-xl" />
                    <div className="flex-1">
                      <Skeleton className="h-8 w-16 mb-2" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Escalations Table Skeleton */}
          <Card className="bg-card shadow-none border-muted-gray">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Skeleton className="h-5 w-5" />
                <Skeleton className="h-6 w-40" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-card border rounded-lg">
                {/* Table Header */}
                <div className="border-b">
                  <div className="grid grid-cols-5 gap-4 p-4">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                </div>

                {/* Table Rows */}
                <div className="divide-y">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
                    <div key={i} className="grid grid-cols-5 gap-4 p-4">
                      <Skeleton className="h-4 w-full" />
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-4 w-4" />
                        <Skeleton className="h-4 w-full" />
                      </div>
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-6 w-20 rounded-full" />
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-4 w-4" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pagination Skeleton */}
              <div className="flex items-center justify-between mt-4 px-2">
                <Skeleton className="h-4 w-24" />
                <div className="flex items-center gap-2">
                  <Skeleton className="h-8 w-20" />
                  <Skeleton className="h-8 w-16" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
