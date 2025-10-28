"use client";

import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Cell } from "recharts";

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
import api from "@/utils/api";

const chartConfig = {
  count: {
    label: "Ratings",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

// Color gradient from red (1-star) to yellow (5-star)
const ratingColors = {
  "1 ⭐": "#ef4444", // Red
  "2 ⭐": "#f97316", // Orange
  "3 ⭐": "#f59e0b", // Amber
  "4 ⭐": "#eab308", // Yellow-600
  "5 ⭐": "#facc15", // Yellow
};

interface RatingsBarChartProps {
  businessId: string;
}

export function RatingsBarChart({ businessId }: RatingsBarChartProps) {
  const [chartData, setChartData] = useState<
    Array<{ rating: string; count: number }>
  >([]);
  const [loading, setLoading] = useState(true);
  const [totalRatings, setTotalRatings] = useState(0);

  useEffect(() => {
    const fetchRatingsDistribution = async () => {
      try {
        setLoading(true);
        const response = await api.get(
          `/analytics/ratings/${businessId}/distribution`
        );

        if (response.data.success) {
          const distribution = response.data.data.distribution;
          const formattedData = distribution.map(
            (item: { rating: number; count: number }) => ({
              rating: `${item.rating} ⭐`,
              count: item.count,
            })
          );

          setChartData(formattedData);

          // Calculate total ratings
          const total = distribution.reduce(
            (sum: number, item: { count: number }) => sum + item.count,
            0
          );
          setTotalRatings(total);
        }
      } catch (error) {
        console.error("Error fetching ratings distribution:", error);
        // Set default data with 0 counts
        setChartData([
          { rating: "1 ⭐", count: 0 },
          { rating: "2 ⭐", count: 0 },
          { rating: "3 ⭐", count: 0 },
          { rating: "4 ⭐", count: 0 },
          { rating: "5 ⭐", count: 0 },
        ]);
        setTotalRatings(0);
      } finally {
        setLoading(false);
      }
    };

    if (businessId) {
      fetchRatingsDistribution();
    }
  }, [businessId]);

  if (loading) {
    return (
      <Card className="h-full flex flex-col">
        <CardHeader className="shrink-0 pb-3 px-6 pt-6">
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5" />
            Ratings Distribution
          </CardTitle>
          <CardDescription>Loading ratings data...</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center flex-1 px-6 pb-6">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card shadow-none border-muted-gray h-full flex flex-col">
      <CardHeader className="shrink-0 pb-3 px-6 pt-6">
        <CardTitle className="flex items-center gap-2 text-secondary-foreground">
          <Star className="h-5 w-5" />
          Ratings Distribution
        </CardTitle>
        <CardDescription>
          {totalRatings > 0
            ? `Total of ${totalRatings} rating${
                totalRatings !== 1 ? "s" : ""
              } received`
            : "No ratings yet"}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 px-6 pb-6">
        <ChartContainer
          config={chartConfig}
          className="h-full min-h-[200px] w-full"
        >
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              top: 20,
              right: 20,
              left: 20,
              bottom: 20,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="rating"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              fontSize={12}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}`}
              fontSize={12}
              width={30}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="count" radius={8} maxBarSize={60}>
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    ratingColors[entry.rating as keyof typeof ratingColors] ||
                    "#facc15"
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
