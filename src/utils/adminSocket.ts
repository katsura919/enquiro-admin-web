import { io, Socket } from "socket.io-client";

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL;

let adminSocket: Socket | null = null;

export interface AgentStatusUpdate {
  agentId: string;
  status: 'offline' | 'online' | 'available' | 'away' | 'in-chat';
}

export function getAdminSocket() {
  if (!adminSocket) {
    adminSocket = io(SOCKET_URL, { 
      transports: ["websocket"],
      forceNew: true
    });
  }
  return adminSocket;
}

export function connectToBusinessStatusRoom(businessId: string) {
  const socket = getAdminSocket();
  
  // Join the business status room to monitor agent updates
  socket.emit('join_business_status', { businessId });
  
  console.log(`[ADMIN SOCKET] Joining business status room: ${businessId}`);
  
  return socket;
}

export function disconnectAdminSocket() {
  if (adminSocket) {
    adminSocket.disconnect();
    adminSocket = null;
  }
}

// Hook for monitoring agent status updates
export function useAgentStatusMonitoring(
  businessId: string, 
  onAgentStatusUpdate: (update: AgentStatusUpdate) => void
) {
  const socket = getAdminSocket();
  
  const connect = () => {
    // Join business status room
    socket.emit('join_business_status', { businessId });
    
    // Listen for agent status updates
    socket.on('agent_status_update', (data: AgentStatusUpdate) => {
      console.log('[ADMIN SOCKET] Agent status update:', data);
      onAgentStatusUpdate(data);
    });
    
    socket.on('connect', () => {
      console.log('[ADMIN SOCKET] Connected to server');
      // Re-join room on reconnection
      socket.emit('join_business_status', { businessId });
    });
    
    socket.on('disconnect', () => {
      console.log('[ADMIN SOCKET] Disconnected from server');
    });
  };
  
  const disconnect = () => {
    socket.off('agent_status_update');
    socket.off('connect');
    socket.off('disconnect');
  };
  
  return { connect, disconnect };
}
