"use client";

import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export const description = "Escalations bar chart for the last 3 months";

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
} satisfies ChartConfig;

interface EscalationData {
  date: string;
  total: number;
  escalated: number;
  pending: number;
  resolved: number;
}

interface SummaryData {
  totalOverall: number;
  totalEscalated: number;
  totalPending: number;
  totalResolved: number;
}

interface ChartBarInteractiveProps {
  businessId: string;
}

export function ChartBarInteractive({ businessId }: ChartBarInteractiveProps) {
  const [activeChart, setActiveChart] =
    React.useState<keyof typeof chartConfig>("total");
  const [chartData, setChartData] = React.useState<EscalationData[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [summary, setSummary] = React.useState<SummaryData>({
    totalOverall: 0,
    totalEscalated: 0,
    totalPending: 0,
    totalResolved: 0,
  });

  React.useEffect(() => {
    const fetchEscalationsData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/analytics/escalations/${businessId}/per-day?period=3months`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch escalations data");
        }

        const result = await response.json();

        if (result.success) {
          setChartData(result.data.dailyData);
          setSummary(result.data.summary);
        }
      } catch (error) {
        console.error("Error fetching escalations data:", error);
        setChartData([]);
        setSummary({
          totalOverall: 0,
          totalEscalated: 0,
          totalPending: 0,
          totalResolved: 0,
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (businessId) {
      fetchEscalationsData();
    }
  }, [businessId]);

  const total = React.useMemo(
    () => ({
      total: summary.totalOverall,
      escalated: summary.totalEscalated,
      pending: summary.totalPending,
      resolved: summary.totalResolved,
    }),
    [summary]
  );

  return (
    <Card className="pt-0 bg-card border-muted-gray shadow-none">
      <CardHeader className="flex flex-col items-stretch border-b !p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 pt-4 pb-3 sm:!py-0">
          <CardTitle className="text-secondary-foreground">
            Escalations Bar Chart
          </CardTitle>
          <CardDescription>
            Showing escalation data for the last 3 months
          </CardDescription>
        </div>
        <div className="flex">
          {(["total", "escalated", "pending", "resolved"] as const).map(
            (key) => {
              const chart = key as keyof typeof chartConfig;
              return (
                <button
                  key={chart}
                  data-active={activeChart === chart}
                  className="data-[active=true]:bg-muted/50 relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l sm:border-t-0 sm:border-l sm:px-8 sm:py-6 cursor-pointer"
                  onClick={() => setActiveChart(chart)}
                >
                  <span className="text-muted-foreground text-xs">
                    {chartConfig[chart].label}
                  </span>
                  <span className="text-lg leading-none font-bold sm:text-3xl">
                    {total[key].toLocaleString()}
                  </span>
                </button>
              );
            }
          )}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        {isLoading ? (
          <div className="flex h-[250px] items-center justify-center">
            <p className="text-muted-foreground">Loading chart data...</p>
          </div>
        ) : chartData.length === 0 ? (
          <div className="flex h-[250px] items-center justify-center">
            <p className="text-muted-foreground">
              No escalation data available
            </p>
          </div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[250px] w-full"
          >
            <BarChart
              accessibilityLayer
              data={chartData}
              margin={{
                left: 12,
                right: 12,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  });
                }}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    className="w-[150px]"
                    labelFormatter={(value) => {
                      return new Date(value).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      });
                    }}
                  />
                }
              />
              <Bar dataKey={activeChart} fill={`var(--color-${activeChart})`} />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
