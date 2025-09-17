"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { User, Bot, CheckCircle2, Download, FileText, Image as ImageIcon, ExternalLink, Loader2, ZoomIn, X, ChevronRight } from "lucide-react"
import { format } from "date-fns"
import Markdown from "markdown-to-jsx"
import Image from "next/image"
import type { ChatMessage } from "@/types/ChatMessage"

interface MessageProps {
  message: ChatMessage
  index: number
  onEscalationClick: (escalationData?: { type: 'new' | 'continue', caseId?: string, sessionId?: string }) => void
  escalationInProgress?: boolean // Add this to prevent auto-trigger when escalation is already submitted
}

export default function Message({ message, index, onEscalationClick, escalationInProgress = false }: MessageProps) {
  const [imageDialogOpen, setImageDialogOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState<{
    url: string
    fileName: string
    fileSize: number
  } | null>(null)
  const [imageLoading, setImageLoading] = useState<{ [key: string]: boolean }>({})
  const [imageDimensions, setImageDimensions] = useState<{ [key: string]: { width: number; height: number } }>({})
  const [escalationTriggered, setEscalationTriggered] = useState(false)

  const getSkeletonDimensions = (fileName: string) => {
    // Try to infer dimensions from common image types/names
    const extension = fileName.toLowerCase().split('.').pop()
    
    // Common aspect ratios for different image types
    const aspectRatios = {
      // Portrait photos (9:16)
      portrait: { width: 270, height: 480 },
      // Landscape photos (16:9) 
      landscape: { width: 320, height: 180 },
      // Square images (1:1)
      square: { width: 280, height: 280 },
      // Default (4:3)
      default: { width: 320, height: 240 }
    }
    
    // Guess based on filename patterns
    if (fileName.includes('portrait') || fileName.includes('selfie')) {
      return aspectRatios.portrait
    } else if (fileName.includes('square') || fileName.includes('profile')) {
      return aspectRatios.square
    } else if (fileName.includes('landscape') || fileName.includes('wide')) {
      return aspectRatios.landscape
    }
    
    // Default to a common photo size
    return aspectRatios.default
  }
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const handleDownload = async (fileUrl: string, fileName: string) => {
    try {
      // For PDFs and documents, we might need to fetch with proper headers
      if (fileName.toLowerCase().endsWith('.pdf') || !fileUrl.includes('/image/')) {
        // Use fetch to get the file with proper headers
        const response = await fetch(fileUrl);
        const blob = await response.blob();
        
        // Create blob URL and download
        const blobUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Clean up blob URL
        window.URL.revokeObjectURL(blobUrl);
      } else {
        // For images, use direct download
        const link = document.createElement('a');
        link.href = fileUrl;
        link.download = fileName;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      console.error('Download failed:', error);
      // Fallback to direct link
      window.open(fileUrl, '_blank');
    }
  }

  const handleImageClick = (attachment: any) => {
    setSelectedImage({
      url: attachment.fileUrl,
      fileName: attachment.fileName,
      fileSize: attachment.fileSize || 0
    })
    setImageDialogOpen(true)
  }

  const handleImageLoad = (imageUrl: string) => {
    setImageLoading(prev => ({ ...prev, [imageUrl]: false }))
  }

  const handleImageLoadStart = (imageUrl: string) => {
    setImageLoading(prev => ({ ...prev, [imageUrl]: true }))
  }

  const renderContentWithEscalationLink = (content: string) => {
    // Remove the escalation links from the content and just return clean markdown
    const cleanContent = content
      .replace(/\[([^\]]+)\]\(escalate:\/\/new\)/g, "")
      .replace(/\[([^\]]+)\]\(escalate:\/\/continue\?[^)]+\)/g, "")
    return (
      <Markdown
        options={{
          overrides: {
            a: {
              component: ({ href, children, ...props }) => (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline hover:text-primary/80"
                  {...props}
                >
                  {children}
                </a>
              )
            }
          }
        }}
      >
        {cleanContent}
      </Markdown>
    )
  }

  // Check if message contains escalation links
  const hasEscalationLink = (content: string) => {
    return /\[([^\]]+)\]\(escalate:\/\/(new|continue(\?[^)]+)?)\)/g.test(content)
  }

  // Extract escalation type and data from content
  const getEscalationData = (content: string) => {
    // Check for continue escalation with case data
    const continueMatch = content.match(/\[([^\]]+)\]\(escalate:\/\/continue\?caseId=([^&]+)&sessionId=([^)]+)\)/)
    if (continueMatch) {
      return {
        type: 'continue',
        text: continueMatch[1],
        caseId: continueMatch[2],
        sessionId: continueMatch[3]
      }
    }

    // Check for new escalation
    const newMatch = content.match(/\[([^\]]+)\]\(escalate:\/\/new\)/)
    if (newMatch) {
      return {
        type: 'new',
        text: newMatch[1]
      }
    }

    return null
  }

  // Auto-trigger escalation dialog when escalation link is detected (only once per message)
  useEffect(() => {
    if (
      message.senderType === "ai" && 
      message.message && 
      hasEscalationLink(message.message) && 
      !escalationTriggered && 
      !escalationInProgress // Don't auto-trigger if escalation is already in progress
    ) {
      // Small delay to ensure the message is fully rendered before showing dialog
      const timer = setTimeout(() => {
        const escalationData = message.message ? getEscalationData(message.message) : null
        if (escalationData) {
          onEscalationClick({
            type: escalationData.type as 'new' | 'continue',
            caseId: escalationData.caseId,
            sessionId: escalationData.sessionId
          })
        } else {
          onEscalationClick()
        }
        setEscalationTriggered(true) // Mark as triggered to prevent reopening
      }, 500)
      
      return () => clearTimeout(timer)
    }
  }, [message.message, message.senderType, onEscalationClick, escalationTriggered, escalationInProgress])

  // System messages - centered like Facebook Messenger
  if (message.senderType === "system") {
    return (
      <div className="flex justify-center my-6">
        <div className="text-xs text-slate-500 dark:text-slate-400 text-center max-w-md px-4 py-2 bg-slate-50 dark:bg-slate-800/50 rounded-full border border-slate-200 dark:border-slate-700">
          {message.message}
        </div>
      </div>
    )
  }

  return (
    <div 
      className={`flex items-start gap-4 message-enter mb-6 ${
        message.senderType === "ai" || message.senderType === "agent"
          ? "justify-start" 
          : "justify-end"
      }`}
    >
      {(message.senderType === "ai" || message.senderType === "agent") && (
        <div className="flex-shrink-0 mt-1">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            message.senderType === "agent"
              ? "bg-emerald-500 shadow-sm"
              : "bg-slate-800 dark:bg-slate-200 shadow-sm"
          }`}>
            {message.senderType === "agent" ? (
              <User className="h-4 w-4 text-white" />
            ) : (
              <Bot className="h-4 w-4 text-white dark:text-slate-800" />
            )}
          </div>
        </div>
      )}
      
      <div className={`
        relative group
        ${message.senderType === "ai" || message.senderType === "agent" ? "mr-12" : "ml-12"}
        ${message.senderType === "ai" || message.senderType === "agent" ? "max-w-[80%]" : "max-w-[80%]"}
      `}>
        <div className={`
          px-4 py-3 text-sm relative 
          ${message.senderType === "ai" 
            ? " text-forground" 
            : message.senderType === "agent"
            ? "bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/50 text-emerald-900 dark:text-emerald-100 rounded-2xl rounded-bl-md"
            : "bg-card text-foreground rounded-lg"
          }
        `}>
          {/* Attachments */}
          {message.attachments && message.attachments.length > 0 && (
            <div className="space-y-2 mb-3">
              {message.attachments.map((attachment, idx) => (
                <div key={idx}>
                  {attachment.mimeType.startsWith('image/') ? (
                    <div className="relative max-w-sm">
                      {/* Show skeleton if file URL is empty (uploading) or if image is loading */}
                      {(!attachment.fileUrl || imageLoading[attachment.fileUrl]) ? (
                        <div className="space-y-2">
                          {(() => {
                            const dimensions = getSkeletonDimensions(attachment.fileName)
                            return (
                              <Skeleton 
                                className="rounded-lg" 
                                style={{ 
                                  width: `${dimensions.width}px`, 
                                  height: `${dimensions.height}px` 
                                }} 
                              />
                            )
                          })()}
                          {attachment.fileUrl && (
                            <div className="flex items-center justify-between">
                              <Skeleton className="h-3 flex-1 mr-2" />
                              <Skeleton className="h-6 w-6" />
                            </div>
                          )}
                        </div>
                      ) : (
                        <>
                          <div 
                            className="relative w-full h-48 rounded-lg overflow-hidden bg-muted group cursor-pointer"
                            onClick={() => handleImageClick(attachment)}
                          >
                            <Image
                              src={attachment.fileUrl}
                              alt={attachment.fileName}
                              fill
                              className="object-cover transition-all duration-200 group-hover:scale-105"
                              onLoadStart={() => handleImageLoadStart(attachment.fileUrl)}
                              onLoad={() => handleImageLoad(attachment.fileUrl)}
                              onError={() => handleImageLoad(attachment.fileUrl)}
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200 flex items-center justify-center">
                              <ZoomIn className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                            </div>
                          </div>
                          <div className="flex items-center justify-between mt-2 text-xs opacity-70">
                            <span className="truncate flex-1">{attachment.fileName}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0 ml-2"
                              onClick={() => handleDownload(attachment.fileUrl, attachment.fileName)}
                              title="Download image"
                            >
                              <Download className="h-3 w-3" />
                            </Button>
                          </div>
                        </>
                      )}
                    </div>
                  ) : (
                    /* File attachment (non-image) */
                    !attachment.fileUrl ? (
                      /* Show skeleton for uploading files */
                      <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg border border-border/50">
                        <Skeleton className="w-10 h-10 rounded-lg flex-shrink-0" />
                        <div className="flex-1 space-y-2">
                          <Skeleton className="h-4 w-3/4" />
                          <Skeleton className="h-3 w-1/2" />
                        </div>
                        <div className="flex gap-1">
                          <Skeleton className="h-8 w-8" />
                          <Skeleton className="h-8 w-8" />
                        </div>
                      </div>
                    ) : (
                      /* Show actual file when uploaded */
                      <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg border border-border/50">
                        <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                          <FileText className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{attachment.fileName}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatFileSize(attachment.fileSize)}
                          </p>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => window.open(attachment.fileUrl, '_blank')}
                            title="Open file"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => handleDownload(attachment.fileUrl, attachment.fileName)}
                            title="Download file"
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Text content - only show if there are no uploading attachments */}
          {message.message && !message.attachments?.some(att => !att.fileUrl) && (
            <div className="prose prose-sm max-w-none break-words dark:prose-invert [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
              {message.senderType === "ai"
                ? renderContentWithEscalationLink(message.message)
                : message.message}
            </div>
          )}
          
          {message.senderType !== "ai" && (
            <div className="flex items-center justify-end gap-2 mt-2 text-xs text-slate-500 dark:text-slate-400">
              <span>{format(new Date(message.createdAt), "HH:mm")}</span>
              {message.senderType === "customer" && <CheckCircle2 className="h-3 w-3 text-slate-600 dark:text-slate-400" />}
            </div>
          )}
        </div>

        {/* Escalation Card - Show below AI messages that contain escalation links */}
        {message.senderType === "ai" && message.message && hasEscalationLink(message.message) && (
          <div className="mt-4 max-w-sm">
            {(() => {
              const escalationData = getEscalationData(message.message)
              const isReturningCustomer = escalationData?.type === 'continue'
              
              return (
                <div 
                  className={`border rounded-xl p-4 cursor-pointer transition-all duration-200 shadow-sm hover:shadow-md group ${
                    isReturningCustomer 
                      ? 'bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 border-emerald-200 dark:border-emerald-800 hover:from-emerald-100 hover:to-green-100 dark:hover:from-emerald-900/30 dark:hover:to-green-900/30'
                      : 'bg-gradient-to-r from-slate-50 to-gray-50 dark:from-slate-800 dark:to-slate-700 border-slate-200 dark:border-slate-600 hover:from-slate-100 hover:to-gray-100 dark:hover:from-slate-700 dark:hover:to-slate-600'
                  }`}
                  onClick={() => {
                    const escalationData = message.message ? getEscalationData(message.message) : null
                    if (escalationData && escalationData.type === 'continue') {
                      // For returning customers, handle continuing the case
                      onEscalationClick({
                        type: 'continue',
                        caseId: escalationData.caseId,
                        sessionId: escalationData.sessionId
                      })
                    } else {
                      // For new customers, show the regular escalation dialog
                      onEscalationClick({ type: 'new' })
                    }
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        isReturningCustomer 
                          ? 'bg-emerald-100 dark:bg-emerald-800'
                          : 'bg-slate-100 dark:bg-slate-600'
                      }`}>
                        <User className={`h-4 w-4 ${
                          isReturningCustomer 
                            ? 'text-emerald-600 dark:text-emerald-300'
                            : 'text-slate-600 dark:text-slate-300'
                        }`} />
                      </div>
                      <div>
                        <span className={`font-medium ${
                          isReturningCustomer 
                            ? 'text-emerald-700 dark:text-emerald-200'
                            : 'text-slate-700 dark:text-slate-200'
                        }`}>
                          {isReturningCustomer ? 'Continue your case' : 'Fill up details'}
                        </span>
                        {isReturningCustomer && escalationData && (
                          <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-0.5">
                            Resume conversation
                          </p>
                        )}
                      </div>
                    </div>
                    <ChevronRight className={`h-4 w-4 group-hover:translate-x-0.5 transition-transform duration-200 ${
                      isReturningCustomer 
                        ? 'text-emerald-600 dark:text-emerald-300'
                        : 'text-slate-600 dark:text-slate-300'
                    }`} />
                  </div>
                </div>
              )
            })()}
          </div>
        )}
      </div>

      {message.senderType === "customer" && (
        <div className="flex-shrink-0 mt-1">
          <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center shadow-sm">
            <User className="h-4 w-4 text-slate-600 dark:text-slate-300" />
          </div>
        </div>
      )}

      {/* Image Preview Dialog */}
      <Dialog open={imageDialogOpen} onOpenChange={setImageDialogOpen}>
        <DialogContent className="max-w-4xl w-[95vw] max-h-[95vh] p-0">
          <DialogHeader className="p-6 pb-4">
            <DialogTitle className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ImageIcon className="h-5 w-5" />
                <div>
                  <p className="font-semibold">{selectedImage?.fileName}</p>
                  <p className="text-sm text-muted-foreground font-normal">
                    {selectedImage && formatFileSize(selectedImage.fileSize)}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => selectedImage && handleDownload(selectedImage.url, selectedImage.fileName)}
                  className="gap-2"
                >
                  <Download className="h-4 w-4" />
                  Download
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => selectedImage && window.open(selectedImage.url, '_blank')}
                  className="gap-2"
                >
                  <ExternalLink className="h-4 w-4" />
                  Open
                </Button>
              </div>
            </DialogTitle>
          </DialogHeader>
          
          <div className="relative flex-1 min-h-0 p-6 pt-0">
            {selectedImage && (
              <div className="relative w-full h-[70vh] rounded-lg overflow-hidden bg-muted">
                <Image
                  src={selectedImage.url}
                  alt={selectedImage.fileName}
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
