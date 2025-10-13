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
      <div className="p-2 ">
        {/* File Preview */}
        {selectedFile && (
          <div className={`mb-4 p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl transition-opacity ${uploadLoading ? 'opacity-60' : ''}`}>
            <div className="flex items-start gap-4">
              {filePreview ? (
                <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-700 flex-shrink-0">
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
                <div className="w-14 h-14 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center flex-shrink-0">
                  {uploadLoading ? (
                    <Loader2 className="h-5 w-5 text-slate-500 animate-spin" />
                  ) : (
                    <FileText className="h-6 w-6 text-slate-500" />
                  )}
                </div>
              )}
              
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">{selectedFile.name}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {formatFileSize(selectedFile.size)}
                  {uploadLoading && " • Uploading..."}
                </p>
                {selectedFile.type.startsWith('image/') && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-1">
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
                className="h-8 w-8 p-0 flex-shrink-0 hover:bg-red-100 dark:hover:bg-red-900/30"
              >
                <X className="h-4 w-4 text-red-500" />
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
                className="shrink-0 h-8 w-8 hover:bg-slate-200 dark:hover:bg-slate-700"
                title="Attach file"
              >
                {uploadLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin text-slate-500" />
                ) : (
                  <Paperclip className="h-4 w-4 text-slate-500" />
                )}
              </Button>
            )}
            
            <Input
              ref={ref}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={selectedFile ? "Add a caption..." : placeholder}
              disabled={disabled}
              className="flex-1 border-muted-gray bg-card hover:bg-card text-foreground h-10 shadow-none"
            />
            
            <Button 
              type="submit" 
              disabled={disabled || (!value.trim() && !selectedFile)}
              size="icon"
              className="shrink-0 h-10 w-10 bg-card text-secondary-foreground shadow-none border-muted-gray cursor-pointer"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <SendHorizontal className="h-5 w-5 text-foreground" />
              )}
            </Button>
          </div>

        </form>
      </div>
    )
  }
)

ChatInput.displayName = "ChatInput"

export default ChatInput
