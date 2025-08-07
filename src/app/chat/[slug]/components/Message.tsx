"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { User, Bot, CheckCircle2, Download, FileText, Image as ImageIcon, ExternalLink, Loader2, ZoomIn, X } from "lucide-react"
import { format } from "date-fns"
import Markdown from "markdown-to-jsx"
import Image from "next/image"
import type { ChatMessage } from "@/types/ChatMessage"

interface MessageProps {
  message: ChatMessage
  index: number
  onEscalationClick: () => void
}

export default function Message({ message, index, onEscalationClick }: MessageProps) {
  const [imageDialogOpen, setImageDialogOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState<{
    url: string
    fileName: string
    fileSize: number
  } | null>(null)
  const [imageLoading, setImageLoading] = useState<{ [key: string]: boolean }>({})
  const [imageDimensions, setImageDimensions] = useState<{ [key: string]: { width: number; height: number } }>({})

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
    const replaced = content.replace(/\[([^\]]+)\]\(escalate:\/\/now\)/g, "**@@ESCALATE_LINK@@**")
    return (
      <Markdown
        options={{
          overrides: {
            strong: {
              component: ({ children }) => {
                const child = Array.isArray(children) ? children[0] : children;
                if (child === "@@ESCALATE_LINK@@") {
                  return (
                    <Button
                      variant="link"
                      className="text-primary underline hover:text-primary/80 p-0 h-auto"
                      onClick={onEscalationClick}
                    >
                      click here
                    </Button>
                  );
                }
                return <strong>{children}</strong>;
              }
            },
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
        {replaced}
      </Markdown>
    )
  }

  // System messages - centered like Facebook Messenger
  if (message.senderType === "system") {
    return (
      <div className="flex justify-center my-4">
        <div className="text-xs text-muted-foreground text-center max-w-md px-4 py-2">
          {message.message}
        </div>
      </div>
    )
  }

  return (
    <div 
      className={`flex items-start gap-3 message-enter mb-4 ${
        message.senderType === "ai" || message.senderType === "agent"
          ? "justify-start" 
          : "justify-end"
      }`}
    >
      {(message.senderType === "ai" || message.senderType === "agent") && (
        <div className="flex-shrink-0 mt-1">
          <div className={`rounded-full p-2 ${
            message.senderType === "agent"
              ? "bg-green-600"
              : "bg-primary"
          }`}>
            {message.senderType === "agent" ? (
              <User className="h-4 w-4 text-white" />
            ) : (
              <Bot className="h-4 w-4 text-primary-foreground" />
            )}
          </div>
        </div>
      )}
      
      <div className={`
        relative group
        ${message.senderType === "ai" || message.senderType === "agent" ? "ml-2" : "mr-2"}
        ${message.senderType === "ai" || message.senderType === "agent" ? "max-w-[85%]" : "max-w-[85%]"}
      `}>
        <div className={`
          px-4 py-3 rounded-2xl text-sm border relative
          ${message.senderType === "ai" 
            ? "bg-muted border-border text-foreground rounded-tl-sm" 
            : message.senderType === "agent"
            ? "bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800 text-green-900 dark:text-green-100 rounded-tl-sm"
            : "bg-primary border-primary text-primary-foreground rounded-tr-sm"
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
            <div className="prose prose-sm max-w-none break-words dark:prose-invert">
              {message.senderType === "ai"
                ? renderContentWithEscalationLink(message.message)
                : message.message}
            </div>
          )}
          
          <div className="flex items-center justify-end gap-2 mt-2 text-xs opacity-70">
            <span>{format(new Date(message.createdAt), "HH:mm")}</span>
            {message.senderType === "customer" && <CheckCircle2 className="h-3 w-3" />}
          </div>
        </div>
      </div>

      {message.senderType === "customer" && (
        <div className="flex-shrink-0 mt-1">
          <div className="rounded-full p-2 bg-muted border border-border">
            <User className="h-4 w-4 text-muted-foreground" />
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
