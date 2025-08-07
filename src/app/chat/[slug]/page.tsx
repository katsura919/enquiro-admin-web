"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useParams } from "next/navigation"
import api from "@/utils/api"
import type { ChatMessage } from "@/types/ChatMessage"

// Components
import BusinessInfo from "./components/BusinessInfo"
import ChatArea from "./components/ChatArea"
import EscalationDialog from "./components/EscalationDialog"
import { useLiveChat } from "./components/useLiveChat"
import { ToastContainer } from "@/components/ui/toast"
import { toast } from "@/hooks/useToast"

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
  
  // File upload state
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [filePreview, setFilePreview] = useState<string | null>(null)
  const [uploadLoading, setUploadLoading] = useState(false)
  
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

  const apiEndpoint = `/ask/chat/${slug}`

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
          messageType: data.messageType || 'text',
          attachments: data.attachments || [],
          senderType: 'agent',
          agentId: data.agentId,
          createdAt: data.createdAt,
          updatedAt: data.createdAt,
        }
        setMessages(prev => [...prev, agentMessage])
        console.log('[CHAT] Received message from agent:', data.message)
      }
    },
    onSystemMessage: (data) => {
      // Handle system messages from backend
      console.log('[CHAT] System message received:', data);
      
      // Check for duplicate messages by message content and timestamp (within 1 second)
      const now = new Date().getTime();
      const isDuplicate = messages.some(msg => 
        msg.senderType === 'system' && 
        msg.message === data.message &&
        msg.systemMessageType === data.systemMessageType &&
        Math.abs(now - new Date(msg.createdAt).getTime()) < 1000 // within 1 second
      );
      
      if (isDuplicate) {
        console.log('[CHAT] Skipping duplicate system message:', data.message);
        return;
      }
      
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
      console.log('[CHAT] Added system message to chat:', data.message)
    },
    onAgentDisconnectedDuringChat: (data) => {
      console.log('[CHAT] Agent disconnected during active chat:', data);
      // Add system message about agent disconnection
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
      // Reset connection state but keep waiting for reassignment
      setIsConnectedToAgent(false)
      setChatRoom(null)
      setWaitingForAgent(true) // Keep waiting for reassignment
    },
    onChatEnded: (data) => {
      console.log('[CHAT] onChatEnded received:', data);
      setIsConnectedToAgent(false)
      setChatRoom(null)
      setWaitingForAgent(false)
      console.log('[CHAT] Agent disconnected, switched back to AI mode')
    }
  })

  // Load business data
  useEffect(() => {
    setBusinessLoading(true)
    api
      .get(`/business/slug/${slug}`)
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

  // Handle file selection
  const handleFileSelect = (file: File) => {
    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      toast.error("File size must be less than 10MB")
      return
    }

    const allowedTypes = [
      'image/jpeg', 'image/png', 'image/gif', 'image/webp',
      'application/pdf', 'application/msword', 
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ]

    if (!allowedTypes.includes(file.type)) {
      toast.error("File type not supported. Please upload images, PDFs, or documents.")
      return
    }

    setSelectedFile(file)
    
    // Create preview for images
    if (file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setFilePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    } else {
      setFilePreview(null)
    }

    toast.success(`File "${file.name}" selected`)
  }

  // Clear file selection
  const clearFile = () => {
    setSelectedFile(null)
    setFilePreview(null)
  }

  // Handle chat message submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if ((!newMessage.trim() && !selectedFile) || !slug) return

    setLoading(true)
    setError(null)

    // Create user message
    const userMessage: ChatMessage = {
      _id: Date.now().toString(),
      businessId: businessData?._id || '',
      sessionId: sessionId || '',
      message: newMessage.trim() || undefined,
      messageType: selectedFile ? (selectedFile.type.startsWith('image/') ? 'image' : 'file') : 'text',
      attachments: selectedFile ? [{
        fileName: selectedFile.name,
        fileUrl: '', // Will be set after upload
        fileSize: selectedFile.size,
        mimeType: selectedFile.type,
        uploadedAt: new Date().toISOString()
      }] : [],
      senderType: 'customer',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    
    setMessages((prev) => [...prev, userMessage])
    const messageToSend = newMessage
    const fileToSend = selectedFile
    setNewMessage("")
    clearFile()

    try {
      // Debug logging to see what's happening
      console.log('[SUBMIT] Chat state:', { 
        isConnectedToAgent,
        escalationResponse: !!escalationResponse,
        hasFile: !!fileToSend
      });

      // If connected to agent, send message via chat controller
      if (isConnectedToAgent) {
        console.log('[SUBMIT] Sending to agent via chat endpoint');
        
        if (fileToSend) {
          // Send file message
          const formData = new FormData()
          formData.append('file', fileToSend)
          formData.append('businessId', businessData?._id || '')
          formData.append('sessionId', sessionId || '')
          formData.append('senderType', 'customer')
          formData.append('escalationId', escalationResponse?._id || '')
          if (messageToSend.trim()) {
            formData.append('message', messageToSend)
          }

          const response = await api.post('/chat/send-message-with-file', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          })
          
          // Update the message with the actual file URL
          setMessages(prev => prev.map(msg => 
            msg._id === userMessage._id 
              ? { ...msg, attachments: response.data.data.attachments }
              : msg
          ))
          
          toast.success("File uploaded successfully!")
        } else {
          // Send text message
          await api.post('/chat/send-message', {
            businessId: businessData?._id,
            sessionId,
            message: messageToSend,
            senderType: 'customer',
            escalationId: escalationResponse?._id
          })
        }
        setLoading(false)
        return
      }

      console.log('[SUBMIT] Sending to AI via ask endpoint');
      // For AI messages, we don't support file uploads yet, only text
      if (fileToSend) {
        toast.error("File uploads are only available when chatting with an agent. Please escalate to upload files.")
        setLoading(false)
        // Remove the message from UI since upload failed
        setMessages(prev => prev.filter(msg => msg._id !== userMessage._id))
        return
      }

      // Send to AI bot using the original endpoint
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
      console.error('Error sending message:', err)
      
      // Remove the failed message from UI
      setMessages(prev => prev.filter(msg => msg._id !== userMessage._id))
      
      if (fileToSend) {
        toast.error("Failed to upload file. Please try again.")
      } else {
        toast.error("Failed to send message. Please try again.")
      }
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
      const response = await api.post('/escalation', {
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

      // Close the dialog immediately after successful submission
      setEscalationVisible(false)
      
    } catch (error: any) {
      setFormError(error.response?.data?.error || "Failed to submit escalation. Please try again.")
    }
  }

  // Handle escalation dialog close
  const handleEscalationClose = () => {
    setEscalationVisible(false)
    setFormError(null) // Clear any form errors
    
    // Only reset form data if not waiting for agent (to allow re-opening dialog for edits)
    if (!waitingForAgent) {
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
  }

  return (
    <div className="h-screen bg-background overflow-hidden">
      {/* Main container */}
      <div className="container mx-auto max-w-4xl p-4 h-full flex flex-col">
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
            escalationResponse={escalationResponse}
            selectedFile={selectedFile}
            filePreview={filePreview}
            onFileSelect={handleFileSelect}
            onFileClear={clearFile}
            uploadLoading={uploadLoading}
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

        {/* Toast Container */}
        <ToastContainer />
      </div>
    </div>
  )
}