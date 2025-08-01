"use client"

import { Button } from "@/components/ui/button"
import { User, Bot, CheckCircle2 } from "lucide-react"
import { format } from "date-fns"
import Markdown from "markdown-to-jsx"
import type { ChatMessage } from "@/types/ChatMessage"

interface MessageProps {
  message: ChatMessage
  index: number
  onEscalationClick: () => void
}

export default function Message({ message, index, onEscalationClick }: MessageProps) {
  const renderContentWithEscalationLink = (content: string) => {
    const replaced = content.replace(/\[([^\]]+)\]\(escalate:\/\/now\)/g, "**@@ESCALATE_LINK@@**")
    return (
      <Markdown
        options={{
          overrides: {
            strong: {
              component: ({ children }) => {
                const child = Array.isArray(children) ? children[0] : children;
                if (child === "@@ESCALATE_LINK@@") {
                  return (
                    <Button
                      variant="link"
                      className="text-primary underline hover:text-primary/80 p-0 h-auto"
                      onClick={onEscalationClick}
                    >
                      click here
                    </Button>
                  );
                }
                return <strong>{children}</strong>;
              }
            },
            a: {
              component: ({ href, children, ...props }) => (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline hover:text-primary/80"
                  {...props}
                >
                  {children}
                </a>
              )
            }
          }
        }}
      >
        {replaced}
      </Markdown>
    )
  }

  // System messages - centered like Facebook Messenger
  if (message.senderType === "system") {
    return (
      <div className="flex justify-center my-4">
        <div className="text-xs text-muted-foreground text-center max-w-md px-4 py-2">
          {message.message}
        </div>
      </div>
    )
  }

  return (
    <div 
      className={`flex items-start gap-3 message-enter ${
        message.senderType === "ai" || message.senderType === "agent"
          ? "justify-start" 
          : "justify-end"
      }`}
    >
      {(message.senderType === "ai" || message.senderType === "agent") && (
        <div className="flex-shrink-0 mt-1">
          <div className={`rounded-full p-2 ${
            message.senderType === "agent"
              ? "bg-green-600"
              : "bg-primary"
          }`}>
            {message.senderType === "agent" ? (
              <User className="h-4 w-4 text-white" />
            ) : (
              <Bot className="h-4 w-4 text-primary-foreground" />
            )}
          </div>
        </div>
      )}
      
      <div className={`
        relative group
        ${message.senderType === "ai" || message.senderType === "agent" ? "ml-2" : "mr-2"}
        ${message.senderType === "ai" || message.senderType === "agent" ? "max-w-[85%]" : "max-w-[85%]"}
      `}>
        <div className={`
          px-4 py-3 rounded-2xl text-sm border
          ${message.senderType === "ai" 
            ? "bg-muted border-border text-foreground rounded-tl-sm" 
            : message.senderType === "agent"
            ? "bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800 text-green-900 dark:text-green-100 rounded-tl-sm"
            : "bg-primary border-primary text-primary-foreground rounded-tr-sm"
          }
        `}>
          <div className="prose prose-sm max-w-none break-words dark:prose-invert">
            {message.senderType === "ai"
              ? renderContentWithEscalationLink(message.message)
              : message.message}
          </div>
          
          <div className="flex items-center justify-end gap-2 mt-2 text-xs opacity-70">
            <span>{format(new Date(message.createdAt), "HH:mm")}</span>
            {message.senderType === "customer" && <CheckCircle2 className="h-3 w-3" />}
          </div>
        </div>
      </div>

      {message.senderType === "customer" && (
        <div className="flex-shrink-0 mt-1">
          <div className="rounded-full p-2 bg-muted border border-border">
            <User className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>
      )}
    </div>
  )
}
