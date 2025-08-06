"use client"

import * as React from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"

export function EscalationsPageSkeleton() {
  return (
    <div className="p-6 w-full">
      {/* Page Header - Real content, no skeleton needed */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground mb-2">Escalation Management</h1>
        <p className="text-muted-foreground">Monitor and manage customer escalations</p>
      </div>

      {/* Count Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 w-full">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="border-none bg-card flex-1">
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-3">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-6 w-6 rounded" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-10 w-16" />
                <Skeleton className="h-5 w-24" />
              </div>
            
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search and Filter Controls Skeleton */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
        <Skeleton className="h-10 w-full max-w-md flex-1" />
        <Skeleton className="h-10 w-32" />
      </div>

      {/* Table Skeleton */}
      <Card className="w-full">
        <CardContent className="p-0">
          {/* Table Header */}
          <div className="border-b">
            <div className="grid grid-cols-7 gap-4 p-4">
              <Skeleton className="h-4 w-4" /> {/* Checkbox */}
              <Skeleton className="h-4 w-16" /> {/* Case # */}
              <Skeleton className="h-4 w-20" /> {/* Customer */}
              <Skeleton className="h-4 w-16" /> {/* Email */}
              <Skeleton className="h-4 w-20" /> {/* Concern */}
              <Skeleton className="h-4 w-16" /> {/* Status */}
              <Skeleton className="h-4 w-20" /> {/* Created */}
            </div>
          </div>

          {/* Table Rows */}
          {[...Array(10)].map((_, i) => (
            <div key={i} className="border-b last:border-b-0">
              <div className="grid grid-cols-7 gap-4 p-4 items-center">
                <Skeleton className="h-4 w-4" /> {/* Checkbox */}
                <Skeleton className="h-4 w-16 font-mono" /> {/* Case # */}
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-4 w-32" />
                </div>
                <Skeleton className="h-4 w-40" /> {/* Concern */}
                <Skeleton className="h-6 w-20 rounded-full" /> {/* Status Badge */}
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-4 w-28" />
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Pagination Skeleton */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6">
        <Skeleton className="h-4 w-48" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-10 w-20" />
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-10 w-16" />
        </div>
      </div>
    </div>
  )
}

// Mobile-specific skeleton with adjusted layout
export function EscalationsPageSkeletonMobile() {
  return (
    <div className="p-4 w-full">
      {/* Page Header - Real content, no skeleton needed */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground mb-2">Escalation Management</h1>
        <p className="text-muted-foreground">Monitor and manage customer escalations</p>
      </div>

      {/* Count Cards Skeleton - Stacked on Mobile */}
      <div className="grid grid-cols-1 gap-4 mb-6 w-full">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-5 w-5 rounded" />
              </div>
              <div className="flex items-center justify-between">
                <Skeleton className="h-8 w-12" />
                <Skeleton className="h-5 w-20" />
              </div>
              <Skeleton className="h-1 w-full mt-3 rounded-full" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search and Filter Controls Skeleton */}
      <div className="space-y-3 mb-6">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-32" />
      </div>

      {/* Mobile Table/Card Layout Skeleton */}
      <div className="space-y-4">
        {[...Array(8)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-3">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-5 w-24" />
                </div>
                <Skeleton className="h-6 w-18 rounded-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-3 w-20" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination Skeleton */}
      <div className="flex flex-col items-center gap-3 mt-6">
        <Skeleton className="h-4 w-40" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-18" />
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-9 w-14" />
        </div>
      </div>
    </div>
  )
}
