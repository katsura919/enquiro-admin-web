"use client"

import { forwardRef } from "react"
import { Button } from "@/components/ui/button"
import { Loader2, Users } from "lucide-react"
import ChatWidgetMessage from "./ChatWidgetMessage"
import ChatWidgetInput from "./ChatWidgetInput"
import type { ChatMessage } from "@/types/ChatMessage"

interface ChatWidgetAreaProps {
  messages: ChatMessage[]
  waitingForAgent: boolean
  loading: boolean
  error: string | null
  newMessage: string
  onMessageChange: (value: string) => void
  onSubmit: (e: React.FormEvent) => void
  onEscalationClick: () => void
  disabled: boolean
  placeholder?: string
  isLiveChatMode?: boolean
  escalationResponse?: {
    caseNumber: string
    customerName: string
    customerEmail: string
    concern: string
    createdAt: string
  } | null
}

const ChatWidgetArea = forwardRef<HTMLDivElement, ChatWidgetAreaProps>(
  ({ 
    messages, 
    waitingForAgent, 
    loading, 
    error, 
    newMessage, 
    onMessageChange, 
    onSubmit, 
    onEscalationClick,
    disabled,
    placeholder = "Type your message here...",
    isLiveChatMode = false,
    escalationResponse
  }, chatEndRef) => {

    return (
      <div className="flex-1 flex flex-col min-h-0">
        {/* Live Chat Mode Indicator */}
        {isLiveChatMode && (
          <div className="px-3 py-2 border-b bg-green-50 dark:bg-green-950 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="h-3 w-3 text-green-600" />
              <span className="text-xs font-medium text-green-700">Live agent</span>
            </div>
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
          </div>
        )}

        <div className="flex-1 min-h-0 overflow-hidden flex flex-col">
          <div className="flex-1 overflow-y-auto">
            <div className="p-3">
              {waitingForAgent ? (
                <div className="flex flex-col items-center justify-center min-h-[200px] py-8 space-y-4">
                  <div className="flex flex-col items-center">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground mb-3" />
                    <span className="text-sm font-medium mb-1">Connecting to agent...</span>
                    <span className="text-muted-foreground text-xs text-center max-w-[200px]">
                      Please wait while we connect you to an available agent.
                    </span>
                  </div>

                  {/* Escalation Details */}
                  {escalationResponse && (
                    <div className="w-full max-w-[250px] mt-4">
                      <div className="rounded-lg border border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950 p-3">
                        <div className="text-center">
                          <span className="text-xs font-medium text-green-700 dark:text-green-300">
                            Case #{escalationResponse.caseNumber}
                          </span>
                          <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                            Support request submitted
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  {/* Welcome message if no messages */}
                  {messages.length === 0 && (
                    <div className="bg-muted/50 rounded-lg p-3 mb-4">
                      <p className="text-sm text-muted-foreground text-center">
                        👋 Hi! How can I help you today?
                      </p>
                    </div>
                  )}
                  
                  {messages.map((msg, index) => (
                    <ChatWidgetMessage 
                      key={msg._id} 
                      message={msg} 
                      index={index} 
                      onEscalationClick={onEscalationClick}
                    />
                  ))}
                  
                  {/* Connect to Agent Button - Only show if not waiting and not connected */}
                  {!waitingForAgent && !isLiveChatMode && messages.length > 0 && (
                    <div className="flex justify-center py-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={onEscalationClick}
                        className="text-xs h-7"
                      >
                        <Users className="h-3 w-3 mr-1" />
                        Connect to Agent
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {loading && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  <span className="text-xs">AI is typing...</span>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>
          </div>
        </div>

        {error && (
          <div className="px-3 py-2 bg-destructive/10 border-t border-destructive/20">
            <p className="text-destructive text-xs">
              {error}
            </p>
          </div>
        )}

        <ChatWidgetInput
          value={newMessage}
          onChange={onMessageChange}
          onSubmit={onSubmit}
          loading={loading}
          disabled={disabled}
          placeholder={placeholder}
          isLiveChatMode={isLiveChatMode}
        />
      </div>
    )
  }
)

ChatWidgetArea.displayName = "ChatWidgetArea"

export default ChatWidgetArea
