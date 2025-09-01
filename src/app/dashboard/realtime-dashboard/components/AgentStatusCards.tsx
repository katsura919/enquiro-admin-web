'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, UserCheck, UserX, Clock, MessageSquare } from 'lucide-react';

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

interface StatusCardData {
  title: string;
  value: number;
  change: number;
  icon: React.ReactNode;
  color: string;
}

interface AgentStatusCardsProps {
  agents?: Agent[];
  availableCount?: number;
  busyCount?: number;
  awayCount?: number;
  offlineCount?: number;
}

export function AgentStatusCards({ 
  agents = [], 
  availableCount = 0, 
  busyCount = 0, 
  awayCount = 0, 
  offlineCount = 0 
}: AgentStatusCardsProps) {
  const totalAgents = agents.length;
  const onlineAgents = totalAgents - offlineCount;
  
  const [statusData, setStatusData] = useState<StatusCardData[]>([]);

  useEffect(() => {
    const newStatusData: StatusCardData[] = [
      {
        title: 'Total Agents',
        value: totalAgents,
        change: 0, // Would calculate from previous state in real app
        icon: <Users className="h-4 w-4" />,
        color: 'blue'
      },
      {
        title: 'Online Agents',
        value: onlineAgents,
        change: 0,
        icon: <UserCheck className="h-4 w-4" />,
        color: 'green'
      },
      {
        title: 'Available',
        value: availableCount,
        change: 0,
        icon: <Clock className="h-4 w-4" />,
        color: 'yellow'
      },
      {
        title: 'In Chat',
        value: busyCount,
        change: 0,
        icon: <MessageSquare className="h-4 w-4" />,
        color: 'purple'
      }
    ];
    
    setStatusData(newStatusData);
  }, [totalAgents, onlineAgents, availableCount, busyCount]);

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'green':
        return 'text-green-600 bg-green-50 dark:bg-green-950 dark:text-green-400';
      case 'blue':
        return 'text-blue-600 bg-blue-50 dark:bg-blue-950 dark:text-blue-400';
      case 'yellow':
        return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-950 dark:text-yellow-400';
      case 'red':
        return 'text-red-600 bg-red-50 dark:bg-red-950 dark:text-red-400';
      case 'purple':
        return 'text-purple-600 bg-purple-50 dark:bg-purple-950 dark:text-purple-400';
      default:
        return 'text-gray-600 bg-gray-50 dark:bg-gray-950 dark:text-gray-400';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {statusData.map((item, index) => (
        <Card key={index} className="relative overflow-hidden border-border ">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {item.title}
            </CardTitle>
            <div className={`p-2 rounded-full ${getColorClasses(item.color)}`}>
              {item.icon}
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{item.value}</div>
              <Badge 
                variant={item.change >= 0 ? "default" : "destructive"}
                className="text-xs"
              >
                {item.change >= 0 ? '+' : ''}{item.change}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {item.change >= 0 ? 'Increase' : 'Decrease'} from last hour
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
