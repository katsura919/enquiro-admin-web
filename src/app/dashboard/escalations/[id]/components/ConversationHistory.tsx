import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Bot, Clock, MessageSquare, RefreshCw, UserCircle } from "lucide-react";
import Markdown from "markdown-to-jsx";

interface ChatMessage {
  _id: string
  businessId: string
  sessionId: string
  query: string
  response: string
  isGoodResponse?: boolean | null
  createdAt: string
  updatedAt: string
}

interface ConversationHistoryProps {
  chatMessages: ChatMessage[];
  loadingChats: boolean;
  refreshing: boolean;
  handleRefreshChats: () => void;
  formatTime: (dateString: string) => string;
}

export function ConversationHistory({
  chatMessages,
  loadingChats,
  refreshing,
  handleRefreshChats,
  formatTime,
}: ConversationHistoryProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-blue-500" />
          <h2 className="text-lg font-semibold">Conversation History</h2>
          <Badge variant="secondary" className="text-xs">
            {chatMessages.length} messages
          </Badge>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefreshChats}
          disabled={refreshing}
          className="gap-2"
        >
          <RefreshCw className={cn("h-4 w-4", refreshing && "animate-spin")}/>
          Refresh
        </Button>
      </div>
      <Card className="p-0 overflow-hidden shadow-sm border-border/40">
        {loadingChats ? (
          <div className="p-8 text-center">
            <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading conversation...</p>
          </div>
        ) : chatMessages.length === 0 ? (
          <div className="p-8 text-center">
            <MessageSquare className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
            <p className="text-muted-foreground">No conversation found for this session</p>
          </div>
        ) : (
          <ScrollArea className="h-[450px]">
            <div className="p-4 space-y-6">
              {chatMessages.map((message) => (
                <div key={message._id} className="space-y-2">
                  {/* User Message (right) */}
                  <div className="flex justify-end">
                    <div className="flex items-end gap-2 max-w-2xl w-full justify-end">
                      <div className="flex-1 flex flex-col items-end">
                        <div className="flex items-center justify-end gap-2">
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatTime(message.createdAt)}
                          </span>
                          <span className="text-sm font-medium">Customer</span>
                        </div>
                        <div className="bg-blue-500 text-white rounded-lg p-3 border-r-4 border-blue-700 max-w-full">
                          <p className="text-sm leading-relaxed break-words">{message.query}</p>
                        </div>
                      </div>
                      <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center flex-shrink-0">
                        <UserCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      </div>
                    </div>
                  </div>
                  {/* AI Message (left) */}
                  <div className="flex justify-start">
                    <div className="flex items-end gap-2 max-w-2xl w-full">
                      <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center flex-shrink-0">
                        <Bot className="h-4 w-4 text-green-600 dark:text-green-400" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">AI Assistant</span>
                          {message.isGoodResponse !== null && (
                            <Badge variant={message.isGoodResponse ? "default" : "destructive"} className="text-xs">
                              {message.isGoodResponse ? "Helpful" : "Not Helpful"}
                            </Badge>
                          )}
                        </div>
                        <div className="bg-muted rounded-lg p-3 border-l-4 border-green-700 max-w-full">
                          <Markdown
                            options={{
                              overrides: {
                                a: {
                                  component: ({ children }) => <span className="text-primary underline cursor-pointer">{children}</span>,
                                },
                              },
                            }}
                          >
                            {message.response.replace(/\[([^\]]+)\]\(escalate:\/\/now\)/gi, "click here")}
                          </Markdown>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </Card>
    </div>
  );
}
