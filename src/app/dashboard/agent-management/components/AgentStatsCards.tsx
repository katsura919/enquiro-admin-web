"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserCheck, UserX, Shield } from "lucide-react";

interface AgentStatsCardsProps {
  totalAgents: number;
  activeAgents: number;
  inactiveAgents: number;
  loading?: boolean;
}

export function AgentStatsCards({
  totalAgents,
  activeAgents,
  inactiveAgents,
  loading = false,
}: AgentStatsCardsProps) {
  const stats = [
    {
      title: "Total Agents",
      value: totalAgents,
      icon: Users,
      color: "white",
      bgColor: "",
    },
    {
      title: "Active Agents",
      value: activeAgents,
      icon: UserCheck,
      color: "white",
      bgColor: "",
    },
    {
      title: "Inactive Agents",
      value: inactiveAgents,
      icon: UserX,
      color: "white",
      bgColor: "",
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <Card className="border-border" key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                <div className="h-4 bg-muted animate-pulse rounded"></div>
              </CardTitle>
              <div className="h-4 w-4 bg-muted animate-pulse rounded"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-muted animate-pulse rounded mb-1"></div>
              <div className="h-3 bg-muted animate-pulse rounded w-20"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card
            key={index}
            className="bg-card border-border shadow-none"
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {index === 0 && "Total registered agents"}
                {index === 1 && "Currently active"}
                {index === 2 && "Deactivated accounts"}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
