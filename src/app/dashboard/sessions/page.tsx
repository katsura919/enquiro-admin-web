"use client"

import { useState } from "react"
import ChatSessionList from "./components/ChatSessionList"
import ChatWindow from "./components/ChatWindow"

// Mock data - replace with actual API data
const mockSessions = [
  {
    _id: "1",
    businessId: "1",
    customerName: "John Doe",
    status: "active" as const,
    lastMessage: "Thank you for your help!",
    lastMessageTime: new Date("2024-03-10T10:30:00"),
    unreadCount: 2,
  },
  {
    _id: "2",
    businessId: "1",
    customerName: "Jane Smith",
    status: "closed" as const,
    lastMessage: "Issue has been resolved.",
    lastMessageTime: new Date("2024-03-09T15:45:00"),
    unreadCount: 0,
  },
  {
    _id: "3",
    businessId: "1",
    customerName: "Mike Johnson",
    status: "escalated" as const,
    lastMessage: "I need to speak with a supervisor.",
    lastMessageTime: new Date("2024-03-10T09:15:00"),
    unreadCount: 5,
  },
]

const mockMessages = [
  {
    _id: "1",
    sessionId: "1",
    content: "Hello, I need help with my order.",
    sender: "user" as const,
    timestamp: new Date("2024-03-10T10:15:00"),
  },
  {
    _id: "2",
    sessionId: "1",
    content: "Hi! I'd be happy to help you with your order. Could you please provide your order number?",
    sender: "bot" as const,
    timestamp: new Date("2024-03-10T10:16:00"),
  },
  {
    _id: "3",
    sessionId: "1",
    content: "My order number is #12345",
    sender: "user" as const,
    timestamp: new Date("2024-03-10T10:17:00"),
  },
  {
    _id: "4",
    sessionId: "1",
    content: "Let me check that for you...",
    sender: "bot" as const,
    timestamp: new Date("2024-03-10T10:17:30"),
  },
  {
    _id: "5",
    sessionId: "1",
    content: "I can see your order. It's currently being processed and will be shipped within 24 hours.",
    sender: "bot" as const,
    timestamp: new Date("2024-03-10T10:18:00"),
  },
  {
    _id: "6",
    sessionId: "1",
    content: "Thank you for your help!",
    sender: "user" as const,
    timestamp: new Date("2024-03-10T10:30:00"),
  },
]

export default function SessionsPage() {
  const [selectedSession, setSelectedSession] = useState<any>(null)

  const handleSendMessage = (content: string) => {
    // TODO: Implement API call
    console.log("Send message:", content)
  }

  const handleEscalate = () => {
    // TODO: Implement API call
    console.log("Escalate session:", selectedSession?._id)
  }

  return (
    <div className="p-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-1">
          <ChatSessionList
            sessions={mockSessions}
            selectedSessionId={selectedSession?._id}
            onSelectSession={setSelectedSession}
          />
        </div>
        <div className="md:col-span-2">
          <ChatWindow
            session={selectedSession}
            messages={mockMessages}
            onSendMessage={handleSendMessage}
            onEscalate={handleEscalate}
          />
        </div>
      </div>
    </div>
  )
} 