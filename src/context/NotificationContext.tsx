'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { Notification, NotificationContextType } from '@/types/Notification';

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000';

interface NotificationProviderProps {
  children: React.ReactNode;
  businessId?: string;
}

export function NotificationProvider({ children, businessId }: NotificationProviderProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);

  // Initialize socket connection
  useEffect(() => {
    if (!businessId) {
      console.log('[Notifications] ⏸️ Waiting for businessId...');
      return;
    }

    console.log('[Notifications] 🚀 Initializing socket connection...');
    console.log('[Notifications] 📍 SOCKET_URL:', SOCKET_URL);
    console.log('[Notifications] 🏢 Business ID:', businessId);

    const socketInstance = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
    });

    socketInstance.on('connect', () => {
      console.log('[Notifications] ✅ Socket connected successfully!');
      console.log('[Notifications] 🔌 Socket ID:', socketInstance.id);
      
      // Join notification room
      console.log('[Notifications] 🚪 Joining notification room...');
      socketInstance.emit('join_notification_room', { businessId });
      console.log('[Notifications] 📨 join_notification_room event emitted');
    });

    socketInstance.on('disconnect', () => {
      console.log('[Notifications] ❌ Socket disconnected');
    });

    socketInstance.on('connect_error', (error: any) => {
      console.error('[Notifications] ⚠️ Connection error:', error);
    });

    // Listen for new notifications
    socketInstance.on('new_notification', (notification: Notification) => {
      console.log('[Notifications] 🔔 New notification received!');
      console.log('[Notifications] 📬 Notification data:', notification);
      setNotifications((prev) => [notification, ...prev]);
      setUnreadCount((prev) => prev + 1);
    });

    // Listen for unread count updates
    socketInstance.on('unread_count', (data: { count: number }) => {
      console.log('[Notifications] 🔢 Unread count updated:', data.count);
      setUnreadCount(data.count);
    });

    // Listen for all notifications marked as read
    socketInstance.on('all_notifications_read', () => {
      console.log('[Notifications] ✅ All notifications marked as read');
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    });

    socketInstance.on('error', (error: any) => {
      console.error('[Notifications] ❌ Socket error:', error);
    });

    setSocket(socketInstance);
    console.log('[Notifications] 🎯 Socket instance saved to state');

    return () => {
      console.log('[Notifications] 🧹 Cleaning up socket connection...');
      if (socketInstance) {
        socketInstance.emit('leave_notification_room', { businessId });
        socketInstance.disconnect();
        console.log('[Notifications] ✅ Socket disconnected and cleaned up');
      }
    };
  }, [businessId]);

  // Fetch notifications from API
  const fetchNotifications = useCallback(async () => {
    if (!businessId) return;

    console.log('[Notifications] 📥 Fetching notifications from API...');
    setLoading(true);
    try {
      const response = await fetch(
        `${API_URL}/notifications?businessId=${businessId}&limit=50`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log('[Notifications] ✅ Notifications fetched:', data.length, 'items');
        setNotifications(data);
        
        // Fetch unread count
        const countResponse = await fetch(
          `${API_URL}/notifications/unread-count?businessId=${businessId}`
        );
        if (countResponse.ok) {
          const countData = await countResponse.json();
          console.log('[Notifications] 🔢 Unread count fetched:', countData.count);
          setUnreadCount(countData.count);
        }
      } else {
        console.error('[Notifications] ❌ Failed to fetch notifications:', response.status);
      }
    } catch (error) {
      console.error('[Notifications] ❌ Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  }, [businessId]);

  // Mark notification as read
  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      const response = await fetch(
        `${API_URL}/notifications/${notificationId}/read`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.ok) {
        setNotifications((prev) =>
          prev.map((n) => (n._id === notificationId ? { ...n, read: true } : n))
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));

        // Emit to socket as well
        if (socket && businessId) {
          socket.emit('mark_notification_read', { notificationId, businessId });
        }
      }
    } catch (error) {
      console.error('[Notifications] Error marking notification as read:', error);
    }
  }, [socket, businessId]);

  // Mark all notifications as read
  const markAllAsRead = useCallback(async () => {
    if (!businessId) return;

    try {
      const response = await fetch(`${API_URL}/notifications/read-all`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ businessId }),
      });

      if (response.ok) {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
        setUnreadCount(0);

        // Emit to socket as well
        if (socket) {
          socket.emit('mark_all_notifications_read', { businessId });
        }
      }
    } catch (error) {
      console.error('[Notifications] Error marking all notifications as read:', error);
    }
  }, [socket, businessId]);

  // Delete notification
  const deleteNotification = useCallback(async (notificationId: string) => {
    try {
      const response = await fetch(
        `${API_URL}/notifications/${notificationId}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.ok) {
        setNotifications((prev) => {
          const notification = prev.find((n) => n._id === notificationId);
          if (notification && !notification.read) {
            setUnreadCount((count) => Math.max(0, count - 1));
          }
          return prev.filter((n) => n._id !== notificationId);
        });
      }
    } catch (error) {
      console.error('[Notifications] Error deleting notification:', error);
    }
  }, []);

  // Fetch notifications on mount
  useEffect(() => {
    if (businessId) {
      console.log('[Notifications] 🎬 Component mounted, fetching initial notifications...');
      fetchNotifications();
    } else {
      console.log('[Notifications] ⏸️ Waiting for businessId...');
    }
  }, [businessId, fetchNotifications]);

  const value: NotificationContextType = {
    notifications,
    unreadCount,
    loading,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}
