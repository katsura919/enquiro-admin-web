"use client"

import { useState, useEffect, useRef } from "react"
import { MessageCircle, X, Minimize2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import api from "@/utils/api"
import type { ChatMessage } from "@/types/ChatMessage"
import ChatWidgetArea from "./ChatWidgetArea"
import ChatWidgetEscalationDialog from "./ChatWidgetEscalationDialog"
import { useChatWidgetLiveChat } from "./useChatWidgetLiveChat"
import { toast } from "@/hooks/useToast"

interface BusinessData {
  _id: string
  name: string
  description: string
  logo: string
}

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

interface EscalationFormData {
  customerName: string
  customerEmail: string
  customerPhone: string
  concern: string
  description: string
}

interface ChatWidgetProps {
  businessSlug: string
  position?: 'bottom-right' | 'bottom-left'
  primaryColor?: string
  title?: string
}

export default function ChatWidget({ 
  businessSlug, 
  position = 'bottom-right',
  primaryColor = '#2563eb',
  title = 'Chat with us'
}: ChatWidgetProps) {
  // Widget state
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  
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
  
  // Refs
  const chatEndRef = useRef<HTMLDivElement | null>(null)

  const apiEndpoint = `/ask/chat/${businessSlug}`

  // Live chat hook
  const { requestChat } = useChatWidgetLiveChat({
    waitingForAgent,
    escalationResponse,
    businessData,
    onChatStarted: (data) => {
      setWaitingForAgent(false)
      setChatRoom(data.room)
      setIsConnectedToAgent(true)
    },
    onNewMessage: (data) => {
      if (data.senderType === 'agent') {
        const agentMessage: ChatMessage = {
          _id: data._id,
          businessId: data.businessId,
          sessionId: data.sessionId,
          message: data.message,
          messageType: data.messageType || 'text',
          attachments: data.attachments || [],
          senderType: 'agent',
          agentId: data.agentId,
          createdAt: data.createdAt,
          updatedAt: data.createdAt,
        }
        setMessages(prev => [...prev, agentMessage])
      }
    },
    onSystemMessage: (data) => {
      const now = new Date().getTime();
      const isDuplicate = messages.some(msg => 
        msg.senderType === 'system' && 
        msg.message === data.message &&
        msg.systemMessageType === data.systemMessageType &&
        Math.abs(now - new Date(msg.createdAt).getTime()) < 1000
      );
      
      if (isDuplicate) return;
      
      const systemMessage: ChatMessage = {
        _id: data._id || `system-${Date.now()}`,
        businessId: data.businessId || businessData?._id || '',
        sessionId: data.sessionId || sessionId || '',
        message: data.message,
        senderType: 'system',
        systemMessageType: data.systemMessageType,
        agentId: data.agentId,
        createdAt: data.createdAt || new Date().toISOString(),
        updatedAt: data.updatedAt || new Date().toISOString(),
      }
      setMessages(prev => [...prev, systemMessage])
    },
    onAgentDisconnectedDuringChat: (data) => {
      const disconnectionMessage: ChatMessage = {
        _id: `agent-disconnected-${Date.now()}`,
        businessId: businessData?._id || '',
        sessionId: sessionId || '',
        message: data.message || 'Agent has disconnected. You will be reassigned to another agent.',
        senderType: 'system',
        systemMessageType: 'agent_left',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      setMessages(prev => [...prev, disconnectionMessage])
      setIsConnectedToAgent(false)
      setChatRoom(null)
      setWaitingForAgent(true)
    },
    onChatEnded: (data) => {
      setIsConnectedToAgent(false)
      setChatRoom(null)
      setWaitingForAgent(false)
    }
  })

  // Load business data
  useEffect(() => {
    if (businessSlug) {
      setBusinessLoading(true)
      api
        .get(`/business/slug/${businessSlug}`)
        .then((res) => setBusinessData(res.data))
        .catch(() => setBusinessData(null))
        .finally(() => setBusinessLoading(false))
    }
  }, [businessSlug])

  // Auto scroll to bottom
  useEffect(() => {
    if (isOpen && !isMinimized) {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages, isOpen, isMinimized])

  // Handle chat message submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !businessSlug) return

    setLoading(true)
    setError(null)

    const userMessage: ChatMessage = {
      _id: Date.now().toString(),
      businessId: businessData?._id || '',
      sessionId: sessionId || '',
      message: newMessage.trim(),
      messageType: 'text',
      senderType: 'customer',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    
    setMessages((prev) => [...prev, userMessage])
    const messageToSend = newMessage
    setNewMessage("")

    try {
      if (isConnectedToAgent) {
        await api.post('/chat/send-message', {
          businessId: businessData?._id,
          sessionId,
          message: messageToSend,
          senderType: 'customer',
          escalationId: escalationResponse?._id
        })
        setLoading(false)
        return
      }

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
      
      const response = await api.post(apiEndpoint, body)
      const aiMessage: ChatMessage = {
        _id: `${Date.now()}-response`,
        businessId: businessData?._id || '',
        sessionId: sessionId || response.data.sessionId || '',
        message: response.data.answer,
        messageType: 'text',
        senderType: 'ai',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      setMessages((prev) => [...prev, aiMessage])
      
      if (!sessionId && response.data.sessionId) {
        setSessionId(response.data.sessionId)
      }
    } catch (err) {
      setMessages(prev => prev.filter(msg => msg._id !== userMessage._id))
      toast.error("Failed to send message. Please try again.")
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

    if (!formData.customerName || !formData.customerEmail) {
      setFormError("Name and Email are required.")
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.customerEmail)) {
      setFormError("Please enter a valid email address.")
      return
    }

    try {
      const response = await api.post('/escalation', {
        businessId: businessData._id,
        sessionId,
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        customerPhone: formData.customerPhone,
        concern: formData.concern || 'Live Chat Request',
        description: formData.description || 'Customer requested live chat support'
      })

      setEscalationResponse(response.data)
      setEscalationSuccess(true)
      setWaitingForAgent(true)
      
      const escalationMessage: ChatMessage = {
        _id: `escalation-${Date.now()}`,
        businessId: businessData._id,
        sessionId: sessionId || '',
        message: `Your support request has been submitted. Case Number: ${response.data.caseNumber}. You will be connected to an available agent shortly.`,
        senderType: 'system',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      setMessages(prev => [...prev, escalationMessage])
      
      requestChat(response.data._id, businessData._id)
      setEscalationVisible(false)
      
    } catch (error: any) {
      setFormError(error.response?.data?.error || "Failed to submit escalation. Please try again.")
    }
  }

  const positionClasses = {
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4'
  }

  return (
    <div className={`fixed ${positionClasses[position]} z-50`}>
      {/* Chat Widget Button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          size="lg"
          className="rounded-full w-14 h-14 shadow-lg hover:scale-105 transition-transform"
          style={{ backgroundColor: primaryColor }}
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}

      {/* Chat Widget Window */}
      {isOpen && (
        <Card className="w-80 h-96 flex flex-col shadow-xl border-0 overflow-hidden">
          {/* Header */}
          <div 
            className="p-4 text-white flex items-center justify-between"
            style={{ backgroundColor: primaryColor }}
          >
            <div className="flex items-center gap-3">
              {businessData?.logo && (
                <img 
                  src={businessData.logo} 
                  alt={businessData.name}
                  className="w-8 h-8 rounded-full bg-white/20"
                />
              )}
              <div>
                <h3 className="font-medium text-sm">
                  {businessData?.name || title}
                </h3>
                <p className="text-xs text-white/80">
                  {isConnectedToAgent ? 'Connected to agent' : 'AI Assistant'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(!isMinimized)}
                className="h-8 w-8 p-0 text-white hover:bg-white/20"
              >
                <Minimize2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="h-8 w-8 p-0 text-white hover:bg-white/20"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Chat Area */}
          {!isMinimized && (
            <div className="flex-1 flex flex-col min-h-0">
              <ChatWidgetArea
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
                escalationResponse={escalationResponse}
              />
            </div>
          )}

          {/* Escalation Dialog */}
          <ChatWidgetEscalationDialog
            open={escalationVisible}
            onOpenChange={setEscalationVisible}
            escalationSuccess={escalationSuccess}
            escalationResponse={escalationResponse}
            formData={formData}
            setFormData={setFormData}
            formError={formError}
            onSubmit={handleEscalationSubmit}
          />
        </Card>
      )}
    </div>
  )
}
