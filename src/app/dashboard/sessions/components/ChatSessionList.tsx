import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Search, MessageSquare } from "lucide-react"
import ChatSessionItem from "./ChatSessionItem"

interface ChatSession {
  _id: string
  businessId: string
  customerName: string
  lastMessageTime: Date
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

  const filteredSessions = sessions.filter((session) => {
    return (session.customerName?.toLowerCase() || "").includes(searchQuery.toLowerCase())
  })

  return (
    <div className="flex flex-col h-screen bg-white/5 backdrop-blur-lg">
      <div className="flex h-16 shrink-0 items-center px-6 border-b border-blue-500/20">
        <h2 className="text-xl font-bold text-white">Chat Sessions</h2>
      </div>
      <div className="flex flex-col gap-4 px-6 py-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search sessions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white/5 text-white border-blue-500/20"
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-6 pb-4">
        {filteredSessions.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <MessageSquare className="h-12 w-12 mb-2" />
            <p>No chat sessions found</p>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredSessions.map((session) => (
              <div
                key={session._id}
                className={`p-4 rounded-lg cursor-pointer transition-colors ${
                  session._id === selectedSessionId
                    ? "bg-blue-500 text-white"
                    : "bg-white/5 text-gray-100 hover:bg-white/10"
                }`}
                onClick={() => onSelectSession(session)}
              >
                <div className="font-medium">{session.customerName}</div>
                <div className="text-sm opacity-70">
                  {new Date(session.lastMessageTime).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
} 