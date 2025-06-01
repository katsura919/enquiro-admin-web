"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { useAuth } from '@/lib/auth'
import ChatSessionList from "./components/ChatSessionList"
import ChatWindow from "./components/ChatWindow"
import { MessageSquare } from "lucide-react"

const API_URL = process.env.NEXT_PUBLIC_API_URL

export default function SessionsPage() {
  const { user } = useAuth()
  const [sessions, setSessions] = useState<any[]>([])
  const [selectedSession, setSelectedSession] = useState<any>(null)
  const [messages, setMessages] = useState<any[]>([])
  const [loadingSessions, setLoadingSessions] = useState(false)
  const [loadingMessages, setLoadingMessages] = useState(false)
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
  const businessId = user?.businessId
  console.log(sessions)
  // Fetch sessions for the business
  useEffect(() => {
    if (!businessId) return
    setLoadingSessions(true)
    axios.get(`${API_URL}/session/business/${businessId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => setSessions(
        res.data.map((session: any) => ({
          ...session,
          customerName: session.customerDetails?.name || "Unknown",
          lastMessageTime: session.createdAt,
        }))
      ))
      .catch(() => setSessions([]))
      .finally(() => setLoadingSessions(false))
  }, [businessId, token])

  // Fetch messages for the selected session
  useEffect(() => {
    if (!selectedSession) return setMessages([])
    setLoadingMessages(true)
    axios.get(`${API_URL}/chat/session/${selectedSession._id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => setMessages(
        res.data.flatMap((msg: any) => [
          {
            _id: msg._id + '-user',
            sessionId: msg.sessionId,
            content: msg.query,
            sender: "user",
            displayTime: msg.createdAt,
          },
          {
            _id: msg._id + '-ai',
            sessionId: msg.sessionId,
            content: msg.response,
            sender: "bot",
            displayTime: msg.createdAt,
          }
        ])
      ))
      .catch(() => setMessages([]))
      .finally(() => setLoadingMessages(false))
  }, [selectedSession, token])

  // Send a message
  const handleSendMessage = async (content: string) => {
    if (!selectedSession || !businessId) return
    const newMsg = {
      businessId,
      sessionId: selectedSession._id,
      query: content,
      response: "", // Will be filled by AI backend
    }
    try {
      const res = await axios.post(`${API_URL}/chat`, newMsg, {
        headers: { Authorization: `Bearer ${token}` },
      })
      // Refetch messages after sending
      axios.get(`${API_URL}/chat/session/${selectedSession._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(res => setMessages(
          res.data.flatMap((msg: any) => [
            {
              _id: msg._id + '-user',
              sessionId: msg.sessionId,
              content: msg.query,
              sender: "user",
              displayTime: msg.createdAt,
            },
            {
              _id: msg._id + '-ai',
              sessionId: msg.sessionId,
              content: msg.response,
              sender: "bot",
              displayTime: msg.createdAt,
            }
          ])
        ))
    } catch (err) {
      // handle error
    }
  }

  // Escalate session (placeholder)
  const handleEscalate = () => {
    // TODO: Implement API call for escalation
    if (selectedSession) {
      console.log("Escalate session:", selectedSession._id)
    }
  }

  return (
    <div className="flex items-center justify-center h-screen bg-white/5">
      <div className="text-center text-gray-400">
        <MessageSquare className="h-16 w-16 mx-auto mb-4" />
        <h2 className="text-xl font-semibold mb-2">Welcome to Chat Sessions</h2>
        <p>Select a chat session from the sidebar to start messaging</p>
      </div>
    </div>
  )
} 