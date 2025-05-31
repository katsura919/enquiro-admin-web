import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Bot, MessageSquare } from "lucide-react"

interface ChatbotSettingsProps {
  settings: {
    welcomeMessage: string
    offlineMessage: string
    maxResponseTime: number
    autoEscalation: boolean
    escalationTimeout: number
    workingHours: {
      start: string
      end: string
    }
    defaultResponses: {
      unknownQuery: string
      escalation: string
      outOfHours: string
    }
  }
  onSave: (data: any) => void
}

export default function ChatbotSettings({ settings, onSave }: ChatbotSettingsProps) {
  const [formData, setFormData] = useState(settings)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      await onSave(formData)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="bg-white/5 border-blue-500/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Bot className="h-5 w-5" />
          Chatbot Settings
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="welcomeMessage">Welcome Message</Label>
            <Textarea
              id="welcomeMessage"
              value={formData.welcomeMessage}
              onChange={(e) => setFormData({ ...formData, welcomeMessage: e.target.value })}
              className="bg-white/5 text-white border-blue-500/20"
              placeholder="Hello! How can I help you today?"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="offlineMessage">Offline Message</Label>
            <Textarea
              id="offlineMessage"
              value={formData.offlineMessage}
              onChange={(e) => setFormData({ ...formData, offlineMessage: e.target.value })}
              className="bg-white/5 text-white border-blue-500/20"
              placeholder="We're currently offline. Please leave a message."
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="workingHoursStart">Working Hours Start</Label>
              <Input
                id="workingHoursStart"
                type="time"
                value={formData.workingHours.start}
                onChange={(e) => setFormData({
                  ...formData,
                  workingHours: { ...formData.workingHours, start: e.target.value }
                })}
                className="bg-white/5 text-white border-blue-500/20"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="workingHoursEnd">Working Hours End</Label>
              <Input
                id="workingHoursEnd"
                type="time"
                value={formData.workingHours.end}
                onChange={(e) => setFormData({
                  ...formData,
                  workingHours: { ...formData.workingHours, end: e.target.value }
                })}
                className="bg-white/5 text-white border-blue-500/20"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Auto Escalation</Label>
                <p className="text-sm text-gray-400">
                  Automatically escalate chats to human agents after timeout
                </p>
              </div>
              <Switch
                checked={formData.autoEscalation}
                onCheckedChange={(checked) => setFormData({ ...formData, autoEscalation: checked })}
              />
            </div>

            {formData.autoEscalation && (
              <div className="space-y-2">
                <Label htmlFor="escalationTimeout">Escalation Timeout (minutes)</Label>
                <Input
                  id="escalationTimeout"
                  type="number"
                  min="1"
                  value={formData.escalationTimeout}
                  onChange={(e) => setFormData({ ...formData, escalationTimeout: parseInt(e.target.value) })}
                  className="bg-white/5 text-white border-blue-500/20"
                />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="maxResponseTime">Maximum Response Time (seconds)</Label>
            <Input
              id="maxResponseTime"
              type="number"
              min="1"
              value={formData.maxResponseTime}
              onChange={(e) => setFormData({ ...formData, maxResponseTime: parseInt(e.target.value) })}
              className="bg-white/5 text-white border-blue-500/20"
            />
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white">Default Responses</h3>
            
            <div className="space-y-2">
              <Label htmlFor="unknownQuery">Unknown Query Response</Label>
              <Textarea
                id="unknownQuery"
                value={formData.defaultResponses.unknownQuery}
                onChange={(e) => setFormData({
                  ...formData,
                  defaultResponses: { ...formData.defaultResponses, unknownQuery: e.target.value }
                })}
                className="bg-white/5 text-white border-blue-500/20"
                placeholder="I'm not sure I understand. Could you rephrase that?"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="escalation">Escalation Message</Label>
              <Textarea
                id="escalation"
                value={formData.defaultResponses.escalation}
                onChange={(e) => setFormData({
                  ...formData,
                  defaultResponses: { ...formData.defaultResponses, escalation: e.target.value }
                })}
                className="bg-white/5 text-white border-blue-500/20"
                placeholder="I'll connect you with a human agent..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="outOfHours">Out of Hours Message</Label>
              <Textarea
                id="outOfHours"
                value={formData.defaultResponses.outOfHours}
                onChange={(e) => setFormData({
                  ...formData,
                  defaultResponses: { ...formData.defaultResponses, outOfHours: e.target.value }
                })}
                className="bg-white/5 text-white border-blue-500/20"
                placeholder="We're currently outside of working hours..."
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600"
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
} 