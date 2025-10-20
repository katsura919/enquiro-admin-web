"use client"

import React from 'react'
import Navbar from '@/components/hero-page/nav-bar'
import Footer from '@/components/hero-page/footer'
import { DocsSidebar } from '@/components/docs/DocsSidebar'
import { DocsLayout, DocsPageHeader, DocsPageContent } from '@/components/docs/DocsLayout'
import { TableOfContents } from '@/components/docs/TableOfContents'
import { CodeBlock, FeatureCard, Step } from '@/components/docs/DocsComponents'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { 
  MessageSquare, 
  Users, 
  Zap, 
  Shield, 
  Code, 
  Palette,
  Database,
  Settings,
  ArrowRight,
  Play,
  BookOpen,
  Rocket
} from 'lucide-react'
import Link from 'next/link'

export default function DocsPage() {
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
                  heading="Documentation"
                  text="Everything you need to integrate and customize your chat support system. Built for developers, designed for scale."
                />
              </div>

              <Separator className="my-8 bg-gray-800" />

              {/* Quick Start Cards */}
              <section className="space-y-6">
                <div className="space-y-2">
                  <h2 id="quick-start" className="text-2xl font-bold tracking-tight text-white">Quick Start</h2>
                  <p className="text-gray-400">
                    Get up and running with your chat support system in minutes.
                  </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  <Card className="border-gray-800 bg-gradient-to-br from-blue-950/20 to-purple-950/20 hover:shadow-lg hover:shadow-blue-900/20 transition-all duration-300">
                    <CardHeader className="pb-4">
                      <div className="flex items-center gap-2">
                        <div className="rounded-md bg-primary/20 p-2">
                          <Rocket className="h-5 w-5 text-primary" />
                        </div>
                        <CardTitle className="text-lg">Installation</CardTitle>
                      </div>
                      <CardDescription>
                        Set up your chat system with our step-by-step guide.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <Button asChild size="sm" className="w-full shadow-sm">
                        <Link href="/docs/installation">
                          Get Started <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="border-gray-800 bg-gradient-to-br from-blue-950/20 to-blue-900/20 hover:shadow-lg hover:shadow-blue-900/20 transition-all duration-300">
                    <CardHeader className="pb-4">
                      <div className="flex items-center gap-2">
                        <div className="rounded-md bg-blue-100 p-2 dark:bg-blue-900">
                          <Code className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <CardTitle className="text-lg">API Reference</CardTitle>
                      </div>
                      <CardDescription>
                        Integrate with our comprehensive REST API.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <Button asChild size="sm" className="w-full  shadow-sm">
                        <Link href="/docs/integration/api">
                          View API Docs <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="border-gray-800 bg-gradient-to-br from-green-950/20 to-green-900/20 hover:shadow-lg hover:shadow-green-900/20 transition-all duration-300">
                    <CardHeader className="pb-4">
                      <div className="flex items-center gap-2">
                        <div className="rounded-md bg-green-100 p-2 dark:bg-green-900">
                          <Play className="h-5 w-5 text-green-600 dark:text-green-400" />
                        </div>
                        <CardTitle className="text-lg">Live Demo</CardTitle>
                      </div>
                      <CardDescription>
                        Try out the chat widget and agent dashboard.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <Button asChild size="sm" className="w-full shadow-sm">
                        <Link href="/demo">
                          Try Demo <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </section>

              <Separator className="my-8 bg-gray-800" />

              {/* System Overview */}
              <section className="space-y-6">
                <div className="space-y-2">
                  <h2 id="overview" className="text-2xl font-bold tracking-tight text-white">System Overview</h2>
                  <p className="text-gray-400">
                    Our chat support system provides everything you need to deliver exceptional customer support.
                  </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  <FeatureCard
                    icon={MessageSquare}
                    title="Live Chat System"
                    description="Real-time chat between customers and support agents with file sharing, typing indicators, and chat routing."
                    href="/docs/chat/live-chat"
                  />
                  
                  <FeatureCard
                    icon={Users}
                    title="Agent Management"
                    description="Comprehensive agent dashboard with status management, performance metrics, and escalation handling."
                    href="/docs/agents/dashboard"
                  />
                  
                  <FeatureCard
                    icon={Code}
                    title="Chat Widget"
                    description="Embeddable chat widget that can be customized and integrated into any website with minimal setup."
                    href="/docs/integration/embed"
                  />
                  
                  <FeatureCard
                    icon={Database}
                    title="Knowledge Base"
                    description="Built-in FAQ and knowledge management system to help agents provide quick and accurate responses."
                    href="/docs/knowledge/faq"
                  />
                  
                  <FeatureCard
                    icon={Shield}
                    title="Security & Privacy"
                    description="Enterprise-grade security with authentication, data encryption, and privacy compliance."
                    href="/docs/security/auth"
                    badge="Important"
                  />
                  
                  <FeatureCard
                    icon={Settings}
                    title="Multi-tenant"
                    description="Support multiple businesses with isolated data, custom branding, and individual configurations."
                    href="/docs/business/multi-tenant"
                  />
                </div>
              </section>

              <Separator className="my-8 bg-gray-800" />

              {/* Quick Setup Guide */}
              <section className="space-y-6">
                <div className="space-y-2">
                  <h2 id="setup-guide" className="text-2xl font-bold tracking-tight text-white">Quick Setup Guide</h2>
                  <p className="text-gray-400">
                    Follow these steps to get your chat system running in production.
                  </p>
                </div>

                <div className="space-y-8">
                  <Step
                    step={1}
                    title="Install and Configure"
                    description="Set up the backend server and configure your database connection."
                  >
                    <CodeBlock language="bash" title="Installation">
{`# Clone the repository
git clone https://github.com/your-org/chat-support-system.git

# Install dependencies
cd Backend && npm install
cd ../Frontend && npm install

# Configure environment variables
cp .env.example .env`}
                    </CodeBlock>
                  </Step>

                  <Step
                    step={2}
                    title="Create Your First Business"
                    description="Register your business and create initial agent accounts."
                  >
                    <CodeBlock language="javascript" title="Create Business via API">
{`// POST /api/business
{
  "name": "Your Company Name",
  "email": "admin@yourcompany.com",
  "domain": "yourcompany.com"
}`}
                    </CodeBlock>
                  </Step>

                  <Step
                    step={3}
                    title="Integrate Chat Widget"
                    description="Add the chat widget to your website with a simple script tag."
                  >
                    <CodeBlock language="html" title="Embed Widget">
{`<!-- Add to your website -->
<script src="https://your-domain.com/chat-widget.js"></script>
<script>
  ChatWidget.init({
    businessId: 'your-business-id',
    position: 'bottom-right',
    theme: 'light'
  });
</script>`}
                    </CodeBlock>
                  </Step>

                  <Step
                    step={4}
                    title="Set Up Agent Dashboard"
                    description="Access the agent dashboard to start handling customer chats."
                  >
                    <div className="flex gap-2">
                      <Button asChild size="sm">
                        <Link href="/dashboard">
                          Agent Dashboard <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                      <Button asChild variant="outline" size="sm">
                        <Link href="/docs/agents/dashboard">
                          Learn More
                        </Link>
                      </Button>
                    </div>
                  </Step>
                </div>
              </section>

              <Separator className="my-8 bg-gray-800" />

              {/* Popular Topics */}
              <section className="space-y-6">
                <div className="space-y-2">
                  <h2 id="popular-topics" className="text-2xl font-bold tracking-tight text-white">Popular Topics</h2>
                  <p className="text-gray-400">
                    Most frequently accessed documentation sections.
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <Card className="group hover:shadow-md hover:shadow-blue-900/20 transition-shadow cursor-pointer border-gray-800 bg-gray-950">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <MessageSquare className="h-5 w-5 text-blue-400 mt-0.5" />
                        <div className="space-y-1">
                          <h4 className="font-medium text-white group-hover:text-blue-400 transition-colors">
                            Chat Widget Setup
                          </h4>
                          <p className="text-sm text-gray-400">
                            Embed and customize the chat widget
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="group hover:shadow-md hover:shadow-green-900/20 transition-shadow cursor-pointer border-gray-800 bg-gray-950">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <Code className="h-5 w-5 text-green-400 mt-0.5" />
                        <div className="space-y-1">
                          <h4 className="font-medium text-white group-hover:text-green-400 transition-colors">
                            API Authentication
                          </h4>
                          <p className="text-sm text-gray-400">
                            Secure your API endpoints
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="group hover:shadow-md hover:shadow-yellow-900/20 transition-shadow cursor-pointer border-gray-800 bg-gray-950">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <Zap className="h-5 w-5 text-yellow-400 mt-0.5" />
                        <div className="space-y-1">
                          <h4 className="font-medium text-white group-hover:text-yellow-400 transition-colors">
                            Real-time Events
                          </h4>
                          <p className="text-sm text-gray-400">
                            Handle socket events and webhooks
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="group hover:shadow-md hover:shadow-purple-900/20 transition-shadow cursor-pointer border-gray-800 bg-gray-950">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <Users className="h-5 w-5 text-purple-400 mt-0.5" />
                        <div className="space-y-1">
                          <h4 className="font-medium text-white group-hover:text-purple-400 transition-colors">
                            Agent Status Management
                          </h4>
                          <p className="text-sm text-gray-400">
                            Configure agent availability
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="group hover:shadow-md hover:shadow-pink-900/20 transition-shadow cursor-pointer border-gray-800 bg-gray-950">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <Palette className="h-5 w-5 text-pink-400 mt-0.5" />
                        <div className="space-y-1">
                          <h4 className="font-medium text-white group-hover:text-pink-400 transition-colors">
                            Custom Themes
                          </h4>
                          <p className="text-sm text-gray-400">
                            Brand your chat interface
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="group hover:shadow-md hover:shadow-red-900/20 transition-shadow cursor-pointer border-gray-800 bg-gray-950">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <Shield className="h-5 w-5 text-red-400 mt-0.5" />
                        <div className="space-y-1">
                          <h4 className="font-medium text-white group-hover:text-red-400 transition-colors">
                            Data Privacy
                          </h4>
                          <p className="text-sm text-gray-400">
                            GDPR compliance and security
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </section>

              <Separator className="my-8 bg-gray-800" />

              {/* Need Help Section */}
              <section className="space-y-6">
                <div className="text-center space-y-4">
                  <h2 className="text-2xl font-bold tracking-tight text-white">Need Help?</h2>
                  <p className="text-gray-400 max-w-2xl mx-auto">
                    Can't find what you're looking for? Our support team is here to help you get the most out of your chat system.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button asChild>
                      <Link href="/support">
                        Contact Support <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                    <Button asChild variant="outline">
                      <Link href="/docs/faq">
                        <BookOpen className="mr-2 h-4 w-4" />
                        View FAQ
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
