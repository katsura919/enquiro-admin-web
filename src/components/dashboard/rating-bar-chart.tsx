"use client"

import { useEffect, useState } from "react"
import { Star } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import api from "@/utils/api"

const chartConfig = {
  count: {
    label: "Ratings",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

interface RatingsBarChartProps {
  businessId: string
}

export function RatingsBarChart({ businessId }: RatingsBarChartProps) {
  const [chartData, setChartData] = useState<Array<{ rating: string; count: number }>>([])
  const [loading, setLoading] = useState(true)
  const [totalRatings, setTotalRatings] = useState(0)

  useEffect(() => {
    const fetchRatingsDistribution = async () => {
      try {
        setLoading(true)
        const response = await api.get(`/analytics/ratings/${businessId}/distribution`)
        
        if (response.data.success) {
          const distribution = response.data.data.distribution
          const formattedData = distribution.map((item: { rating: number; count: number }) => ({
            rating: `${item.rating} ⭐`,
            count: item.count
          }))
          
          setChartData(formattedData)
          
          // Calculate total ratings
          const total = distribution.reduce((sum: number, item: { count: number }) => sum + item.count, 0)
          setTotalRatings(total)
        }
      } catch (error) {
        console.error("Error fetching ratings distribution:", error)
        // Set default data with 0 counts
        setChartData([
          { rating: "1 ⭐", count: 0 },
          { rating: "2 ⭐", count: 0 },
          { rating: "3 ⭐", count: 0 },
          { rating: "4 ⭐", count: 0 },
          { rating: "5 ⭐", count: 0 },
        ])
        setTotalRatings(0)
      } finally {
        setLoading(false)
      }
    }

    if (businessId) {
      fetchRatingsDistribution()
    }
  }, [businessId])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5" />
            Ratings Distribution
          </CardTitle>
          <CardDescription>Loading ratings data...</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[300px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-card shadow-none border-muted-gray">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Star className="h-5 w-5" />
          Ratings Distribution
        </CardTitle>
        <CardDescription>
          {totalRatings > 0 
            ? `Total of ${totalRatings} rating${totalRatings !== 1 ? 's' : ''} received` 
            : "No ratings yet"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="rating"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}`}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="count" fill="#facc15" radius={8} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
