'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, UserCheck, UserX, Clock, MessageSquare, User } from 'lucide-react';

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
  const onlineAgents = agents.length - offlineCount;
  
  const [statusData, setStatusData] = useState<StatusCardData[]>([]);

  useEffect(() => {
    const newStatusData: StatusCardData[] = [
      {
        title: 'Online Agents',
        value: onlineAgents,
        icon: <UserCheck className="h-4 w-4" />,
        color: 'green'
      },
      {
        title: 'Away',
        value: awayCount,
        icon: <Clock className="h-4 w-4" />,
        color: 'orange'
      },
      {
        title: 'Available',
        value: availableCount,
        icon: <User className="h-4 w-4" />,
        color: 'blue'
      },
      {
        title: 'In Chat',
        value: busyCount,
        icon: <MessageSquare className="h-4 w-4" />,
        color: 'purple'
      }
    ];
    
    setStatusData(newStatusData);
  }, [onlineAgents, awayCount, availableCount, busyCount]);

  const getGradientClasses = (color: string) => {
    switch (color) {
      case 'green':
        return 'border-0 shadow-sm bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/20 dark:to-green-800/20';
      case 'blue':
        return 'border-0 shadow-sm bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/20 dark:to-blue-800/20';
      case 'yellow':
        return 'border-0 shadow-sm bg-gradient-to-br from-yellow-100 to-yellow-200 dark:from-yellow-900/20 dark:to-yellow-800/20';
      case 'orange':
        return 'border-0 shadow-sm bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-900/20 dark:to-orange-800/20';
      case 'red':
        return 'border-0 shadow-sm bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900/20 dark:to-red-800/20';
      case 'purple':
        return 'border-0 shadow-sm bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/20 dark:to-purple-800/20';
      default:
        return 'border-0 shadow-sm bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900/20 dark:to-gray-800/20';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {statusData.map((item, index) => (
        <Card key={index} className={getGradientClasses(item.color)}>
          <CardHeader className="pb-3 px-6 pt-6">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              {item.icon}
              {item.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="px-6 pb-6">
            <div className="text-2xl font-bold text-foreground">{item.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
