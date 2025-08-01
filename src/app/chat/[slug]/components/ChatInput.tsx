"use client"

import { forwardRef } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { SendHorizontal, Loader2 } from "lucide-react"

interface ChatInputProps {
  value: string
  onChange: (value: string) => void
  onSubmit: (e: React.FormEvent) => void
  loading: boolean
  disabled: boolean
  placeholder?: string
}

const ChatInput = forwardRef<HTMLInputElement, ChatInputProps>(
  ({ value, onChange, onSubmit, loading, disabled, placeholder = "Type your message here..." }, ref) => {
    return (
      <form onSubmit={onSubmit} className="p-4 border-t bg-muted/30">
        <div className="flex items-center gap-3">
          <Input
            ref={ref}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            disabled={disabled}
            className="flex-1 border-border focus-visible:ring-1 focus-visible:ring-ring"
          />
          <Button 
            type="submit" 
            disabled={disabled || !value.trim()}
            size="icon"
            className="shrink-0"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <SendHorizontal className="h-4 w-4" />
            )}
          </Button>
        </div>
      </form>
    )
  }
)

ChatInput.displayName = "ChatInput"

export default ChatInput
