'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Clock, 
  Users
} from 'lucide-react';

interface QueueData {
  waiting: number;
  inProgress: number;
  resolved: number;
  total: number;
}

interface QueueMonitorProps {
  queueData?: QueueData;
}

export function QueueMonitor({ queueData: propQueueData }: QueueMonitorProps) {
  const [queueData, setQueueData] = useState<QueueData>({
    waiting: 0,
    inProgress: 0,
    resolved: 0,
    total: 0,
    ...propQueueData
  });

  // Update queue data when props change
  useEffect(() => {
    if (propQueueData) {
      setQueueData(prev => ({
        ...prev,
        ...propQueueData
      }));
    }
  }, [propQueueData]);

  return (
    <Card className="border-0 shadow-sm bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-900/20 dark:to-orange-800/20">
      <CardHeader className="pb-3 px-6 pt-6">
        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
          <Clock className="h-4 w-4" />
          Waiting in Queue
        </CardTitle>
      </CardHeader>
      <CardContent className="px-6 pb-6">
        <div className="text-2xl font-bold text-foreground">{queueData.waiting}</div>
      </CardContent>
    </Card>
  );
}
