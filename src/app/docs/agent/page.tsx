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
  Users, 
  UserPlus,
  Edit,
  Trash2,
  Search,
  Shield,
  Mail,
  Lock,
  Phone,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ArrowRight,
  Settings,
  Eye,
  Download,
  Info,
  Sparkles,
  Globe
} from 'lucide-react'
import Link from 'next/link'

export default function AgentManagementDocsPage() {
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
                  heading="Agent Management"
                  text="Complete guide to creating, managing, and organizing your support agents. Learn how to set up your team and enable them to provide exceptional customer support."
                />
                
                <div className="flex gap-3">
                  <Button asChild>
                    <Link href="/dashboard/agent-management">
                      <Users className="mr-2 h-4 w-4" />
                      Go to Agent Management
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
                    The Agent Management system allows you to create, manage, and organize your support team. Each agent has their own credentials and can access the dedicated agent portal to handle customer chats.
                  </p>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <Card className="border-gray-800 bg-gray-950">
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-2">
                        <UserPlus className="h-5 w-5 text-blue-400" />
                        <CardTitle className="text-base text-white">Create Agents</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-400">Add team members with unique credentials</p>
                    </CardContent>
                  </Card>

                  <Card className="border-gray-800 bg-gray-950">
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-2">
                        <Eye className="h-5 w-5 text-green-400" />
                        <CardTitle className="text-base text-white">Monitor Activity</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-400">Track agent performance and status</p>
                    </CardContent>
                  </Card>
                </div>
              </section>

              <Separator className="my-8 bg-gray-800" />

              {/* Creating an Agent */}
              <section className="space-y-6">
                <div className="space-y-2">
                  <h2 id="creating-agent" className="text-2xl font-bold tracking-tight text-white">Creating an Agent</h2>
                  <p className="text-gray-400">
                    Follow these steps to add a new agent to your support team.
                  </p>
                </div>

                <div className="space-y-8">
                  <Step
                    step={1}
                    title="Access Agent Management"
                    description="Navigate to the Agent Management page from your dashboard."
                  >
                    <CodeBlock language="text" title="Navigation Path">
{`Dashboard → Agent Management`}
                    </CodeBlock>
                  </Step>

                  <Step
                    step={2}
                    title="Click 'Add Agent' Button"
                    description="Click the 'Add agent' button in the top-right corner of the page."
                  >
                    <div className="bg-gray-950 border border-gray-800 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <p className="text-sm text-white font-medium">Look for this button:</p>
                          <p className="text-xs text-gray-400">Located in the top-right corner with a plus icon</p>
                        </div>
                        <Button size="sm" className="gap-2">
                          <UserPlus className="h-4 w-4" />
                          Add agent
                        </Button>
                      </div>
                    </div>
                  </Step>

                  <Step
                    step={3}
                    title="Fill in Agent Details"
                    description="Complete the agent creation form with the required information."
                  >
                    <div className="space-y-4">
                      <Alert className="border-gray-800 bg-gray-950">
                        <Info className="h-4 w-4 text-blue-400" />
                        <AlertTitle className="text-white">Required Fields</AlertTitle>
                        <AlertDescription className="text-gray-400">
                          All fields marked with an asterisk (*) must be filled out.
                        </AlertDescription>
                      </Alert>

                      <div className="grid gap-4">
                        <Card className="border-gray-800 bg-gray-950">
                          <CardHeader className="pb-3">
                            <div className="flex items-center gap-2">
                              <Users className="h-4 w-4 text-blue-400" />
                              <CardTitle className="text-sm text-white">Name *</CardTitle>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <p className="text-xs text-gray-400 mb-2">Full name of the agent</p>
                            <code className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded">Example: John Smith</code>
                          </CardContent>
                        </Card>

                        <Card className="border-gray-800 bg-gray-950">
                          <CardHeader className="pb-3">
                            <div className="flex items-center gap-2">
                              <Mail className="h-4 w-4 text-green-400" />
                              <CardTitle className="text-sm text-white">Email *</CardTitle>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <p className="text-xs text-gray-400 mb-2">Agent's email address (used for login)</p>
                            <code className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded">Example: john.smith@company.com</code>
                          </CardContent>
                        </Card>

                        <Card className="border-gray-800 bg-gray-950">
                          <CardHeader className="pb-3">
                            <div className="flex items-center gap-2">
                              <Phone className="h-4 w-4 text-purple-400" />
                              <CardTitle className="text-sm text-white">Phone</CardTitle>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <p className="text-xs text-gray-400 mb-2">Contact phone number (optional)</p>
                            <code className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded">Example: +1234567890</code>
                          </CardContent>
                        </Card>

                        <Card className="border-gray-800 bg-gray-950">
                          <CardHeader className="pb-3">
                            <div className="flex items-center gap-2">
                              <Lock className="h-4 w-4 text-red-400" />
                              <CardTitle className="text-sm text-white">Password *</CardTitle>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <p className="text-xs text-gray-400 mb-2">Secure password (minimum 6 characters)</p>
                            <div className="space-y-1 mt-3">
                              <p className="text-xs text-gray-500">Password requirements:</p>
                              <ul className="text-xs text-gray-400 space-y-1 ml-4">
                                <li>• At least 6 characters long</li>
                                <li>• Both password fields must match</li>
                              </ul>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </Step>

                  <Step
                    step={4}
                    title="Submit and Create"
                    description="Click the 'Create Agent' button to complete the process."
                  >
                    <Alert className="border-green-800 bg-gradient-to-r from-green-950/20 to-emerald-950/20">
                      <CheckCircle2 className="h-4 w-4 text-green-400" />
                      <AlertTitle className="text-white">Success!</AlertTitle>
                      <AlertDescription className="text-gray-300">
                        Once created, the agent will appear in your agent list and can immediately log in to the agent portal.
                      </AlertDescription>
                    </Alert>
                  </Step>
                </div>
              </section>

              <Separator className="my-8 bg-gray-800" />

              {/* Agent Portal Access */}
              <section className="space-y-6">
                <div className="space-y-2">
                  <h2 id="agent-portal" className="text-2xl font-bold tracking-tight text-white">Agent Portal Access</h2>
                  <p className="text-gray-400">
                    After creating an agent, they can log in to the dedicated agent portal to start handling customer chats.
                  </p>
                </div>

                <Alert className="border-blue-800 bg-gradient-to-r from-blue-950/20 to-purple-950/20">
                  <Globe className="h-4 w-4 text-blue-400" />
                  <AlertTitle className="text-white">Agent Portal URL</AlertTitle>
                  <AlertDescription className="space-y-3">
                    <p className="text-gray-300">
                      Direct your agents to log in at:
                    </p>
                    <div className="flex items-center gap-2">
                      <code className="text-sm bg-gray-800 text-blue-400 px-3 py-2 rounded flex-1">
                        https://agent-enquiro.vercel.app
                      </code>
                      <Button asChild size="sm" variant="outline">
                        <Link href="https://agent-enquiro.vercel.app" target="_blank">
                          Visit <ExternalLink className="ml-2 h-3 w-3" />
                        </Link>
                      </Button>
                    </div>
                  </AlertDescription>
                </Alert>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">Login Credentials</h3>
                  
                  <div className="grid gap-4 md:grid-cols-2">
                    <Card className="border-gray-800 bg-gray-950">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-white">
                          <Mail className="h-5 w-5 text-green-400" />
                          Email Address
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-300">
                          The email address you specified when creating the agent account.
                        </p>
                        <code className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded mt-2 inline-block">
                          john.smith@company.com
                        </code>
                      </CardContent>
                    </Card>

                    <Card className="border-gray-800 bg-gray-950">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-white">
                          <Lock className="h-5 w-5 text-red-400" />
                          Password
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-300">
                          The password you set during agent creation. Agents can change this after first login.
                        </p>
                        <Badge variant="secondary" className="mt-2 bg-gray-800 text-gray-300">Secure & Confidential</Badge>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">What Agents Can Do</h3>
                  
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <Card className="border-gray-800 bg-gray-950">
                      <CardHeader className="pb-3">
                        <CheckCircle2 className="h-5 w-5 text-green-400 mb-2" />
                        <CardTitle className="text-sm text-white">Handle Live Chats</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-xs text-gray-400">Accept and respond to customer chat requests in real-time</p>
                      </CardContent>
                    </Card>

                    <Card className="border-gray-800 bg-gray-950">
                      <CardHeader className="pb-3">
                        <CheckCircle2 className="h-5 w-5 text-green-400 mb-2" />
                        <CardTitle className="text-sm text-white">Manage Status</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-xs text-gray-400">Set availability status (online, away, busy)</p>
                      </CardContent>
                    </Card>

                    <Card className="border-gray-800 bg-gray-950">
                      <CardHeader className="pb-3">
                        <CheckCircle2 className="h-5 w-5 text-green-400 mb-2" />
                        <CardTitle className="text-sm text-white">View Chat History</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-xs text-gray-400">Access previous conversations and customer context</p>
                      </CardContent>
                    </Card>

                    <Card className="border-gray-800 bg-gray-950">
                      <CardHeader className="pb-3">
                        <CheckCircle2 className="h-5 w-5 text-green-400 mb-2" />
                        <CardTitle className="text-sm text-white">Send Files</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-xs text-gray-400">Share documents, images, and attachments</p>
                      </CardContent>
                    </Card>

                    <Card className="border-gray-800 bg-gray-950">
                      <CardHeader className="pb-3">
                        <CheckCircle2 className="h-5 w-5 text-green-400 mb-2" />
                        <CardTitle className="text-sm text-white">Escalate Issues</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-xs text-gray-400">Forward complex issues to supervisors</p>
                      </CardContent>
                    </Card>

                    <Card className="border-gray-800 bg-gray-950">
                      <CardHeader className="pb-3">
                        <CheckCircle2 className="h-5 w-5 text-green-400 mb-2" />
                        <CardTitle className="text-sm text-white">Update Profile</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-xs text-gray-400">Manage personal information and settings</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </section>

              <Separator className="my-8 bg-gray-800" />

              {/* Managing Agents */}
              <section className="space-y-6">
                <div className="space-y-2">
                  <h2 id="managing-agents" className="text-2xl font-bold tracking-tight text-white">Managing Agents</h2>
                  <p className="text-gray-400">
                    Learn how to edit, search, and manage your existing agents.
                  </p>
                </div>

                <div className="space-y-6">
                  <Card className="border-gray-800 bg-gray-950">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-white">
                        <Search className="h-5 w-5 text-blue-400" />
                        Search Agents
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm text-gray-300">
                        Use the search bar to quickly find agents by name or email.
                      </p>
                      <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-3">
                        <div className="flex items-center gap-2">
                          <Search className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-400">Type to search agents...</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-gray-800 bg-gray-950">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-white">
                        <Edit className="h-5 w-5 text-purple-400" />
                        Edit Agent Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm text-gray-300">
                        Update agent details such as name, email, phone, and role.
                      </p>
                      <div className="space-y-2">
                        <p className="text-xs text-gray-400">Steps to edit:</p>
                        <ol className="text-xs text-gray-400 space-y-1 ml-4">
                          <li>1. Click on the agent row or the three-dot menu</li>
                          <li>2. Select "Edit" from the dropdown</li>
                          <li>3. Update the necessary fields</li>
                          <li>4. Click "Save Changes"</li>
                        </ol>
                      </div>
                      <Alert className="border-yellow-800 bg-yellow-950/20">
                        <AlertCircle className="h-4 w-4 text-yellow-400" />
                        <AlertDescription className="text-xs text-gray-300">
                          Note: Password cannot be changed from here. Agents must reset their password through the agent portal.
                        </AlertDescription>
                      </Alert>
                    </CardContent>
                  </Card>

                  <Card className="border-gray-800 bg-gray-950">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-white">
                        <Trash2 className="h-5 w-5 text-red-400" />
                        Delete Agents
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm text-gray-300">
                        Remove agents who are no longer part of your team.
                      </p>
                      <div className="space-y-2">
                        <p className="text-xs text-gray-400">Deletion options:</p>
                        <ul className="text-xs text-gray-400 space-y-1 ml-4">
                          <li>• <strong className="text-white">Single delete:</strong> Click the trash icon in the agent's row</li>
                          <li>• <strong className="text-white">Bulk delete:</strong> Select multiple agents and click "Delete"</li>
                        </ul>
                      </div>
                      <Alert className="border-red-800 bg-red-950/20">
                        <AlertCircle className="h-4 w-4 text-red-400" />
                        <AlertDescription className="text-xs text-gray-300">
                          Deleted agents are soft-deleted and can be restored if needed. They will not be able to log in to the agent portal.
                        </AlertDescription>
                      </Alert>
                    </CardContent>
                  </Card>

                  <Card className="border-gray-800 bg-gray-950">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-white">
                        <Download className="h-5 w-5 text-green-400" />
                        Export Agent Data
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm text-gray-300">
                        Export your agent list to a CSV file for reporting or backup purposes.
                      </p>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline" className="gap-2">
                          <Download className="h-4 w-4" />
                          Export to CSV
                        </Button>
                        <span className="text-xs text-gray-400">Includes name, email, phone, role, and status</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </section>

              <Separator className="my-8 bg-gray-800" />

              {/* Agent Roles */}
              <section className="space-y-6">
                <div className="space-y-2">
                  <h2 id="agent-roles" className="text-2xl font-bold tracking-tight text-white">Agent Roles</h2>
                  <p className="text-gray-400">
                    Understand the different roles and their permissions.
                  </p>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <Card className="border-gray-800 bg-gray-950">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-white">Agent</CardTitle>
                        <Badge variant="secondary" className="bg-gray-800 text-gray-300">Default</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <p className="text-sm text-gray-300">Basic support role for handling customer chats.</p>
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-gray-400">Permissions:</p>
                        <ul className="text-xs text-gray-400 space-y-1">
                          <li>✓ Handle customer chats</li>
                          <li>✓ View chat history</li>
                          <li>✓ Send messages & files</li>
                          <li>✓ Update own profile</li>
                        </ul>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-gray-800 bg-gray-950">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-white">Supervisor</CardTitle>
                        <Badge className="bg-blue-900 text-blue-300">Mid-level</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <p className="text-sm text-gray-300">Team lead with monitoring capabilities.</p>
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-gray-400">Additional Permissions:</p>
                        <ul className="text-xs text-gray-400 space-y-1">
                          <li>✓ View team performance</li>
                          <li>✓ Receive escalations</li>
                          <li>✓ Monitor agent activity</li>
                          <li>✓ Access reports</li>
                        </ul>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-gray-800 bg-gray-950">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-white">Admin</CardTitle>
                        <Badge className="bg-purple-900 text-purple-300">Full Access</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <p className="text-sm text-gray-300">Full system access and management.</p>
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-gray-400">Additional Permissions:</p>
                        <ul className="text-xs text-gray-400 space-y-1">
                          <li>✓ Manage all agents</li>
                          <li>✓ Configure settings</li>
                          <li>✓ Access all data</li>
                          <li>✓ Manage integrations</li>
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </section>

              <Separator className="my-8 bg-gray-800" />

              {/* Best Practices */}
              <section className="space-y-6">
                <div className="space-y-2">
                  <h2 id="best-practices" className="text-2xl font-bold tracking-tight text-white">Best Practices</h2>
                  <p className="text-gray-400">
                    Tips for effective agent management and team organization.
                  </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <Card className="border-gray-800 bg-gray-950">
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <Shield className="h-5 w-5 text-blue-400" />
                        <CardTitle className="text-white">Security</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ul className="text-sm text-gray-300 space-y-2">
                        <li>• Use strong, unique passwords for each agent</li>
                        <li>• Regularly review and update agent access</li>
                        <li>• Remove access immediately when agents leave</li>
                        <li>• Implement the principle of least privilege</li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="border-gray-800 bg-gray-950">
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-green-400" />
                        <CardTitle className="text-white">Organization</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ul className="text-sm text-gray-300 space-y-2">
                        <li>• Use consistent naming conventions</li>
                        <li>• Keep agent information up to date</li>
                        <li>• Document role assignments and changes</li>
                        <li>• Regular audit of active vs inactive agents</li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="border-gray-800 bg-gray-950">
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <Mail className="h-5 w-5 text-purple-400" />
                        <CardTitle className="text-white">Onboarding</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ul className="text-sm text-gray-300 space-y-2">
                        <li>• Provide agent portal URL immediately</li>
                        <li>• Send credentials through secure channels</li>
                        <li>• Schedule training sessions for new agents</li>
                        <li>• Create onboarding documentation</li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="border-gray-800 bg-gray-950">
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <Settings className="h-5 w-5 text-yellow-400" />
                        <CardTitle className="text-white">Maintenance</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ul className="text-sm text-gray-300 space-y-2">
                        <li>• Regularly export agent data for backups</li>
                        <li>• Monitor agent login activity</li>
                        <li>• Update roles based on performance</li>
                        <li>• Clean up inactive or deleted agents</li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </section>

              <Separator className="my-8 bg-gray-800" />

              {/* Troubleshooting */}
              <section className="space-y-6">
                <div className="space-y-2">
                  <h2 id="troubleshooting" className="text-2xl font-bold tracking-tight text-white">Troubleshooting</h2>
                  <p className="text-gray-400">
                    Common issues and their solutions.
                  </p>
                </div>

                <div className="space-y-4">
                  <Card className="border-gray-800 bg-gray-950">
                    <CardHeader>
                      <CardTitle className="text-white">Agent Cannot Log In</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <p className="text-sm text-gray-300">Possible solutions:</p>
                      <ul className="text-sm text-gray-400 space-y-1 ml-4">
                        <li>• Verify the agent hasn't been deleted or deactivated</li>
                        <li>• Check that the correct email and password are being used</li>
                        <li>• Ensure the agent is accessing the correct portal URL</li>
                        <li>• Try resetting the agent's password</li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="border-gray-800 bg-gray-950">
                    <CardHeader>
                      <CardTitle className="text-white">Email Already in Use</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <p className="text-sm text-gray-300">This error occurs when:</p>
                      <ul className="text-sm text-gray-400 space-y-1 ml-4">
                        <li>• An agent with this email already exists</li>
                        <li>• A deleted agent had this email (check deleted agents)</li>
                        <li>• Use a different email address or restore the deleted agent</li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="border-gray-800 bg-gray-950">
                    <CardHeader>
                      <CardTitle className="text-white">Agent Not Receiving Chats</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <p className="text-sm text-gray-300">Check the following:</p>
                      <ul className="text-sm text-gray-400 space-y-1 ml-4">
                        <li>• Agent status is set to "Online" in the portal</li>
                        <li>• Agent has the correct permissions for their role</li>
                        <li>• Chat routing settings are configured properly</li>
                        <li>• No connection issues in the agent portal</li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </section>

              <Separator className="my-8 bg-gray-800" />

              {/* Next Steps */}
              <section className="space-y-6">
                <div className="text-center space-y-4">
                  <h2 className="text-2xl font-bold tracking-tight text-white">Ready to Manage Your Team?</h2>
                  <p className="text-gray-400 max-w-2xl mx-auto">
                    Start creating and managing your support agents to provide exceptional customer service.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button asChild size="lg">
                      <Link href="/dashboard/agent-management">
                        <Users className="mr-2 h-4 w-4" />
                        Go to Agent Management
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                    <Button asChild variant="outline" size="lg">
                      <Link href="https://agent-enquiro.vercel.app" target="_blank">
                        <Globe className="mr-2 h-4 w-4" />
                        Open Agent Portal
                        <ExternalLink className="ml-2 h-3 w-3" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </section>
            </div>
          </main>

          {/* Table of Contents - Right Sidebar */}
          <div className="hidden xl:block">
            <div className="fixed top-24 w-64 px-6 py-8 h-fit">
              <TableOfContents />
            </div>
          </div>
        </DocsLayout>
      </div>

      <Footer />
    </div>
  )
}
