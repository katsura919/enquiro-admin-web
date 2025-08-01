"use client"

import { forwardRef } from "react"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Loader2, AlertTriangle, Users, Bot } from "lucide-react"
import Message from "./Message"
import ChatInput from "./ChatInput"
import type { ChatMessage } from "@/types/ChatMessage"

interface ChatAreaProps {
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
}

const ChatArea = forwardRef<HTMLDivElement, ChatAreaProps>(
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
    isLiveChatMode = false
  }, chatEndRef) => {
    return (
      <Card className="flex-1 flex flex-col border border-border/50 shadow-sm min-h-0">
        
        {/* Live Chat Mode Indicator */}
        {isLiveChatMode && (
          <div className="px-4 py-3 border-b bg-muted/50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium">Connected to live agent</span>
            </div>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          </div>
        )}

        <ScrollArea className="flex-1 p-4">
          {waitingForAgent ? (
            <div className="flex flex-col items-center justify-center h-full min-h-[300px] py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mb-4" />
              <span className="text-lg font-medium mb-2">Waiting for an available agent...</span>
              <span className="text-muted-foreground text-sm text-center max-w-md">
                You will be connected as soon as an agent is available. Thank you for your patience.
              </span>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((msg, index) => (
                <Message 
                  key={msg._id} 
                  message={msg} 
                  index={index} 
                  onEscalationClick={onEscalationClick}
                />
              ))}
            </div>
          )}

          {loading && (
            <div className="flex items-center gap-2 text-muted-foreground p-4">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm">AI is typing...</span>
            </div>
          )}
          <div ref={chatEndRef} />
        </ScrollArea>

        {error && (
          <div className="px-4 py-3 bg-destructive/10 border-t border-destructive/20">
            <p className="text-destructive text-sm flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              {error}
            </p>
          </div>
        )}

        <ChatInput
          value={newMessage}
          onChange={onMessageChange}
          onSubmit={onSubmit}
          loading={loading}
          disabled={disabled}
          placeholder={placeholder}
        />
      </Card>
    )
  }
)

ChatArea.displayName = "ChatArea"

export default ChatArea
