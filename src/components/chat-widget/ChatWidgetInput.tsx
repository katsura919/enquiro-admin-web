"use client"

import { forwardRef } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { SendHorizontal, Loader2 } from "lucide-react"

interface ChatWidgetInputProps {
  value: string
  onChange: (value: string) => void
  onSubmit: (e: React.FormEvent) => void
  loading: boolean
  disabled: boolean
  placeholder?: string
  isLiveChatMode?: boolean
}

const ChatWidgetInput = forwardRef<HTMLInputElement, ChatWidgetInputProps>(
  ({ 
    value, 
    onChange, 
    onSubmit, 
    loading, 
    disabled, 
    placeholder = "Type your message here...",
    isLiveChatMode = false
  }, ref) => {
    
    const handleKeyPress = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        onSubmit(e as any)
      }
    }

    return (
      <div className="p-3 border-t bg-background">
        <form onSubmit={onSubmit} className="flex gap-2">
          <Input
            ref={ref}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            disabled={disabled || loading}
            className="flex-1 text-sm h-8"
          />
          <Button
            type="submit"
            size="sm"
            disabled={disabled || loading || !value.trim()}
            className="h-8 w-8 p-0"
          >
            {loading ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <SendHorizontal className="h-3 w-3" />
            )}
          </Button>
        </form>
      </div>
    )
  }
)

ChatWidgetInput.displayName = "ChatWidgetInput"

export default ChatWidgetInput
