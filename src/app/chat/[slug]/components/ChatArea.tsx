"use client"

import { forwardRef, useState } from "react"
import { Card } from "@/components/ui/card"
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
  onEscalationClick: (escalationData?: { type: 'new' | 'continue', caseId?: string, sessionId?: string }) => void
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
  selectedFile?: File | null
  filePreview?: string | null
  onFileSelect?: (file: File) => void
  onFileClear?: () => void
  uploadLoading?: boolean
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
    escalationResponse,
    selectedFile,
    filePreview,
    onFileSelect,
    onFileClear,
    uploadLoading = false
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
      <Card className="flex-1 flex flex-col border-0 shadow-none bg-transparent min-h-0">
        
        {/* Live Chat Mode Indicator */}
        {isLiveChatMode && (
          <div className="px-6 py-4 border-b bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/50 flex items-center justify-between rounded-t-xl">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">Connected to live agent</span>
            </div>
            <Users className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          </div>
        )}

        <div className="flex-1 min-h-0 overflow-hidden flex flex-col rounded-xl">
          <div className="flex-1 overflow-y-auto">
            <div className="p-6">
              {waitingForAgent ? (
                <div className="flex flex-col items-center justify-center min-h-[400px] py-12 space-y-8">
              <div className="flex flex-col items-center">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center mb-6">
                    <Loader2 className="h-8 w-8 animate-spin text-slate-600 dark:text-slate-300" />
                  </div>
                </div>
                <span className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-3">Connecting you to an agent</span>
                <span className="text-slate-600 dark:text-slate-400 text-center max-w-md leading-relaxed">
                  Please wait while we find an available agent to assist you. This usually takes just a moment.
                </span>
              </div>

              {/* Escalation Details Card */}
              {escalationResponse && (
                <div className="w-full max-w-md">
                  <div className="rounded-xl border border-emerald-200 dark:border-emerald-800/50 bg-emerald-50 dark:bg-emerald-950/20 p-6 shadow-sm">
                    <div className="flex items-start gap-4 mb-6">
                      <div className="bg-emerald-100 dark:bg-emerald-900/50 rounded-full p-3">
                        <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-emerald-900 dark:text-emerald-100 mb-2 text-lg">
                          Support Ticket Created
                        </h3>
                        <p className="text-emerald-800 dark:text-emerald-200 text-sm leading-relaxed">
                          Your ticket has been submitted successfully and you're in the queue
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {/* Case Number */}
                      <div className="flex items-center justify-between p-4 bg-white border border-emerald-200 dark:border-emerald-800">
                        <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Case Number:</span>
                        <div className="flex items-center gap-3">
                          <code className="text-sm font-mono bg-slate-100 dark:bg-slate-700 px-3 py-1.5 rounded-md text-slate-900 dark:text-slate-100">
                            {escalationResponse.caseNumber}
                          </code>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0 hover:bg-emerald-100 dark:hover:bg-emerald-900/30"
                            onClick={() => copyToClipboard(escalationResponse.caseNumber)}
                          >
                            {copiedToClipboard ? (
                              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                            ) : (
                              <Copy className="h-4 w-4 text-slate-500" />
                            )}
                          </Button>
                        </div>
                      </div>

                      {/* Details */}
                      <div className="space-y-3 text-sm text-emerald-800 dark:text-emerald-200">
                        <div className="flex items-center gap-3">
                          <Clock className="h-4 w-4" />
                          <span>Submitted: {format(new Date(escalationResponse.createdAt), 'MMM dd, HH:mm')}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <AlertCircle className="h-4 w-4" />
                          <span>Concern: {escalationResponse.concern}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            ) : (
              <div className="space-y-6">
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center min-h-[400px] py-12">
                    <div className="flex flex-col items-center text-center">
                      <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center mb-6">
                        <Bot className="h-8 w-8 text-slate-600 dark:text-slate-300" />
                      </div>
                      <span className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-3">
                        How can I help?
                      </span>
                      <span className="text-slate-600 dark:text-slate-400 text-center max-w-md leading-relaxed">
                        I'm here to assist you with any questions or concerns you may have. Feel free to ask me anything!
                      </span>
                    </div>
                  </div>
                ) : (
                  messages.map((msg, index) => (
                    <Message 
                      key={msg._id} 
                      message={msg} 
                      index={index} 
                      onEscalationClick={onEscalationClick}
                      escalationInProgress={!!escalationResponse || waitingForAgent || isLiveChatMode}
                    />
                  ))
                )}
              </div>
            )}

            {loading && (
              <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400 pl-14 mb-6">
                <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
                <span className="text-sm">AI is thinking...</span>
              </div>
            )}
            <div ref={chatEndRef} />
            </div>
          </div>
        </div>

        {error && (
          <div className="px-6 py-4 bg-red-50 dark:bg-red-950/20 border-t border-red-200 dark:border-red-800/50 rounded-b-xl">
            <p className="text-red-700 dark:text-red-300 text-sm flex items-center gap-3">
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
          selectedFile={selectedFile}
          filePreview={filePreview}
          onFileSelect={onFileSelect}
          onFileClear={onFileClear}
          uploadLoading={uploadLoading}
          isLiveChatMode={isLiveChatMode}
        />
      </Card>
    )
  }
)

ChatArea.displayName = "ChatArea"

export default ChatArea
