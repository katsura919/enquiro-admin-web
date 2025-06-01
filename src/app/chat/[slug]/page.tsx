"use client"

import { useState, useEffect, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { SendHorizontal, Loader2, User, Bot } from "lucide-react"
import { useParams } from "next/navigation"
import axios from "axios"
import { ScrollArea } from "@/components/ui/scroll-area"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { format } from "date-fns"

const API_URL = process.env.NEXT_PUBLIC_API_URL

interface Message {
  id: string
  role: "user" | "ai"
  content: string
  timestamp: number
}

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

  const renderContentWithEscalationLink = (content: string) => {
    const replaced = content.replace(/\[([^\]]+)\]\(escalate:\/\/now\)/g, "**@@ESCALATE_LINK@@**")
    return (
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          strong: ({ children }) => {
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
          },
          a: ({ href, children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline hover:text-blue-800"
              {...props}
            >
              {children}
            </a>
          ),
        }}
      >
        {replaced}
      </ReactMarkdown>
    )
  }

  const handleEscalationSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)
    if (!formData.customerName || !formData.customerEmail || !formData.concern) {
      setFormError("Name, Email, and Concern are required.")
      return
    }
    setEscalationSuccess(true)
    setTimeout(() => {
      setEscalationVisible(false)
      setEscalationSuccess(false)
      setFormData({
        customerName: "",
        customerEmail: "",
        customerPhone: "",
        concern: "",
        description: "",
      })
      setFormError(null)
    }, 2000)
  }

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-950 via-black to-blue-900 overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-30" style={{ background: "radial-gradient(circle at 20% 20%, #3b82f6 0%, transparent 60%), radial-gradient(circle at 80% 80%, #6366f1 0%, transparent 60%)" }} />
      <div className="relative z-10 w-full max-w-2xl flex flex-col items-center">
        {/* Business Info */}
        <Card className="w-full mt-8 mb-4 p-6 flex flex-col items-center bg-white/10 backdrop-blur-md shadow-2xl border-0">
          {businessLoading ? (
            <div className="flex flex-col items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500 mb-2" />
              <span className="text-gray-300">Loading business info...</span>
            </div>
          ) : businessData ? (
            <>
              <img
                src={businessData.logo}
                alt={businessData.name}
                className="w-20 h-20 rounded-full bg-white/20 p-2 mb-2 shadow-lg"
              />
              <h1 className="text-2xl font-bold text-white mb-1">{businessData.name}</h1>
              <p className="text-gray-300 text-center max-w-md">{businessData.description}</p>
            </>
          ) : (
            <span className="text-red-400">Business not found.</span>
          )}
        </Card>
        {/* Chat Area */}
        <Card className="w-full flex-1 flex flex-col bg-white/20 backdrop-blur-lg shadow-2xl border-0" style={{ minHeight: 400, maxHeight: 600 }}>
          <ScrollArea className="flex-1 p-4 space-y-3 overflow-y-auto">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex items-end gap-2 ${msg.role === "ai" ? "justify-start" : "justify-end"}`}>
                {msg.role === "ai" && (
                  <div className="flex flex-col items-center mr-1">
                    <div className="bg-blue-500 rounded-full p-1"><Bot className="h-5 w-5 text-white" /></div>
                  </div>
                )}
                <div
                  className={`max-w-[75%] px-4 py-2 rounded-2xl text-sm shadow-md ${
                    msg.role === "ai"
                      ? "bg-gray-200/80 dark:bg-gray-700/80 text-gray-900 dark:text-gray-100"
                      : "bg-blue-500 text-white"
                  }`}
                >
                  {msg.role === "ai"
                    ? renderContentWithEscalationLink(msg.content)
                    : msg.content}
                  <div className="text-xs text-gray-400 mt-1 text-right">
                    {format(msg.timestamp, "HH:mm")}
                  </div>
                </div>
                {msg.role === "user" && (
                  <div className="flex flex-col items-center ml-1">
                    <div className="bg-gray-300 rounded-full p-1"><User className="h-5 w-5 text-blue-700" /></div>
                  </div>
                )}
              </div>
            ))}
            <div ref={chatEndRef} />
          </ScrollArea>
          {error && <p className="text-red-500 text-center text-sm px-4">{error}</p>}
          <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200/20 dark:border-gray-700/20 flex items-center bg-white/10">
            <Input
              ref={inputRef}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              disabled={loading || businessLoading}
              className="flex-1 bg-gray-100/80 dark:bg-gray-700/80 border-none focus:ring-0 text-gray-900 dark:text-gray-100"
            />
            <Button type="submit" disabled={loading || businessLoading} className="ml-3">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <SendHorizontal className="h-5 w-5" />}
            </Button>
          </form>
        </Card>
        {/* Escalation Dialog */}
        <Dialog open={escalationVisible} onOpenChange={setEscalationVisible}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Escalate Your Concern</DialogTitle>
            </DialogHeader>
            {escalationSuccess ? (
              <div className="text-green-600 text-center py-6 font-semibold">Thank you! Your escalation has been submitted.</div>
            ) : (
              <form className="space-y-3" onSubmit={handleEscalationSubmit}>
                <Input
                  placeholder="Customer Name*"
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                />
                <Input
                  placeholder="Customer Email*"
                  type="email"
                  value={formData.customerEmail}
                  onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                />
                <Input
                  placeholder="Customer Phone (optional)"
                  value={formData.customerPhone}
                  onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                />
                <Input
                  placeholder="Concern (e.g., billing issue)*"
                  value={formData.concern}
                  onChange={(e) => setFormData({ ...formData, concern: e.target.value })}
                />
                <Textarea
                  placeholder="Additional description (optional)"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
                {formError && <div className="text-red-500 text-xs text-center">{formError}</div>}
                <DialogFooter className="mt-4">
                  <Button variant="ghost" type="button" onClick={() => setEscalationVisible(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    Submit
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