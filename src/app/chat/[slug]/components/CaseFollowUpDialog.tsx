"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertTriangle, Search } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"

interface CaseFollowUpDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (caseNumber: string) => void
  isLoading?: boolean
  error?: string | null
}

export default function CaseFollowUpDialog({
  open,
  onOpenChange,
  onSubmit,
  isLoading = false,
  error = null
}: CaseFollowUpDialogProps) {
  const [caseNumber, setCaseNumber] = useState("")
  const [validationError, setValidationError] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate case number
    if (!caseNumber.trim()) {
      setValidationError("Please enter a case number")
      return
    }

    if (caseNumber.trim().length < 6) {
      setValidationError("Case number must be at least 6 characters")
      return
    }

    // Clear validation error and submit
    setValidationError(null)
    onSubmit(caseNumber.trim())
  }

  const handleCaseNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCaseNumber(e.target.value)
    // Clear validation error when user starts typing
    if (validationError) {
      setValidationError(null)
    }
  }

  const handleClose = () => {
    setCaseNumber("")
    setValidationError(null)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Continue Your Case
          </DialogTitle>
          <DialogDescription className="text-sm text-slate-600 dark:text-slate-400 mt-2">
            Enter your case number to continue your conversation or check the status of your existing case.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="caseNumber">Case Number *</Label>
            <div className="relative">
              <Input
                id="caseNumber"
                placeholder="e.g., EQB-123456 or 7890123"
                value={caseNumber}
                onChange={handleCaseNumberChange}
                disabled={isLoading}
                className="pr-10"
                autoFocus
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
            <p className="text-xs text-muted-foreground">
              Case numbers are usually 6 or more characters long
            </p>
          </div>

          {(validationError || error) && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 flex items-start gap-2 text-destructive">
              <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <p className="text-sm">{validationError || error}</p>
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              type="button"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Searching..." : "Continue"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
