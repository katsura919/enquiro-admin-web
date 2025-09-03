"use client"

import { useState, useEffect } from "react"
import { MessageCircle, X, Minus } from "lucide-react"

interface ChatEmbedWidgetProps {
  businessSlug: string
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
  primaryColor?: string
  title?: string
  frontendUrl?: string
}

export function ChatEmbedWidget({
  businessSlug,
  position = 'bottom-right',
  primaryColor = '#007bff',
  title = 'Chat with us',
  frontendUrl = 'http://localhost:3000'
}: ChatEmbedWidgetProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)

  // Position classes
  const positionClasses = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6',
    'top-right': 'top-6 right-6',
    'top-left': 'top-6 left-6'
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
    }
  }

  const closeChat = () => {
    setIsOpen(false)
    setIsMinimized(false)
  }

  return (
    <div className={`fixed ${positionClasses[position]} z-[9999] font-sans`}>
      {/* Chat Bubble */}
      {!isOpen && (
        <div
          onClick={toggleChat}
          className="w-14 h-14 rounded-full flex items-center justify-center cursor-pointer shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
          style={{ backgroundColor: primaryColor }}
        >
          <MessageCircle className="w-6 h-6 text-white" />
        </div>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div 
          className={`bg-white rounded-lg shadow-2xl transition-all duration-300 ${
            isMinimized ? 'w-80 h-12' : 'w-96 h-[600px]'
          }`}
          style={{
            position: 'absolute',
            [position.includes('bottom') ? 'bottom' : 'top']: '70px',
            [position.includes('right') ? 'right' : 'left']: '0'
          }}
        >
          {/* Header */}
          <div 
            className="flex items-center justify-between p-4 rounded-t-lg text-white"
            style={{ backgroundColor: primaryColor }}
          >
            <h3 className="font-semibold text-sm">{title}</h3>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1 hover:bg-white/20 rounded transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>
              <button
                onClick={closeChat}
                className="p-1 hover:bg-white/20 rounded transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Chat Content */}
          {!isMinimized && (
            <div className="h-[calc(100%-60px)] relative">
              <iframe
                src={chatUrl}
                className="w-full h-full border-0 rounded-b-lg"
                title="Chat Widget"
                allow="camera; microphone"
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
              />
            </div>
          )}
        </div>
      )}

      {/* Floating Badge for Notifications (optional) */}
      {!isOpen && (
        <div 
          className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs text-white font-bold animate-pulse"
          style={{ backgroundColor: '#ef4444' }}
        >
          1
        </div>
      )}
    </div>
  )
}
