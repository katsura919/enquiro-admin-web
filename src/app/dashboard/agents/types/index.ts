// Agent Dashboard Types
export interface Agent {
  id: string;
  businessId: string;
  name: string;
  email: string;
  phone?: string;
  profilePic?: string;
  password: string;
  role: string;
  createdAt: Date;
  deletedAt?: Date | null;
}

export interface AgentStatus {
  agentId: string;
  businessId: string;
  status: 'offline' | 'online' | 'available' | 'away' | 'in-chat';
  lastActive: Date;
}

export interface QueueData {
  waiting: number;
  inProgress: number;
  resolved: number;
  avgWaitTime: string;
  avgResponseTime: string;
  satisfactionRate: number;
}

export interface AgentWithStatus extends Agent {
  status: AgentStatus['status'];
  activeChats: number;
  totalChats: number;
  lastActive: Date;
}

export interface StatusCardData {
  title: string;
  value: number;
  change: number;
  icon: React.ReactNode;
  color: string;
}

export interface AgentPerformance {
  name: string;
  status: string;
  chatsHandled: number;
  avgResponseTime: string;
  efficiency: number;
}
