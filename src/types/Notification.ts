export type NotificationType = 'case_created' | 'rating_received';

export interface Notification {
  _id: string;
  businessId: string;
  type: NotificationType;
  
  // For case_created notifications
  caseId?: string;
  caseTitle?: string;
  casePriority?: string;
  customerId?: string;
  customerName?: string;
  agentId?: string;
  agentName?: string;
  
  // For rating_received notifications
  ratingId?: string;
  rating?: number;
  ratedAgentId?: string;
  ratedAgentName?: string;
  feedback?: string;
  
  read: boolean;
  link?: string;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationResponse {
  count: number;
}

export interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  fetchNotifications: () => Promise<void>;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (notificationId: string) => Promise<void>;
}
