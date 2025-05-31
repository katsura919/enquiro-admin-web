import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search, MessageSquare } from "lucide-react"
import ChatSessionItem from "./ChatSessionItem"

interface ChatSession {
  _id: string
  businessId: string
  customerName: string
  status: "active" | "closed" | "escalated"
  lastMessage: string
  lastMessageTime: Date
  unreadCount: number
}

interface ChatSessionListProps {
  sessions: ChatSession[]
  onSelectSession: (session: ChatSession) => void
  selectedSessionId: string | null
}

export default function ChatSessionList({
  sessions,
  onSelectSession,
  selectedSessionId,
}: ChatSessionListProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "closed" | "escalated">("all")

  const filteredSessions = sessions.filter((session) => {
    const matchesSearch = session.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         session.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || session.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <Card className="h-[calc(100vh-2rem)] bg-white/5 border-blue-500/20">
      <CardHeader>
        <CardTitle className="text-white">Chat Sessions</CardTitle>
        <div className="space-y-4 mt-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search sessions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white/5 text-white border-blue-500/20"
            />
          </div>
          <div className="flex gap-2">
            {["all", "active", "closed", "escalated"].map((status) => (
              <button
                key={status}
                className={`px-3 py-1 rounded-full text-sm ${
                  statusFilter === status
                    ? "bg-blue-500 text-white"
                    : "bg-white/5 text-gray-400 hover:text-white"
                }`}
                onClick={() => setStatusFilter(status as any)}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent className="overflow-y-auto h-[calc(100%-12rem)]">
        {filteredSessions.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <MessageSquare className="h-12 w-12 mb-2" />
            <p>No chat sessions found</p>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredSessions.map((session) => (
              <ChatSessionItem
                key={session._id}
                session={session}
                isSelected={session._id === selectedSessionId}
                onClick={() => onSelectSession(session)}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
} 