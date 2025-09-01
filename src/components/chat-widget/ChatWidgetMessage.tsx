"use client"

import { User, Bot } from "lucide-react"
import { format } from "date-fns"
import Markdown from "markdown-to-jsx"
import type { ChatMessage } from "@/types/ChatMessage"

interface ChatWidgetMessageProps {
  message: ChatMessage
  index: number
  onEscalationClick: () => void
}

export default function ChatWidgetMessage({ message, index, onEscalationClick }: ChatWidgetMessageProps) {
  const isCustomer = message.senderType === 'customer'
  const isSystem = message.senderType === 'system'
  
  // Handle escalation link in AI responses - matching main Message.tsx
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
                    <button
                      className="text-blue-600 hover:text-blue-800 underline font-medium"
                      onClick={onEscalationClick}
                    >
                      click here
                    </button>
                  );
                }
                return <strong className="font-semibold">{children}</strong>;
              }
            },
            a: {
              component: ({ href, children, ...props }: any) => (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline"
                  {...props}
                >
                  {children}
                </a>
              )
            },
            p: {
              component: ({ children, ...props }: any) => (
                <p {...props} className="mb-2 last:mb-0">
                  {children}
                </p>
              ),
            },
            ul: {
              component: ({ children, ...props }: any) => (
                <ul {...props} className="list-disc list-inside mb-2 space-y-1">
                  {children}
                </ul>
              ),
            },
            ol: {
              component: ({ children, ...props }: any) => (
                <ol {...props} className="list-decimal list-inside mb-2 space-y-1">
                  {children}
                </ol>
              ),
            },
            li: {
              component: ({ children, ...props }: any) => (
                <li {...props} className="text-sm">
                  {children}
                </li>
              ),
            },
            code: {
              component: ({ children, ...props }: any) => (
                <code {...props} className="bg-muted px-1 py-0.5 rounded text-xs font-mono">
                  {children}
                </code>
              ),
            },
          },
        }}
      >
        {replaced}
      </Markdown>
    )
  }

  if (isSystem) {
    return (
      <div className="flex justify-center mb-3">
        <div className="bg-muted/80 text-muted-foreground px-3 py-1.5 rounded-full">
          <p className="text-xs text-center">
            {message.message}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className={`flex gap-2 mb-3 ${isCustomer ? 'justify-end' : 'justify-start'}`}>
      {!isCustomer && (
        <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-0.5">
          {message.senderType === 'agent' ? (
            <User className="h-3 w-3 text-primary-foreground" />
          ) : (
            <Bot className="h-3 w-3 text-primary-foreground" />
          )}
        </div>
      )}
      
      <div className={`max-w-[200px] ${isCustomer ? 'order-first' : ''}`}>
        <div
          className={`rounded-lg px-3 py-2 text-sm ${
            isCustomer
              ? 'bg-primary text-primary-foreground ml-auto'
              : 'bg-muted text-foreground'
          }`}
        >
          {message.message && (
            <div className="prose prose-sm max-w-none dark:prose-invert">
              {message.senderType === 'ai' 
                ? renderContentWithEscalationLink(message.message)
                : message.message}
            </div>
          )}
        </div>
        
        <p className={`text-xs text-muted-foreground mt-1 ${isCustomer ? 'text-right' : 'text-left'}`}>
          {format(new Date(message.createdAt), 'HH:mm')}
        </p>
      </div>

      {isCustomer && (
        <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center flex-shrink-0 mt-0.5">
          <User className="h-3 w-3 text-muted-foreground" />
        </div>
      )}
    </div>
  )
}
