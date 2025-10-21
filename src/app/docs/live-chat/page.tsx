"use client"

import React from 'react'
import Navbar from '@/components/hero-page/nav-bar'
import Footer from '@/components/hero-page/footer'
import { DocsSidebar } from '@/components/docs/DocsSidebar'
import { DocsLayout, DocsPageHeader } from '@/components/docs/DocsLayout'
import { TableOfContents } from '@/components/docs/TableOfContents'
import { CodeBlock, FeatureCard, Step } from '@/components/docs/DocsComponents'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { 
  MessageSquare, 
  Users,
  Zap,
  Clock,
  CheckCircle2,
  ArrowRight,
  Info,
  AlertCircle,
  FileText,
  Phone,
  Mail,
  Star,
  Send,
  Bot,
  UserCircle,
  ExternalLink,
  Loader2,
  Shield,
  Globe,
  Wifi,
  MessageCircle,
  Settings,
  Code
} from 'lucide-react'
import Link from 'next/link'

export default function LiveChatDocsPage() {
  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      
      <div className="w-full pt-20">
        <DocsLayout>
          {/* Sidebar */}
          <aside className="fixed top-20 z-30 hidden h-[calc(100vh-5rem)] w-72 shrink-0 border-r border-gray-800 bg-black/95 backdrop-blur md:sticky md:block">
            <div className="px-6 py-6">
              <DocsSidebar />
            </div>
          </aside>
          
          {/* Main Content */}
          <main className="relative py-8 px-6 flex-1 min-w-0">
            <div className="mx-auto w-full max-w-6xl">
              {/* Hero Section */}
              <div className="space-y-4">
                <DocsPageHeader 
                  heading="Live Chat System"
                  text="Real-time customer support with seamless escalation from AI to human agents. Built on Socket.IO for instant communication and enhanced customer experience."
                />
                
                <div className="flex gap-3">
                  <Button asChild>
                    <Link href="/demo">
                      <MessageCircle className="mr-2 h-4 w-4" />
                      Try Live Demo
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className='bg-black text-white'>
                    <Link href="https://agent-enquiro.vercel.app" target="_blank">
                      <Globe className="mr-2 h-4 w-4" />
                      Agent Portal
                      <ExternalLink className="ml-2 h-3 w-3" />
                    </Link>
                  </Button>
                </div>
              </div>

              <Separator className="my-8 bg-gray-800" />

              {/* Overview */}
              <section className="space-y-6">
                <div className="space-y-2">
                  <h2 id="overview" className="text-2xl font-bold tracking-tight text-white">Overview</h2>
                  <p className="text-gray-400">
                    The live chat system provides a seamless transition from AI chatbot assistance to real-time human agent support. 
                    Customers can escalate their conversations at any time, and agents can handle multiple chats simultaneously from a dedicated portal.
                  </p>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <Card className="border-gray-800 bg-gray-950">
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-2">
                        <Wifi className="h-5 w-5 text-blue-400" />
                        <CardTitle className="text-base text-white">Real-Time Communication</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-400">Built on Socket.IO for instant message delivery with typing indicators</p>
                    </CardContent>
                  </Card>

                  <Card className="border-gray-800 bg-gray-950">
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-2">
                        <ArrowRight className="h-5 w-5 text-green-400" />
                        <CardTitle className="text-base text-white">Smart Escalation</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-400">Seamlessly transition from AI to human agents with full context</p>
                    </CardContent>
                  </Card>

                  <Card className="border-gray-800 bg-gray-950">
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-purple-400" />
                        <CardTitle className="text-base text-white">File Sharing</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-400">Share images, documents, and files up to 10MB during live chats</p>
                    </CardContent>
                  </Card>
                </div>

                <Alert className="border-blue-800 bg-gradient-to-r from-blue-950/20 to-purple-950/20">
                  <Info className="h-4 w-4 text-blue-400" />
                  <AlertTitle className="text-white">Key Feature</AlertTitle>
                  <AlertDescription className="text-gray-300">
                    The system automatically queues customers and assigns them to available agents. If an agent disconnects, customers are automatically reassigned to maintain service continuity.
                  </AlertDescription>
                </Alert>
              </section>

              <Separator className="my-8 bg-gray-800" />

              {/* How It Works */}
              <section className="space-y-6">
                <div className="space-y-2">
                  <h2 id="how-it-works" className="text-2xl font-bold tracking-tight text-white">How It Works</h2>
                  <p className="text-gray-400">
                    Understanding the customer journey from AI chatbot to live agent support.
                  </p>
                </div>

                <div className="space-y-8">
                  <Step
                    step={1}
                    title="AI Chatbot Interaction"
                    description="Customers start by chatting with an AI-powered assistant that can answer common questions."
                  >
                    <div className="space-y-4">
                      <CodeBlock language="text" title="Initial Chat Flow">
{`Customer → AI Chatbot → Instant Responses
                     ↓
              Can escalate anytime`}
                      </CodeBlock>
                      
                      <div className="bg-gray-950 border border-gray-800 rounded-lg p-6">
                        <div className="space-y-4">
                          {/* AI Message */}
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                              <Bot className="h-4 w-4 text-white" />
                            </div>
                            <div className="flex-1">
                              <div className="bg-gray-800 rounded-2xl rounded-tl-sm p-4">
                                <p className="text-sm text-gray-200">Hi! I'm here to help. What can I assist you with today?</p>
                              </div>
                              <p className="text-xs text-gray-500 mt-1 ml-2">AI Assistant • 2:45 PM</p>
                            </div>
                          </div>

                          {/* Customer Message */}
                          <div className="flex items-start gap-3 justify-end">
                            <div className="flex-1 flex justify-end">
                              <div className="max-w-[80%]">
                                <div className="bg-blue-600 rounded-2xl rounded-tr-sm p-4">
                                  <p className="text-sm text-white">I need help with my account settings.</p>
                                </div>
                                <p className="text-xs text-gray-500 mt-1 mr-2 text-right">You • 2:46 PM</p>
                              </div>
                            </div>
                            <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center flex-shrink-0">
                              <UserCircle className="h-4 w-4 text-gray-300" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Step>

                  <Step
                    step={2}
                    title="Escalation Request"
                    description="When customers need human assistance, they can click the escalate button or request live support."
                  >
                    <div className="space-y-4">
                      <Alert className="border-yellow-800 bg-yellow-950/20">
                        <AlertCircle className="h-4 w-4 text-yellow-400" />
                        <AlertTitle className="text-white">Escalation Triggers</AlertTitle>
                        <AlertDescription className="text-gray-300">
                          Customers can escalate at any time by clicking the "Talk to an Agent" button or when the AI suggests escalation for complex issues.
                        </AlertDescription>
                      </Alert>

                      <div className="bg-gray-950 border border-gray-800 rounded-lg p-6">
                        <div className="space-y-4">
                          <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="text-sm font-semibold text-white">Contact Information Required</h4>
                              <Shield className="h-4 w-4 text-blue-400" />
                            </div>
                            <div className="space-y-2 text-xs text-gray-400">
                              <div className="flex items-center gap-2">
                                <UserCircle className="h-3 w-3" />
                                <span>Full Name</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Mail className="h-3 w-3" />
                                <span>Email Address</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Phone className="h-3 w-3" />
                                <span>Phone Number (optional)</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <MessageSquare className="h-3 w-3" />
                                <span>Concern/Issue Description</span>
                              </div>
                            </div>
                          </div>
                          <Button className="w-full" size="sm">
                            <Send className="mr-2 h-4 w-4" />
                            Submit & Connect to Agent
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Step>

                  <Step
                    step={3}
                    title="Queue & Case Creation"
                    description="The system creates a support ticket with a unique case number and places the customer in the queue."
                  >
                    <div className="space-y-4">
                      <div className="bg-emerald-950/20 border border-emerald-800 rounded-lg p-6">
                        <div className="flex items-start gap-4">
                          <div className="bg-emerald-900/50 rounded-full p-3">
                            <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-emerald-100 mb-2 text-lg">
                              Support Ticket Created
                            </h3>
                            <div className="space-y-3">
                              <div className="flex items-center justify-between p-3 bg-gray-900 rounded-lg">
                                <span className="text-sm font-medium text-gray-300">Case Number:</span>
                                <code className="text-sm font-mono bg-gray-800 px-3 py-1.5 rounded text-emerald-400">
                                  CASE-2025-10-001234
                                </code>
                              </div>
                              <div className="text-sm text-emerald-200 space-y-1">
                                <div className="flex items-center gap-2">
                                  <Clock className="h-4 w-4" />
                                  <span>Position in queue: 2</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                  <span>Waiting for available agent...</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <Alert className="border-gray-800 bg-gray-950">
                        <Info className="h-4 w-4 text-blue-400" />
                        <AlertTitle className="text-white">Case Number Benefits</AlertTitle>
                        <AlertDescription className="text-gray-400">
                          Customers can save their case number to resume conversations later or reference in future communications.
                        </AlertDescription>
                      </Alert>
                    </div>
                  </Step>

                  <Step
                    step={4}
                    title="Agent Connection"
                    description="An available agent accepts the chat and establishes a real-time connection."
                  >
                    <div className="space-y-4">
                      <CodeBlock language="text" title="Socket Events Flow">
{`1. request_chat        → Customer joins queue
2. chat_started        → Agent assigned
3. agent_connected     → Connection established
4. new_message         → Real-time messaging begins
5. agent_typing        → Typing indicators
6. chat_ended          → Session concludes`}
                      </CodeBlock>

                      <div className="bg-gray-950 border border-gray-800 rounded-lg p-6">
                        <div className="space-y-4">
                          {/* Connection Indicator */}
                          <div className="bg-emerald-950/20 border border-emerald-800/50 rounded-lg p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                              <span className="text-sm font-medium text-emerald-300">Connected to live agent</span>
                              <Users className="h-4 w-4 text-emerald-400 ml-auto" />
                            </div>
                          </div>

                          {/* System Message */}
                          <div className="flex justify-center">
                            <div className="bg-gray-800 rounded-full px-4 py-2">
                              <p className="text-xs text-gray-300">Sarah from support team has joined</p>
                            </div>
                          </div>

                          {/* Agent Message */}
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center flex-shrink-0">
                              <Users className="h-4 w-4 text-white" />
                            </div>
                            <div className="flex-1">
                              <div className="bg-gray-800 rounded-2xl rounded-tl-sm p-4">
                                <p className="text-sm text-gray-200">Hi! I'm Sarah, and I'll be helping you today. I see you need assistance with your account settings. Let me help you with that.</p>
                              </div>
                              <p className="text-xs text-gray-500 mt-1 ml-2">Sarah • 2:50 PM</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Step>

                  <Step
                    step={5}
                    title="Live Conversation"
                    description="Customer and agent engage in real-time conversation with full feature support."
                  >
                    <div className="space-y-4">
                      <div className="grid gap-4 md:grid-cols-3">
                        <Card className="border-gray-800 bg-gray-950">
                          <CardHeader className="pb-3">
                            <div className="flex items-center gap-2">
                              <MessageSquare className="h-4 w-4 text-blue-400" />
                              <CardTitle className="text-sm text-white">Text Messages</CardTitle>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <p className="text-xs text-gray-400">Instant message delivery</p>
                          </CardContent>
                        </Card>

                        <Card className="border-gray-800 bg-gray-950">
                          <CardHeader className="pb-3">
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4 text-purple-400" />
                              <CardTitle className="text-sm text-white">File Uploads</CardTitle>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <p className="text-xs text-gray-400">Share screenshots & docs</p>
                          </CardContent>
                        </Card>

                        <Card className="border-gray-800 bg-gray-950">
                          <CardHeader className="pb-3">
                            <div className="flex items-center gap-2">
                              <Loader2 className="h-4 w-4 text-green-400" />
                              <CardTitle className="text-sm text-white">Typing Status</CardTitle>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <p className="text-xs text-gray-400">See when agent is typing</p>
                          </CardContent>
                        </Card>
                      </div>

                      <div className="bg-gray-950 border border-gray-800 rounded-lg p-6">
                        <div className="space-y-4">
                          {/* Customer with file */}
                          <div className="flex items-start gap-3 justify-end">
                            <div className="flex-1 flex justify-end">
                              <div className="max-w-[80%]">
                                <div className="bg-blue-600 rounded-2xl rounded-tr-sm p-4">
                                  <p className="text-sm text-white mb-2">Here's a screenshot of the error I'm seeing:</p>
                                  <div className="bg-blue-700 rounded-lg p-2 flex items-center gap-2">
                                    <FileText className="h-4 w-4" />
                                    <span className="text-xs">screenshot.png (245 KB)</span>
                                  </div>
                                </div>
                                <p className="text-xs text-gray-500 mt-1 mr-2 text-right">You • 2:52 PM</p>
                              </div>
                            </div>
                            <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center flex-shrink-0">
                              <UserCircle className="h-4 w-4 text-gray-300" />
                            </div>
                          </div>

                          {/* Typing indicator */}
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center flex-shrink-0">
                              <Users className="h-4 w-4 text-white" />
                            </div>
                            <div className="bg-gray-800 rounded-2xl rounded-tl-sm px-4 py-3">
                              <div className="flex gap-1">
                                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" />
                                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                              </div>
                            </div>
                          </div>

                          {/* Agent response */}
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center flex-shrink-0">
                              <Users className="h-4 w-4 text-white" />
                            </div>
                            <div className="flex-1">
                              <div className="bg-gray-800 rounded-2xl rounded-tl-sm p-4">
                                <p className="text-sm text-gray-200">Thanks for the screenshot! I can see the issue. Let me guide you through fixing this...</p>
                              </div>
                              <p className="text-xs text-gray-500 mt-1 ml-2">Sarah • 2:53 PM</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Step>

                  <Step
                    step={6}
                    title="Chat Resolution & Rating"
                    description="Agent resolves the issue and closes the chat. Customer can rate their experience."
                  >
                    <div className="space-y-4">
                      <div className="bg-gray-950 border border-gray-800 rounded-lg p-6">
                        <div className="space-y-4">
                          {/* Resolution message */}
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center flex-shrink-0">
                              <Users className="h-4 w-4 text-white" />
                            </div>
                            <div className="flex-1">
                              <div className="bg-gray-800 rounded-2xl rounded-tl-sm p-4">
                                <p className="text-sm text-gray-200">Great! Your account settings are now updated. Is there anything else I can help you with today?</p>
                              </div>
                              <p className="text-xs text-gray-500 mt-1 ml-2">Sarah • 2:58 PM</p>
                            </div>
                          </div>

                          {/* Customer thanks */}
                          <div className="flex items-start gap-3 justify-end">
                            <div className="flex-1 flex justify-end">
                              <div className="max-w-[80%]">
                                <div className="bg-blue-600 rounded-2xl rounded-tr-sm p-4">
                                  <p className="text-sm text-white">That's perfect! Thank you so much for your help!</p>
                                </div>
                                <p className="text-xs text-gray-500 mt-1 mr-2 text-right">You • 2:59 PM</p>
                              </div>
                            </div>
                            <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center flex-shrink-0">
                              <UserCircle className="h-4 w-4 text-gray-300" />
                            </div>
                          </div>

                          {/* System message */}
                          <div className="flex justify-center">
                            <div className="bg-gray-800 rounded-full px-4 py-2">
                              <p className="text-xs text-gray-300">Chat ended by Sarah</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Rating Dialog */}
                      <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
                        <h4 className="text-lg font-semibold text-white mb-4 text-center">Rate Your Experience</h4>
                        <div className="space-y-4">
                          <div className="flex justify-center gap-2">
                            {[1, 2, 3, 4, 5].map((rating) => (
                              <Star key={rating} className="h-8 w-8 text-yellow-400 fill-yellow-400 cursor-pointer" />
                            ))}
                          </div>
                          <div className="text-center">
                            <p className="text-sm text-gray-400 mb-2">How was your experience with Sarah?</p>
                            <Button size="sm">
                              Submit Rating
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Step>
                </div>
              </section>

              <Separator className="my-8 bg-gray-800" />

              {/* Chat Modes */}
              <section className="space-y-6">
                <div className="space-y-2">
                  <h2 id="chat-modes" className="text-2xl font-bold tracking-tight text-white">Chat Modes</h2>
                  <p className="text-gray-400">
                    The system operates in different modes based on your configuration.
                  </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <Card className="border-gray-800 bg-gradient-to-br from-blue-950/20 to-blue-900/20">
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <Wifi className="h-5 w-5 text-blue-400" />
                        <CardTitle className="text-white">Live Chat Mode (Default)</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm text-gray-300">
                        Customers connect directly to live agents in real-time via Socket.IO.
                      </p>
                      <div className="space-y-2 text-xs text-gray-400">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-3 w-3 text-green-400" />
                          <span>Real-time messaging</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-3 w-3 text-green-400" />
                          <span>File sharing support</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-3 w-3 text-green-400" />
                          <span>Typing indicators</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-3 w-3 text-green-400" />
                          <span>Agent rating system</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-gray-800 bg-gradient-to-br from-purple-950/20 to-purple-900/20">
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-purple-400" />
                        <CardTitle className="text-white">Form-Only Mode</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm text-gray-300">
                        When live chat is disabled, customers submit support requests via form.
                      </p>
                      <div className="space-y-2 text-xs text-gray-400">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-3 w-3 text-green-400" />
                          <span>Case ticket creation</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-3 w-3 text-green-400" />
                          <span>Email notifications</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-3 w-3 text-green-400" />
                          <span>Follow-up tracking</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <AlertCircle className="h-3 w-3 text-yellow-400" />
                          <span>No real-time chat</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Alert className="border-gray-800 bg-gray-950">
                  <Settings className="h-4 w-4 text-gray-400" />
                  <AlertTitle className="text-white">Configuration</AlertTitle>
                  <AlertDescription className="text-gray-400">
                    You can toggle between modes in your Chatbot Settings. Form-only mode is useful for businesses with limited support staff or during off-hours.
                  </AlertDescription>
                </Alert>
              </section>

              <Separator className="my-8 bg-gray-800" />

              {/* Case Continuation */}
              <section className="space-y-6">
                <div className="space-y-2">
                  <h2 id="case-continuation" className="text-2xl font-bold tracking-tight text-white">Case Continuation</h2>
                  <p className="text-gray-400">
                    Customers can resume conversations using their case number at any time.
                  </p>
                </div>

                <div className="space-y-4">
                  <CodeBlock language="text" title="Case Continuation Flow">
{`1. Customer enters case number (e.g., CASE-2025-10-001234)
2. System validates case and retrieves session data
3. Previous conversation context is loaded
4. Customer rejoins queue for agent connection
5. Agent sees full conversation history`}
                  </CodeBlock>

                  <div className="bg-gray-950 border border-gray-800 rounded-lg p-6">
                    <h4 className="text-sm font-semibold text-white mb-4">Resume Conversation Example</h4>
                    <div className="space-y-3">
                      <div className="bg-gray-900 rounded-lg p-4">
                        <label className="text-xs text-gray-400 mb-2 block">Case Number</label>
                        <code className="text-sm font-mono bg-gray-800 text-blue-400 px-3 py-2 rounded block">
                          CASE-2025-10-001234
                        </code>
                      </div>
                      <Button className="w-full" size="sm">
                        <ArrowRight className="mr-2 h-4 w-4" />
                        Continue Conversation
                      </Button>
                    </div>
                  </div>

                  <Alert className="border-blue-800 bg-blue-950/20">
                    <Info className="h-4 w-4 text-blue-400" />
                    <AlertTitle className="text-white">Benefits</AlertTitle>
                    <AlertDescription className="text-gray-300">
                      Case continuation ensures customers don't have to re-explain their issue. Agents can see the full conversation history and pick up right where the last conversation left off.
                    </AlertDescription>
                  </Alert>
                </div>
              </section>

              <Separator className="my-8 bg-gray-800" />

              {/* Socket Events Reference */}
              <section className="space-y-6">
                <div className="space-y-2">
                  <h2 id="socket-events" className="text-2xl font-bold tracking-tight text-white">Socket Events Reference</h2>
                  <p className="text-gray-400">
                    Real-time communication is powered by Socket.IO. Here are the key events.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="grid gap-4">
                    {/* Client to Server Events */}
                    <Card className="border-gray-800 bg-gray-950">
                      <CardHeader>
                        <CardTitle className="text-base text-white flex items-center gap-2">
                          <Send className="h-4 w-4 text-blue-400" />
                          Client → Server Events
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="bg-gray-900 rounded-lg p-3">
                            <code className="text-sm text-blue-400">request_chat</code>
                            <p className="text-xs text-gray-400 mt-1">Request connection to live agent</p>
                          </div>
                          <div className="bg-gray-900 rounded-lg p-3">
                            <code className="text-sm text-blue-400">join_escalation</code>
                            <p className="text-xs text-gray-400 mt-1">Join specific escalation room</p>
                          </div>
                          <div className="bg-gray-900 rounded-lg p-3">
                            <code className="text-sm text-blue-400">customer_typing</code>
                            <p className="text-xs text-gray-400 mt-1">Notify agent customer is typing</p>
                          </div>
                          <div className="bg-gray-900 rounded-lg p-3">
                            <code className="text-sm text-blue-400">customer_stopped_typing</code>
                            <p className="text-xs text-gray-400 mt-1">Notify agent customer stopped typing</p>
                          </div>
                          <div className="bg-gray-900 rounded-lg p-3">
                            <code className="text-sm text-blue-400">leave_queue</code>
                            <p className="text-xs text-gray-400 mt-1">Leave waiting queue (on unmount/navigation)</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Server to Client Events */}
                    <Card className="border-gray-800 bg-gray-950">
                      <CardHeader>
                        <CardTitle className="text-base text-white flex items-center gap-2">
                          <MessageCircle className="h-4 w-4 text-green-400" />
                          Server → Client Events
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="bg-gray-900 rounded-lg p-3">
                            <code className="text-sm text-green-400">chat_started</code>
                            <p className="text-xs text-gray-400 mt-1">Agent assigned, chat room created</p>
                          </div>
                          <div className="bg-gray-900 rounded-lg p-3">
                            <code className="text-sm text-green-400">agent_connected</code>
                            <p className="text-xs text-gray-400 mt-1">Agent joined the chat room</p>
                          </div>
                          <div className="bg-gray-900 rounded-lg p-3">
                            <code className="text-sm text-green-400">new_message</code>
                            <p className="text-xs text-gray-400 mt-1">New message from agent</p>
                          </div>
                          <div className="bg-gray-900 rounded-lg p-3">
                            <code className="text-sm text-green-400">system_message</code>
                            <p className="text-xs text-gray-400 mt-1">System notifications and updates</p>
                          </div>
                          <div className="bg-gray-900 rounded-lg p-3">
                            <code className="text-sm text-green-400">agent_typing</code>
                            <p className="text-xs text-gray-400 mt-1">Agent is typing indicator</p>
                          </div>
                          <div className="bg-gray-900 rounded-lg p-3">
                            <code className="text-sm text-green-400">agent_stopped_typing</code>
                            <p className="text-xs text-gray-400 mt-1">Agent stopped typing</p>
                          </div>
                          <div className="bg-gray-900 rounded-lg p-3">
                            <code className="text-sm text-yellow-400">agent_disconnected_during_chat</code>
                            <p className="text-xs text-gray-400 mt-1">Agent disconnected unexpectedly (auto-reassign)</p>
                          </div>
                          <div className="bg-gray-900 rounded-lg p-3">
                            <code className="text-sm text-green-400">chat_ended</code>
                            <p className="text-xs text-gray-400 mt-1">Chat ended normally by agent</p>
                          </div>
                          <div className="bg-gray-900 rounded-lg p-3">
                            <code className="text-sm text-red-400">chat_error</code>
                            <p className="text-xs text-gray-400 mt-1">Error occurred (e.g., live chat disabled)</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </section>

              <Separator className="my-8 bg-gray-800" />

              {/* Best Practices */}
              <section className="space-y-6">
                <div className="space-y-2">
                  <h2 id="best-practices" className="text-2xl font-bold tracking-tight text-white">Best Practices</h2>
                  <p className="text-gray-400">
                    Tips for providing the best customer support experience.
                  </p>
                </div>

                <div className="grid gap-4">
                  <Card className="border-gray-800 bg-gray-950">
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <Zap className="h-5 w-5 text-yellow-400" />
                        <CardTitle className="text-base text-white">Quick Response Times</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-400">
                        Keep agents available during business hours to minimize queue times. The system automatically manages the queue, but having sufficient staff ensures customers aren't waiting long.
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="border-gray-800 bg-gray-950">
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <Shield className="h-5 w-5 text-blue-400" />
                        <CardTitle className="text-base text-white">Context Preservation</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-400">
                        Train agents to review conversation history before engaging. The system provides full context from AI chatbot conversations and previous interactions.
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="border-gray-800 bg-gray-950">
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <Star className="h-5 w-5 text-purple-400" />
                        <CardTitle className="text-base text-white">Agent Performance</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-400">
                        Monitor agent ratings to identify training opportunities. High ratings correlate with clear communication and timely issue resolution.
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="border-gray-800 bg-gray-950">
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-green-400" />
                        <CardTitle className="text-base text-white">File Sharing Guidelines</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-400">
                        Encourage customers to share screenshots of errors or issues. Visual context significantly reduces resolution time and improves accuracy.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </section>

              <Separator className="my-8 bg-gray-800" />

              {/* API Integration */}
              <section className="space-y-6">
                <div className="space-y-2">
                  <h2 id="api-integration" className="text-2xl font-bold tracking-tight text-white">API Integration</h2>
                  <p className="text-gray-400">
                    Key endpoints for integrating the live chat system.
                  </p>
                </div>

                <div className="space-y-4">
                  <CodeBlock language="typescript" title="Create Escalation">
{`// POST /escalation
const response = await fetch('/api/escalation', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    businessId: 'your-business-id',
    sessionId: 'session-id',
    customerName: 'John Doe',
    customerEmail: 'john@example.com',
    customerPhone: '555-0123',
    concern: 'Account Issue',
    description: 'Need help with account settings'
  })
})

// Response
{
  "_id": "escalation-id",
  "caseNumber": "CASE-2025-10-001234",
  "customerName": "John Doe",
  "customerEmail": "john@example.com",
  "concern": "Account Issue",
  "createdAt": "2025-10-21T14:30:00Z"
}`}
                  </CodeBlock>

                  <CodeBlock language="typescript" title="Send Message (Live Chat)">
{`// POST /chat/send-message
await fetch('/api/chat/send-message', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    businessId: 'your-business-id',
    sessionId: 'session-id',
    escalationId: 'escalation-id',
    message: 'Hello, I need help',
    senderType: 'customer'
  })
})`}
                  </CodeBlock>

                  <CodeBlock language="typescript" title="Send Message with File">
{`// POST /chat/send-message-with-file
const formData = new FormData()
formData.append('file', file)
formData.append('businessId', 'your-business-id')
formData.append('sessionId', 'session-id')
formData.append('escalationId', 'escalation-id')
formData.append('senderType', 'customer')
formData.append('message', 'Here is the screenshot')

await fetch('/api/chat/send-message-with-file', {
  method: 'POST',
  body: formData
})`}
                  </CodeBlock>

                  <CodeBlock language="typescript" title="Submit Agent Rating">
{`// POST /agent-rating
await fetch('/api/agent-rating', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    businessId: 'your-business-id',
    sessionId: 'session-id',
    agentId: 'agent-id',
    caseNumber: 'CASE-2025-10-001234',
    rating: 5,
    feedback: 'Excellent support!'
  })
})`}
                  </CodeBlock>

                  <CodeBlock language="typescript" title="Validate Case Number">
{`// GET /escalation/case/{caseNumber}?businessId={businessId}
const response = await fetch(
  '/api/escalation/case/CASE-2025-10-001234?businessId=your-business-id'
)

// Response includes full escalation data for continuation
const data = await response.json()
console.log(data.sessionId) // Use for resuming conversation`}
                  </CodeBlock>
                </div>
              </section>

              <Separator className="my-8 bg-gray-800" />

              {/* Next Steps */}
              <section className="space-y-6">
                <div className="space-y-2">
                  <h2 id="next-steps" className="text-2xl font-bold tracking-tight text-white">Next Steps</h2>
                  <p className="text-gray-400">
                    Continue learning about the system's capabilities.
                  </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <Card className="border-gray-800 bg-gradient-to-br from-blue-950/20 to-blue-900/20 hover:shadow-lg hover:shadow-blue-900/20 transition-all">
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-blue-400" />
                        <CardTitle className="text-base text-white">Agent Management</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm text-gray-400">
                        Learn how to create and manage your support team.
                      </p>
                      <Button asChild size="sm" className="w-full">
                        <Link href="/docs/agent">
                          View Docs <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="border-gray-800 bg-gradient-to-br from-purple-950/20 to-purple-900/20 hover:shadow-lg hover:shadow-purple-900/20 transition-all">
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <Code className="h-5 w-5 text-purple-400" />
                        <CardTitle className="text-base text-white">Chat Widget</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm text-gray-400">
                        Install the widget on your website or app.
                      </p>
                      <Button asChild size="sm" className="w-full">
                        <Link href="/docs/chat-widget">
                          View Docs <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </section>
            </div>
          </main>

          {/* Table of Contents */}
          <aside className="hidden xl:sticky xl:top-20 xl:block xl:h-[calc(100vh-5rem)] xl:w-64 xl:shrink-0">
            <div className="px-6 py-8">
              <TableOfContents/>
            </div>
          </aside>
        </DocsLayout>
      </div>
      
      <Footer />
    </div>
  )
}
