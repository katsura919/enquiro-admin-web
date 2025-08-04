'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Users, 
  Wifi, 
  WifiOff, 
  MessageSquare, 
  Clock,
  UserCheck,
  Activity
} from 'lucide-react';

interface StatusOverview {
  status: string;
  count: number;
  percentage: number;
  color: string;
  icon: React.ReactNode;
  description: string;
}

interface AgentPerformance {
  name: string;
  status: string;
  chatsHandled: number;
  avgResponseTime: string;
  efficiency: number;
}

export function AgentStatusOverview() {
  const [statusOverview, setStatusOverview] = useState<StatusOverview[]>([
    {
      status: 'Available',
      count: 12,
      percentage: 50,
      color: 'green',
      icon: <UserCheck className="h-4 w-4" />,
      description: 'Ready to handle new chats'
    },
    {
      status: 'In Chat',
      count: 6,
      percentage: 25,
      color: 'blue',
      icon: <MessageSquare className="h-4 w-4" />,
      description: 'Currently handling customers'
    },
    {
      status: 'Away',
      count: 3,
      percentage: 12.5,
      color: 'yellow',
      icon: <Clock className="h-4 w-4" />,
      description: 'Temporarily unavailable'
    },
    {
      status: 'Offline',
      count: 3,
      percentage: 12.5,
      color: 'gray',
      icon: <WifiOff className="h-4 w-4" />,
      description: 'Not currently working'
    }
  ]);

  const [topPerformers, setTopPerformers] = useState<AgentPerformance[]>([
    {
      name: 'Sarah Johnson',
      status: 'available',
      chatsHandled: 23,
      avgResponseTime: '32s',
      efficiency: 96
    },
    {
      name: 'Mike Chen',
      status: 'in-chat',
      chatsHandled: 18,
      avgResponseTime: '45s',
      efficiency: 92
    },
    {
      name: 'Emily Rodriguez',
      status: 'available',
      chatsHandled: 16,
      avgResponseTime: '38s',
      efficiency: 89
    },
    {
      name: 'Lisa Wang',
      status: 'in-chat',
      chatsHandled: 21,
      avgResponseTime: '28s',
      efficiency: 94
    }
  ]);

  const totalAgents = statusOverview.reduce((sum, status) => sum + status.count, 0);
  const onlineAgents = statusOverview
    .filter(s => s.status !== 'Offline')
    .reduce((sum, status) => sum + status.count, 0);

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'green':
        return {
          bg: 'bg-green-50 dark:bg-green-950',
          border: 'border-green-200 dark:border-green-800',
          text: 'text-green-700 dark:text-green-300',
          icon: 'text-green-600 dark:text-green-400'
        };
      case 'blue':
        return {
          bg: 'bg-blue-50 dark:bg-blue-950',
          border: 'border-blue-200 dark:border-blue-800',
          text: 'text-blue-700 dark:text-blue-300',
          icon: 'text-blue-600 dark:text-blue-400'
        };
      case 'yellow':
        return {
          bg: 'bg-yellow-50 dark:bg-yellow-950',
          border: 'border-yellow-200 dark:border-yellow-800',
          text: 'text-yellow-700 dark:text-yellow-300',
          icon: 'text-yellow-600 dark:text-yellow-400'
        };
      default:
        return {
          bg: 'bg-gray-50 dark:bg-gray-950',
          border: 'border-gray-200 dark:border-gray-800',
          text: 'text-gray-700 dark:text-gray-300',
          icon: 'text-gray-600 dark:text-gray-400'
        };
    }
  };

  const getStatusBadgeVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case 'available':
        return 'default';
      case 'in-chat':
        return 'secondary';
      case 'away':
        return 'outline';
      default:
        return 'destructive';
    }
  };

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setStatusOverview(prev => prev.map(status => {
        const change = Math.floor(Math.random() * 3) - 1;
        const newCount = Math.max(0, status.count + change);
        return {
          ...status,
          count: newCount,
          percentage: totalAgents > 0 ? (newCount / totalAgents) * 100 : 0
        };
      }));
    }, 20000);

    return () => clearInterval(interval);
  }, [totalAgents]);

  return (
    <div className="space-y-6">
      {/* Status Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <Activity className="h-5 w-5 mr-2" />
            Agent Status Distribution
          </CardTitle>
          <div className="text-sm text-muted-foreground">
            {onlineAgents} of {totalAgents} agents online ({Math.round((onlineAgents / totalAgents) * 100)}%)
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {statusOverview.map((status, index) => {
            const colors = getColorClasses(status.color);
            return (
              <div 
                key={index}
                className={`p-4 rounded-lg border ${colors.bg} ${colors.border}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <div className={colors.icon}>
                      {status.icon}
                    </div>
                    <div>
                      <div className={`font-medium ${colors.text}`}>
                        {status.status}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {status.description}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-xl font-bold ${colors.text}`}>
                      {status.count}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {status.percentage.toFixed(1)}%
                    </div>
                  </div>
                </div>
                <Progress 
                  value={status.percentage} 
                  className="h-2 mt-2"
                />
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Top Performers */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Top Performing Agents</CardTitle>
          <div className="text-sm text-muted-foreground">
            Based on today's performance metrics
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topPerformers.map((agent, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-8 h-8 bg-primary text-primary-foreground rounded-full text-sm font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-medium">{agent.name}</div>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Badge variant={getStatusBadgeVariant(agent.status)} className="text-xs capitalize">
                        {agent.status}
                      </Badge>
                      <span>•</span>
                      <span>{agent.chatsHandled} chats</span>
                    </div>
                  </div>
                </div>
                <div className="text-right space-y-1">
                  <div className="text-sm font-medium">
                    {agent.efficiency}% efficiency
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Avg: {agent.avgResponseTime}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Stats</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {Math.round((onlineAgents / totalAgents) * 100)}%
              </div>
              <div className="text-sm text-muted-foreground">Online Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {statusOverview.find(s => s.status === 'In Chat')?.count || 0}
              </div>
              <div className="text-sm text-muted-foreground">Active Chats</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {topPerformers.reduce((sum, agent) => sum + agent.chatsHandled, 0)}
              </div>
              <div className="text-sm text-muted-foreground">Total Chats Today</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                92%
              </div>
              <div className="text-sm text-muted-foreground">Avg Efficiency</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
