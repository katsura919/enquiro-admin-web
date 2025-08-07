"use client"

import { forwardRef, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { SendHorizontal, Loader2, Paperclip, X, FileText, Image as ImageIcon } from "lucide-react"
import Image from "next/image"

interface ChatInputProps {
  value: string
  onChange: (value: string) => void
  onSubmit: (e: React.FormEvent) => void
  loading: boolean
  disabled: boolean
  placeholder?: string
  selectedFile?: File | null
  filePreview?: string | null
  onFileSelect?: (file: File) => void
  onFileClear?: () => void
  uploadLoading?: boolean
  isLiveChatMode?: boolean
}

const ChatInput = forwardRef<HTMLInputElement, ChatInputProps>(
  ({ 
    value, 
    onChange, 
    onSubmit, 
    loading, 
    disabled, 
    placeholder = "Type your message here...",
    selectedFile,
    filePreview,
    onFileSelect,
    onFileClear,
    uploadLoading = false,
    isLiveChatMode = false
  }, ref) => {
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleFileButtonClick = () => {
      fileInputRef.current?.click()
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file && onFileSelect) {
        onFileSelect(file)
      }
      // Reset input to allow selecting the same file again
      e.target.value = ''
    }

    const formatFileSize = (bytes: number) => {
      if (bytes === 0) return '0 Bytes'
      const k = 1024
      const sizes = ['Bytes', 'KB', 'MB', 'GB']
      const i = Math.floor(Math.log(bytes) / Math.log(k))
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    }

    return (
      <div className="p-4 border-t bg-muted/30">
        {/* File Preview */}
        {selectedFile && (
          <div className={`mb-3 p-3 bg-background border border-border rounded-lg transition-opacity ${uploadLoading ? 'opacity-60' : ''}`}>
            <div className="flex items-start gap-3">
              {filePreview ? (
                <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                  <Image
                    src={filePreview}
                    alt="Preview"
                    fill
                    className="object-cover"
                  />
                  {uploadLoading && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <Loader2 className="h-4 w-4 text-white animate-spin" />
                    </div>
                  )}
                </div>
              ) : (
                <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                  {uploadLoading ? (
                    <Loader2 className="h-4 w-4 text-muted-foreground animate-spin" />
                  ) : (
                    <FileText className="h-6 w-6 text-muted-foreground" />
                  )}
                </div>
              )}
              
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{selectedFile.name}</p>
                <p className="text-xs text-muted-foreground">
                  {formatFileSize(selectedFile.size)}
                  {uploadLoading && " • Uploading..."}
                </p>
                {selectedFile.type.startsWith('image/') && (
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                    <ImageIcon className="h-3 w-3" />
                    Image
                  </p>
                )}
              </div>
              
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={onFileClear}
                disabled={uploadLoading}
                className="h-8 w-8 p-0 flex-shrink-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        <form onSubmit={onSubmit}>
          <div className="flex items-center gap-3">
            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,.pdf,.doc,.docx,.txt"
              onChange={handleFileChange}
              className="hidden"
            />
            
            {/* File attachment button - only show in live chat mode */}
            {isLiveChatMode && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={handleFileButtonClick}
                disabled={disabled || uploadLoading}
                className="shrink-0"
                title="Attach file"
              >
                {uploadLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Paperclip className="h-4 w-4" />
                )}
              </Button>
            )}
            
            <Input
              ref={ref}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={selectedFile ? "Add a caption..." : placeholder}
              disabled={disabled}
              className="flex-1 border-border focus-visible:ring-1 focus-visible:ring-ring"
            />
            
            <Button 
              type="submit" 
              disabled={disabled || (!value.trim() && !selectedFile)}
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
          
          {!isLiveChatMode && (
            <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
              <Paperclip className="h-3 w-3" />
              File uploads are available when chatting with an agent
            </p>
          )}
        </form>
      </div>
    )
  }
)

ChatInput.displayName = "ChatInput"

export default ChatInput
