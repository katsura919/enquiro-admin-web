"use client"

import React from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { DocsSidebar } from '@/components/docs/DocsSidebar'
import { DocsLayout, DocsPageHeader, DocsPageContent } from '@/components/docs/DocsLayout'
import { TableOfContents } from '@/components/docs/TableOfContents'
import { CodeBlock, FeatureCard, Step } from '@/components/docs/DocsComponents'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { 
  MessageSquare, 
  Zap, 
  Users, 
  FileText, 
  Clock,
  CheckCircle,
  AlertTriangle,
  Info
} from 'lucide-react'
import Link from 'next/link'

export default function LiveChatDocsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="border-b">
        <div className="container mx-auto px-4">
          <DocsLayout>
            <aside className="fixed top-14 z-30 -ml-2 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 md:sticky md:block">
              <DocsSidebar />
            </aside>
            
            <main className="relative py-6 lg:gap-10 lg:py-8">
              <div className="mx-auto w-full min-w-0">
                <DocsPageHeader 
                  heading="Live Chat System"
                  text="Real-time chat communication between customers and support agents with advanced features."
                />

                <Separator className="my-8" />

                {/* Overview */}
                <section className="space-y-6">
                  <div className="space-y-2">
                    <h2 id="overview" className="text-2xl font-bold tracking-tight">Overview</h2>
                    <p className="text-muted-foreground">
                      Our live chat system enables real-time communication between customers visiting your website 
                      and your support agents. It includes features like typing indicators, file sharing, chat routing, 
                      and escalation management.
                    </p>
                  </div>

                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertTitle>Real-time Technology</AlertTitle>
                    <AlertDescription>
                      The system uses WebSocket connections for instant message delivery and real-time updates.
                    </AlertDescription>
                  </Alert>
                </section>

                <Separator className="my-8" />

                {/* Key Features */}
                <section className="space-y-6">
                  <div className="space-y-2">
                    <h2 id="features" className="text-2xl font-bold tracking-tight">Key Features</h2>
                  </div>

                  <div className="grid gap-6 md:grid-cols-2">
                    <FeatureCard
                      icon={MessageSquare}
                      title="Real-time Messaging"
                      description="Instant message delivery with WebSocket connections and message persistence."
                    />
                    
                    <FeatureCard
                      icon={FileText}
                      title="File Sharing"
                      description="Upload and share files during chat conversations with automatic cloud storage."
                    />
                    
                    <FeatureCard
                      icon={Clock}
                      title="Typing Indicators"
                      description="Real-time typing indicators to show when agents or customers are composing messages."
                    />
                    
                    <FeatureCard
                      icon={Users}
                      title="Agent Routing"
                      description="Intelligent chat routing based on agent availability and specialization."
                    />
                  </div>
                </section>

                <Separator className="my-8" />

                {/* Implementation Guide */}
                <section className="space-y-6">
                  <div className="space-y-2">
                    <h2 id="implementation" className="text-2xl font-bold tracking-tight">Implementation Guide</h2>
                    <p className="text-muted-foreground">
                      Follow these steps to implement live chat functionality in your application.
                    </p>
                  </div>

                  <div className="space-y-8">
                    <Step
                      step={1}
                      title="Initialize Socket Connection"
                      description="Set up the WebSocket connection for real-time communication."
                    >
                      <CodeBlock language="javascript" title="Socket Setup">
{`import { io } from 'socket.io-client';

// Initialize socket connection
const socket = io('http://localhost:3001', {
  transports: ['websocket'],
  autoConnect: false
});

// Connect to socket
socket.connect();

// Listen for connection
socket.on('connect', () => {
  console.log('Connected to chat server');
});`}
                      </CodeBlock>
                    </Step>

                    <Step
                      step={2}
                      title="Request Live Chat"
                      description="Trigger a live chat request and wait for agent assignment."
                    >
                      <CodeBlock language="javascript" title="Request Chat">
{`// Request live chat with customer details
const requestChat = (customerInfo) => {
  socket.emit('request_live_chat', {
    businessId: 'your-business-id',
    sessionId: 'unique-session-id',
    customerInfo: {
      name: customerInfo.name,
      email: customerInfo.email,
      query: customerInfo.initialMessage
    }
  });
};

// Listen for chat assignment
socket.on('chat_started', (data) => {
  console.log('Chat started with agent:', data.agentId);
  setChatRoom(data.room);
  setIsConnectedToAgent(true);
});`}
                      </CodeBlock>
                    </Step>

                    <Step
                      step={3}
                      title="Handle Messages"
                      description="Send and receive messages in real-time."
                    >
                      <CodeBlock language="javascript" title="Message Handling">
{`// Send message
const sendMessage = (messageText, attachments = []) => {
  const messageData = {
    businessId: 'your-business-id',
    sessionId: 'session-id',
    message: messageText,
    messageType: 'text',
    attachments: attachments,
    senderType: 'customer'
  };
  
  socket.emit('send_message', messageData);
};

// Listen for incoming messages
socket.on('new_message', (data) => {
  if (data.senderType === 'agent') {
    // Handle agent message
    addMessageToChat(data);
  }
});

// Handle typing indicators
socket.on('agent_typing', (data) => {
  setAgentTyping(true);
});

socket.on('agent_stopped_typing', (data) => {
  setAgentTyping(false);
});`}
                      </CodeBlock>
                    </Step>

                    <Step
                      step={4}
                      title="File Upload Integration"
                      description="Enable file sharing during chat conversations."
                    >
                      <CodeBlock language="javascript" title="File Upload">
{`// Upload file during chat
const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('sessionId', sessionId);
  formData.append('businessId', businessId);

  try {
    const response = await fetch('/api/chat/upload', {
      method: 'POST',
      body: formData
    });
    
    const result = await response.json();
    
    // Send message with file attachment
    sendMessage('Shared a file', [{
      filename: result.filename,
      url: result.url,
      type: result.type,
      size: result.size
    }]);
    
  } catch (error) {
    console.error('File upload failed:', error);
  }
};`}
                      </CodeBlock>
                    </Step>
                  </div>
                </section>

                <Separator className="my-8" />

                {/* Agent Side Implementation */}
                <section className="space-y-6">
                  <div className="space-y-2">
                    <h2 id="agent-side" className="text-2xl font-bold tracking-tight">Agent Side Implementation</h2>
                    <p className="text-muted-foreground">
                      How agents can handle incoming chats and communicate with customers.
                    </p>
                  </div>

                  <CodeBlock language="javascript" title="Agent Chat Handler">
{`// Agent connects to receive chat assignments
socket.emit('agent_online', {
  agentId: 'agent-id',
  businessId: 'business-id',
  status: 'available'
});

// Listen for chat assignments
socket.on('chat_assigned', (data) => {
  console.log('New chat assigned:', data);
  
  // Join the chat room
  socket.emit('join_chat_room', {
    room: data.room,
    agentId: data.agentId
  });
  
  // Load chat history
  loadChatHistory(data.sessionId);
});

// Send agent message
const sendAgentMessage = (message) => {
  socket.emit('send_message', {
    businessId: businessId,
    sessionId: sessionId,
    message: message,
    messageType: 'text',
    senderType: 'agent',
    agentId: agentId
  });
};

// Handle chat end
const endChat = () => {
  socket.emit('end_chat', {
    escalationId: escalationId,
    agentId: agentId,
    resolution: 'resolved'
  });
};`}
                  </CodeBlock>
                </section>

                <Separator className="my-8" />

                {/* Events Reference */}
                <section className="space-y-6">
                  <div className="space-y-2">
                    <h2 id="events-reference" className="text-2xl font-bold tracking-tight">Socket Events Reference</h2>
                    <p className="text-muted-foreground">
                      Complete list of socket events for live chat functionality.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Customer Events</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="grid gap-3 text-sm">
                          <div className="flex justify-between">
                            <code className="bg-muted px-2 py-1 rounded">request_live_chat</code>
                            <span className="text-muted-foreground">Request chat with agent</span>
                          </div>
                          <div className="flex justify-between">
                            <code className="bg-muted px-2 py-1 rounded">send_message</code>
                            <span className="text-muted-foreground">Send message to agent</span>
                          </div>
                          <div className="flex justify-between">
                            <code className="bg-muted px-2 py-1 rounded">customer_typing</code>
                            <span className="text-muted-foreground">Indicate typing status</span>
                          </div>
                          <div className="flex justify-between">
                            <code className="bg-muted px-2 py-1 rounded">leave_chat</code>
                            <span className="text-muted-foreground">Leave chat session</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Agent Events</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="grid gap-3 text-sm">
                          <div className="flex justify-between">
                            <code className="bg-muted px-2 py-1 rounded">agent_online</code>
                            <span className="text-muted-foreground">Set agent availability</span>
                          </div>
                          <div className="flex justify-between">
                            <code className="bg-muted px-2 py-1 rounded">join_chat_room</code>
                            <span className="text-muted-foreground">Join assigned chat</span>
                          </div>
                          <div className="flex justify-between">
                            <code className="bg-muted px-2 py-1 rounded">agent_typing</code>
                            <span className="text-muted-foreground">Indicate typing to customer</span>
                          </div>
                          <div className="flex justify-between">
                            <code className="bg-muted px-2 py-1 rounded">end_chat</code>
                            <span className="text-muted-foreground">End chat session</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">System Events</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="grid gap-3 text-sm">
                          <div className="flex justify-between">
                            <code className="bg-muted px-2 py-1 rounded">chat_started</code>
                            <span className="text-muted-foreground">Chat successfully assigned</span>
                          </div>
                          <div className="flex justify-between">
                            <code className="bg-muted px-2 py-1 rounded">new_message</code>
                            <span className="text-muted-foreground">New message received</span>
                          </div>
                          <div className="flex justify-between">
                            <code className="bg-muted px-2 py-1 rounded">chat_ended</code>
                            <span className="text-muted-foreground">Chat session ended</span>
                          </div>
                          <div className="flex justify-between">
                            <code className="bg-muted px-2 py-1 rounded">system_message</code>
                            <span className="text-muted-foreground">System notification</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </section>

                <Separator className="my-8" />

                {/* Best Practices */}
                <section className="space-y-6">
                  <div className="space-y-2">
                    <h2 id="best-practices" className="text-2xl font-bold tracking-tight">Best Practices</h2>
                  </div>

                  <div className="space-y-4">
                    <Alert>
                      <CheckCircle className="h-4 w-4" />
                      <AlertTitle>Connection Management</AlertTitle>
                      <AlertDescription>
                        Always handle socket disconnections gracefully and implement reconnection logic for better user experience.
                      </AlertDescription>
                    </Alert>

                    <Alert>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertTitle>Message Persistence</AlertTitle>
                      <AlertDescription>
                        Store messages in the database to ensure no data loss during connection issues or page refreshes.
                      </AlertDescription>
                    </Alert>

                    <Alert>
                      <Info className="h-4 w-4" />
                      <AlertTitle>Rate Limiting</AlertTitle>
                      <AlertDescription>
                        Implement rate limiting on message sending to prevent spam and ensure system stability.
                      </AlertDescription>
                    </Alert>
                  </div>
                </section>
              </div>
            </main>

            {/* Table of Contents - Right Sidebar */}
            <div className="hidden text-sm xl:block">
              <div className="sticky top-16 -mt-10 pt-4">
                <TableOfContents />
              </div>
            </div>
          </DocsLayout>
        </div>
      </div>

      <Footer />
    </div>
  )
}