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
  AlertTriangle, 
  Clock,
  CheckCircle2,
  FileText,
  Activity,
  Mail,
  MessageSquare,
  Edit,
  UserPlus,
  Search,
  Filter,
  ArrowRight,
  Info,
  Users,
  Bell,
  Trash2,
  RefreshCw,
  Download,
  Send,
  Eye,
  Shield,
  Zap
} from 'lucide-react'
import Link from 'next/link'

export default function EscalationDocsPage() {
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
                  heading="Escalation Management"
                  text="Complete case management system for tracking, managing, and resolving customer escalations. Monitor conversations, send emails, add notes, and collaborate with your team."
                />
                
                <div className="flex gap-3">
                  <Button asChild>
                    <Link href="/dashboard/escalations">
                      <AlertTriangle className="mr-2 h-4 w-4" />
                      View Escalations
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className='bg-black text-white'>
                    <Link href="/docs/live-chat">
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Live Chat Docs
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
                    The Escalation Management system provides a centralized dashboard for handling customer support cases. 
                    Each escalation is created when a customer requests live support and is tracked from creation to resolution.
                  </p>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <Card className="border-gray-800 bg-gray-950">
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-orange-400" />
                        <CardTitle className="text-base text-white">Case Tracking</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-400">Track every escalation with unique case numbers and status updates</p>
                    </CardContent>
                  </Card>

                  <Card className="border-gray-800 bg-gray-950">
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-blue-400" />
                        <CardTitle className="text-base text-white">Team Collaboration</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-400">Assign cases to team members and track progress together</p>
                    </CardContent>
                  </Card>

                  <Card className="border-gray-800 bg-gray-950">
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="h-5 w-5 text-green-400" />
                        <CardTitle className="text-base text-white">Multi-Channel Support</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-400">View chat history and send email responses from one place</p>
                    </CardContent>
                  </Card>
                </div>

                <Alert className="border-blue-800 bg-gradient-to-r from-blue-950/20 to-purple-950/20">
                  <Info className="h-4 w-4 text-blue-400" />
                  <AlertTitle className="text-white">Automatic Creation</AlertTitle>
                  <AlertDescription className="text-gray-300">
                    Escalations are automatically created when customers submit the live chat escalation form. Each case is assigned a unique case number for easy reference.
                  </AlertDescription>
                </Alert>
              </section>

              <Separator className="my-8 bg-gray-800" />

              {/* Case Statuses */}
              <section className="space-y-6">
                <div className="space-y-2">
                  <h2 id="case-statuses" className="text-2xl font-bold tracking-tight text-white">Case Statuses</h2>
                  <p className="text-gray-400">
                    Every escalation has a status that indicates its current state in the resolution process.
                  </p>
                </div>

                <div className="grid gap-4">
                  <Card className="border-orange-800 bg-gradient-to-br from-orange-950/20 to-red-950/20">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-full bg-orange-900/50">
                          <AlertTriangle className="h-5 w-5 text-orange-400" />
                        </div>
                        <div>
                          <CardTitle className="text-white">Escalated</CardTitle>
                          <CardDescription className="text-gray-400">New cases requiring immediate attention</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-300">
                        Default status for newly created escalations. Indicates the case has been submitted and is awaiting agent response or assignment.
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="border-yellow-800 bg-gradient-to-br from-yellow-950/20 to-amber-950/20">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-full bg-yellow-900/50">
                          <Clock className="h-5 w-5 text-yellow-400" />
                        </div>
                        <div>
                          <CardTitle className="text-white">Pending</CardTitle>
                          <CardDescription className="text-gray-400">Work in progress, awaiting information or action</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-300">
                        Cases that are actively being worked on. May be waiting for customer response, internal review, or additional information.
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="border-green-800 bg-gradient-to-br from-green-950/20 to-emerald-950/20">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-full bg-green-900/50">
                          <CheckCircle2 className="h-5 w-5 text-green-400" />
                        </div>
                        <div>
                          <CardTitle className="text-white">Resolved</CardTitle>
                          <CardDescription className="text-gray-400">Issue successfully addressed and closed</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-300">
                        Cases that have been successfully resolved. Customer issue has been addressed and the case is closed.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </section>

              <Separator className="my-8 bg-gray-800" />

              {/* Escalations Dashboard */}
              <section className="space-y-6">
                <div className="space-y-2">
                  <h2 id="dashboard" className="text-2xl font-bold tracking-tight text-white">Escalations Dashboard</h2>
                  <p className="text-gray-400">
                    The main dashboard provides a comprehensive view of all escalations with filtering and search capabilities.
                  </p>
                </div>

                <div className="space-y-8">
                  <Step
                    step={1}
                    title="Status Overview Cards"
                    description="Quick metrics showing case counts by status at the top of the dashboard."
                  >
                    <div className="grid gap-4 md:grid-cols-4">
                      <Card className="border-gray-800 bg-gray-950">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <FileText className="h-5 w-5 text-blue-400" />
                            <Badge className="bg-blue-200 text-blue-800">125</Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm font-medium text-white">Total Cases</p>
                        </CardContent>
                      </Card>

                      <Card className="border-gray-800 bg-gray-950">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <AlertTriangle className="h-5 w-5 text-orange-400" />
                            <Badge className="bg-red-200 text-red-800">23</Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm font-medium text-white">Escalated</p>
                        </CardContent>
                      </Card>

                      <Card className="border-gray-800 bg-gray-950">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <Clock className="h-5 w-5 text-yellow-400" />
                            <Badge className="bg-yellow-200 text-yellow-800">45</Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm font-medium text-white">Pending</p>
                        </CardContent>
                      </Card>

                      <Card className="border-gray-800 bg-gray-950">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <CheckCircle2 className="h-5 w-5 text-green-400" />
                            <Badge className="bg-green-200 text-green-800">57</Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm font-medium text-white">Resolved</p>
                        </CardContent>
                      </Card>
                    </div>
                    <Alert className="border-gray-800 bg-gray-950 mt-4">
                      <Info className="h-4 w-4 text-blue-400" />
                      <AlertTitle className="text-white">Interactive Filtering</AlertTitle>
                      <AlertDescription className="text-gray-400">
                        Click on any status card to instantly filter the table to show only cases with that status.
                      </AlertDescription>
                    </Alert>
                  </Step>

                  <Step
                    step={2}
                    title="Search and Filter Tools"
                    description="Powerful search and filtering capabilities to find specific cases quickly."
                  >
                    <div className="bg-gray-950 border border-gray-800 rounded-lg p-6 space-y-4">
                      <div className="flex gap-3">
                        <div className="flex-1 relative">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                          <div className="h-10 bg-gray-900 border border-gray-800 rounded-lg pl-10 pr-4 flex items-center">
                            <span className="text-sm text-gray-500">Search by customer, case #, or concern...</span>
                          </div>
                        </div>
                        <div className="w-48 relative">
                          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                          <div className="h-10 bg-gray-900 border border-gray-800 rounded-lg pl-10 pr-4 flex items-center">
                            <span className="text-sm text-gray-500">Filter by status</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2 text-sm text-gray-400">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-400" />
                          <span>Real-time search with 500ms debounce</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-400" />
                          <span>Search across customer names, emails, case numbers, and concerns</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-400" />
                          <span>Pagination automatically resets when filtering or searching</span>
                        </div>
                      </div>
                    </div>
                  </Step>

                  <Step
                    step={3}
                    title="Escalations Table"
                    description="Sortable table displaying all escalation cases with key information."
                  >
                    <div className="bg-gray-950 border border-gray-800 rounded-lg overflow-hidden">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-900 border-b border-gray-800">
                          <tr>
                            <th className="text-left p-3 text-gray-400 font-medium">Case Number</th>
                            <th className="text-left p-3 text-gray-400 font-medium">Customer</th>
                            <th className="text-left p-3 text-gray-400 font-medium">Concern</th>
                            <th className="text-left p-3 text-gray-400 font-medium">Status</th>
                            <th className="text-left p-3 text-gray-400 font-medium">Case Owner</th>
                            <th className="text-left p-3 text-gray-400 font-medium">Created</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b border-gray-800 hover:bg-gray-900/50">
                            <td className="p-3">
                              <code className="text-xs bg-gray-800 px-2 py-1 rounded text-blue-400">CASE-2025-10-001234</code>
                            </td>
                            <td className="p-3">
                              <div>
                                <p className="text-white font-medium">John Doe</p>
                                <p className="text-xs text-gray-500">john@example.com</p>
                              </div>
                            </td>
                            <td className="p-3 text-gray-300">Account access issue</td>
                            <td className="p-3">
                              <Badge className="bg-red-200 text-red-800">Escalated</Badge>
                            </td>
                            <td className="p-3 text-gray-400">Sarah Johnson</td>
                            <td className="p-3 text-gray-400">Oct 21, 2025</td>
                          </tr>
                          <tr className="border-b border-gray-800 hover:bg-gray-900/50">
                            <td className="p-3">
                              <code className="text-xs bg-gray-800 px-2 py-1 rounded text-blue-400">CASE-2025-10-001233</code>
                            </td>
                            <td className="p-3">
                              <div>
                                <p className="text-white font-medium">Jane Smith</p>
                                <p className="text-xs text-gray-500">jane@example.com</p>
                              </div>
                            </td>
                            <td className="p-3 text-gray-300">Billing inquiry</td>
                            <td className="p-3">
                              <Badge className="bg-yellow-200 text-yellow-800">Pending</Badge>
                            </td>
                            <td className="p-3 text-gray-400">Mike Chen</td>
                            <td className="p-3 text-gray-400">Oct 20, 2025</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Eye className="h-4 w-4" />
                        <span>Click any row to view full case details</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <ArrowRight className="h-4 w-4" />
                        <span>Right-click for context menu with edit/delete options</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <ArrowRight className="h-4 w-4" />
                        <span>Column headers are sortable - click to sort ascending/descending</span>
                      </div>
                    </div>
                  </Step>
                </div>
              </section>

              <Separator className="my-8 bg-gray-800" />

              {/* Case Details Page */}
              <section className="space-y-6">
                <div className="space-y-2">
                  <h2 id="case-details" className="text-2xl font-bold tracking-tight text-white">Case Details Page</h2>
                  <p className="text-gray-400">
                    Comprehensive view of individual escalation cases with all related information and communication history.
                  </p>
                </div>

                <div className="space-y-8">
                  <Step
                    step={1}
                    title="Case Header"
                    description="Key information and controls at the top of every case details page."
                  >
                    <div className="bg-gray-950 border border-gray-800 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-xl font-bold text-white">Case #CASE-2025-10-001234</h3>
                            <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                              <Eye className="h-3 w-3" />
                            </Button>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">Session ID: sess_abc123xyz</p>
                        </div>
                        <div className="flex gap-4">
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Status</p>
                            <Badge className="bg-red-200 text-red-800">Escalated</Badge>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Case Owner</p>
                            <div className="text-sm text-white">Sarah Johnson</div>
                          </div>
                        </div>
                      </div>

                      <Alert className="border-gray-800 bg-gray-900">
                        <Info className="h-4 w-4 text-blue-400" />
                        <AlertTitle className="text-white">Quick Actions</AlertTitle>
                        <AlertDescription className="text-gray-400">
                          <ul className="mt-2 space-y-1 text-sm">
                            <li>• Copy case number or session ID with one click</li>
                            <li>• Change status using dropdown (escalated, pending, resolved)</li>
                            <li>• Assign/reassign case owner from available agents</li>
                          </ul>
                        </AlertDescription>
                      </Alert>
                    </div>
                  </Step>

                  <Step
                    step={2}
                    title="Customer & Issue Information"
                    description="Editable card displaying customer contact details and issue description."
                  >
                    <Card className="border-gray-800 bg-gray-950">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-white">Customer & Issue Details</CardTitle>
                          <Button size="sm" variant="ghost">
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Customer Name</p>
                            <p className="text-sm text-white">John Doe</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Email</p>
                            <p className="text-sm text-white">john@example.com</p>
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Phone</p>
                          <p className="text-sm text-white">+1 555-0123</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Concern</p>
                          <p className="text-sm text-white">Account access issue</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Description</p>
                          <p className="text-sm text-gray-300">Unable to log in to my account. Tried password reset but didn't receive the email.</p>
                        </div>
                      </CardContent>
                    </Card>

                    <Alert className="border-gray-800 bg-gray-950">
                      <Edit className="h-4 w-4 text-gray-400" />
                      <AlertTitle className="text-white">Inline Editing</AlertTitle>
                      <AlertDescription className="text-gray-400">
                        Click "Edit" to modify customer information or issue details. Changes are saved instantly and recorded in the activity feed.
                      </AlertDescription>
                    </Alert>
                  </Step>

                  <Step
                    step={3}
                    title="Conversation History"
                    description="Complete chat transcript between customer and AI/agent with file attachments."
                  >
                    <div className="bg-gray-950 border border-gray-800 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <MessageSquare className="h-5 w-5 text-blue-400" />
                          <h4 className="font-semibold text-white">Chat History</h4>
                          <Badge variant="outline" className="text-xs">24 messages</Badge>
                        </div>
                        <Button size="sm" variant="ghost">
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Refresh
                        </Button>
                      </div>

                      <div className="space-y-4">
                        {/* AI Message */}
                        <div className="flex gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                            <MessageSquare className="h-4 w-4 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="bg-gray-800 rounded-2xl rounded-tl-sm p-3">
                              <p className="text-sm text-gray-200">Hi! How can I help you today?</p>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">AI Assistant • 2:45 PM</p>
                          </div>
                        </div>

                        {/* Customer Message */}
                        <div className="flex gap-3 justify-end">
                          <div className="flex-1 flex justify-end">
                            <div className="max-w-[80%]">
                              <div className="bg-blue-600 rounded-2xl rounded-tr-sm p-3">
                                <p className="text-sm text-white">I can't access my account</p>
                              </div>
                              <p className="text-xs text-gray-500 mt-1 text-right">Customer • 2:46 PM</p>
                            </div>
                          </div>
                        </div>

                        {/* Agent Message with File */}
                        <div className="flex gap-3">
                          <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center flex-shrink-0">
                            <Users className="h-4 w-4 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="bg-gray-800 rounded-2xl rounded-tl-sm p-3">
                              <p className="text-sm text-gray-200 mb-2">I can help with that. Could you share a screenshot?</p>
                              <div className="bg-gray-700 rounded-lg p-2 flex items-center gap-2">
                                <FileText className="h-4 w-4 text-blue-400" />
                                <span className="text-xs text-gray-300">instructions.pdf</span>
                                <Download className="h-3 w-3 text-gray-400 ml-auto" />
                              </div>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">Sarah Johnson • 2:48 PM</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <CheckCircle2 className="h-4 w-4 text-green-400" />
                        <span>Chronological display of all chat messages</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <CheckCircle2 className="h-4 w-4 text-green-400" />
                        <span>Differentiated icons for AI, customer, and agent messages</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <CheckCircle2 className="h-4 w-4 text-green-400" />
                        <span>Image previews with modal viewer for full-size viewing</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <CheckCircle2 className="h-4 w-4 text-green-400" />
                        <span>File attachments with download capability</span>
                      </div>
                    </div>
                  </Step>

                  <Step
                    step={4}
                    title="Email Thread"
                    description="Integrated email communication with reply and compose capabilities."
                  >
                    <div className="bg-gray-950 border border-gray-800 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <Mail className="h-5 w-5 text-purple-400" />
                          <h4 className="font-semibold text-white">Email Thread</h4>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Send className="h-4 w-4 mr-2" />
                            Compose
                          </Button>
                          <Button size="sm" variant="ghost">
                            <RefreshCw className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="bg-gray-900 rounded-lg p-4 border-l-4 border-blue-500">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <p className="text-sm font-medium text-white">Support Team</p>
                              <p className="text-xs text-gray-500">support@company.com</p>
                            </div>
                            <p className="text-xs text-gray-500">Oct 21, 2:50 PM</p>
                          </div>
                          <p className="text-sm text-gray-300 mb-2">
                            Hi John, I'm following up on your account access issue...
                          </p>
                          <Button size="sm" variant="ghost" className="text-xs">
                            <ArrowRight className="h-3 w-3 mr-1" />
                            Reply
                          </Button>
                        </div>

                        <div className="bg-gray-900 rounded-lg p-4 border-l-4 border-gray-600">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <p className="text-sm font-medium text-white">John Doe</p>
                              <p className="text-xs text-gray-500">john@example.com</p>
                            </div>
                            <p className="text-xs text-gray-500">Oct 20, 4:30 PM</p>
                          </div>
                          <p className="text-sm text-gray-300">
                            I'm having trouble accessing my account. Can you help?
                          </p>
                        </div>
                      </div>
                    </div>

                    <Alert className="border-gray-800 bg-gray-950">
                      <Mail className="h-4 w-4 text-purple-400" />
                      <AlertTitle className="text-white">Email Features</AlertTitle>
                      <AlertDescription className="text-gray-400">
                        <ul className="mt-2 space-y-1 text-sm">
                          <li>• View complete email thread with customer</li>
                          <li>• Reply to any email in the thread</li>
                          <li>• Compose new emails to customer</li>
                          <li>• Automatic linking of emails to escalation case</li>
                          <li>• Email attachments are viewable and downloadable</li>
                        </ul>
                      </AlertDescription>
                    </Alert>
                  </Step>

                  <Step
                    step={5}
                    title="Case Notes"
                    description="Internal notes for team collaboration and documentation."
                  >
                    <div className="bg-gray-950 border border-gray-800 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <FileText className="h-5 w-5 text-indigo-400" />
                          <h4 className="font-semibold text-white">Case Notes</h4>
                          <Badge variant="outline" className="text-xs">5</Badge>
                        </div>
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-2" />
                          View All
                        </Button>
                      </div>

                      {/* Add Note Section */}
                      <div className="mb-4">
                        <div className="bg-gray-900 rounded-lg p-3 border border-gray-800">
                          <textarea 
                            placeholder="Add a note..."
                            className="w-full bg-transparent text-sm text-white placeholder:text-gray-500 outline-none resize-none"
                            rows={3}
                          />
                        </div>
                        <Button size="sm" className="mt-2">
                          <Send className="h-3 w-3 mr-2" />
                          Add Note
                        </Button>
                      </div>

                      {/* Recent Notes */}
                      <div className="space-y-3">
                        <div className="bg-gray-900 rounded-lg p-3">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center">
                                <span className="text-xs text-white font-medium">SJ</span>
                              </div>
                              <div>
                                <p className="text-xs font-medium text-white">Sarah Johnson</p>
                                <p className="text-xs text-gray-500">Oct 21, 2025, 3:15 PM</p>
                              </div>
                            </div>
                            <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                              <Trash2 className="h-3 w-3 text-gray-500" />
                            </Button>
                          </div>
                          <p className="text-sm text-gray-300">
                            Customer confirmed password reset email was in spam folder. Issue resolved.
                          </p>
                        </div>

                        <div className="bg-gray-900 rounded-lg p-3">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full bg-green-600 flex items-center justify-center">
                                <span className="text-xs text-white font-medium">MC</span>
                              </div>
                              <div>
                                <p className="text-xs font-medium text-white">Mike Chen</p>
                                <p className="text-xs text-gray-500">Oct 21, 2025, 2:30 PM</p>
                              </div>
                            </div>
                            <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                              <Trash2 className="h-3 w-3 text-gray-500" />
                            </Button>
                          </div>
                          <p className="text-sm text-gray-300">
                            Escalated to engineering team. Ticket #ENG-1234 created.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Shield className="h-4 w-4" />
                        <span>Internal notes are only visible to team members</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Users className="h-4 w-4" />
                        <span>All notes are attributed to the creating user</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Trash2 className="h-4 w-4" />
                        <span>Notes can be deleted by any team member</span>
                      </div>
                    </div>
                  </Step>

                  <Step
                    step={6}
                    title="Activity Feed"
                    description="Automatic tracking of all actions and changes to the case."
                  >
                    <div className="bg-gray-950 border border-gray-800 rounded-lg p-6">
                      <div className="flex items-center gap-2 mb-4">
                        <Activity className="h-5 w-5 text-blue-400" />
                        <h4 className="font-semibold text-white">Recent Activity</h4>
                      </div>

                      <div className="space-y-4 relative">
                        <div className="flex gap-4 items-start">
                          <div className="w-7 h-7 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                            <RefreshCw className="h-3.5 w-3.5 text-white" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-white">Status Changed</p>
                            <p className="text-xs text-gray-500">Changed from Pending to Resolved</p>
                            <p className="text-xs text-gray-500 mt-1">Oct 21, 2025, 3:20 PM</p>
                          </div>
                        </div>

                        <div className="flex gap-4 items-start">
                          <div className="w-7 h-7 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                            <FileText className="h-3.5 w-3.5 text-white" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-white">Note Added</p>
                            <p className="text-xs text-gray-500">Oct 21, 2025, 3:15 PM</p>
                          </div>
                        </div>

                        <div className="flex gap-4 items-start">
                          <div className="w-7 h-7 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                            <UserPlus className="h-3.5 w-3.5 text-white" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-white">Case Owner Assigned</p>
                            <p className="text-xs text-gray-500">Assigned to Sarah Johnson</p>
                            <p className="text-xs text-gray-500 mt-1">Oct 21, 2025, 2:45 PM</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <Alert className="border-gray-800 bg-gray-950">
                      <Activity className="h-4 w-4 text-blue-400" />
                      <AlertTitle className="text-white">Automatic Tracking</AlertTitle>
                      <AlertDescription className="text-gray-400">
                        <p className="mb-2">Activities are automatically logged for:</p>
                        <ul className="space-y-1 text-sm">
                          <li>• Status changes</li>
                          <li>• Case owner assignments</li>
                          <li>• Customer detail updates</li>
                          <li>• Note additions/deletions</li>
                          <li>• Email sends and replies</li>
                        </ul>
                      </AlertDescription>
                    </Alert>
                  </Step>
                </div>
              </section>

              <Separator className="my-8 bg-gray-800" />

              {/* API Reference */}
              <section className="space-y-6">
                <div className="space-y-2">
                  <h2 id="api-reference" className="text-2xl font-bold tracking-tight text-white">API Reference</h2>
                  <p className="text-gray-400">
                    Key API endpoints for working with escalations programmatically.
                  </p>
                </div>

                <div className="space-y-4">
                  <CodeBlock language="typescript" title="Get Business Escalations">
{`// GET /escalation/business/:businessId
const response = await fetch(
  '/api/escalation/business/your-business-id?' + 
  'status=all&page=1&limit=13&search=query'
)

// Response
{
  "escalations": [
    {
      "_id": "escalation-id",
      "caseNumber": "CASE-2025-10-001234",
      "customerName": "John Doe",
      "customerEmail": "john@example.com",
      "concern": "Account Issue",
      "status": "escalated",
      "caseOwner": {
        "_id": "agent-id",
        "name": "Sarah Johnson"
      },
      "createdAt": "2025-10-21T14:30:00Z"
    }
  ],
  "totalPages": 5,
  "currentPage": 1
}`}
                  </CodeBlock>

                  <CodeBlock language="typescript" title="Get Escalation Counts">
{`// GET /escalation/business/:businessId/count
const response = await fetch('/api/escalation/business/your-business-id/count')

// Response
{
  "total": 125,
  "escalated": 23,
  "pending": 45,
  "resolved": 57
}`}
                  </CodeBlock>

                  <CodeBlock language="typescript" title="Get Single Escalation">
{`// GET /escalation/:id
const response = await fetch('/api/escalation/escalation-id')

// Response includes full details
{
  "_id": "escalation-id",
  "sessionId": "session-id",
  "businessId": "business-id",
  "caseNumber": "CASE-2025-10-001234",
  "customerName": "John Doe",
  "customerEmail": "john@example.com",
  "customerPhone": "+1 555-0123",
  "concern": "Account access issue",
  "description": "Unable to log in...",
  "status": "escalated",
  "caseOwner": {
    "_id": "agent-id",
    "name": "Sarah Johnson",
    "email": "sarah@company.com"
  },
  "emailThreadId": "thread-id",
  "createdAt": "2025-10-21T14:30:00Z",
  "updatedAt": "2025-10-21T15:00:00Z"
}`}
                  </CodeBlock>

                  <CodeBlock language="typescript" title="Update Escalation Status">
{`// PATCH /escalation/:id/status
await fetch('/api/escalation/escalation-id/status', {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    status: 'resolved' // 'escalated' | 'pending' | 'resolved'
  })
})`}
                  </CodeBlock>

                  <CodeBlock language="typescript" title="Update Case Owner">
{`// PATCH /escalation/:id/case-owner
await fetch('/api/escalation/escalation-id/case-owner', {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    caseOwner: 'agent-id' // or null to unassign
  })
})

// Response includes updated escalation with populated caseOwner`}
                  </CodeBlock>

                  <CodeBlock language="typescript" title="Update Customer Details">
{`// PATCH /escalation/:id
await fetch('/api/escalation/escalation-id', {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    customerName: 'John Doe',
    customerEmail: 'john@example.com',
    customerPhone: '+1 555-0123',
    concern: 'Updated concern',
    description: 'Updated description'
  })
})`}
                  </CodeBlock>

                  <CodeBlock language="typescript" title="Get Chat Messages">
{`// GET /chat/session/:sessionId
const response = await fetch('/api/chat/session/session-id')

// Response is array of chat messages
[
  {
    "_id": "message-id",
    "sessionId": "session-id",
    "businessId": "business-id",
    "message": "Hello, how can I help?",
    "messageType": "text",
    "senderType": "ai",
    "attachments": [],
    "createdAt": "2025-10-21T14:30:00Z"
  }
]`}
                  </CodeBlock>

                  <CodeBlock language="typescript" title="Case Notes Operations">
{`// GET /notes/escalation/:escalationId
const notes = await fetch('/api/notes/escalation/escalation-id')

// POST /notes/escalation/:escalationId
await fetch('/api/notes/escalation/escalation-id', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    content: 'Note content here',
    createdBy: 'User Name'
  })
})

// DELETE /notes/:noteId
await fetch('/api/notes/note-id', { method: 'DELETE' })`}
                  </CodeBlock>

                  <CodeBlock language="typescript" title="Get Activities">
{`// GET /activity/escalation/:escalationId
const response = await fetch('/api/activity/escalation/escalation-id')

// Response
[
  {
    "_id": "activity-id",
    "escalationId": "escalation-id",
    "action": "Status Changed",
    "details": "Changed from Pending to Resolved",
    "timestamp": "2025-10-21T15:00:00Z"
  }
]`}
                  </CodeBlock>
                </div>
              </section>

              <Separator className="my-8 bg-gray-800" />

              {/* Best Practices */}
              <section className="space-y-6">
                <div className="space-y-2">
                  <h2 id="best-practices" className="text-2xl font-bold tracking-tight text-white">Best Practices</h2>
                  <p className="text-gray-400">
                    Tips for effective escalation management and team collaboration.
                  </p>
                </div>

                <div className="grid gap-4">
                  <Card className="border-gray-800 bg-gray-950">
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <Zap className="h-5 w-5 text-yellow-400" />
                        <CardTitle className="text-base text-white">Prompt Case Assignment</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-400">
                        Assign cases to appropriate team members immediately upon escalation. Clear ownership improves response time and accountability.
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="border-gray-800 bg-gray-950">
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-indigo-400" />
                        <CardTitle className="text-base text-white">Detailed Case Notes</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-400">
                        Document all important details, customer communications, and troubleshooting steps. This ensures continuity if the case is reassigned.
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="border-gray-800 bg-gray-950">
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <RefreshCw className="h-5 w-5 text-blue-400" />
                        <CardTitle className="text-base text-white">Regular Status Updates</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-400">
                        Keep case status current. Move cases to "pending" when waiting for information and "resolved" when complete. This helps with accurate metrics.
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="border-gray-800 bg-gray-950">
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <MessageSquare className="h-5 w-5 text-green-400" />
                        <CardTitle className="text-base text-white">Review Chat History</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-400">
                        Always review the complete conversation history before responding. This provides context and prevents asking customers to repeat information.
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="border-gray-800 bg-gray-950">
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <Mail className="h-5 w-5 text-purple-400" />
                        <CardTitle className="text-base text-white">Timely Email Responses</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-400">
                        Respond to customer emails promptly. Use the integrated email thread to keep all communication linked to the case.
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="border-gray-800 bg-gray-950">
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <Search className="h-5 w-5 text-orange-400" />
                        <CardTitle className="text-base text-white">Use Search Effectively</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-400">
                        Use the search function to quickly find cases by case number, customer name, or issue type. This helps identify duplicate or related issues.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </section>

              <Separator className="my-8 bg-gray-800" />

              {/* Next Steps */}
              <section className="space-y-6">
                <div className="space-y-2">
                  <h2 id="next-steps" className="text-2xl font-bold tracking-tight text-white">Next Steps</h2>
                  <p className="text-gray-400">
                    Continue exploring related documentation.
                  </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <Card className="border-gray-800 bg-gradient-to-br from-blue-950/20 to-blue-900/20 hover:shadow-lg hover:shadow-blue-900/20 transition-all">
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <MessageSquare className="h-5 w-5 text-blue-400" />
                        <CardTitle className="text-base text-white">Live Chat System</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm text-gray-400">
                        Learn how escalations are created through live chat.
                      </p>
                      <Button asChild size="sm" className="w-full">
                        <Link href="/docs/live-chat">
                          View Docs <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="border-gray-800 bg-gradient-to-br from-purple-950/20 to-purple-900/20 hover:shadow-lg hover:shadow-purple-900/20 transition-all">
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-purple-400" />
                        <CardTitle className="text-base text-white">Agent Management</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm text-gray-400">
                        Set up your support team and assign case owners.
                      </p>
                      <Button asChild size="sm" className="w-full">
                        <Link href="/docs/agent">
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
              <TableOfContents
              />
            </div>
          </aside>
        </DocsLayout>
      </div>
      
      <Footer />
    </div>
  )
}
