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

interface Agent {
  id: string;
  name: string;
  email: string;
  status: 'offline' | 'online' | 'available' | 'away' | 'in-chat';
  profilePic?: string;
  activeChats: number;
  totalChats: number;
  lastActive: Date;
  businessId: string;
}

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

interface AgentStatusOverviewProps {
  agents?: Agent[];
}

export function AgentStatusOverview({ agents = [] }: AgentStatusOverviewProps) {
  const [statusOverview, setStatusOverview] = useState<StatusOverview[]>([]);

  useEffect(() => {
    if (agents.length === 0) {
      // Fallback data if no agents provided
      setStatusOverview([
        {
          status: 'Available',
          count: 0,
          percentage: 0,
          color: 'green',
          icon: <UserCheck className="h-4 w-4" />,
          description: 'Ready to handle new chats'
        },
        {
          status: 'In Chat',
          count: 0,
          percentage: 0,
          color: 'blue',
          icon: <MessageSquare className="h-4 w-4" />,
          description: 'Currently helping customers'
        },
        {
          status: 'Away',
          count: 0,
          percentage: 0,
          color: 'yellow',
          icon: <Clock className="h-4 w-4" />,
          description: 'Temporarily unavailable'
        },
        {
          status: 'Offline',
          count: 0,
          percentage: 0,
          color: 'gray',
          icon: <WifiOff className="h-4 w-4" />,
          description: 'Not connected'
        }
      ]);
      return;
    }

    // Calculate status counts from real agent data
    const statusCounts = {
      available: agents.filter(a => a.status === 'available').length,
      'in-chat': agents.filter(a => a.status === 'in-chat').length,
      away: agents.filter(a => a.status === 'away').length,
      offline: agents.filter(a => a.status === 'offline').length,
      online: agents.filter(a => a.status === 'online').length
    };

    const total = agents.length;
    
    setStatusOverview([
      {
        status: 'Available',
        count: statusCounts.available,
        percentage: total > 0 ? Math.round((statusCounts.available / total) * 100) : 0,
        color: 'green',
        icon: <UserCheck className="h-4 w-4" />,
        description: 'Ready to handle new chats'
      },
      {
        status: 'In Chat',
        count: statusCounts['in-chat'],
        percentage: total > 0 ? Math.round((statusCounts['in-chat'] / total) * 100) : 0,
        color: 'blue',
        icon: <MessageSquare className="h-4 w-4" />,
        description: 'Currently helping customers'
      },
      {
        status: 'Away',
        count: statusCounts.away,
        percentage: total > 0 ? Math.round((statusCounts.away / total) * 100) : 0,
        color: 'yellow',
        icon: <Clock className="h-4 w-4" />,
        description: 'Temporarily unavailable'
      },
      {
        status: 'Offline',
        count: statusCounts.offline,
        percentage: total > 0 ? Math.round((statusCounts.offline / total) * 100) : 0,
        color: 'gray',
        icon: <WifiOff className="h-4 w-4" />,
        description: 'Not connected'
      }
    ]);
  }, [agents]);

  const [agentPerformance, setAgentPerformance] = useState<AgentPerformance[]>([]);

  useEffect(() => {
    // Convert agents to performance data
    const performance = agents.map(agent => ({
      name: agent.name,
      status: agent.status,
      chatsHandled: agent.totalChats,
      avgResponseTime: '1m 23s', // Would be calculated from real data
      efficiency: Math.floor(Math.random() * 20) + 80 // Mock efficiency
    }));
    
    setAgentPerformance(performance);
  }, [agents]);

  const getStatusColor = (color: string) => {
    switch (color) {
      case 'green':
        return 'text-green-600 bg-green-50 dark:bg-green-950 dark:text-green-400';
      case 'blue':
        return 'text-blue-600 bg-blue-50 dark:bg-blue-950 dark:text-blue-400';
      case 'yellow':
        return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-950 dark:text-yellow-400';
      case 'gray':
        return 'text-gray-600 bg-gray-50 dark:bg-gray-950 dark:text-gray-400';
      default:
        return 'text-gray-600 bg-gray-50 dark:bg-gray-950 dark:text-gray-400';
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
      case 'offline':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      {/* Status Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <Activity className="h-5 w-5 mr-2" />
            Agent Status Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {statusOverview.map((status, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${getStatusColor(status.color)}`}>
                    {status.icon}
                  </div>
                  <div>
                    <p className="font-medium">{status.status}</p>
                    <p className="text-sm text-muted-foreground">{status.description}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="font-semibold">{status.count}</p>
                    <p className="text-sm text-muted-foreground">{status.percentage}%</p>
                  </div>
                  <div className="w-20">
                    <Progress 
                      value={status.percentage} 
                      className="h-2"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Agent Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Top Performers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {agentPerformance.slice(0, 5).map((agent, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-full">
                    <span className="text-xs font-medium">
                      {agent.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium">{agent.name}</p>
                    <div className="flex items-center space-x-2">
                      <Badge variant={getStatusBadgeVariant(agent.status)} className="text-xs">
                        {agent.status}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {agent.chatsHandled} chats
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{agent.avgResponseTime}</p>
                  <p className="text-xs text-muted-foreground">avg response</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
