'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Clock, 
  Users, 
  CheckCircle, 
  AlertCircle,
  TrendingUp,
  TrendingDown
} from 'lucide-react';

interface QueueData {
  waiting: number;
  inProgress: number;
  resolved: number;
  avgWaitTime: string;
  avgResponseTime: string;
  satisfactionRate: number;
}

export function QueueMonitor() {
  const [queueData, setQueueData] = useState<QueueData>({
    waiting: 15,
    inProgress: 8,
    resolved: 42,
    avgWaitTime: '2m 34s',
    avgResponseTime: '45s',
    satisfactionRate: 94
  });

  const [trend, setTrend] = useState({
    waiting: -2,
    inProgress: +1,
    resolved: +12
  });

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setQueueData(prev => ({
        ...prev,
        waiting: Math.max(0, prev.waiting + Math.floor(Math.random() * 5) - 2),
        inProgress: Math.max(0, prev.inProgress + Math.floor(Math.random() * 3) - 1),
        resolved: prev.resolved + Math.floor(Math.random() * 3),
        satisfactionRate: Math.min(100, Math.max(80, prev.satisfactionRate + Math.floor(Math.random() * 3) - 1))
      }));

      setTrend({
        waiting: Math.floor(Math.random() * 5) - 2,
        inProgress: Math.floor(Math.random() * 3) - 1,
        resolved: Math.floor(Math.random() * 4) + 1
      });
    }, 15000); // Update every 15 seconds

    return () => clearInterval(interval);
  }, []);

  const totalCustomers = queueData.waiting + queueData.inProgress;

  return (
    <div className="space-y-4">
      {/* Queue Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <Users className="h-5 w-5 mr-2" />
            Customer Queue
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Main Queue Stats */}
          <div className="grid grid-cols-1 gap-4">
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
              <div className="text-right">
                <div className="text-2xl font-bold">{queueData.waiting}</div>
                <div className="flex items-center text-xs">
                  {trend.waiting >= 0 ? (
                    <TrendingUp className="h-3 w-3 text-red-500 mr-1" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-green-500 mr-1" />
                  )}
                  <span className={trend.waiting >= 0 ? 'text-red-500' : 'text-green-500'}>
                    {Math.abs(trend.waiting)}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-full">
                  <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm font-medium">In Progress</p>
                  <p className="text-xs text-muted-foreground">Being handled</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">{queueData.inProgress}</div>
                <div className="flex items-center text-xs">
                  {trend.inProgress >= 0 ? (
                    <TrendingUp className="h-3 w-3 text-blue-500 mr-1" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-blue-500 mr-1" />
                  )}
                  <span className="text-blue-500">
                    {Math.abs(trend.inProgress)}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 dark:bg-green-900 rounded-full">
                  <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-sm font-medium">Resolved Today</p>
                  <p className="text-xs text-muted-foreground">Completed</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">{queueData.resolved}</div>
                <div className="flex items-center text-xs">
                  <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                  <span className="text-green-500">+{trend.resolved}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Queue Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Queue Progress</span>
              <span>{totalCustomers} active customers</span>
            </div>
            <Progress 
              value={totalCustomers > 0 ? (queueData.inProgress / totalCustomers) * 100 : 0} 
              className="h-2"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0% idle</span>
              <span>100% capacity</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Performance Metrics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Avg. Wait Time</span>
              <Badge variant="outline">{queueData.avgWaitTime}</Badge>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Avg. Response Time</span>
              <Badge variant="outline">{queueData.avgResponseTime}</Badge>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Satisfaction Rate</span>
                <span className="text-sm font-bold">{queueData.satisfactionRate}%</span>
              </div>
              <Progress value={queueData.satisfactionRate} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Priority Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-red-600 dark:text-red-400">
            Priority Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          {queueData.waiting > 10 ? (
            <div className="space-y-2">
              <div className="flex items-center p-2 bg-red-50 dark:bg-red-950 rounded-lg">
                <AlertCircle className="h-4 w-4 text-red-500 mr-2" />
                <span className="text-sm">High queue volume detected</span>
              </div>
              <p className="text-xs text-muted-foreground pl-6">
                Consider adding more agents to reduce wait times
              </p>
            </div>
          ) : (
            <div className="flex items-center p-2 bg-green-50 dark:bg-green-950 rounded-lg">
              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
              <span className="text-sm">Queue levels normal</span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
