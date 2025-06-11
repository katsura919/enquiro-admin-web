"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { useAuth } from "@/lib/auth"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import ChatSessionList from "./components/ChatSessionList"
import ChatWindow from "./components/ChatWindow"

interface Message {
  _id: string
  sessionId: string
  content: string
  sender: "user" | "bot"
  displayTime: string
}

interface ChatSession {
  _id: string
  businessId: string
  customerDetails: {
    name: string
    email: string
    phoneNumber: string
  }
  createdAt: string
  updatedAt: string
}

const API_URL = process.env.NEXT_PUBLIC_API_URL

export default function SessionsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user } = useAuth()
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)
  
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
  const businessId = user?.businessId

  // Fetch sessions for the business
  useEffect(() => {
    if (!businessId || !token) return

    const fetchSessions = async () => {
      setLoading(true)
      try {
        const response = await axios.get(`${API_URL}/session/business/${businessId}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        setSessions(response.data)
      } catch (error) {
        console.error('Error fetching sessions:', error)
        setSessions([])
      } finally {
        setLoading(false)
      }
    }

    fetchSessions()
  }, [businessId, token])

  // Fetch messages when a session is selected
  useEffect(() => {
    if (!selectedSessionId || !token) return

    const fetchMessages = async () => {
      try {
        const response = await axios.get(`${API_URL}/chat/session/${selectedSessionId}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        
        // Transform the chat data into messages
        const transformedMessages = response.data.flatMap((chat: any) => [
          {
            _id: `${chat._id}-query`,
            sessionId: chat.sessionId,
            content: chat.query,
            sender: "user",
            displayTime: chat.createdAt
          },
          {
            _id: `${chat._id}-response`,
            sessionId: chat.sessionId,
            content: chat.response,
            sender: "bot",
            displayTime: chat.createdAt
          }
        ])
        
        setMessages(transformedMessages)
      } catch (error) {
        console.error('Error fetching messages:', error)
        setMessages([])
      }
    }

    fetchMessages()
  }, [selectedSessionId, token])

  // Handle sending a new message
  const handleSendMessage = async (content: string) => {
    if (!selectedSessionId || !businessId || !token) return

    try {
      // Create a new chat message
      await axios.post(`${API_URL}/chat`, {
        businessId,
        sessionId: selectedSessionId,
        query: content,
        response: "" // Will be filled by AI backend
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })

      // Refetch messages to get the updated chat including AI response
      const response = await axios.get(`${API_URL}/chat/session/${selectedSessionId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      const transformedMessages = response.data.flatMap((chat: any) => [
        {
          _id: `${chat._id}-query`,
          sessionId: chat.sessionId,
          content: chat.query,
          sender: "user",
          displayTime: chat.createdAt
        },
        {
          _id: `${chat._id}-response`,
          sessionId: chat.sessionId,
          content: chat.response,
          sender: "bot",
          displayTime: chat.createdAt
        }
      ])
      
      setMessages(transformedMessages)
    } catch (error) {
      console.error('Error sending message:', error)
    }
  }

  const selectedSession = sessions.find(session => session._id === selectedSessionId)
  return (
    <ResizablePanelGroup direction="horizontal" className="h-full">
      <ResizablePanel defaultSize={25} minSize={20} maxSize={40}>
        <ChatSessionList
          sessions={sessions.map(session => ({
            _id: session._id,
            businessId: session.businessId,
            customerName: session.customerDetails?.name || "Unknown Customer",
            lastMessageTime: new Date(session.updatedAt)
          }))}
          selectedSessionId={selectedSessionId}
          onSelectSession={(session) => setSelectedSessionId(session._id)}
        />
      </ResizablePanel>
      <ResizableHandle className="w-1 bg-white/10 hover:bg-white/20 transition-colors" />
      <ResizablePanel defaultSize={75}>
        {selectedSession ? (
          <ChatWindow
            session={{
              _id: selectedSession._id,
              businessId: selectedSession.businessId,
              customerName: selectedSession.customerDetails?.name || "Unknown Customer",
              lastMessageTime: new Date(selectedSession.updatedAt)
            }}
            messages={messages.map(msg => ({
              id: msg._id,
              content: msg.content,
              sender: msg.sender === "bot" ? "customer" : "user",
              timestamp: new Date(msg.displayTime)
            }))}
            onSendMessage={handleSendMessage}
          />
        ) : (
          children
        )}
      </ResizablePanel>
    </ResizablePanelGroup>
  )
} 