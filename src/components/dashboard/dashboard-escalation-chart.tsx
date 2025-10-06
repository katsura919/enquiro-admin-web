"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export const description = "Escalations per day chart"

const chartConfig = {
  total: {
    label: "Total Overall",
    color: "#2563eb", // Blue
  },
  escalated: {
    label: "Escalated",
    color: "#ef4444", // Red
  },
  pending: {
    label: "Pending",
    color: "#eab308", // Yellow
  },
  resolved: {
    label: "Resolved",
    color: "#22c55e", // Green
  },
} satisfies ChartConfig

interface EscalationData {
  date: string
  total: number
  escalated: number
  pending: number
  resolved: number
}

interface SummaryData {
  totalOverall: number
  totalEscalated: number
  totalPending: number
  totalResolved: number
}

interface ChartAreaInteractiveProps {
  businessId: string
}

export function ChartAreaInteractive({ businessId }: ChartAreaInteractiveProps) {
  const [timeRange, setTimeRange] = React.useState("7days")
  const [chartData, setChartData] = React.useState<EscalationData[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [summary, setSummary] = React.useState<SummaryData>({
    totalOverall: 0,
    totalEscalated: 0,
    totalPending: 0,
    totalResolved: 0
  })

  React.useEffect(() => {
    const fetchEscalationsData = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/analytics/escalations/${businessId}/per-day?period=${timeRange}`
        )
        
        if (!response.ok) {
          throw new Error('Failed to fetch escalations data')
        }

        const result = await response.json()
        
        if (result.success) {
          setChartData(result.data.dailyData)
          setSummary(result.data.summary)
        }
      } catch (error) {
        console.error('Error fetching escalations data:', error)
        setChartData([])
        setSummary({
          totalOverall: 0,
          totalEscalated: 0,
          totalPending: 0,
          totalResolved: 0
        })
      } finally {
        setIsLoading(false)
      }
    }

    if (businessId) {
      fetchEscalationsData()
    }
  }, [businessId, timeRange])

  const getPeriodLabel = () => {
    switch (timeRange) {
      case "3months":
        return "Last 3 months (including today)"
      case "30days":
        return "Last 30 days (including today)"
      case "7days":
        return "Last 7 days (including today)"
      default:
        return "Select period"
    }
  }

  return (
    <Card className="pt-0 bg-card border-muted-gray shadow-none">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle className="text-secondary-foreground">Escalations Overview</CardTitle>
          <CardDescription>
            View escalation trends over time.
          </CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger
            className="w-[160px] rounded-lg sm:ml-auto"
            aria-label="Select time range"
          >
            <SelectValue placeholder="Last 7 days" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="3months" className="rounded-lg">
              Last 3 months
            </SelectItem>
            <SelectItem value="30days" className="rounded-lg">
              Last 30 days
            </SelectItem>
            <SelectItem value="7days" className="rounded-lg">
              Last 7 days
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        {isLoading ? (
          <div className="flex h-[250px] items-center justify-center">
            <p className="text-muted-foreground">Loading chart data...</p>
          </div>
        ) : chartData.length === 0 ? (
          <div className="flex h-[250px] items-center justify-center">
            <p className="text-muted-foreground">No escalation data available</p>
          </div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[250px] w-full"
          >
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="fillTotal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-total)" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="var(--color-total)" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="fillEscalated" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-escalated)" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="var(--color-escalated)" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="fillPending" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-pending)" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="var(--color-pending)" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="fillResolved" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-resolved)" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="var(--color-resolved)" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) => {
                  const date = new Date(value)
                  return date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })
                }}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) => {
                      return new Date(value).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    }}
                    indicator="dot"
                  />
                }
              />
              <Area
                dataKey="total"
                type="natural"
                fill="url(#fillTotal)"
                stroke="var(--color-total)"
                strokeWidth={2}
                name="Total Overall"
              />
              <Area
                dataKey="escalated"
                type="natural"
                fill="url(#fillEscalated)"
                stroke="var(--color-escalated)"
                strokeWidth={2}
                name="Escalated"
              />
              <Area
                dataKey="pending"
                type="natural"
                fill="url(#fillPending)"
                stroke="var(--color-pending)"
                strokeWidth={2}
                name="Pending"
              />
              <Area
                dataKey="resolved"
                type="natural"
                fill="url(#fillResolved)"
                stroke="var(--color-resolved)"
                strokeWidth={2}
                name="Resolved"
              />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
