"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function AgentProfileSkeleton() {
  return (
    <div className="p-4 md:p-6 space-y-4">
      {/* Compact Header Skeleton */}
      <div className="flex items-center gap-3">
        <Skeleton className="h-8 w-8 rounded-md" /> {/* Back button */}
        <div>
          <Skeleton className="h-6 w-32 mb-1" /> {/* Title */}
          <Skeleton className="h-4 w-24" /> {/* Subtitle */}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left Column - Compact Profile Card Skeleton */}
        <div className="lg:col-span-1">
          <Card className="bg-card shadow-none border-muted-gray">
            {/* Compact Profile Header */}
            <div className="relative h-28 bg-gradient-to-br from-blue-500 to-purple-600 rounded-t-lg">
              <div className="absolute -bottom-10 left-1/2 -translate-x-1/2">
                <Skeleton className="h-20 w-20 rounded-full border-4 border-background" />
              </div>
            </div>

            <CardContent className="pt-12 pb-4">
              {/* Name and Role */}
              <div className="text-center mb-4">
                <Skeleton className="h-5 w-28 mx-auto mb-1" />
                <Skeleton className="h-3 w-16 mx-auto" />
              </div>

              {/* Contact Section */}
              <Skeleton className="h-3 w-20 mb-3" />
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <Skeleton className="h-3.5 w-3.5 mt-0.5" />
                  <div className="flex-1">
                    <Skeleton className="h-3 w-12 mb-1" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Skeleton className="h-3.5 w-3.5 mt-0.5" />
                  <div className="flex-1">
                    <Skeleton className="h-3 w-12 mb-1" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                </div>
              </div>

              {/* Edit Button */}
              <Skeleton className="h-8 w-full mt-4" />
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Compact Stats and Table */}
        <div className="lg:col-span-2 space-y-4">
          {/* Compact Stats Cards Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="bg-card shadow-none border-muted-gray">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-lg" />
                    <div className="flex-1">
                      <Skeleton className="h-7 w-12 mb-1" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Compact Escalations Table Skeleton */}
          <Card className="bg-card shadow-none border-muted-gray">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-5 w-36" />
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <div className="bg-card border rounded-lg overflow-hidden">
                {/* Table Header */}
                <div className="border-b">
                  <div className="grid grid-cols-5 gap-4 p-3">
                    <Skeleton className="h-3 w-12" />
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-3 w-14" />
                    <Skeleton className="h-3 w-12" />
                    <Skeleton className="h-3 w-14" />
                  </div>
                </div>

                {/* Table Rows */}
                <div className="divide-y">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="grid grid-cols-5 gap-4 p-3">
                      <Skeleton className="h-3 w-full" />
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-3.5 w-3.5" />
                        <Skeleton className="h-3 w-full" />
                      </div>
                      <Skeleton className="h-3 w-full" />
                      <Skeleton className="h-5 w-16 rounded-full" />
                      <div className="flex items-center gap-1.5">
                        <Skeleton className="h-3.5 w-3.5" />
                        <Skeleton className="h-3 w-20" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Compact Pagination Skeleton */}
              <div className="flex items-center justify-between mt-3 px-1">
                <Skeleton className="h-3 w-20" />
                <div className="flex items-center gap-1.5">
                  <Skeleton className="h-7 w-16" />
                  <Skeleton className="h-7 w-12" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
