"use client"

import { useState, useEffect } from "react"
import { MessageCircle, X, Minus, Maximize2, Loader2 } from "lucide-react"

interface ChatEmbedWidgetProps {
  businessSlug: string
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
  primaryColor?: string
  title?: string
  subtitle?: string
}

export function ChatEmbedWidget({
  businessSlug,
  position = 'bottom-right',
  primaryColor = '#007bff',
  title = 'Chat with us',
  subtitle = 'We typically reply instantly'
}: ChatEmbedWidgetProps) {
  const frontendUrl = 'https://enquiro.vercel.app'
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [hasNewMessage, setHasNewMessage] = useState(true)

  // Position classes
  const positionClasses = {
    'bottom-right': 'bottom-4 right-4 sm:bottom-6 sm:right-6',
    'bottom-left': 'bottom-4 left-4 sm:bottom-6 sm:left-6',
    'top-right': 'top-4 right-4 sm:top-6 sm:right-6',
    'top-left': 'top-4 left-4 sm:top-6 sm:left-6'
  }

  const chatUrl = `${frontendUrl}/chat/${businessSlug}?embed=true`

  const toggleChat = () => {
    if (isOpen && !isMinimized) {
      setIsMinimized(true)
    } else if (isOpen && isMinimized) {
      setIsMinimized(false)
    } else {
      setIsOpen(true)
      setIsMinimized(false)
      setIsLoading(true)
      setHasNewMessage(false) // Clear notification when opening
    }
  }

  const closeChat = () => {
    setIsOpen(false)
    setIsMinimized(false)
    setIsLoading(false)
  }

  const handleIframeLoad = () => {
    setIsLoading(false)
  }

  return (
    <div className={`fixed ${positionClasses[position]} z-[9999] font-sans`}>
      {/* Chat Bubble */}
      {!isOpen && (
        <button
          onClick={toggleChat}
          className="group relative w-16 h-16 rounded-full flex items-center justify-center cursor-pointer shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 focus:outline-none focus:ring-4 focus:ring-opacity-50"
          style={{ 
            backgroundColor: primaryColor,
            boxShadow: `0 10px 25px -5px ${primaryColor}40, 0 8px 10px -6px ${primaryColor}40`
          }}
          aria-label="Open chat"
        >
          <MessageCircle className="w-7 h-7 text-white transition-transform group-hover:scale-110" />
          
          {/* Pulse ring effect */}
          <span 
            className="absolute inset-0 rounded-full animate-ping opacity-20"
            style={{ backgroundColor: primaryColor }}
          />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div 
          className={`bg-white rounded-2xl shadow-2xl transition-all duration-300 ease-in-out backdrop-blur-sm border border-gray-100 overflow-hidden ${
            isMinimized ? 'w-80 h-14' : 'w-[360px] sm:w-[400px] h-[600px] sm:h-[650px]'
          }`}
          style={{
            position: 'absolute',
            [position.includes('bottom') ? 'bottom' : 'top']: '80px',
            [position.includes('right') ? 'right' : 'left']: '0',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            transform: isMinimized ? 'scale(0.98)' : 'scale(1)',
          }}
        >
          {/* Header */}
          <div 
            className={`relative flex items-center text-white overflow-hidden ${
              isMinimized ? 'justify-center px-5 py-3' : 'justify-between px-5 py-4'
            }`}
            style={{ 
              background: `linear-gradient(135deg, ${primaryColor} 0%, ${primaryColor}dd 100%)`,
            }}
          >
            {/* Decorative background pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl" 
                   style={{ backgroundColor: 'white' }} />
            </div>
            
            {isMinimized ? (
              // Minimized state with better spacing
              <div className="flex items-center justify-between w-full relative z-10">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
                    <MessageCircle className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="font-semibold text-sm leading-tight">{title}</h3>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsMinimized(false)}
                    className="p-1.5 hover:bg-white/20 rounded-lg transition-all duration-200 active:scale-95 focus:outline-none focus:ring-2 focus:ring-white/30 cursor-pointer"
                    aria-label="Maximize"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={closeChat}
                    className="p-1.5 hover:bg-white/20 rounded-lg transition-all duration-200 active:scale-95 focus:outline-none focus:ring-2 focus:ring-white/30 cursor-pointer"
                    aria-label="Close chat"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              // Full header state
              <>
                <div className="flex items-center gap-3 relative z-10 flex-1 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0 shadow-lg">
                    <MessageCircle className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-base leading-tight truncate">{title}</h3>
                    <p className="text-xs text-white/90 mt-0.5 truncate">{subtitle}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-1 relative z-10 flex-shrink-0 ml-2">
                  <button
                    onClick={() => setIsMinimized(true)}
                    className="p-2 hover:bg-white/20 rounded-lg transition-all duration-200 active:scale-95 focus:outline-none focus:ring-2 focus:ring-white/30 cursor-pointer"
                    aria-label="Minimize"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <button
                    onClick={closeChat}
                    className="p-2 hover:bg-white/20 rounded-lg transition-all duration-200 active:scale-95 focus:outline-none focus:ring-2 focus:ring-white/30"
                    aria-label="Close chat"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Chat Content */}
          <div 
            className={`relative bg-gray-50 ${isMinimized ? 'hidden' : 'h-[calc(100%-72px)]'}`}
          >
            {/* Loading Overlay */}
            {isLoading && (
              <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-white flex flex-col items-center justify-center z-10">
                <div className="flex flex-col items-center gap-4 p-8 rounded-2xl bg-white/80 backdrop-blur-sm shadow-xl">
                  <div className="relative">
                    <Loader2 
                      className="w-10 h-10 animate-spin" 
                      style={{ color: primaryColor }}
                    />
                    <div 
                      className="absolute inset-0 animate-ping opacity-20 rounded-full"
                      style={{ backgroundColor: primaryColor }}
                    />
                  </div>
                  <div className="text-center">
                    <p className="text-base font-semibold text-gray-800">Starting chat...</p>
                    <p className="text-xs text-gray-500 mt-1.5">Connecting you with support</p>
                  </div>
                </div>
              </div>
            )}
            
            <iframe
              src={chatUrl}
              className="w-full h-full border-0"
              title="Chat Widget"
              allow="camera; microphone"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
              onLoad={handleIframeLoad}
              style={{ 
                opacity: isLoading ? 0 : 1,
                transition: 'opacity 0.3s ease-in-out'
              }}
            />
          </div>
        </div>
      )}

      {/* Floating Badge for Notifications */}
      {!isOpen && hasNewMessage && (
        <div 
          className="absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-xs text-white font-bold shadow-lg"
          style={{ 
            backgroundColor: '#ef4444',
            animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
          }}
        >
          <span className="relative z-10">1</span>
          <span 
            className="absolute inset-0 rounded-full animate-ping opacity-75"
            style={{ backgroundColor: '#ef4444' }}
          />
        </div>
      )}
    </div>
  )
}
