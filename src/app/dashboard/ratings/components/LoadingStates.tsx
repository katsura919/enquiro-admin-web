import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function RatingStatsLoader() {
  return (
    <>
      {[1, 2, 3, 4].map((i) => (
        <Card key={i} className="border-0 shadow-sm">
          <CardHeader className="pb-3 px-6 pt-6">
            <Skeleton className="h-4 w-32" />
          </CardHeader>
          <CardContent className="px-6 pb-6">
            <Skeleton className="h-8 w-20 mb-2" />
            <Skeleton className="h-4 w-24" />
          </CardContent>
        </Card>
      ))}
    </>
  )
}

export function RatingDistributionLoader() {
  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <Skeleton className="h-6 w-48 mb-2" />
        <Skeleton className="h-4 w-64" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-4">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 flex-1 rounded-full" />
              <Skeleton className="h-4 w-16" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export function RatingTableLoader() {
  return (
    <div className="space-y-3">
      {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
        <div key={i} className="flex items-center gap-4 p-4 border rounded-lg">
          <Skeleton className="h-12 w-32" />
          <Skeleton className="h-12 w-48" />
          <Skeleton className="h-12 w-24" />
          <Skeleton className="h-12 flex-1" />
          <Skeleton className="h-12 w-32" />
        </div>
      ))}
    </div>
  )
}
