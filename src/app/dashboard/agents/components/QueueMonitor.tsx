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
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <Users className="h-5 w-5 mr-2" />
          Customer Queue
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-950 rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-full">
              <Clock className="h-4 w-4 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <p className="text-sm font-medium">Waiting</p>
              <p className="text-xs text-muted-foreground">In queue</p>
            </div>
          </div>
          <div className="text-2xl font-bold">{queueData.waiting}</div>
        </div>
      </CardContent>
    </Card>
  );
}
