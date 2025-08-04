'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
// Simple avatar component replacement   
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { 
  Search, 
  MoreHorizontal, 
  MessageSquare, 
  UserCheck, 
  UserX,
  Clock,
  Wifi,
  WifiOff
} from 'lucide-react';

interface Agent {
  id: string;
  name: string;
  email: string;
  status: 'online' | 'offline' | 'available' | 'away' | 'in-chat';
  profilePic?: string;
  activeChats: number;
  totalChats: number;
  lastActive: Date;
  businessId: string;
}

interface AgentsTableProps {
  filterOnline?: boolean;
}

export function AgentsTable({ filterOnline = false }: AgentsTableProps) {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  // Mock data - replace with actual API call
  useEffect(() => {
    const mockAgents: Agent[] = [
      {
        id: '1',
        name: 'Sarah Johnson',
        email: 'sarah.johnson@company.com',
        status: 'available',
        profilePic: '',
        activeChats: 3,
        totalChats: 47,
        lastActive: new Date(),
        businessId: 'bus1'
      },
      {
        id: '2',
        name: 'Mike Chen',
        email: 'mike.chen@company.com',
        status: 'in-chat',
        profilePic: '',
        activeChats: 5,
        totalChats: 32,
        lastActive: new Date(Date.now() - 300000), // 5 minutes ago
        businessId: 'bus1'
      },
      {
        id: '3',
        name: 'Emily Rodriguez',
        email: 'emily.rodriguez@company.com',
        status: 'away',
        profilePic: '',
        activeChats: 1,
        totalChats: 28,
        lastActive: new Date(Date.now() - 900000), // 15 minutes ago
        businessId: 'bus1'
      },
      {
        id: '4',
        name: 'David Kim',
        email: 'david.kim@company.com',
        status: 'offline',
        profilePic: '',
        activeChats: 0,
        totalChats: 19,
        lastActive: new Date(Date.now() - 3600000), // 1 hour ago
        businessId: 'bus1'
      },
      {
        id: '5',
        name: 'Lisa Wang',
        email: 'lisa.wang@company.com',
        status: 'online',
        profilePic: '',
        activeChats: 2,
        totalChats: 41,
        lastActive: new Date(Date.now() - 60000), // 1 minute ago
        businessId: 'bus1'
      }
    ];

    setTimeout(() => {
      setAgents(mockAgents);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online':
      case 'available':
        return <Wifi className="h-3 w-3" />;
      case 'in-chat':
        return <MessageSquare className="h-3 w-3" />;
      case 'away':
        return <Clock className="h-3 w-3" />;
      case 'offline':
        return <WifiOff className="h-3 w-3" />;
      default:
        return <WifiOff className="h-3 w-3" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
      case 'available':
        return 'bg-green-500';
      case 'in-chat':
        return 'bg-blue-500';
      case 'away':
        return 'bg-yellow-500';
      case 'offline':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case 'online':
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

  const formatLastActive = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const filteredAgents = agents
    .filter(agent => filterOnline ? agent.status !== 'offline' : true)
    .filter(agent => 
      agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">
            {filterOnline ? 'Online Agents' : 'All Agents'}
          </CardTitle>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search agents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 w-64"
              />
            </div>
            <Button size="sm">Add Agent</Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Agent</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Active Chats</TableHead>
                <TableHead>Total Chats</TableHead>
                <TableHead>Last Active</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse"></div>
                        <div className="space-y-1">
                          <div className="h-4 w-32 bg-gray-200 animate-pulse rounded"></div>
                          <div className="h-3 w-48 bg-gray-200 animate-pulse rounded"></div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell><div className="h-6 w-16 bg-gray-200 animate-pulse rounded"></div></TableCell>
                    <TableCell><div className="h-4 w-8 bg-gray-200 animate-pulse rounded"></div></TableCell>
                    <TableCell><div className="h-4 w-8 bg-gray-200 animate-pulse rounded"></div></TableCell>
                    <TableCell><div className="h-4 w-16 bg-gray-200 animate-pulse rounded"></div></TableCell>
                    <TableCell><div className="h-4 w-4 bg-gray-200 animate-pulse rounded"></div></TableCell>
                  </TableRow>
                ))
              ) : filteredAgents.length > 0 ? (
                filteredAgents.map((agent) => (
                  <TableRow key={agent.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-medium">
                            {agent.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div 
                            className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-background ${getStatusColor(agent.status)}`}
                          />
                        </div>
                        <div>
                          <div className="font-medium">{agent.name}</div>
                          <div className="text-sm text-muted-foreground">{agent.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(agent.status)} className="capitalize">
                        <span className="flex items-center gap-1">
                          {getStatusIcon(agent.status)}
                          {agent.status}
                        </span>
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <MessageSquare className="h-4 w-4 mr-1 text-muted-foreground" />
                        {agent.activeChats}
                      </div>
                    </TableCell>
                    <TableCell>{agent.totalChats}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatLastActive(agent.lastActive)}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <UserCheck className="mr-2 h-4 w-4" />
                            View Profile
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <MessageSquare className="mr-2 h-4 w-4" />
                            Send Message
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <UserX className="mr-2 h-4 w-4" />
                            Deactivate
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No agents found matching your search.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
