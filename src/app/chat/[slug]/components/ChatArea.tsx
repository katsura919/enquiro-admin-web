"use client"

import { forwardRef, useState } from "react"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Loader2, AlertTriangle, Users, Bot, Copy, CheckCircle2, Clock, AlertCircle } from "lucide-react"
import { format } from "date-fns"
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
  escalationResponse?: {
    caseNumber: string
    customerName: string
    customerEmail: string
    concern: string
    createdAt: string
  } | null
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
    isLiveChatMode = false,
    escalationResponse
  }, chatEndRef) => {
    const [copiedToClipboard, setCopiedToClipboard] = useState(false)

    const copyToClipboard = async (text: string) => {
      try {
        await navigator.clipboard.writeText(text)
        setCopiedToClipboard(true)
        setTimeout(() => setCopiedToClipboard(false), 2000)
      } catch (err) {
        console.error('Failed to copy:', err)
      }
    }

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
            <div className="flex flex-col items-center justify-center h-full min-h-[300px] py-12 space-y-6">
              <div className="flex flex-col items-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mb-4" />
                <span className="text-lg font-medium mb-2">Waiting for an available agent...</span>
                <span className="text-muted-foreground text-sm text-center max-w-md">
                  You will be connected as soon as an agent is available. Thank you for your patience.
                </span>
              </div>

              {/* Escalation Details Card */}
              {escalationResponse && (
                <div className="w-full max-w-md">
                  <div className="rounded-lg border border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950 p-4">
                    <div className="flex items-start gap-3 mb-4">
                      <div className="bg-green-100 dark:bg-green-900 rounded-full p-2">
                        <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-green-900 dark:text-green-100 mb-1">
                          Support Ticket Created
                        </h3>
                        <p className="text-green-800 dark:text-green-200 text-xs">
                          Your ticket has been submitted successfully
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {/* Case Number */}
                      <div className="flex items-center justify-between p-2 bg-background rounded border">
                        <span className="text-xs font-medium text-muted-foreground">Case Number:</span>
                        <div className="flex items-center gap-2">
                          <code className="text-xs font-mono bg-muted px-2 py-1 rounded">
                            {escalationResponse.caseNumber}
                          </code>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 w-6 p-0"
                            onClick={() => copyToClipboard(escalationResponse.caseNumber)}
                          >
                            {copiedToClipboard ? (
                              <CheckCircle2 className="h-3 w-3 text-green-600" />
                            ) : (
                              <Copy className="h-3 w-3" />
                            )}
                          </Button>
                        </div>
                      </div>

                      {/* Details */}
                      <div className="space-y-2 text-xs text-green-800 dark:text-green-200">
                        <div className="flex items-center gap-2">
                          <Clock className="h-3 w-3" />
                          <span>Submitted: {format(new Date(escalationResponse.createdAt), 'MMM dd, HH:mm')}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <AlertCircle className="h-3 w-3" />
                          <span>Concern: {escalationResponse.concern}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
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
