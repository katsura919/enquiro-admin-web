"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, ThumbsUp, ThumbsDown } from "lucide-react";

interface Message {
  id: string;
  content: string;
  sender: "user" | "customer" | "agent" | "ai" | "system";
  timestamp: Date;
  messageType?: "text" | "image" | "file";
  attachments?: Array<{
    fileName: string;
    fileUrl: string;
    fileSize?: number;
    mimeType: string;
  }>;
  systemMessageType?: string;
  isGoodResponse?: boolean | null;
}

interface ChatSession {
  _id: string;
  businessId: string;
  customerName: string;
  lastMessageTime: Date;
}

interface ChatWindowProps {
  session: ChatSession | null;
  messages: Message[];
  onSendMessage: (content: string) => void;
}

export default function ChatWindow({
  session,
  messages,
  onSendMessage,
}: ChatWindowProps) {
  const [newMessage, setNewMessage] = useState("");

  if (!session) {
    return null;
  }

  const handleSend = () => {
    if (newMessage.trim()) {
      onSendMessage(newMessage.trim());
      setNewMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  return (
    <div className="flex flex-col h-screen bg-card">
      {/* Chat Header */}
      <div className="flex items-center px-6 h-16 border-b border-border">
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            {session.customerName}
          </h2>
          <p className="text-sm text-muted-foreground">
            Last active: {new Date(session.lastMessageTime).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((message) => {
          const isCustomer = message.sender === "customer";
          const isSystem = message.sender === "system";
          const isBot = message.sender === "ai";
          const isAgent =
            message.sender === "agent" || message.sender === "user";

          if (isSystem) {
            return (
              <div key={message.id} className="flex justify-center">
                <div className="bg-muted/50 text-muted-foreground text-sm px-4 py-2 rounded-full">
                  {message.content}
                </div>
              </div>
            );
          }

          return (
            <div
              key={message.id}
              className={`flex ${isCustomer ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[70%] rounded-lg px-4 py-2 ${
                  isCustomer
                    ? "bg-primary text-primary-foreground"
                    : isAgent
                    ? "bg-blue-500 text-white"
                    : "bg-muted text-foreground"
                }`}
              >
                {message.messageType === "text" || !message.messageType ? (
                  <p>{message.content}</p>
                ) : null}

                {message.attachments && message.attachments.length > 0 && (
                  <div className="space-y-2 mt-2">
                    {message.attachments.map((attachment, idx) => (
                      <div key={idx}>
                        {message.messageType === "image" ? (
                          <img
                            src={attachment.fileUrl}
                            alt={attachment.fileName}
                            className="rounded max-w-full h-auto"
                          />
                        ) : (
                          <a
                            href={attachment.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-sm underline"
                          >
                            📎 {attachment.fileName}
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between gap-2 mt-1">
                  <p className="text-xs opacity-70">
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </p>
                  <div className="flex items-center gap-2">
                    {message.sender && (
                      <p className="text-xs opacity-70 capitalize">
                        {message.sender === "ai" ? "Bot" : message.sender}
                      </p>
                    )}
                    {isBot &&
                      message.isGoodResponse !== undefined &&
                      message.isGoodResponse !== null && (
                        <span
                          className="text-xs flex items-center"
                          title={
                            message.isGoodResponse
                              ? "Good Response"
                              : "Bad Response"
                          }
                        >
                          {message.isGoodResponse ? (
                            <ThumbsUp className="h-3 w-3" />
                          ) : (
                            <ThumbsDown className="h-3 w-3" />
                          )}
                        </span>
                      )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-border">
        <div className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type your message..."
            className="bg-background border-border text-foreground"
          />
          <Button
            onClick={handleSend}
            disabled={!newMessage.trim()}
            className="bg-primary hover:bg-primary/90"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
