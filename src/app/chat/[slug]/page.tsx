"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useParams, useSearchParams } from "next/navigation"
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
  const params = useParams();
  // Defensive: params.slug may be undefined
  const slug = typeof params.slug === "string" ? params.slug : Array.isArray(params.slug) ? params.slug[0] : "";
  const searchParams = useSearchParams();
  const isEmbed = searchParams.get('embed') === 'true';

  // Core chat state
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sessionId, setSessionId] = useState<string | null>(null)
  
  // File upload state...
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
  
  // Refs
  const chatEndRef = useRef<HTMLDivElement | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)

  const apiEndpoint = `/ask/chat/${slug}`

  // --- useLiveChat callbacks with useCallback to avoid stale closures ---
  const handleChatStarted = useCallback((data: any) => {
    setWaitingForAgent(false)
    setChatRoom(data.room)
    setIsConnectedToAgent(true)
  }, [])

  const handleNewMessage = useCallback((data: any) => {
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
  }, [])

  const handleSystemMessage = useCallback((data: any) => {
    setMessages(prev => {
      const now = Date.now();
      const isDuplicate = prev.some(msg =>
        msg.senderType === 'system' &&
        msg.message === data.message &&
        msg.systemMessageType === data.systemMessageType &&
        Math.abs(now - new Date(msg.createdAt).getTime()) < 1000
      );
      if (isDuplicate) return prev;
      const systemMessage: ChatMessage = {
        _id: data._id || `system-${now}`,
        businessId: data.businessId || businessData?._id || '',
        sessionId: data.sessionId || sessionId || '',
        message: data.message,
        senderType: 'system',
        systemMessageType: data.systemMessageType,
        agentId: data.agentId,
        createdAt: data.createdAt || new Date().toISOString(),
        updatedAt: data.updatedAt || new Date().toISOString(),
      }
      return [...prev, systemMessage];
    });
  }, [businessData?._id, sessionId])

  const handleAgentDisconnected = useCallback((data: any) => {
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
  }, [businessData?._id, sessionId])

  const handleChatEnded = useCallback(() => {
    setIsConnectedToAgent(false)
    setChatRoom(null)
    setWaitingForAgent(false)
  }, [])

  // --- useLiveChat hook ---
  const { requestChat } = useLiveChat({
    waitingForAgent,
    escalationResponse,
    businessData,
    onChatStarted: handleChatStarted,
    onNewMessage: handleNewMessage,
    onSystemMessage: handleSystemMessage,
    onAgentDisconnectedDuringChat: handleAgentDisconnected,
    onChatEnded: handleChatEnded,
  })

  // --- Effects ---
  // Load business data
  useEffect(() => {
    if (!slug) return;
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
    if (!loading && inputRef.current) inputRef.current.focus()
  }, [loading])

  // --- Handlers ---
  // Handle file selection
  const handleFileSelect = (file: File) => {
    if (file.size > 10 * 1024 * 1024) {
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
        fileUrl: '',
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
      if (isConnectedToAgent) {
        if (fileToSend) {
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
          setMessages(prev => prev.map(msg => 
            msg._id === userMessage._id 
              ? { ...msg, attachments: response.data.data.attachments }
              : msg
          ))
          toast.success("File uploaded successfully!")
        } else {
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

      // For AI messages, we don't support file uploads yet, only text
      if (fileToSend) {
        toast.error("File uploads are only available when chatting with an agent. Please escalate to upload files.")
        setLoading(false)
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
      setMessages(prev => [...prev, aiMessage])
      if (!sessionId && response.data.sessionId) {
        setSessionId(response.data.sessionId)
      }
    } catch (err) {
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
    if (!formData.customerName || !formData.customerEmail) {
      setFormError("Name and Email are required.")
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
        message: `Your concern has been escalated to our support team. Case Number: ${response.data.caseNumber}. You will be connected to an available agent shortly.`,
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

  // Handle escalation dialog close
  const handleEscalationClose = () => {
    setEscalationVisible(false)
    setFormError(null)
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
    <div className={`h-screen bg-background overflow-hidden ${isEmbed ? 'embed-mode' : ''}`}>
      <div className={`${isEmbed ? 'h-full flex flex-col' : 'container mx-auto max-w-4xl p-4 h-full flex flex-col'}`}>
        {!isEmbed && <BusinessInfo businessData={businessData} businessLoading={businessLoading} />}
        <div className="flex-1 flex flex-col min-h-0">
          <ChatArea
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
        <div ref={chatEndRef} />
        <EscalationDialog
          open={escalationVisible}
          onOpenChange={(open: boolean) => {
            if (!open) {
              handleEscalationClose()
            }
          }}
          escalationSuccess={escalationSuccess}
          escalationResponse={escalationResponse}
          formData={formData}
          setFormData={setFormData}
          formError={formError}
          onSubmit={handleEscalationSubmit}
          onClose={handleEscalationClose}
        />
        <ToastContainer />
      </div>
      <style jsx global>{`
        body {
          margin: 0;
          overflow: hidden;
        }
        .embed-mode {
          padding: 0;
          margin: 0;
        }
        .embed-mode .container {
          padding: 8px;
          max-width: none;
        }
      `}</style>
    </div>
  )
}