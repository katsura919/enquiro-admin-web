'use client';

import { useState, useEffect } from 'react';
import { AgentStatusOverview } from './components/AgentStatusOverview';
import { AgentsTable } from './components/AgentsTable';
import { AgentStatusCards } from './components/AgentStatusCards';
import { QueueMonitor } from './components/QueueMonitor';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { useAgentDashboard } from '@/hooks/useAgentDashboard';
import { useAuth } from '@/lib/auth';
import { Wifi, WifiOff } from 'lucide-react';

export default function AgentDashboardPage() {
  const { user, isLoading: authLoading } = useAuth();
  
  const {
    agents,
    queueData,
    loading,
    connected,
    getOnlineAgents,
    totalAgents,
    onlineAgents,
    availableAgents,
    busyAgents,
    awayAgents,
    offlineAgents
  } = useAgentDashboard(user?.businessId || '');

  // Show loading state while auth or agent data is loading
  if (authLoading || loading) {
    return (
      <div className="w-full p-6 space-y-6">
        {/* Status Cards Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          <div className="lg:col-span-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <Card className="border-none" key={i}>
                  <CardHeader className="pb-3">
                    <Skeleton className="h-4 w-24" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-10 w-16" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          
          {/* Queue Monitor Skeleton */}
          <div className="lg:col-span-1">
            <Card className='border-muted-gray'>
              <CardHeader className="pb-3">
                <Skeleton className="h-4 w-28" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-10 w-16" />
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Agents Table Skeleton */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-9 w-64" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <div className="p-4 space-y-3">
                {/* Table Header */}
                <div className="grid grid-cols-2 gap-4 pb-2 border-b">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-16" />
                </div>
                
                {/* Table Rows */}
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="grid grid-cols-2 gap-4 items-center py-3">
                    <div className="flex items-center space-x-3">
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-48" />
                      </div>
                    </div>
                    <Skeleton className="h-6 w-20" />
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show message if user is not authenticated
  if (!user) {
    return (
      <div className="w-full p-6 flex items-center justify-center min-h-[400px]">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Authentication Required</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-muted-foreground">
              Please log in to access the agent dashboard.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full p-6 space-y-6">


      {/* Status Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Agent Status Cards - spans 4 columns */}
        <div className="lg:col-span-4">
          <AgentStatusCards 
            agents={agents}
            availableCount={availableAgents}
            busyCount={busyAgents}
            awayCount={awayAgents}
            offlineCount={offlineAgents}
          />
        </div>
        
        {/* Queue Monitor - spans 1 column */}
        <div className="lg:col-span-1">
          <QueueMonitor queueData={queueData} />
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 gap-6">
        {/* Agents Table */}
        <div className="w-full">
          <Tabs defaultValue="agents" className="space-y-4">
            
            <TabsContent value="agents" className="space-y-4">
              <AgentsTable agents={agents} />
            </TabsContent>
            
            <TabsContent value="online" className="space-y-4">
              <AgentsTable agents={getOnlineAgents()} filterOnline={true} />
            </TabsContent>
            
            <TabsContent value="status-overview" className="space-y-4">
              <AgentStatusOverview agents={agents} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
