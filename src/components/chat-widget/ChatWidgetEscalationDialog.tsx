"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Copy, CheckCircle2, AlertTriangle, Clock, AlertCircle } from "lucide-react"
import { format } from "date-fns"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"

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

interface ChatWidgetEscalationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  escalationSuccess: boolean
  escalationResponse: EscalationResponse | null
  formData: EscalationFormData
  setFormData: (data: EscalationFormData) => void
  formError: string | null
  onSubmit: (e: React.FormEvent) => void
}

export default function ChatWidgetEscalationDialog({
  open,
  onOpenChange,
  escalationSuccess,
  escalationResponse,
  formData,
  setFormData,
  formError,
  onSubmit
}: ChatWidgetEscalationDialogProps) {
  const [copiedToClipboard, setCopiedToClipboard] = useState(false)

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Connect with Support
          </DialogTitle>
        </DialogHeader>

        {escalationSuccess && escalationResponse ? (
          <div className="space-y-4">
            <div className="rounded-lg border border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950 p-4">
              <div className="flex items-start gap-3">
                <div className="bg-green-100 dark:bg-green-900 rounded-full p-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-green-900 dark:text-green-100 mb-1">
                    Request Submitted!
                  </h3>
                  <p className="text-green-800 dark:text-green-200 text-xs">
                    You'll be connected to an agent shortly.
                  </p>
                </div>
              </div>

              <div className="mt-3 rounded-lg bg-background border p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-muted-foreground">Case Number:</span>
                  <div className="flex items-center gap-2">
                    <code className="bg-muted px-2 py-1 rounded text-xs font-mono">
                      {escalationResponse.caseNumber}
                    </code>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyToClipboard(escalationResponse.caseNumber)}
                      className="h-6 w-6 p-0"
                    >
                      {copiedToClipboard ? (
                        <CheckCircle2 className="h-3 w-3 text-green-600" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="space-y-1 text-xs text-muted-foreground">
                  <p className="flex items-center gap-2">
                    <Clock className="h-3 w-3" />
                    <span>Submitted: {format(new Date(escalationResponse.createdAt), 'MMM dd, HH:mm')}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <AlertCircle className="h-3 w-3" />
                    <span>Concern: {escalationResponse.concern}</span>
                  </p>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button onClick={() => onOpenChange(false)} className="w-full">
                Continue Waiting
              </Button>
            </DialogFooter>
          </div>
        ) : (
          <form className="space-y-4" onSubmit={onSubmit}>
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="customerName" className="text-sm">Full Name *</Label>
                <Input
                  id="customerName"
                  placeholder="John Doe"
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  className="h-9"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="customerEmail" className="text-sm">Email Address *</Label>
                <Input
                  id="customerEmail"
                  type="email"
                  placeholder="john.doe@example.com"
                  value={formData.customerEmail}
                  onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                  className="h-9"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="customerPhone" className="text-sm">Phone Number</Label>
                <Input
                  id="customerPhone"
                  placeholder="123-456-7890"
                  value={formData.customerPhone}
                  onChange={handlePhoneChange}
                  className="h-9"
                />
              </div>
            </div>

            {formError && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 flex items-center gap-2 text-destructive">
                <AlertTriangle className="h-4 w-4" />
                <p className="text-xs">{formError}</p>
              </div>
            )}

            <DialogFooter className="gap-2">
              <Button
                variant="outline"
                type="button"
                onClick={() => onOpenChange(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button type="submit" className="flex-1">
                Connect
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
