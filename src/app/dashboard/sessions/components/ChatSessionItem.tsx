import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatDistanceToNow } from "date-fns"

interface ChatSession {
  _id: string
  businessId: string
  customerName: string
  status: "active" | "closed" | "escalated"
  lastMessage: string
  lastMessageTime: Date
  unreadCount: number
}

interface ChatSessionItemProps {
  session: ChatSession
  isSelected: boolean
  onClick: () => void
}

export default function ChatSessionItem({
  session,
  isSelected,
  onClick,
}: ChatSessionItemProps) {
  const statusColors = {
    active: "bg-green-500/20 text-green-400",
    closed: "bg-gray-500/20 text-gray-400",
    escalated: "bg-red-500/20 text-red-400",
  }

  return (
    <Card
      className={`p-4 cursor-pointer transition-colors ${
        isSelected
          ? "bg-blue-500/20 border-blue-500"
          : "bg-white/5 border-blue-500/20 hover:bg-white/10"
      }`}
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2">
          <h3 className="font-medium text-white">{session.customerName}</h3>
          <Badge variant="secondary" className={statusColors[session.status]}>
            {session.status}
          </Badge>
        </div>
        <span className="text-sm text-gray-400">
          {formatDistanceToNow(new Date(session.lastMessageTime), { addSuffix: true })}
        </span>
      </div>
      <p className="text-sm text-gray-300 line-clamp-2">{session.lastMessage}</p>
      {session.unreadCount > 0 && (
        <div className="mt-2 flex justify-end">
          <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
            {session.unreadCount} unread
          </span>
        </div>
      )}
    </Card>
  )
} 