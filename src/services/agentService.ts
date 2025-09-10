import api from '@/utils/api';

export interface Agent {
  _id: string;
  businessId: string;
  name: string;
  email: string;
  phone?: string;
  profilePic?: string;
  role: string;
  createdAt: string;
  deletedAt?: string | null;
}

export interface CreateAgentData {
  name: string;
  email: string;
  phone?: string;
  profilePic?: string;
  role: string;
  password: string;
  businessId: string;
}

export interface UpdateAgentData {
  name?: string;
  email?: string;
  phone?: string;
  profilePic?: string;
  role?: string;
}

export const agentService = {
  // Get all agents (optionally by business)
  getAgents: async (businessId?: string): Promise<Agent[]> => {
    const params = businessId ? { businessId } : {};
    const response = await api.get('/agent', { params });
    return response.data;
  },

  // Get agents by business ID
  getAgentsByBusiness: async (businessId: string): Promise<Agent[]> => {
    const response = await api.get(`/agent/${businessId}`);
    return response.data;
  },

  // Get agent by ID
  getAgentById: async (id: string): Promise<Agent> => {
    const response = await api.get(`/agent/${id}`);
    return response.data;
  },

  // Create a new agent
  createAgent: async (data: CreateAgentData): Promise<Agent> => {
    const response = await api.post('/agent', data);
    return response.data;
  },

  // Update an agent
  updateAgent: async (id: string, data: UpdateAgentData): Promise<Agent> => {
    const response = await api.put(`/agent/${id}`, data);
    return response.data;
  },

  // Soft delete an agent
  deleteAgent: async (id: string): Promise<{ message: string }> => {
    const response = await api.delete(`/agent/${id}`);
    return response.data;
  },

  // Restore a deleted agent
  restoreAgent: async (id: string): Promise<{ message: string; agent: Agent }> => {
    const response = await api.patch(`/agent/${id}/restore`);
    return response.data;
  },

  // Search agents by name
  searchAgents: async (search: string, businessId?: string): Promise<Agent[]> => {
    const params: any = { search };
    if (businessId) params.businessId = businessId;
    const response = await api.get('/agent/search', { params });
    return response.data;
  },

  // Get agent info using token
  getAgentInfo: async (): Promise<Agent> => {
    const response = await api.get('/agent/info');
    return response.data;
  }
};
