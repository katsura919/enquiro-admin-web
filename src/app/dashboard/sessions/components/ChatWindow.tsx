import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Send, Phone, AlertCircle, MessageSquare } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface Message {
  _id: string
  sessionId: string
  content: string
  sender: "user" | "bot" | "agent"
  timestamp: Date
}

interface ChatSession {
  _id: string
  businessId: string
  customerName: string
  status: "active" | "closed" | "escalated"
  lastMessage: string
  lastMessageTime: Date
  unreadCount: number
}

interface ChatWindowProps {
  session: ChatSession | null
  messages: Message[]
  onSendMessage: (content: string) => void
  onEscalate: () => void
}

export default function ChatWindow({
  session,
  messages,
  onSendMessage,
  onEscalate,
}: ChatWindowProps) {
  const [newMessage, setNewMessage] = useState("")

  if (!session) {
    return (
      <Card className="h-[calc(100vh-2rem)] bg-white/5 border-blue-500/20">
        <div className="flex flex-col items-center justify-center h-full text-gray-400">
          <MessageSquare className="h-12 w-12 mb-2" />
          <p>Select a chat session to view messages</p>
        </div>
      </Card>
    )
  }

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      onSendMessage(newMessage.trim())
      setNewMessage("")
    }
  }

  const statusColors = {
    active: "bg-green-500/20 text-green-400",
    closed: "bg-gray-500/20 text-gray-400",
    escalated: "bg-red-500/20 text-red-400",
  }

  return (
    <Card className="h-[calc(100vh-2rem)] bg-white/5 border-blue-500/20 flex flex-col">
      <CardHeader className="border-b border-blue-500/20">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-white">{session.customerName}</CardTitle>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="secondary" className={statusColors[session.status]}>
                {session.status}
              </Badge>
              <span className="text-sm text-gray-400">
                Last active {formatDistanceToNow(new Date(session.lastMessageTime), { addSuffix: true })}
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            {session.status === "active" && (
              <Button
                variant="outline"
                size="sm"
                className="border-red-500/20 text-red-400 hover:text-red-300"
                onClick={onEscalate}
              >
                <AlertCircle className="h-4 w-4 mr-2" />
                Escalate
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              className="border-blue-500/20 text-gray-400 hover:text-white"
            >
              <Phone className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message._id}
            className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[70%] rounded-lg p-3 ${
                message.sender === "user"
                  ? "bg-blue-500 text-white"
                  : message.sender === "bot"
                  ? "bg-white/5 text-gray-300"
                  : "bg-green-500/20 text-green-300"
              }`}
            >
              {message.content}
              <div className="mt-1 text-xs opacity-70">
                {formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })}
              </div>
            </div>
          </div>
        ))}
      </CardContent>

      <div className="p-4 border-t border-blue-500/20">
        <div className="flex gap-2">
          <Input
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            className="bg-white/5 text-white border-blue-500/20"
          />
          <Button
            className="bg-blue-500 hover:bg-blue-600"
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  )
} 