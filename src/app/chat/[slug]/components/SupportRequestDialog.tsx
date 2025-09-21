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

interface SupportRequestResponse {
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

interface SupportRequestFormData {
  customerName: string
  customerEmail: string
  customerPhone: string
  concern: string
  description: string
}

interface SupportRequestDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  requestSuccess: boolean
  requestResponse: SupportRequestResponse | null
  formData: SupportRequestFormData
  setFormData: (data: SupportRequestFormData) => void
  formError: string | null
  onSubmit: (e: React.FormEvent) => void
  onClose: () => void
}

export default function SupportRequestDialog({
  open,
  onOpenChange,
  requestSuccess,
  requestResponse,
  formData,
  setFormData,
  formError,
  onSubmit,
  onClose
}: SupportRequestDialogProps) {
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
            Submit Support Request
          </DialogTitle>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
            Please provide your contact information and details about your concern. Our team will review your request and get back to you.
          </p>
        </DialogHeader>

        {requestSuccess && requestResponse ? (
          <div className="space-y-6">
            <div className="rounded-lg border border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950 p-6">
              <div className="flex items-start gap-3">
                <div className="bg-green-100 dark:bg-green-900 rounded-full p-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div className="space-y-3 flex-1">
                  <div>
                    <h3 className="font-semibold text-green-900 dark:text-green-100 mb-1">
                      Request Submitted Successfully!
                    </h3>
                    <p className="text-sm text-green-700 dark:text-green-300">
                      {requestResponse.message || "Your support request has been submitted. Our team will review it and get back to you."}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-green-900 dark:text-green-100 mb-2">Case Number:</p>
                    <div className="flex items-center gap-2">
                      <code className="bg-muted px-2 py-1 rounded text-sm font-mono">
                        {requestResponse.caseNumber}
                      </code>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyToClipboard(requestResponse.caseNumber)}
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
                      <span>
                        Submitted: {
                          requestResponse.createdAt 
                            ? (() => {
                                try {
                                  return format(new Date(requestResponse.createdAt), 'MMM dd, yyyy HH:mm')
                                } catch (error) {
                                  console.error('Date formatting error:', error)
                                  return 'Just now'
                                }
                              })()
                            : 'Just now'
                        }
                      </span>
                    </p>
                    <p className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4" />
                      <span>Concern: {requestResponse.concern}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button onClick={() => onOpenChange(false)}>
                Continue Chatting
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

            <div className="space-y-2">
              <Label htmlFor="concern">Concern/Issue Type *</Label>
              <Input
                id="concern"
                placeholder="e.g., Product inquiry, Technical support, Billing question"
                value={formData.concern}
                onChange={(e) => setFormData({ ...formData, concern: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="Please provide detailed information about your concern or question..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
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
                Submit Request
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}