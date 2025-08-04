'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, UserCheck, UserX, Clock } from 'lucide-react';

interface StatusCardData {
  title: string;
  value: number;
  change: number;
  icon: React.ReactNode;
  color: string;
}

export function AgentStatusCards() {
  const [statusData, setStatusData] = useState<StatusCardData[]>([
    {
      title: 'Total Agents',
      value: 24,
      change: +2,
      icon: <Users className="h-4 w-4" />,
      color: 'blue'
    },
    {
      title: 'Online Agents',
      value: 18,
      change: +3,
      icon: <UserCheck className="h-4 w-4" />,
      color: 'green'
    },
    {
      title: 'Available',
      value: 12,
      change: -1,
      icon: <Clock className="h-4 w-4" />,
      color: 'yellow'
    },
    {
      title: 'Offline',
      value: 6,
      change: -1,
      icon: <UserX className="h-4 w-4" />,
      color: 'red'
    }
  ]);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setStatusData(prev => prev.map(item => ({
        ...item,
        value: Math.max(0, item.value + Math.floor(Math.random() * 3) - 1),
        change: Math.floor(Math.random() * 5) - 2
      })));
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

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
      default:
        return 'text-gray-600 bg-gray-50 dark:bg-gray-950 dark:text-gray-400';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {statusData.map((item, index) => (
        <Card key={index} className="relative overflow-hidden">
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
