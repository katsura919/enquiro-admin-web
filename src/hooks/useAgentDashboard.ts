'use client';

import { useState, useEffect, useCallback } from 'react';
import { getAdminSocket } from '@/utils/adminSocket';

export interface Agent {
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

export interface AgentStatusUpdate {
  agentId: string;
  status: 'offline' | 'online' | 'available' | 'away' | 'in-chat';
}

export interface QueueData {
  waiting: number;
  inProgress: number;
  resolved: number;
  total: number;
  avgWaitTime?: string;
  avgResponseTime?: string;
  satisfactionRate?: number;
  updatedAt?: Date;
}

export function useAgentDashboard(businessId: string) {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [queueData, setQueueData] = useState<QueueData>({
    waiting: 0,
    inProgress: 0,
    resolved: 0,
    total: 0,
    updatedAt: new Date()
  });
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(false);

  // Handle agent status updates from socket
  const handleAgentStatusUpdate = useCallback((update: AgentStatusUpdate) => {
    setAgents(prevAgents => 
      prevAgents.map(agent => 
        agent.id === update.agentId 
          ? { ...agent, status: update.status, lastActive: new Date() }
          : agent
      )
    );
  }, []);

  // Handle initial agent statuses from socket
  const handleInitialAgentStatuses = useCallback((statuses: any[]) => {
    const agentData: Agent[] = statuses.map(status => ({
      id: status.agentId._id || status.agentId,
      name: status.agentId.name || 'Unknown Agent',
      email: status.agentId.email || '',
      status: status.status,
      profilePic: status.agentId.profilePic || '',
      activeChats: 0, // This would need to be calculated from actual chat data
      totalChats: 0, // This would need to be fetched from chat history
      lastActive: new Date(status.lastActive),
      businessId: status.businessId
    }));
    
    setAgents(agentData);
    setLoading(false);
  }, []);

  // Handle initial queue status from socket
  const handleInitialQueueStatus = useCallback((queueStats: any) => {
    setQueueData(prev => ({
      ...prev,
      waiting: queueStats.waiting || 0,
      inProgress: queueStats.inProgress || 0,
      total: queueStats.total || 0,
      updatedAt: queueStats.updatedAt ? new Date(queueStats.updatedAt) : new Date()
    }));
  }, []);

  // Handle queue status updates from socket
  const handleQueueStatusUpdate = useCallback((queueStats: any) => {
    setQueueData(prev => ({
      ...prev,
      waiting: queueStats.waiting || 0,
      inProgress: queueStats.inProgress || 0,
      total: queueStats.total || 0,
      updatedAt: queueStats.updatedAt ? new Date(queueStats.updatedAt) : new Date()
    }));
  }, []);

  // Initialize socket connection and load initial data
  useEffect(() => {
    const socket = getAdminSocket();
    
    // Socket event listeners
    socket.on('connect', () => {
      console.log('[DASHBOARD] Connected to socket');
      setConnected(true);
      // Join business status room
      socket.emit('join_business_status', { businessId });
    });

    socket.on('disconnect', () => {
      console.log('[DASHBOARD] Disconnected from socket');
      setConnected(false);
    });

    socket.on('agent_status_update', handleAgentStatusUpdate);
    socket.on('initial_agent_statuses', handleInitialAgentStatuses);
    socket.on('initial_queue_status', handleInitialQueueStatus);
    socket.on('queue_status_update', handleQueueStatusUpdate);

    // Connect if not already connected
    if (!socket.connected) {
      socket.connect();
    } else {
      // Already connected, join room immediately
      socket.emit('join_business_status', { businessId });
    }

    // Cleanup
    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('agent_status_update', handleAgentStatusUpdate);
      socket.off('initial_agent_statuses', handleInitialAgentStatuses);
      socket.off('initial_queue_status', handleInitialQueueStatus);
      socket.off('queue_status_update', handleQueueStatusUpdate);
    };
  }, [businessId, handleAgentStatusUpdate, handleInitialAgentStatuses, handleInitialQueueStatus, handleQueueStatusUpdate]);

  // Update queue customers wait times - Removed since we only need numbers, not individual customer tracking

  // Calculate queue stats from agents (this useEffect can be removed since we get real data from socket)
  // Keeping it as fallback but prioritizing socket data
  useEffect(() => {
    const inChatCount = agents.filter(agent => agent.status === 'in-chat').length;
    
    // Only update if we don't have real queue data from socket
    setQueueData(prev => {
      if (prev.updatedAt && Date.now() - prev.updatedAt.getTime() < 5000) {
        return prev; // Keep socket data if it's recent
      }
      
      return {
        ...prev,
        inProgress: inChatCount,
        total: prev.waiting + inChatCount
      };
    });
  }, [agents]);

  // Get agents by status
  const getAgentsByStatus = useCallback((status: Agent['status']) => {
    return agents.filter(agent => agent.status === status);
  }, [agents]);

  // Get online agents
  const getOnlineAgents = useCallback(() => {
    return agents.filter(agent => 
      agent.status !== 'offline'
    );
  }, [agents]);

  return {
    agents,
    queueData,
    loading,
    connected,
    getAgentsByStatus,
    getOnlineAgents,
    // Additional utility functions
    totalAgents: agents.length,
    onlineAgents: getOnlineAgents().length,
    availableAgents: getAgentsByStatus('available').length,
    busyAgents: getAgentsByStatus('in-chat').length,
    awayAgents: getAgentsByStatus('away').length,
    offlineAgents: getAgentsByStatus('offline').length
  };
}
