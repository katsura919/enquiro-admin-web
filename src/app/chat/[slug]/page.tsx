"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useParams, useSearchParams } from "next/navigation"
import api from "@/utils/api"
import type { ChatMessage } from "@/types/ChatMessage"

// Components
import BusinessInfo from "./components/BusinessInfo"
import ChatArea from "./components/ChatArea"
import EscalationDialog from "./components/EscalationDialog"
import SupportRequestDialog from "./components/SupportRequestDialog"
import AgentRatingDialog from "./components/AgentRatingDialog"
import CaseFollowUpDialog from "./components/CaseFollowUpDialog"
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

interface ChatbotSettings {
  _id: string
  businessId: string
  chatbotName: string
  chatbotIcon: string
  enableLiveChat: boolean
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

interface ContinuationData {
  caseId: string
  sessionId: string
}

export default function ChatPage() {
  const { slug } = useParams()
  const searchParams = useSearchParams()
  const isEmbed = searchParams.get('embed') === 'true'
  
  // Core chat state
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sessionId, setSessionId] = useState<string | null>(null)
  console.log(sessionId)
  // File upload state
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [filePreview, setFilePreview] = useState<string | null>(null)
  const [uploadLoading, setUploadLoading] = useState(false)
  
  // Business data
  const [businessData, setBusinessData] = useState<BusinessData | null>(null)
  const [businessLoading, setBusinessLoading] = useState(true)
  
  // Chatbot settings
  const [chatbotSettings, setChatbotSettings] = useState<ChatbotSettings | null>(null)
  const [chatbotSettingsLoading, setChatbotSettingsLoading] = useState(false)
  
  // Escalation state (for live chat)
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
  
  // Support request state (for form-only when live chat disabled)
  const [supportRequestVisible, setSupportRequestVisible] = useState(false)
  const [supportRequestSuccess, setSupportRequestSuccess] = useState(false)
  const [supportRequestResponse, setSupportRequestResponse] = useState<EscalationResponse | null>(null)
  const [supportRequestFormData, setSupportRequestFormData] = useState<EscalationFormData>({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    concern: "",
    description: "",
  })
  const [supportRequestFormError, setSupportRequestFormError] = useState<string | null>(null)
  
  // Case continuation state
  const [continuationData, setContinuationData] = useState<ContinuationData | null>(null)
  const [caseFollowUpVisible, setCaseFollowUpVisible] = useState(false)
  const [caseFollowUpLoading, setCaseFollowUpLoading] = useState(false)
  const [caseFollowUpError, setCaseFollowUpError] = useState<string | null>(null)
  
  // Agent rating state
  const [ratingDialogVisible, setRatingDialogVisible] = useState(false)
  const [ratingSuccess, setRatingSuccess] = useState(false)
  const [ratingLoading, setRatingLoading] = useState(false)
  const [currentAgentInfo, setCurrentAgentInfo] = useState<{ id: string, name?: string, email?: string } | null>(null)
  const [chatEndedNormally, setChatEndedNormally] = useState(false)
  
  // Live chat state
  const [waitingForAgent, setWaitingForAgent] = useState(false)
  const [chatRoom, setChatRoom] = useState<string | null>(null)
  const [isConnectedToAgent, setIsConnectedToAgent] = useState(false)
  console.log("isConnectedToAgent:", isConnectedToAgent)
  
  // Refs
  const chatEndRef = useRef<HTMLDivElement | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)
  const ratingTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const apiEndpoint = `/ask/chat/${slug}`

  // Agent rating functions
  const submitAgentRating = async (rating: number, feedback: string) => {
    if (!escalationResponse || !currentAgentInfo) {
      console.error('Missing data for rating submission')
      return
    }

    setRatingLoading(true)
    try {
      await api.post('/agent-rating', {
        businessId: businessData?._id,
        sessionId: sessionId,
        agentId: currentAgentInfo.id,
        caseNumber: escalationResponse.caseNumber,
        rating: rating,
        feedback: feedback || null
      })
      
      setRatingSuccess(true)
      // Auto-close the success dialog after 3 seconds
      setTimeout(() => {
        setRatingDialogVisible(false)
        setRatingSuccess(false)
      }, 3000)
    } catch (error) {
      console.error('Failed to submit rating:', error)
      toast.error('Failed to submit rating. Please try again.')
    } finally {
      setRatingLoading(false)
    }
  }

  const handleRatingSkip = () => {
    setRatingDialogVisible(false)
    setRatingSuccess(false)
  }

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
      
      // Capture agent info for rating
      setCurrentAgentInfo({
        id: data.agentId,
        name: undefined, // Will be populated from agent messages
        email: undefined
      })
      
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
        
        // Update agent info if available in the message data
        if (data.agentId && (data.agentName || data.agentEmail)) {
          setCurrentAgentInfo(prev => prev ? {
            ...prev,
            name: data.agentName || prev.name,
            email: data.agentEmail || prev.email
          } : {
            id: data.agentId,
            name: data.agentName,
            email: data.agentEmail
          })
        }
        
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
      
      // Don't show rating for unexpected disconnections
      setChatEndedNormally(false)
    },
    onChatEnded: (data) => {
      console.log('[CHAT] onChatEnded received:', data);
      setIsConnectedToAgent(false)
      setChatRoom(null)
      setWaitingForAgent(false)
      setChatEndedNormally(true)
      
      // Show rating dialog after a short delay if conditions are met:
      // 1. We have agent info
      // 2. We have escalation response (valid chat session)
      // 3. Chat ended normally (not due to errors or disconnections)
      // 4. User was actually connected to an agent
      if (currentAgentInfo && escalationResponse && chatEndedNormally && !ratingDialogVisible) {
        // Clear any existing timeout
        if (ratingTimeoutRef.current) {
          clearTimeout(ratingTimeoutRef.current)
        }
        
        ratingTimeoutRef.current = setTimeout(() => {
          setRatingDialogVisible(true)
          ratingTimeoutRef.current = null
        }, 2000) // 2 second delay to let users process the chat ending
      }
      
      console.log('[CHAT] Agent disconnected, switched back to AI mode')
    },
    onChatError: (data) => {
      console.log('[CHAT] Chat error received:', data);
      
      if (data.type === 'live_chat_disabled') {
        // Live chat is disabled for this business
        setWaitingForAgent(false)
        setIsConnectedToAgent(false)
        setChatRoom(null)
        
        // Add system message explaining live chat is not available
        const errorMessage: ChatMessage = {
          _id: `chat-error-${Date.now()}`,
          businessId: businessData?._id || '',
          sessionId: sessionId || '',
          message: data.message || 'Live chat is not available. Please fill out the form to submit your request.',
          senderType: 'system',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
        setMessages(prev => [...prev, errorMessage])
      } else {
        // Other chat errors
        const errorMessage: ChatMessage = {
          _id: `chat-error-${Date.now()}`,
          businessId: businessData?._id || '',
          sessionId: sessionId || '',
          message: data.message || 'An error occurred with the chat connection.',
          senderType: 'system',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
        setMessages(prev => [...prev, errorMessage])
      }
    }
  })

  // Load business data
  useEffect(() => {
    setBusinessLoading(true)
    api
      .get(`/business/slug/${slug}`)
      .then((res) => {
        setBusinessData(res.data)
        // Fetch chatbot settings after getting business data
        if (res.data?._id) {
          setChatbotSettingsLoading(true)
          return api.get(`/chatbot-settings/${res.data._id}`)
        }
      })
      .then((chatbotRes) => {
        if (chatbotRes?.data?.success) {
          setChatbotSettings(chatbotRes.data.data)
        }
      })
      .catch((error) => {
        console.error('Error loading business or chatbot settings:', error)
        setBusinessData(null)
      })
      .finally(() => {
        setBusinessLoading(false)
        setChatbotSettingsLoading(false)
      })
  }, [slug])

  // Auto scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Focus input when not loading
  useEffect(() => {
    if (!loading) inputRef.current?.focus()
  }, [loading])

  // Cleanup rating timeout on unmount
  useEffect(() => {
    return () => {
      if (ratingTimeoutRef.current) {
        clearTimeout(ratingTimeoutRef.current)
      }
    }
  }, [])

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
        _id: response.data.aiChatId || `${Date.now()}-response`, // Use backend ID or fallback
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

  // Handle escalation click - now supports new, continue, and form escalations
  const handleEscalationClick = (escalationData?: { type: 'new' | 'continue' | 'form', caseId?: string, sessionId?: string }) => {
    if (escalationData?.type === 'continue') {
      // Show case follow-up dialog to accept case number
      setCaseFollowUpVisible(true)
      setCaseFollowUpError(null)
    } else {
      // Check if live chat is enabled to determine which dialog to show
      const liveChatEnabled = chatbotSettings?.enableLiveChat !== false
      
      if (liveChatEnabled) {
        // Show live chat escalation dialog
        setEscalationVisible(true)
      } else {
        // Show support request form (form-only mode)
        setSupportRequestVisible(true)
      }
    }
  }

  // Handle message updates (like rating changes)
  const handleUpdateMessage = useCallback((updatedMessage: ChatMessage) => {
    setMessages(prev => 
      prev.map(msg => 
        msg._id === updatedMessage._id ? updatedMessage : msg
      )
    )
  }, [])

  // Handle case number submission for follow-up
  const handleCaseNumberSubmit = async (caseNumber: string) => {
    setCaseFollowUpLoading(true)
    setCaseFollowUpError(null)

    try {
      if (!businessData?._id) {
        setCaseFollowUpError('Business information not available.')
        setCaseFollowUpLoading(false)
        return
      }

      // Call API to validate case number and get escalation data
      const response = await api.get(`/escalation/case/${caseNumber}?businessId=${businessData._id}`)
      
      const escalationData = response.data

      // Set continuation data
      setContinuationData({
        caseId: escalationData._id,
        sessionId: escalationData.sessionId
      })
      
      // Set the session to the existing one for continuation
      setSessionId(escalationData.sessionId)
      
      // Mark that we have an escalation response
      setEscalationResponse({
        _id: escalationData._id,
        businessId: escalationData.businessId,
        sessionId: escalationData.sessionId,
        caseNumber: escalationData.caseNumber,
        customerName: escalationData.customerName,
        customerEmail: escalationData.customerEmail,
        customerPhone: escalationData.customerPhone || '',
        concern: escalationData.concern,
        description: escalationData.description || '',
        createdAt: escalationData.createdAt,
        updatedAt: escalationData.updatedAt
      })
      
      setWaitingForAgent(true)
      
      // Close the case follow-up dialog
      setCaseFollowUpVisible(false)
      
      // Add system message about case continuation
      const continuationMessage: ChatMessage = {
        _id: `continuation-${Date.now()}`,
        businessId: businessData._id,
        sessionId: escalationData.sessionId,
        message: `Case #${caseNumber} found! Welcome back, ${escalationData.customerName}. Connecting you to an available agent...`,
        senderType: 'system',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      setMessages(prev => [...prev, continuationMessage])
      
      // Request live chat with existing escalation ID and business ID
      requestChat(escalationData._id, businessData._id)
      
    } catch (error: any) {
      console.error('Error validating case number:', error)
      const errorMessage = error.response?.data?.error || 'Case not found. Please check your case number and try again.'
      setCaseFollowUpError(errorMessage)
    } finally {
      setCaseFollowUpLoading(false)
    }
  }

  // Handle support request form submission (when live chat is disabled)
  const handleSupportRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSupportRequestFormError(null)

    if (!sessionId) {
      setSupportRequestFormError("No active session. Please start a conversation first.")
      return
    }

    if (!businessData?._id) {
      setSupportRequestFormError("Business information not available.")
      return
    }

    if (!supportRequestFormData.customerName || !supportRequestFormData.customerEmail) {
      setSupportRequestFormError("Name and Email are required.")
      return
    }

    if (!supportRequestFormData.concern || !supportRequestFormData.description) {
      setSupportRequestFormError("Concern and Description are required.")
      return
    }

    if (supportRequestFormData.concern.trim().length < 5) {
      setSupportRequestFormError("Please provide a more detailed concern (at least 5 characters).")
      return
    }

    if (supportRequestFormData.description.trim().length < 10) {
      setSupportRequestFormError("Please provide a more detailed description (at least 10 characters).")
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(supportRequestFormData.customerEmail)) {
      setSupportRequestFormError("Please enter a valid email address.")
      return
    }

    const phoneRegex = /^\+?[\d\s-]{10,}$/
    if (supportRequestFormData.customerPhone && !phoneRegex.test(supportRequestFormData.customerPhone)) {
      setSupportRequestFormError("Please enter a valid phone number.")
      return
    }

    try {
      const response = await api.post('/escalation', {
        businessId: businessData._id,
        sessionId,
        customerName: supportRequestFormData.customerName,
        customerEmail: supportRequestFormData.customerEmail,
        customerPhone: supportRequestFormData.customerPhone,
        concern: supportRequestFormData.concern,
        description: supportRequestFormData.description
      })

      setSupportRequestResponse(response.data)
      setSupportRequestSuccess(true)
      
      // Add system message about successful form submission
      const formSubmissionMessage: ChatMessage = {
        _id: `support-request-${Date.now()}`,
        businessId: businessData._id,
        sessionId: sessionId || '',
        message: response.data.message || `Your support request has been submitted successfully. Case Number: ${response.data.caseNumber}. Our team will review your request and get back to you.`,
        senderType: 'system',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      setMessages(prev => [...prev, formSubmissionMessage])

      // Close the dialog immediately after successful submission
      setSupportRequestVisible(false)
      
    } catch (error: any) {
      setSupportRequestFormError(error.response?.data?.error || "Failed to submit support request. Please try again.")
    }
  }

  // Handle escalation form submission (for live chat)
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
      
      // Live chat enabled - proceed with normal flow
      setWaitingForAgent(true)
      
      // Add system message about escalation with live chat
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
    
    // Always reset form data and success state when dialog is closed
    setEscalationSuccess(false)
    setEscalationResponse(null)
    setFormData({
      customerName: "",
      customerEmail: "",
      customerPhone: "",
      concern: "",
      description: "",
    })
    
    // Reset rating state and clear timeout
    setRatingDialogVisible(false)
    setRatingSuccess(false)
    setCurrentAgentInfo(null)
    setChatEndedNormally(false)
    if (ratingTimeoutRef.current) {
      clearTimeout(ratingTimeoutRef.current)
      ratingTimeoutRef.current = null
    }
  }

  // Handle support request dialog close
  const handleSupportRequestClose = () => {
    setSupportRequestVisible(false)
    setSupportRequestFormError(null) // Clear any form errors
    
    // Always reset form data and success state when dialog is closed
    setSupportRequestSuccess(false)
    setSupportRequestResponse(null)
    setSupportRequestFormData({
      customerName: "",
      customerEmail: "",
      customerPhone: "",
      concern: "",
      description: "",
    })
  }

  return (
    <div className={`h-screen bg-background overflow-hidden ${isEmbed ? 'embed-mode' : ''}`}>
      {/* Main container */}
      <div className={`${isEmbed ? 'h-full flex flex-col' : 'container mx-auto max-w-4xl p-4 h-full flex flex-col'}`}>
        {/* Business Info - Hide in embed mode */}
        {!isEmbed && (
          <BusinessInfo 
            businessData={businessData} 
            businessLoading={businessLoading}
            chatbotSettings={chatbotSettings}
            chatbotSettingsLoading={chatbotSettingsLoading}
          />
        )}

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
            onEscalationClick={handleEscalationClick}
            disabled={loading || businessLoading}
            placeholder={isConnectedToAgent ? "Type your message to the agent..." : "Type your message here..."}
            isLiveChatMode={isConnectedToAgent}
            escalationResponse={escalationResponse}
            selectedFile={selectedFile}
            filePreview={filePreview}
            onFileSelect={handleFileSelect}
            onFileClear={clearFile}
            uploadLoading={uploadLoading}
            chatbotName={chatbotSettings?.chatbotName || "AI Assistant"}
            chatbotIcon={chatbotSettings?.chatbotIcon || businessData?.logo}
            onUpdateMessage={handleUpdateMessage}
          />
        </div>

        {/* Escalation Dialog (for live chat) */}
        <EscalationDialog
          open={escalationVisible}
          onOpenChange={(open) => {
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

        {/* Support Request Dialog (for form-only when live chat disabled) */}
        <SupportRequestDialog
          open={supportRequestVisible}
          onOpenChange={(open) => {
            if (!open) {
              handleSupportRequestClose()
            }
          }}
          requestSuccess={supportRequestSuccess}
          requestResponse={supportRequestResponse}
          formData={supportRequestFormData}
          setFormData={setSupportRequestFormData}
          formError={supportRequestFormError}
          onSubmit={handleSupportRequestSubmit}
          onClose={handleSupportRequestClose}
        />

        {/* Agent Rating Dialog */}
        <AgentRatingDialog
          open={ratingDialogVisible}
          onOpenChange={setRatingDialogVisible}
          agentInfo={currentAgentInfo}
          caseNumber={escalationResponse?.caseNumber}
          onSubmit={submitAgentRating}
          onSkip={handleRatingSkip}
          loading={ratingLoading}
          success={ratingSuccess}
        />

        {/* Case Follow-Up Dialog */}
        <CaseFollowUpDialog
          open={caseFollowUpVisible}
          onOpenChange={setCaseFollowUpVisible}
          onSubmit={handleCaseNumberSubmit}
          isLoading={caseFollowUpLoading}
          error={caseFollowUpError}
        />

        {/* Toast Container */}
        <ToastContainer />
      </div>
      
      {/* Embed-specific styles */}
      {isEmbed && (
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
      )}
    </div>
  )
}