"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useParams } from "next/navigation"
import axios from "axios"
import type { ChatMessage } from "@/types/ChatMessage"

// Components
import BusinessInfo from "./components/BusinessInfo"
import ChatArea from "./components/ChatArea"
import EscalationDialog from "./components/EscalationDialog"
import { useLiveChat } from "./components/useLiveChat"

const API_URL = process.env.NEXT_PUBLIC_API_URL

interface EscalationResponse {
  businessId: string
  sessionId: string
  caseNumber: string
  customerName: string
  customerEmail: string
  customerPhone: string
  concern: string
  description: string
  _id: string
  createdAt: string
  updatedAt: string
}

interface BusinessData {
  _id: string
  name: string
  description: string
  logo: string
}

interface EscalationFormData {
  customerName: string
  customerEmail: string
  customerPhone: string
  concern: string
  description: string
}

export default function ChatPage() {
  const { slug } = useParams()
  
  // Core chat state
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sessionId, setSessionId] = useState<string | null>(null)
  
  // Business data
  const [businessData, setBusinessData] = useState<BusinessData | null>(null)
  const [businessLoading, setBusinessLoading] = useState(true)
  
  // Escalation state
  const [escalationVisible, setEscalationVisible] = useState(false)
  const [escalationSuccess, setEscalationSuccess] = useState(false)
  const [escalationResponse, setEscalationResponse] = useState<EscalationResponse | null>(null)
  const [formData, setFormData] = useState<EscalationFormData>({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    concern: "",
    description: "",
  })
  const [formError, setFormError] = useState<string | null>(null)
  
  // Live chat state
  const [waitingForAgent, setWaitingForAgent] = useState(false)
  const [chatRoom, setChatRoom] = useState<string | null>(null)
  const [isConnectedToAgent, setIsConnectedToAgent] = useState(false)
  console.log("isConnectedToAgent:", isConnectedToAgent)
  
  // Refs
  const chatEndRef = useRef<HTMLDivElement | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)

  const apiEndpoint = `${API_URL}/ask/chat/${slug}`

  // Live chat hook
  const { requestChat } = useLiveChat({
    waitingForAgent,
    escalationResponse,
    businessData,
    onChatStarted: (data) => {
      console.log('[CHAT] onChatStarted received:', data);
      setWaitingForAgent(false)
      setChatRoom(data.room)
      setIsConnectedToAgent(true)
      console.log('[CHAT] Setting chatRoom to:', data.room);
      // Add system message that agent joined
      const agentJoinedMessage: ChatMessage = {
        _id: `agent-joined-${Date.now()}`,
        businessId: businessData?._id || '',
        sessionId: sessionId || '',
        message: 'An agent has joined the chat and will assist you shortly.',
        senderType: 'system',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      setMessages(prev => [...prev, agentJoinedMessage])
      console.log('[CHAT] Switched to live chat mode with agent')
    },
    onNewMessage: (data) => {
      // Handle incoming messages from agent
      if (data.senderType === 'agent') {
        const agentMessage: ChatMessage = {
          _id: data._id,
          businessId: data.businessId,
          sessionId: data.sessionId,
          message: data.message,
          senderType: 'agent',
          agentId: data.agentId,
          createdAt: data.createdAt,
          updatedAt: data.createdAt,
        }
        setMessages(prev => [...prev, agentMessage])
        console.log('[CHAT] Received message from agent:', data.message)
      }
    },
    onChatEnded: (data) => {
      console.log('[CHAT] onChatEnded received:', data);
      setIsConnectedToAgent(false)
      setChatRoom(null)
      setWaitingForAgent(false)
      // Add system message that agent left
      const agentLeftMessage: ChatMessage = {
        _id: `agent-left-${Date.now()}`,
        businessId: businessData?._id || '',
        sessionId: sessionId || '',
        message: data.message || 'The agent has left the chat. Thank you for contacting us.',
        senderType: 'system',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      setMessages(prev => [...prev, agentLeftMessage])
      console.log('[CHAT] Agent disconnected, switched back to AI mode')
    }
  })

  // Load business data
  useEffect(() => {
    setBusinessLoading(true)
    axios
      .get(`${API_URL}/business/slug/${slug}`)
      .then((res) => setBusinessData(res.data))
      .catch(() => setBusinessData(null))
      .finally(() => setBusinessLoading(false))
  }, [slug])

  // Auto scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Focus input when not loading
  useEffect(() => {
    if (!loading) inputRef.current?.focus()
  }, [loading])

  // Handle chat message submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !slug) return

    setLoading(true)
    setError(null)

    const userMessage: ChatMessage = {
      _id: Date.now().toString(),
      businessId: businessData?._id || '',
      sessionId: sessionId || '',
      message: newMessage,
      senderType: 'customer',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    setMessages((prev) => [...prev, userMessage])
    const messageToSend = newMessage
    setNewMessage("")

    try {
      // Debug logging to see what's happening
      console.log('[SUBMIT] Chat state:', { 
        isConnectedToAgent,
        escalationResponse: !!escalationResponse
      });

      // If connected to agent, send message via chat controller
      if (isConnectedToAgent) {
        console.log('[SUBMIT] Sending to agent via chat endpoint');
        await axios.post(`${API_URL}/chat/send-message`, {
          businessId: businessData?._id,
          sessionId,
          message: messageToSend,
          senderType: 'customer',
          escalationId: escalationResponse?._id
        })
        setLoading(false)
        return
      }

      console.log('[SUBMIT] Sending to AI via ask endpoint');
      // Otherwise, send to AI bot using the original endpoint
      const body: any = {
        query: messageToSend,
        history: messages.map(({ senderType, message }) => ({ 
          role: senderType === 'customer' ? 'user' : senderType, 
          content: message 
        })),
      }
      
      if (!sessionId) {
        body.customerDetails = {
          name: "Guest",
          email: "guest@example.com",
          phoneNumber: "0000000000",
        }
      } else {
        body.sessionId = sessionId
      }
      
      const response = await axios.post(apiEndpoint, body)
      const aiMessage: ChatMessage = {
        _id: `${Date.now()}-response`,
        businessId: businessData?._id || '',
        sessionId: sessionId || response.data.sessionId || '',
        message: response.data.answer,
        senderType: 'ai',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      setMessages((prev) => [...prev, aiMessage])
      
      if (!sessionId && response.data.sessionId) {
        setSessionId(response.data.sessionId)
      }
    } catch (err) {
      console.error('Error sending message:', err)
      setError("Failed to send message. Try again.")
    } finally {
      setLoading(false)
    }
  }

  // Handle escalation submission
  const handleEscalationSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)

    if (!sessionId) {
      setFormError("No active session. Please start a conversation first.")
      return
    }

    if (!businessData?._id) {
      setFormError("Business information not available.")
      return
    }

    if (!formData.customerName || !formData.customerEmail || !formData.concern) {
      setFormError("Name, Email, and Concern are required.")
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.customerEmail)) {
      setFormError("Please enter a valid email address.")
      return
    }

    const phoneRegex = /^\+?[\d\s-]{10,}$/
    if (formData.customerPhone && !phoneRegex.test(formData.customerPhone)) {
      setFormError("Please enter a valid phone number.")
      return
    }

    try {
      const response = await axios.post(`${API_URL}/escalation`, {
        businessId: businessData._id,
        sessionId,
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        customerPhone: formData.customerPhone,
        concern: formData.concern,
        description: formData.description
      })

      setEscalationResponse(response.data)
      setEscalationSuccess(true)
      setWaitingForAgent(true)
      
      // Add system message about escalation
      const escalationMessage: ChatMessage = {
        _id: `escalation-${Date.now()}`,
        businessId: businessData._id,
        sessionId: sessionId || '',
        message: `Your concern has been escalated to our support team. Case Number: ${response.data.caseNumber}. You will be connected to an available agent shortly.`,
        senderType: 'system',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      setMessages(prev => [...prev, escalationMessage])
      
      // Request live chat
      requestChat(response.data._id, businessData._id)
      
    } catch (error: any) {
      setFormError(error.response?.data?.error || "Failed to submit escalation. Please try again.")
    }
  }

  // Handle escalation dialog close
  const handleEscalationClose = () => {
    setEscalationVisible(false)
    setEscalationSuccess(false)
    setEscalationResponse(null)
    setFormData({
      customerName: "",
      customerEmail: "",
      customerPhone: "",
      concern: "",
      description: "",
    })
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Main container */}
      <div className="container mx-auto max-w-4xl p-4 min-h-screen flex flex-col">
        {/* Business Info */}
        <BusinessInfo businessData={businessData} businessLoading={businessLoading} />

        {/* Chat Area */}
        <div className="flex-1 flex flex-col min-h-0">
          <ChatArea
            ref={chatEndRef}
            messages={messages}
            waitingForAgent={waitingForAgent}
            loading={loading}
            error={error}
            newMessage={newMessage}
            onMessageChange={setNewMessage}
            onSubmit={handleSubmit}
            onEscalationClick={() => setEscalationVisible(true)}
            disabled={loading || businessLoading}
            placeholder={isConnectedToAgent ? "Type your message to the agent..." : "Type your message here..."}
            isLiveChatMode={isConnectedToAgent}
          />
        </div>

        {/* Escalation Dialog */}
        <EscalationDialog
          open={escalationVisible}
          onOpenChange={setEscalationVisible}
          escalationSuccess={escalationSuccess}
          escalationResponse={escalationResponse}
          formData={formData}
          setFormData={setFormData}
          formError={formError}
          onSubmit={handleEscalationSubmit}
          onClose={handleEscalationClose}
        />
      </div>
    </div>
  )
}