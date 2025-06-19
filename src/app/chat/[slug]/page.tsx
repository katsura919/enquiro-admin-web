"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { SendHorizontal, Loader2, User, Bot, Copy, CheckCircle2, AlertCircle, AlertTriangle, Clock } from "lucide-react"
import { useParams } from "next/navigation"
import axios from "axios"
import { ScrollArea } from "@/components/ui/scroll-area"
import Markdown from "markdown-to-jsx"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { format } from "date-fns"
import { Label } from "@/components/ui/label"

const API_URL = process.env.NEXT_PUBLIC_API_URL

interface Message {
  id: string
  role: "user" | "ai"
  content: string
  timestamp: number
  isTyping?: boolean
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

const TypewriterEffect = ({ content, onComplete }: { content: string; onComplete?: () => void }) => {
  const [displayedContent, setDisplayedContent] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const speedRef = useRef(30);

  useEffect(() => {
    if (currentIndex < content.length) {
      const timeoutId = setTimeout(() => {
        setDisplayedContent(prev => prev + content[currentIndex]);
        setCurrentIndex(prev => prev + 1);
        
        // Adjust speed based on punctuation
        if (".!?".includes(content[currentIndex])) {
          speedRef.current = 500; 
        } else if (",;:".includes(content[currentIndex])) {
          speedRef.current = 200; 
        } else {
          speedRef.current = 30; 
        }
      }, speedRef.current);

      return () => clearTimeout(timeoutId);
    } else if (onComplete) {
      onComplete();
    }
  }, [content, currentIndex, onComplete]);

  return (
    <div className="whitespace-pre-wrap">
      {displayedContent}
      {currentIndex < content.length && (
        <span className="inline-block w-1 h-4 ml-1 bg-blue-500 animate-pulse" />
      )}
    </div>
  );
};

export default function ChatPage() {
  const { slug } = useParams()
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [escalationVisible, setEscalationVisible] = useState(false)
  const [escalationSuccess, setEscalationSuccess] = useState(false)
  const chatEndRef = useRef<HTMLDivElement | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [businessData, setBusinessData] = useState<any>(null)
  const [businessLoading, setBusinessLoading] = useState(true)
  const [copiedToClipboard, setCopiedToClipboard] = useState(false)
  const [escalationResponse, setEscalationResponse] = useState<EscalationResponse | null>(null)
  const [completedMessages, setCompletedMessages] = useState<Set<string>>(new Set())

  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    concern: "",
    description: "",
  })
  const [formError, setFormError] = useState<string | null>(null)

  const apiEndpoint = `${API_URL}/ask/chat/${slug}`

  useEffect(() => {
    setBusinessLoading(true)
    axios
      .get(`${API_URL}/business/slug/${slug}`)
      .then((res) => setBusinessData(res.data))
      .catch(() => setBusinessData(null))
      .finally(() => setBusinessLoading(false))
  }, [slug])

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  useEffect(() => {
    if (!loading) inputRef.current?.focus()
  }, [loading])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !slug) return

    setLoading(true)
    setError(null)

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: newMessage,
      timestamp: Date.now(),
    }
    setMessages((prev) => [...prev, userMessage])
    setNewMessage("")

    try {
      const body: any = {
        query: newMessage,
        history: messages.map(({ role, content }) => ({ role, content })),
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
      const aiMessage: Message = {
        id: `${Date.now()}-response`,
        role: "ai",
        content: response.data.answer,
        timestamp: Date.now(),
        isTyping: true,
      }
      setMessages((prev) => [...prev, aiMessage])
      if (!sessionId && response.data.sessionId) {
        setSessionId(response.data.sessionId)
      }
    } catch (err) {
      setError("Failed to fetch response. Try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleMessageComplete = useCallback((messageId: string) => {
    setCompletedMessages(prev => new Set([...prev, messageId]))
  }, [])

  const renderContentWithEscalationLink = (content: string) => {
    const replaced = content.replace(/\[([^\]]+)\]\(escalate:\/\/now\)/g, "**@@ESCALATE_LINK@@**")
    return (
      <Markdown
        options={{
          overrides: {
            strong: {
              component: ({ children }) => {
                const child = Array.isArray(children) ? children[0] : children;
                if (child === "@@ESCALATE_LINK@@") {
                  return (
                    <Button
                      variant="link"
                      className="text-blue-600 underline hover:text-blue-800 p-0 h-auto"
                      onClick={() => setEscalationVisible(true)}
                    >
                      click here
                    </Button>
                  );
                }
                return <strong>{children}</strong>;
              }
            },
            a: {
              component: ({ href, children, ...props }) => (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline hover:text-blue-800"
                  {...props}
                >
                  {children}
                </a>
              )
            }
          }
        }}
      >
        {replaced}
      </Markdown>
    )
  }

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const validatePhone = (phone: string) => {
    return /^\+?[\d\s-]{10,}$/.test(phone)
  }

  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/\D/g, '')
    if (numbers.length <= 3) return numbers
    if (numbers.length <= 6) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 6)}-${numbers.slice(6, 10)}`
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value)
    setFormData({ ...formData, customerPhone: formatted })
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedToClipboard(true)
      setTimeout(() => setCopiedToClipboard(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

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

    if (!validateEmail(formData.customerEmail)) {
      setFormError("Please enter a valid email address.")
      return
    }

    if (formData.customerPhone && !validatePhone(formData.customerPhone)) {
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
    } catch (error: any) {
      setFormError(error.response?.data?.error || "Failed to submit escalation. Please try again.")
    }
  }

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-950 via-black to-blue-900 overflow-hidden">
      {/* Background pattern remains the same */}
      <div className="absolute inset-0 pointer-events-none opacity-20" style={{
        backgroundImage: `
          radial-gradient(circle at 20% 20%, rgba(59, 130, 246, 0.4) 0%, transparent 50%),
          radial-gradient(circle at 80% 80%, rgba(99, 102, 241, 0.4) 0%, transparent 50%),
          radial-gradient(circle at 50% 50%, rgba(147, 51, 234, 0.2) 0%, transparent 70%)
        `
      }} />
      
      {/* Main container - adjusted for better mobile responsiveness */}
      <div className="relative z-10 w-full max-w-3xl flex flex-col items-center p-4 sm:px-6 min-h-screen">
        {/* Business Info Card - adjusted padding for mobile */}
        <Card className="w-full mt-4 sm:mt-8 mb-4 sm:mb-6 p-4 sm:p-8 flex flex-col items-center bg-white/10 backdrop-blur-xl shadow-2xl border-0 rounded-2xl overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 animate-gradient" />
          
          {businessLoading ? (
            <div className="flex flex-col items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-blue-400 mb-2" />
              <span className="text-gray-300 font-medium">Loading business details...</span>
            </div>
          ) : businessData ? (
            <>
              <div className="relative mb-4 group">
                <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-md transform group-hover:scale-110 transition-transform duration-300" />
                <img
                  src={businessData.logo}
                  alt={businessData.name}
                  className="relative w-24 h-24 rounded-full bg-white/20 p-2 shadow-xl transform group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
              </div>
              <h1 className="text-3xl font-bold text-white mb-2 text-center">{businessData.name}</h1>
              <p className="text-gray-300 text-center max-w-lg text-lg leading-relaxed">{businessData.description}</p>
            </>
          ) : (
            <div className="text-red-400 flex items-center gap-2 py-4">
              <AlertCircle className="h-5 w-5" />
              <span>Business information unavailable</span>
            </div>
          )}
        </Card>

        {/* Enhanced Chat Area - improved spacing and mobile responsiveness */}
        <Card className="w-full flex-1 flex flex-col bg-white/15 backdrop-blur-xl shadow-2xl border-0 rounded-2xl overflow-hidden my-2" 
              style={{ minHeight: '60vh', maxHeight: '70vh' }}>
          <ScrollArea className="flex-1 px-2 sm:px-6 py-4 overflow-y-auto">
            <div className="space-y-6">
              {messages.map((msg, index) => (
                <div 
                  key={msg.id} 
                  className={`flex items-start gap-3 ${msg.role === "ai" ? "justify-start" : "justify-end"} animate-slideIn`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {msg.role === "ai" && (
                    <div className="flex-shrink-0 mt-1">
                      <div className="bg-gradient-to-br from-blue-500 to-purple-500 rounded-full p-2 shadow-lg">
                        <Bot className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                      </div>
                    </div>
                  )}
                  
                  <div className={`
                    relative group
                    ${msg.role === "ai" ? "ml-2" : "mr-2"}
                    ${msg.role === "ai" ? "max-w-[85%] sm:max-w-[75%]" : "max-w-[85%] sm:max-w-[75%]"}
                  `}>
                    <div className={`
                      px-4 py-3 rounded-2xl text-sm shadow-lg
                      transform transition-all duration-200
                      ${msg.role === "ai" 
                        ? "bg-white/90 text-gray-900 rounded-tl-sm" 
                        : "bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-tr-sm"
                      }
                    `}>
                      <div className="prose prose-sm max-w-none break-words">
                        {msg.role === "ai" ? (
                          msg.isTyping && !completedMessages.has(msg.id) ? (
                            <TypewriterEffect 
                              content={msg.content} 
                              onComplete={() => handleMessageComplete(msg.id)}
                            />
                          ) : (
                            renderContentWithEscalationLink(msg.content)
                          )
                        ) : (
                          msg.content
                        )}
                      </div>
                      
                      <div className="flex items-center justify-end gap-2 mt-2 text-xs opacity-70">
                        <span>{format(msg.timestamp, "HH:mm")}</span>
                        {msg.role === "user" && <CheckCircle2 className="h-3 w-3" />}
                      </div>
                    </div>
                  </div>

                  {msg.role === "user" && (
                    <div className="flex-shrink-0 mt-1">
                      <div className="bg-gradient-to-br from-gray-500 to-gray-600 rounded-full p-2 shadow-lg">
                        <User className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {loading && (
              <div className="flex items-center gap-2 text-gray-400 p-4">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm">typing...</span>
              </div>
            )}
            <div ref={chatEndRef} className="h-4" /> {/* Added padding at bottom */}
          </ScrollArea>

          {error && (
            <div className="px-4 sm:px-6 py-2 bg-red-500/10 border-t border-red-500/20">
              <p className="text-red-400 text-sm flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                {error}
              </p>
            </div>
          )}

          {/* Enhanced input area - better mobile experience */}
          <form onSubmit={handleSubmit} className="p-3 sm:p-4 border-t border-gray-200/10 bg-white/5 backdrop-blur-lg">
            <div className="flex items-center gap-2 sm:gap-3">
              <Input
                ref={inputRef}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message here..."
                disabled={loading || businessLoading}
                className="flex-1 bg-white/10 border-0 focus:ring-2 focus:ring-blue-500/50 text-white placeholder:text-gray-400 rounded-xl py-3 sm:py-6 px-4 text-sm sm:text-base"
              />
              <Button 
                type="submit" 
                disabled={loading || businessLoading}
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-xl p-3 sm:px-6 sm:py-6 shadow-lg transition-all duration-200 hover:scale-105 flex-shrink-0"
              >
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <SendHorizontal className="h-5 w-5" />
                )}
              </Button>
            </div>
          </form>
        </Card>

        {/* Enhanced Escalation Dialog */}
        <Dialog open={escalationVisible} onOpenChange={setEscalationVisible}>
          <DialogContent className="max-w-lg bg-gradient-to-b from-gray-900 to-gray-800 text-white border-gray-700">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Submit Support Ticket
              </DialogTitle>
            </DialogHeader>

            {escalationSuccess && escalationResponse ? (
              <div className="space-y-6">
                <div className="relative overflow-hidden rounded-2xl">
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-emerald-500/20 animate-pulse" />
                  <div className="relative p-6 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-green-500/20 rounded-full p-2">
                        <CheckCircle2 className="h-6 w-6 text-green-400" />
                      </div>
                      <h3 className="text-xl font-semibold text-green-400">Ticket Created Successfully!</h3>
                    </div>
                    
                    <p className="text-gray-300 leading-relaxed">
                      Thank you for submitting your ticket. Our support team will contact you shortly via your provided contact information.
                    </p>

                    <div className="bg-white/5 backdrop-blur-lg rounded-xl p-4 border border-white/10">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-gray-400">Case Number:</span>
                        <div className="flex items-center gap-2">
                          <code className="bg-white/10 px-3 py-1 rounded-lg text-blue-400 font-mono">
                            {escalationResponse.caseNumber}
                          </code>
                          <button
                            onClick={() => copyToClipboard(escalationResponse.caseNumber)}
                            className="text-gray-400 hover:text-white transition-colors"
                          >
                            {copiedToClipboard ? (
                              <CheckCircle2 className="h-4 w-4 text-green-400" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </div>

                      <div className="space-y-2 text-sm text-gray-400">
                        <p className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span>Submitted: {format(new Date(escalationResponse.createdAt), 'MMM dd, yyyy HH:mm')}</span>
                        </p>
                        <p className="flex items-center gap-2">
                          <AlertCircle className="h-4 w-4" />
                          <span>Concern: {escalationResponse.concern}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <DialogFooter>
                  <Button
                    onClick={() => {
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
                    }}
                    className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                  >
                    Close
                  </Button>
                </DialogFooter>
              </div>
            ) : (
              <form className="space-y-6" onSubmit={handleEscalationSubmit}>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="customerName" className="text-gray-300">Full Name *</Label>
                    <Input
                      id="customerName"
                      placeholder="John Doe"
                      value={formData.customerName}
                      onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                      className="bg-white/5 border-gray-700 focus:border-blue-500 text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="customerEmail" className="text-gray-300">Email Address *</Label>
                    <Input
                      id="customerEmail"
                      type="email"
                      placeholder="john.doe@example.com"
                      value={formData.customerEmail}
                      onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                      className="bg-white/5 border-gray-700 focus:border-blue-500 text-white"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="customerPhone" className="text-gray-300">Phone Number</Label>
                  <Input
                    id="customerPhone"
                    placeholder="123-456-7890"
                    value={formData.customerPhone}
                    onChange={handlePhoneChange}
                    className="bg-white/5 border-gray-700 focus:border-blue-500 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="concern" className="text-gray-300">Concern *</Label>
                  <Input
                    id="concern"
                    placeholder="Brief description of your concern"
                    value={formData.concern}
                    onChange={(e) => setFormData({ ...formData, concern: e.target.value })}
                    className="bg-white/5 border-gray-700 focus:border-blue-500 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-gray-300">Additional Details</Label>
                  <Textarea
                    id="description"
                    placeholder="Please provide any additional details that might help us assist you better"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    className="bg-white/5 border-gray-700 focus:border-blue-500 text-white resize-none"
                  />
                </div>

                {formError && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 flex items-center gap-2 text-red-400">
                    <AlertTriangle className="h-4 w-4" />
                    <p className="text-sm">{formError}</p>
                  </div>
                )}

                <DialogFooter className="mt-6">
                  <Button
                    variant="ghost"
                    type="button"
                    onClick={() => setEscalationVisible(false)}
                    className="text-gray-400 hover:text-white hover:bg-white/5"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                  >
                    Submit Ticket
                  </Button>
                </DialogFooter>
              </form>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
} 