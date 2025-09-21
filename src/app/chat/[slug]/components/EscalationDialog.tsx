"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
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
  enableLiveChat?: boolean
  message?: string
}

interface EscalationFormData {
  customerName: string
  customerEmail: string
  customerPhone: string
  concern: string
  description: string
}

interface EscalationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  escalationSuccess: boolean
  escalationResponse: EscalationResponse | null
  formData: EscalationFormData
  setFormData: (data: EscalationFormData) => void
  formError: string | null
  onSubmit: (e: React.FormEvent) => void
  onClose: () => void
}

export default function EscalationDialog({
  open,
  onOpenChange,
  escalationSuccess,
  escalationResponse,
  formData,
  setFormData,
  formError,
  onSubmit,
  onClose
}: EscalationDialogProps) {
  const [copiedToClipboard, setCopiedToClipboard] = useState(false)

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Contact Info
          </DialogTitle>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
            Please provide your contact information to connect with our live support team. This helps us serve you better and ensures we can follow up if needed.
          </p>
        </DialogHeader>

        {escalationSuccess && escalationResponse ? (
          <div className="space-y-6">
            <div className="rounded-lg border border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950 p-6">
              <div className="flex items-start gap-3">
                <div className="bg-green-100 dark:bg-green-900 rounded-full p-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-2">
                    {escalationResponse.enableLiveChat !== false ? "Ticket Created Successfully!" : "Request Submitted Successfully!"}
                  </h3>
                  <p className="text-green-800 dark:text-green-200 text-sm">
                    {escalationResponse.enableLiveChat !== false 
                      ? "Thank you for submitting your ticket. Our support team will contact you shortly via your provided contact information."
                      : escalationResponse.message || "Thank you for your submission. We'll review your request and respond via email within 24 hours."
                    }
                  </p>
                </div>
              </div>

              <div className="mt-4 rounded-lg bg-background border p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-muted-foreground">Case Number:</span>
                  <div className="flex items-center gap-2">
                    <code className="bg-muted px-2 py-1 rounded text-sm font-mono">
                      {escalationResponse.caseNumber}
                    </code>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyToClipboard(escalationResponse.caseNumber)}
                    >
                      {copiedToClipboard ? (
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2 text-sm text-muted-foreground">
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

            <DialogFooter>
              <Button onClick={() => onOpenChange(false)}>
                {escalationResponse.enableLiveChat !== false ? "Continue Waiting" : "Continue Chatting"}
              </Button>
            </DialogFooter>
          </div>
        ) : (
          <form className="space-y-6" onSubmit={onSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="customerName">Full Name *</Label>
                <Input
                  id="customerName"
                  placeholder="John Doe"
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="customerEmail">Email Address *</Label>
                <Input
                  id="customerEmail"
                  type="email"
                  placeholder="john.doe@example.com"
                  value={formData.customerEmail}
                  onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="customerPhone">Phone Number</Label>
              <Input
                id="customerPhone"
                placeholder="123-456-7890"
                value={formData.customerPhone}
                onChange={handlePhoneChange}
              />
            </div>

            {formError && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 flex items-center gap-2 text-destructive">
                <AlertTriangle className="h-4 w-4" />
                <p className="text-sm">{formError}</p>
              </div>
            )}

            <DialogFooter className="mt-6">
              <Button
                variant="outline"
                type="button"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit">
                Continue
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
