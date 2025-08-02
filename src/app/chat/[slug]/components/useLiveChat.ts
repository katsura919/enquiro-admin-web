"use client"

import { useEffect, useRef } from "react"
import { io, Socket } from "socket.io-client"

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000"

interface UseLiveChatProps {
  waitingForAgent: boolean
  escalationResponse: { _id: string } | null
  businessData: { _id: string } | null
  onChatStarted: (data: { agentId: string, escalationId: string, room: string }) => void
  onAgentConnected?: (data: { agentId: string, room: string, message: string }) => void
  onNewMessage?: (data: any) => void
  onChatEnded?: (data: any) => void
}

export function useLiveChat({
  waitingForAgent,
  escalationResponse,
  businessData,
  onChatStarted,
  onAgentConnected,
  onNewMessage,
  onChatEnded
}: UseLiveChatProps) {
  const socketRef = useRef<Socket | null>(null)

  // Initialize socket connection
  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = io(SOCKET_URL, { transports: ["websocket"] })
    }
    
    return () => {
      socketRef.current?.disconnect()
    }
  }, [])

  // Handle escalation and chat request
  const requestChat = (escalationId: string, businessId: string) => {
    if (socketRef.current && escalationId && businessId) {
      const socket = socketRef.current
      
      if (socket.connected) {
        console.log('[SOCKET] Connected, emitting join_escalation and request_chat', {
          escalationId,
          businessId,
          socketConnected: socket.connected,
          socketId: socket.id
        })
        socket.emit('join_escalation', { escalationId })
        socket.emit('request_chat', { businessId, escalationId })
      } else {
        socket.once('connect', () => {
          console.log('[SOCKET] Connected (delayed), now emitting join_escalation and request_chat', {
            escalationId,
            businessId,
            socketConnected: socket.connected,
            socketId: socket.id
          })
          socket.emit('join_escalation', { escalationId })
          socket.emit('request_chat', { businessId, escalationId })
        })
      }
    }
  }

  // Leave queue when component unmounts if waiting
  useEffect(() => {
    return () => {
      if (
        socketRef.current &&
        waitingForAgent &&
        escalationResponse &&
        businessData?._id
      ) {
        console.log('[SOCKET] Leaving queue due to component unmount or navigation')
        socketRef.current.emit('leave_queue', {
          businessId: businessData._id,
          escalationId: escalationResponse._id,
        })
      }
    }
  }, [waitingForAgent, escalationResponse, businessData])

  // Listen for socket events
  useEffect(() => {
    if (!socketRef.current) return
    
    const socket = socketRef.current

    // Chat started event
    const handleChatStarted = (data: { agentId: string, escalationId: string, room: string }) => {
      console.log('[SOCKET] Chat started:', data)
      onChatStarted(data)
    }

    // Agent connected event
    const handleAgentConnected = (data: { agentId: string, room: string, message: string }) => {
      console.log('[SOCKET] Agent connected:', data)
      onAgentConnected?.(data)
    }

    // New message event
    const handleNewMessage = (data: any) => {
      console.log('[SOCKET] New message received:', data)
      onNewMessage?.(data)
    }

    // Chat ended event
    const handleChatEnded = (data: any) => {
      console.log('[SOCKET] Chat ended:', data)
      onChatEnded?.(data)
    }

    socket.on('chat_started', handleChatStarted)
    socket.on('agent_connected', handleAgentConnected)
    socket.on('new_message', handleNewMessage)
    socket.on('chat_ended', handleChatEnded)

    return () => {
      socket.off('chat_started', handleChatStarted)
      socket.off('agent_connected', handleAgentConnected)
      socket.off('new_message', handleNewMessage)
      socket.off('chat_ended', handleChatEnded)
    }
  }, [onChatStarted, onAgentConnected, onNewMessage, onChatEnded])

  return {
    socket: socketRef.current,
    requestChat
  }
}
