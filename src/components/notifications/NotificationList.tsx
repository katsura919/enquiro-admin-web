'use client';

import { useNotifications } from '@/context/NotificationContext';
import { NotificationItem } from './NotificationItem';
import { Button } from '@/components/ui/button';
import { Loader2, Bell } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

export function NotificationList() {
  const { notifications, unreadCount, loading, markAllAsRead } = useNotifications();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <h3 className="font-semibold text-lg">Notifications</h3>
        {unreadCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={markAllAsRead}
            className="text-xs"
          >
            Mark all as read
          </Button>
        )}
      </div>

      {/* List */}
      {notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-center p-4">
          <Bell className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-sm text-muted-foreground">No notifications yet</p>
          <p className="text-xs text-muted-foreground mt-1">
            You'll be notified when new cases or ratings arrive
          </p>
        </div>
      ) : (
        <ScrollArea className="h-96">
          <div className="flex flex-col">
            {notifications.map((notification) => (
              <NotificationItem key={notification._id} notification={notification} />
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
}
