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
    <div className="flex flex-col h-screen bg-card backdrop-blur-lg">

      <div className="flex flex-col gap-4 px-6 py-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search sessions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-background text-foreground border-border"
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-6 pb-4">
        {filteredSessions.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
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
                    ? "bg-primary text-primary-foreground"
                    : "bg-card text-foreground hover:bg-accent"
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