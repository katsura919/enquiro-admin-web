'use client';

import { useState, useEffect } from 'react';
import { AgentStatusOverview } from './components/AgentStatusOverview';
import { AgentsTable } from './components/AgentsTable';
import { QueueMonitor } from './components/QueueMonitor';
import { AgentStatusCards } from './components/AgentStatusCards';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';

export default function AgentDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [agents, setAgents] = useState([]);
  const [queueData, setQueueData] = useState({
    waiting: 0,
    inProgress: 0,
    resolved: 0
  });

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="w-full p-6 space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-96" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-64 w-full" />
              </CardContent>
            </Card>
          </div>
          <div>
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-64 w-full" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full p-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Agent Dashboard</h1>
        <p className="text-muted-foreground">
          Monitor agent performance, status, and customer queue in real-time
        </p>
      </div>

      {/* Status Cards */}
      <AgentStatusCards />

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Agents Table */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="agents" className="space-y-4">
            <TabsList>
              <TabsTrigger value="agents">All Agents</TabsTrigger>
              <TabsTrigger value="online">Online Only</TabsTrigger>
              <TabsTrigger value="status-overview">Status Overview</TabsTrigger>
            </TabsList>
            
            <TabsContent value="agents" className="space-y-4">
              <AgentsTable />
            </TabsContent>
            
            <TabsContent value="online" className="space-y-4">
              <AgentsTable filterOnline={true} />
            </TabsContent>
            
            <TabsContent value="status-overview" className="space-y-4">
              <AgentStatusOverview />
            </TabsContent>
          </Tabs>
        </div>

        {/* Queue Monitor */}
        <div className="space-y-6">
          <QueueMonitor />
          
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md text-sm font-medium transition-colors">
                Add New Agent
              </button>
              <button className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/80 px-4 py-2 rounded-md text-sm font-medium transition-colors">
                Broadcast Message
              </button>
              <button className="w-full bg-outline hover:bg-accent px-4 py-2 rounded-md text-sm font-medium transition-colors">
                Generate Report
              </button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
