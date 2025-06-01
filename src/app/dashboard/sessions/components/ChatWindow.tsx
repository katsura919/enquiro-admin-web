"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Send } from "lucide-react"

interface Message {
  id: string
  content: string
  sender: "user" | "customer"
  timestamp: Date
}

interface ChatSession {
  _id: string
  businessId: string
  customerName: string
  lastMessageTime: Date
}

interface ChatWindowProps {
  session: ChatSession | null
  messages: Message[]
  onSendMessage: (content: string) => void
}

export default function ChatWindow({ session, messages, onSendMessage }: ChatWindowProps) {
  const [newMessage, setNewMessage] = useState("")

  if (!session) {
    return null
  }

  const handleSend = () => {
    if (newMessage.trim()) {
      onSendMessage(newMessage.trim())
      setNewMessage("")
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex flex-col h-screen bg-white/5">
      {/* Chat Header */}
      <div className="flex items-center px-6 h-16 border-b border-blue-500/20">
        <div>
          <h2 className="text-lg font-semibold text-white">{session.customerName}</h2>
          <p className="text-sm text-gray-400">
            Last active: {new Date(session.lastMessageTime).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[70%] rounded-lg px-4 py-2 ${
                message.sender === "user"
                  ? "bg-blue-500 text-white"
                  : "bg-white/10 text-gray-100"
              }`}
            >
              <p>{message.content}</p>
              <p className="text-xs opacity-70 mt-1">
                {new Date(message.timestamp).toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-blue-500/20">
        <div className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type your message..."
            className="bg-white/5 border-blue-500/20 text-white"
          />
          <Button
            onClick={handleSend}
            disabled={!newMessage.trim()}
            className="bg-blue-500 hover:bg-blue-600"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
} 