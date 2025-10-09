'use client';

import { useRouter } from 'next/navigation';
import { Star, FileText, X } from 'lucide-react';
import { Notification } from '@/types/Notification';
import { useNotifications } from '@/context/NotificationContext';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

interface NotificationItemProps {
  notification: Notification;
}

export function NotificationItem({ notification }: NotificationItemProps) {
  const router = useRouter();
  const { markAsRead, deleteNotification } = useNotifications();

  const handleClick = async () => {
    if (!notification.read) {
      await markAsRead(notification._id);
    }
    
    if (notification.link) {
      router.push(notification.link);
    }
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await deleteNotification(notification._id);
  };

  const getNotificationIcon = () => {
    switch (notification.type) {
      case 'case_created':
        return <FileText className="h-5 w-5 text-blue-600" />;
      case 'rating_received':
        return <Star className="h-5 w-5 text-yellow-600" />;
      default:
        return null;
    }
  };

  const getNotificationTitle = () => {
    switch (notification.type) {
      case 'case_created':
        return 'New Case Created';
      case 'rating_received':
        return 'New Rating Received';
      default:
        return 'Notification';
    }
  };

  const getNotificationMessage = () => {
    switch (notification.type) {
      case 'case_created':
        return `${notification.agentName || 'An agent'} created a case for ${notification.customerName}`;
      case 'rating_received':
        return `${notification.ratedAgentName} received a ${notification.rating}-star rating from ${notification.customerName}`;
      default:
        return '';
    }
  };

  const getNotificationDetails = () => {
    switch (notification.type) {
      case 'case_created':
        return notification.caseTitle;
      case 'rating_received':
        return notification.feedback ? `"${notification.feedback}"` : null;
      default:
        return null;
    }
  };

  return (
    <div
      onClick={handleClick}
      className={cn(
        'group relative flex gap-3 p-4 hover:bg-accent cursor-pointer transition-colors border-b last:border-b-0',
        !notification.read && 'bg-blue-50 dark:bg-blue-950/20'
      )}
    >
      {/* Icon */}
      <div className="flex-shrink-0 mt-1">{getNotificationIcon()}</div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <p className="text-sm font-semibold">{getNotificationTitle()}</p>
            <p className="text-sm text-muted-foreground mt-1">
              {getNotificationMessage()}
            </p>
            {getNotificationDetails() && (
              <p className="text-xs text-muted-foreground mt-1 italic">
                {getNotificationDetails()}
              </p>
            )}
          </div>
          {!notification.read && (
            <div className="flex-shrink-0">
              <div className="h-2 w-2 rounded-full bg-blue-600" />
            </div>
          )}
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
        </p>
      </div>

      {/* Delete button */}
      <button
        onClick={handleDelete}
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-destructive/10 rounded"
      >
        <X className="h-4 w-4 text-muted-foreground hover:text-destructive" />
      </button>
    </div>
  );
}
