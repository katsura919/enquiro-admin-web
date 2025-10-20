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
  Zap, 
  Palette,
  Smartphone,
  Code,
  Download,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Globe,
  Package,
  ExternalLink,
  Terminal,
  Info
} from 'lucide-react'
import Link from 'next/link'

export default function ChatWidgetDocsPage() {
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
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <MessageSquare className="h-4 w-4 text-white" />
                  </div>
                  <Badge variant="outline" className="text-xs border-gray-700">
                    v2.0.1
                  </Badge>
                  <Badge variant="secondary" className="text-xs bg-gray-800 text-gray-300">
                    <Package className="h-3 w-3 mr-1" />
                    NPM Package
                  </Badge>
                </div>
                <DocsPageHeader 
                  heading="Chat Widget"
                  text="A beautiful, customizable chat widget for React applications that works with ANY CSS framework or no framework at all!"
                />
                
                <div className="flex gap-3">
                  <Button asChild>
                    <Link href="https://www.npmjs.com/package/enquiro-chat-widget" target="_blank">
                      <Download className="mr-2 h-4 w-4" />
                      Install Package
                      <ExternalLink className="ml-2 h-3 w-3" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link href="/demo">
                      Try Live Demo <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>

              <Separator className="my-8 bg-gray-800" />

              {/* Features */}
              <section className="space-y-6">
                <div className="space-y-2">
                  <h2 id="features" className="text-2xl font-bold tracking-tight text-white">Features</h2>
                  <p className="text-gray-400">
                    Everything you need for a modern chat widget experience.
                  </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <Card className="border-gray-800 bg-gray-950">
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-2">
                        <Palette className="h-5 w-5 text-blue-400" />
                        <CardTitle className="text-base text-white">Modern UI</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-400">Smooth animations and beautiful design</p>
                    </CardContent>
                  </Card>

                  <Card className="border-gray-800 bg-gray-950">
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-2">
                        <Palette className="h-5 w-5 text-purple-400" />
                        <CardTitle className="text-base text-white">Fully Customizable</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-400">Colors, positioning, and styling options</p>
                    </CardContent>
                  </Card>

                  <Card className="border-gray-800 bg-gray-950">
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-2">
                        <Smartphone className="h-5 w-5 text-green-400" />
                        <CardTitle className="text-base text-white">Responsive Design</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-400">Mobile-friendly and adaptive layouts</p>
                    </CardContent>
                  </Card>

                  <Card className="border-gray-800 bg-gray-950">
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-2">
                        <Code className="h-5 w-5 text-blue-400" />
                        <CardTitle className="text-base text-white">TypeScript Support</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-400">Built-in type declarations included</p>
                    </CardContent>
                  </Card>

                  <Card className="border-gray-800 bg-gray-950">
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-yellow-400" />
                        <CardTitle className="text-base text-white">Zero CSS Dependencies</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-400">Pure inline styles - works everywhere</p>
                    </CardContent>
                  </Card>

                  <Card className="border-gray-800 bg-gray-950">
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-2">
                        <Globe className="h-5 w-5 text-teal-400" />
                        <CardTitle className="text-base text-white">Universal Compatibility</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-400">Works with ANY framework</p>
                    </CardContent>
                  </Card>
                </div>
              </section>

              <Separator className="my-8 bg-gray-800" />

              {/* Installation */}
              <section className="space-y-6">
                <div className="space-y-2">
                  <h2 id="installation" className="text-2xl font-bold tracking-tight text-white">Installation</h2>
                  <p className="text-gray-400">
                    Install the chat widget package using your preferred package manager.
                  </p>
                </div>

                <Alert className="border-gray-800 bg-gray-950">
                  <Info className="h-4 w-4 text-blue-400" />
                  <AlertTitle className="text-white">Requirements</AlertTitle>
                  <AlertDescription className="text-gray-400">
                    React 18+ or 19+ is required. The package also uses <code className="text-xs bg-gray-800 text-gray-300 px-1 py-0.5 rounded">lucide-react</code> for icons.
                  </AlertDescription>
                </Alert>

                <div className="space-y-4">
                  <CodeBlock language="bash" title="NPM">
{`npm install enquiro-chat-widget lucide-react`}
                  </CodeBlock>

                  <CodeBlock language="bash" title="Yarn">
{`yarn add enquiro-chat-widget lucide-react`}
                  </CodeBlock>

                  <CodeBlock language="bash" title="PNPM">
{`pnpm add enquiro-chat-widget lucide-react`}
                  </CodeBlock>
                </div>
              </section>

              <Separator className="my-8 bg-gray-800" />

              {/* Compatibility */}
              <section className="space-y-6">
                <div className="space-y-2">
                  <h2 id="compatibility" className="text-2xl font-bold tracking-tight text-white">Compatibility</h2>
                  <p className="text-gray-400">
                    Works seamlessly with all major React frameworks and CSS libraries.
                  </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <Card className="border-gray-800 bg-gray-950">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-white">
                        <CheckCircle2 className="h-5 w-5 text-green-400" />
                        Framework Support
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm text-gray-300">
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-400" />
                          Next.js (13, 14, 15+) - App Router & Pages Router
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-400" />
                          Vite + React
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-400" />
                          Create React App
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-400" />
                          Remix
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-400" />
                          Gatsby
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-400" />
                          Any React Framework
                        </li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="border-gray-800 bg-gray-950">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-white">
                        <CheckCircle2 className="h-5 w-5 text-green-400" />
                        CSS Framework Support
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm text-gray-300">
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-400" />
                          Tailwind CSS v3 & v4
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-400" />
                          Bootstrap
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-400" />
                          Material-UI
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-400" />
                          Styled Components
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-400" />
                          CSS Modules
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-400" />
                          No CSS framework - works out of the box!
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>

                <Alert className="border-blue-800 bg-gradient-to-r from-blue-950/20 to-purple-950/20">
                  <Sparkles className="h-4 w-4 text-blue-400" />
                  <AlertTitle className="text-white">New in v2.0</AlertTitle>
                  <AlertDescription className="text-gray-300">
                    Pure inline styles - no CSS dependencies required! The widget now works everywhere without any CSS framework setup.
                  </AlertDescription>
                </Alert>
              </section>

              <Separator className="my-8 bg-gray-800" />

              {/* Usage */}
              <section className="space-y-6">
                <div className="space-y-2">
                  <h2 id="usage" className="text-2xl font-bold tracking-tight text-white">Usage</h2>
                  <p className="text-gray-400">
                    Get started with simple, straightforward integration.
                  </p>
                </div>

                <div className="space-y-8">
                  <Step
                    step={1}
                    title="Basic Implementation"
                    description="Import the widget and add it to your application."
                  >
                    <CodeBlock language="typescript" title="app.tsx">
                        {`import { ChatEmbedWidget } from 'enquiro-chat-widget'

                        export default function MyApp() {
                          return (
                            <div>
                              {/* Your app content */}
                              
                              <ChatEmbedWidget 
                                businessSlug="your-business-slug" 
                                position="bottom-right"
                                primaryColor="#3b82f6"
                                title="Chat with us"
                              />
                            </div>
                          )
                        }`}
                    </CodeBlock>
                  </Step>

                  <Step
                    step={2}
                    title="Custom Configuration"
                    description="Customize the widget with various options."
                  >
                    <CodeBlock language="typescript" title="Customized Widget">
                        {`<ChatEmbedWidget 
                          businessSlug="your-business-slug" 
                          position="bottom-left"
                          primaryColor="#ef4444"
                          title="Support Chat"
                          subtitle="We're here to help!"
                        />`}
                    </CodeBlock>
                  </Step>

                  <Step
                    step={3}
                    title="Next.js Example"
                    description="Use it in your Next.js application layout or page."
                  >
                    <CodeBlock language="typescript" title="layout.tsx">
                          {`import { ChatEmbedWidget } from 'enquiro-chat-widget'

                          export default function RootLayout({
                            children,
                          }: {
                            children: React.ReactNode
                          }) {
                            return (
                              <html lang="en">
                                <body>
                                  {children}
                                  <ChatEmbedWidget 
                                    businessSlug="your-business-slug"
                                    position="bottom-right"
                                    primaryColor="#3b82f6"
                                  />
                                </body>
                              </html>
                            )
                          }`}
                    </CodeBlock>
                  </Step>
                </div>
              </section>

              <Separator className="my-8 bg-gray-800" />

              {/* API Reference */}
              <section className="space-y-6">
                <div className="space-y-2">
                  <h2 id="api-reference" className="text-2xl font-bold tracking-tight text-white">API Reference</h2>
                  <p className="text-gray-400">
                    All available props and their configurations.
                  </p>
                </div>

                <div className="border border-gray-800 rounded-lg overflow-hidden bg-gray-950">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-900/50">
                        <tr className="border-b border-gray-800">
                          <th className="px-4 py-3 text-left font-semibold text-white">Prop</th>
                          <th className="px-4 py-3 text-left font-semibold text-white">Type</th>
                          <th className="px-4 py-3 text-left font-semibold text-white">Default</th>
                          <th className="px-4 py-3 text-left font-semibold text-white">Description</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-gray-800">
                          <td className="px-4 py-3 font-mono text-xs text-blue-400">businessSlug</td>
                          <td className="px-4 py-3">
                            <code className="text-xs bg-gray-800 text-gray-300 px-1.5 py-0.5 rounded">string</code>
                            <Badge variant="destructive" className="ml-2 text-xs">Required</Badge>
                          </td>
                          <td className="px-4 py-3 text-gray-500">-</td>
                          <td className="px-4 py-3 text-gray-300">Your business identifier</td>
                        </tr>
                        <tr className="border-b border-gray-800">
                          <td className="px-4 py-3 font-mono text-xs text-blue-400">position</td>
                          <td className="px-4 py-3">
                            <code className="text-xs bg-gray-800 text-gray-300 px-1.5 py-0.5 rounded">'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'</code>
                          </td>
                          <td className="px-4 py-3">
                            <code className="text-xs bg-gray-800 text-gray-300 px-1.5 py-0.5 rounded">'bottom-right'</code>
                          </td>
                          <td className="px-4 py-3 text-gray-300">Widget position on screen</td>
                        </tr>
                        <tr className="border-b border-gray-800">
                          <td className="px-4 py-3 font-mono text-xs text-blue-400">primaryColor</td>
                          <td className="px-4 py-3">
                            <code className="text-xs bg-gray-800 text-gray-300 px-1.5 py-0.5 rounded">string</code>
                          </td>
                          <td className="px-4 py-3">
                            <code className="text-xs bg-gray-800 text-gray-300 px-1.5 py-0.5 rounded">'#007bff'</code>
                          </td>
                          <td className="px-4 py-3 text-gray-300">Main color theme (hex color)</td>
                        </tr>
                        <tr className="border-b border-gray-800">
                          <td className="px-4 py-3 font-mono text-xs text-blue-400">title</td>
                          <td className="px-4 py-3">
                            <code className="text-xs bg-gray-800 text-gray-300 px-1.5 py-0.5 rounded">string</code>
                          </td>
                          <td className="px-4 py-3">
                            <code className="text-xs bg-gray-800 text-gray-300 px-1.5 py-0.5 rounded">'Chat with us'</code>
                          </td>
                          <td className="px-4 py-3 text-gray-300">Widget header title</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 font-mono text-xs text-blue-400">subtitle</td>
                          <td className="px-4 py-3">
                            <code className="text-xs bg-gray-800 text-gray-300 px-1.5 py-0.5 rounded">string</code>
                          </td>
                          <td className="px-4 py-3">
                            <code className="text-xs bg-gray-800 text-gray-300 px-1.5 py-0.5 rounded">'We typically reply instantly'</code>
                          </td>
                          <td className="px-4 py-3 text-gray-300">Header subtitle text</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>

              <Separator className="my-8 bg-gray-800" />

              {/* Position Options */}
              <section className="space-y-6">
                <div className="space-y-2">
                  <h2 id="position-options" className="text-2xl font-bold tracking-tight text-white">Position Options</h2>
                  <p className="text-gray-400">
                    Choose where the chat widget appears on your page.
                  </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <Card className="border-gray-800 bg-gray-950">
                    <CardHeader>
                      <CardTitle className="text-base text-white">bottom-right</CardTitle>
                      <CardDescription className="text-gray-400">Bottom right corner (default)</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="relative h-32 bg-gray-900/30 rounded-md border-2 border-dashed border-gray-800">
                        <div className="absolute bottom-4 right-4 h-12 w-12 bg-blue-600 rounded-full flex items-center justify-center">
                          <MessageSquare className="h-6 w-6 text-white" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-gray-800 bg-gray-950">
                    <CardHeader>
                      <CardTitle className="text-base text-white">bottom-left</CardTitle>
                      <CardDescription className="text-gray-400">Bottom left corner</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="relative h-32 bg-gray-900/30 rounded-md border-2 border-dashed border-gray-800">
                        <div className="absolute bottom-4 left-4 h-12 w-12 bg-blue-600 rounded-full flex items-center justify-center">
                          <MessageSquare className="h-6 w-6 text-white" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-gray-800 bg-gray-950">
                    <CardHeader>
                      <CardTitle className="text-base text-white">top-right</CardTitle>
                      <CardDescription className="text-gray-400">Top right corner</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="relative h-32 bg-gray-900/30 rounded-md border-2 border-dashed border-gray-800">
                        <div className="absolute top-4 right-4 h-12 w-12 bg-blue-600 rounded-full flex items-center justify-center">
                          <MessageSquare className="h-6 w-6 text-white" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-gray-800 bg-gray-950">
                    <CardHeader>
                      <CardTitle className="text-base text-white">top-left</CardTitle>
                      <CardDescription className="text-gray-400">Top left corner</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="relative h-32 bg-gray-900/30 rounded-md border-2 border-dashed border-gray-800">
                        <div className="absolute top-4 left-4 h-12 w-12 bg-blue-600 rounded-full flex items-center justify-center">
                          <MessageSquare className="h-6 w-6 text-white" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </section>

              <Separator className="my-8 bg-gray-800" />

              {/* Next Steps */}
              <section className="space-y-6">
                <div className="text-center space-y-4">
                  <h2 className="text-2xl font-bold tracking-tight text-white">Ready to Get Started?</h2>
                  <p className="text-gray-400 max-w-2xl mx-auto">
                    Install the package and start adding beautiful chat support to your application in minutes.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button asChild size="lg">
                      <Link href="https://www.npmjs.com/package/enquiro-chat-widget" target="_blank">
                        <Download className="mr-2 h-4 w-4" />
                        Install Now
                        <ExternalLink className="ml-2 h-3 w-3" />
                      </Link>
                    </Button>
                    <Button asChild variant="outline" size="lg">
                      <Link href="https://github.com/katsura919/enquiro-chat-widget" target="_blank">
                        <Code className="mr-2 h-4 w-4" />
                        View on GitHub
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
            <div className="sticky top-24 w-64 px-6 py-8 h-fit">
              <TableOfContents />
            </div>
          </div>
        </DocsLayout>
      </div>

      <Footer />
    </div>
  )
}
