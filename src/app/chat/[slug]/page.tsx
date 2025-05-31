"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send } from "lucide-react"
import { BackgroundGradient } from "@/components/ui/background-gradient"
import { GridPattern } from "@/components/ui/grid-pattern"

// Mock business data - replace with actual API call
const fetchBusinessData = async (slug: string) => {
  // TODO: Replace with actual API call
  return {
    name: "Test Business",
    description: "AI-powered customer support",
    logo: "https://via.placeholder.com/150",
  }
}

interface Message {
  id: string
  content: string
  isUser: boolean
  timestamp: Date
}

export default function ChatPage({ params }: { params: { slug: string } }) {
  const [businessData, setBusinessData] = useState<any>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const loadBusinessData = async () => {
      const data = await fetchBusinessData(params.slug)
      setBusinessData(data)
    }
    loadBusinessData()
  }, [params.slug])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      isUser: true,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    // TODO: Replace with actual API call
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "This is a mock response. Replace with actual AI response.",
        isUser: false,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, botMessage])
      setIsLoading(false)
    }, 1000)
  }

  if (!businessData) {
    return <div>Loading...</div>
  }

  return (
    <div className="relative min-h-screen bg-black">
      <BackgroundGradient />
      <GridPattern />
      
      <div className="relative z-10 max-w-2xl mx-auto px-4 py-8">
        {/* Business Info */}
        <div className="text-center mb-8">
          <img
            src={businessData.logo}
            alt={businessData.name}
            className="w-16 h-16 mx-auto rounded-full bg-white/10 p-2 mb-4"
          />
          <h1 className="text-2xl font-bold text-white mb-2">{businessData.name}</h1>
          <p className="text-gray-400">{businessData.description}</p>
        </div>

        {/* Chat Interface */}
        <Card className="bg-white/5 border-blue-500/20">
          <CardHeader>
            <CardTitle className="text-white">Chat with our AI Assistant</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 mb-4 max-h-[400px] overflow-y-auto">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`rounded-lg px-4 py-2 max-w-[80%] ${
                      message.isUser
                        ? "bg-blue-500 text-white"
                        : "bg-white/10 text-gray-200"
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white/10 text-gray-200 rounded-lg px-4 py-2">
                    Typing...
                  </div>
                </div>
              )}
            </div>
            <form onSubmit={handleSubmit} className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="bg-white/5 text-white border-blue-500/20"
              />
              <Button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600"
                disabled={isLoading}
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 