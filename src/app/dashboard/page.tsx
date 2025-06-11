"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Copy, MessageSquare, Users, Brain } from "lucide-react"
import { QRCodeSVG } from "qrcode.react"

// Mock data - replace with actual data from your backend
const businessData = {
  name: "My Business",
  slug: "my-business",
  totalSessions: 128,
  activeUsers: 45,
  knowledgeBase: 67,
}

export default function DashboardPage() {
  const [copied, setCopied] = useState(false)
  const chatUrl = `${window.location.origin}/chat/${businessData.slug}`

  const handleCopy = () => {
    navigator.clipboard.writeText(chatUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="p-8">      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Welcome back, Admin</h1>
        <p className="text-muted-foreground">Here's what's happening with your chatbot</p>
      </div>

      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-3 mb-8">
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Sessions
            </CardTitle>
            <MessageSquare className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{businessData.totalSessions}</div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Users
            </CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{businessData.activeUsers}</div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Knowledge Base Items
            </CardTitle>
            <Brain className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{businessData.knowledgeBase}</div>
          </CardContent>
        </Card>
      </div>      {/* Chat Interface Link & QR Code */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Public Chat Interface</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col md:flex-row gap-8 items-start">
          <div className="flex-1 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Your public chat URL
              </label>
              <div className="flex gap-2">
                <Input
                  readOnly
                  value={chatUrl}
                  className="bg-background text-foreground"
                />
                <Button
                  onClick={handleCopy}
                  variant="outline"
                  className="shrink-0 border-border text-primary hover:bg-accent"
                >
                  <Copy className="h-4 w-4" />
                  {copied ? "Copied!" : "Copy"}
                </Button>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Share this link with your customers to let them interact with your AI chatbot.
              You can also use the QR code for easy mobile access.
            </p>
          </div>          <div className="bg-card p-4 rounded-lg border border-border">
            <QRCodeSVG value={chatUrl} size={150} />
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 