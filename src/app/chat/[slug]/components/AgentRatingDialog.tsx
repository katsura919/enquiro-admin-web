"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Star, User, CheckCircle2, X } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"

interface AgentInfo {
  id: string
  name?: string
  email?: string
}

interface AgentRatingDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  agentInfo?: AgentInfo | null
  caseNumber?: string
  onSubmit: (rating: number, feedback: string) => void
  onSkip: () => void
  loading?: boolean
  success?: boolean
}

export default function AgentRatingDialog({
  open,
  onOpenChange,
  agentInfo,
  caseNumber,
  onSubmit,
  onSkip,
  loading = false,
  success = false
}: AgentRatingDialogProps) {
  const [rating, setRating] = useState<number>(0)
  const [hoveredRating, setHoveredRating] = useState<number>(0)
  const [feedback, setFeedback] = useState<string>("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (rating > 0) {
      onSubmit(rating, feedback.trim())
    }
  }

  const handleClose = () => {
    // Reset form when closing
    setRating(0)
    setHoveredRating(0)
    setFeedback("")
    onOpenChange(false)
  }

  const handleSkip = () => {
    setRating(0)
    setHoveredRating(0)
    setFeedback("")
    onSkip()
  }

  const StarIcon = ({ filled, onHover, onClick }: { filled: boolean, onHover: () => void, onClick: () => void }) => (
    <button
      type="button"
      onMouseEnter={onHover}
      onClick={onClick}
      className="focus:outline-none focus:ring-2 focus:ring-blue-500 rounded transition-colors"
      disabled={loading || success}
    >
      <Star 
        className={`h-8 w-8 transition-colors ${
          filled 
            ? 'fill-yellow-400 text-yellow-400' 
            : 'text-gray-300 hover:text-yellow-300'
        }`}
      />
    </button>
  )

  if (success) {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-green-600">
              <CheckCircle2 className="h-5 w-5" />
              Thank You!
            </DialogTitle>
          </DialogHeader>
          <div className="py-6 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              Your rating has been submitted successfully. We appreciate your feedback!
            </p>
          </div>
          <DialogFooter>
            <Button onClick={handleClose} className="w-full">
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-500" />
            Rate Your Experience
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Agent Info */}
          {agentInfo && (
            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="font-medium text-sm">
                  {agentInfo.name || 'Support Agent'}
                </p>
                {caseNumber && (
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Case: {caseNumber}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Rating Stars */}
          <div className="space-y-2">
            <Label htmlFor="rating">How would you rate your experience?</Label>
            <div 
              className="flex gap-1 justify-center py-2"
              onMouseLeave={() => setHoveredRating(0)}
            >
              {[1, 2, 3, 4, 5].map((star) => (
                <StarIcon
                  key={star}
                  filled={star <= (hoveredRating || rating)}
                  onHover={() => setHoveredRating(star)}
                  onClick={() => setRating(star)}
                />
              ))}
            </div>
            {rating > 0 && (
              <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                {rating === 1 && "Poor"}
                {rating === 2 && "Fair"}
                {rating === 3 && "Good"}
                {rating === 4 && "Very Good"}
                {rating === 5 && "Excellent"}
              </p>
            )}
          </div>

          {/* Feedback */}
          <div className="space-y-2">
            <Label htmlFor="feedback">
              Additional feedback <span className="text-gray-500 text-sm">(optional)</span>
            </Label>
            <Textarea
              id="feedback"
              placeholder="Tell us more about your experience..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows={3}
              maxLength={1000}
              disabled={loading}
              className="resize-none"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 text-right">
              {feedback.length}/1000
            </p>
          </div>

          <DialogFooter className="flex gap-2 sm:gap-0">
            <Button
              type="button"
              variant="ghost"
              onClick={handleSkip}
              disabled={loading}
              className="flex-1 sm:flex-none"
            >
              Skip
            </Button>
            <Button
              type="submit"
              disabled={rating === 0 || loading}
              className="flex-1 sm:flex-none"
            >
              {loading ? "Submitting..." : "Submit Rating"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}