import { ActivityIcon, FileText, RefreshCw, Box, Truck } from "lucide-react";
import { Card } from "@/components/ui/card";
import { ViewAllActivities } from "./ViewAllActivities";

export interface ActivityItem {
  id: string
  action: string
  timestamp: string
  details?: string
}

interface ActivityFeedProps {
  activities: ActivityItem[];
  formatDate: (dateString: string) => string;
}

export function ActivityFeed({ activities, formatDate }: ActivityFeedProps) {
  // Get only the 3 most recent activities
  const recentActivities = activities.slice(0, 3);
  
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ActivityIcon className="h-4 w-4 text-blue-500" />
          <h2 className="text-base font-semibold">Activity</h2>
        </div>
      </div>
      
      <Card className="bg-card p-3 overflow-hidden shadow-none border-muted">
        <div className="relative">
          {activities.length === 0 ? (
            <div className="p-6 text-center">
              <ActivityIcon className="h-10 w-10 text-muted-foreground/50 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No activity yet</p>
            </div>
          ) : (
            <>              
              <div className="space-y-2 relative">
                {recentActivities.map((activity, index) => (
                  <div key={activity.id} className="flex gap-2 items-start">
                    <div className="h-6 w-6 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                      {activity.action.includes("Status") ? (
                        <RefreshCw className="h-3 w-3 text-white" />
                      ) : activity.action.includes("Note") ? (
                        <FileText className="h-3 w-3 text-white" />
                      ) : activity.action.includes("Delivering") ? (
                        <Truck className="h-3 w-3 text-white" />
                      ) : activity.action.includes("Shipment") ? (
                        <Box className="h-3 w-3 text-white" />
                      ) : (
                        <ActivityIcon className="h-3 w-3 text-white" />
                      )}
                    </div>
                    <div className="flex-1 pb-2 min-w-0">
                      <div className="flex flex-col">
                        <span className="text-xs font-medium truncate">{activity.action}</span>
                        {activity.details && (
                          <span className="text-xs text-muted-foreground truncate">
                            {activity.details}
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground block mt-0.5">
                        {formatDate(activity.timestamp)}
                      </span>
                    </div>
                  </div>
                ))}              
              </div>
              
              {activities.length > 3 && (
                <div className="pt-2 mt-2 border-t border-border/30">
                  <ViewAllActivities 
                    activities={activities} 
                    formatDate={formatDate}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </Card>
    </div>
  );
}
