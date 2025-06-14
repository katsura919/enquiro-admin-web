import { ActivityIcon, FileText, RefreshCw } from "lucide-react";
import { Card } from "@/components/ui/card";

export interface ActivityItem {
  id: string
  action: string
  user: string
  timestamp: string
  details?: string
}

interface ActivityFeedProps {
  activities: ActivityItem[];
  formatDate: (dateString: string) => string;
}

export function ActivityFeed({ activities, formatDate }: ActivityFeedProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <ActivityIcon className="h-5 w-5 text-emerald-500" />
        <h2 className="text-lg font-semibold">Recent Activity</h2>
      </div>
      
      <Card className="p-4 overflow-hidden shadow-sm border-border/40">
        <div className="space-y-4">
          {activities.length === 0 ? (
            <div className="p-8 text-center">
              <ActivityIcon className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
              <p className="text-muted-foreground">No recent activity</p>
            </div>
          ) : (
            activities.map((activity) => (
              <div key={activity.id} className="flex gap-3 items-start">
                <div className="h-7 w-7 rounded-full bg-emerald-100 dark:bg-emerald-900/20 flex items-center justify-center mt-1">
                  {activity.action.includes("Status") ? (
                    <RefreshCw className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                  ) : activity.action.includes("Note") ? (
                    <FileText className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <ActivityIcon className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                  )}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{activity.user}</span>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(activity.timestamp)}
                    </span>
                  </div>
                  <div>
                    <span className="text-sm">{activity.action}</span>
                    {activity.details && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {activity.details}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}
