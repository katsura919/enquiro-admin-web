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
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="w-full pt-20">
        <DocsLayout>
          {/* Sidebar */}
          <aside className="fixed top-20 z-30 hidden h-[calc(100vh-5rem)] w-72 shrink-0 border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:sticky md:block">
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
                  <Badge variant="outline" className="text-xs">
                    v2.0.1
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
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
                      Install on NPM
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

              <Separator className="my-8" />

              {/* Features */}
              <section className="space-y-6">
                <div className="space-y-2">
                  <h2 id="features" className="text-2xl font-bold tracking-tight">✨ Features</h2>
                  <p className="text-muted-foreground">
                    Everything you need for a modern chat widget experience.
                  </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <Card className="border-muted-gray">
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-2">
                        <Palette className="h-5 w-5 text-blue-500" />
                        <CardTitle className="text-base">Modern UI</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">Smooth animations and beautiful design</p>
                    </CardContent>
                  </Card>

                  <Card className="border-muted-gray">
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-2">
                        <Palette className="h-5 w-5 text-purple-500" />
                        <CardTitle className="text-base">Fully Customizable</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">Colors, positioning, and styling options</p>
                    </CardContent>
                  </Card>

                  <Card className="border-muted-gray">
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-2">
                        <Smartphone className="h-5 w-5 text-green-500" />
                        <CardTitle className="text-base">Responsive Design</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">Mobile-friendly and adaptive layouts</p>
                    </CardContent>
                  </Card>

                  <Card className="border-muted-gray">
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-2">
                        <Code className="h-5 w-5 text-blue-600" />
                        <CardTitle className="text-base">TypeScript Support</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">Built-in type declarations included</p>
                    </CardContent>
                  </Card>

                  <Card className="border-muted-gray">
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-yellow-500" />
                        <CardTitle className="text-base">Zero CSS Dependencies</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">Pure inline styles - works everywhere</p>
                    </CardContent>
                  </Card>

                  <Card className="border-muted-gray">
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-2">
                        <Globe className="h-5 w-5 text-teal-500" />
                        <CardTitle className="text-base">Universal Compatibility</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">Works with ANY framework</p>
                    </CardContent>
                  </Card>
                </div>
              </section>

              <Separator className="my-8" />

              {/* Installation */}
              <section className="space-y-6">
                <div className="space-y-2">
                  <h2 id="installation" className="text-2xl font-bold tracking-tight">📦 Installation</h2>
                  <p className="text-muted-foreground">
                    Install the chat widget package using your preferred package manager.
                  </p>
                </div>

                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertTitle>Requirements</AlertTitle>
                  <AlertDescription>
                    React 18+ or 19+ is required. The package also uses <code className="text-xs bg-muted px-1 py-0.5 rounded">lucide-react</code> for icons.
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

              <Separator className="my-8" />

              {/* Compatibility */}
              <section className="space-y-6">
                <div className="space-y-2">
                  <h2 id="compatibility" className="text-2xl font-bold tracking-tight">🔧 Compatibility</h2>
                  <p className="text-muted-foreground">
                    Works seamlessly with all major React frameworks and CSS libraries.
                  </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                        Framework Support
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                          Next.js (13, 14, 15+) - App Router & Pages Router
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                          Vite + React
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                          Create React App
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                          Remix
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                          Gatsby
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                          Any React Framework
                        </li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                        CSS Framework Support
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                          Tailwind CSS v3 & v4
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                          Bootstrap
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                          Material-UI
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                          Styled Components
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                          CSS Modules
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                          No CSS framework - works out of the box!
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>

                <Alert className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20">
                  <Sparkles className="h-4 w-4" />
                  <AlertTitle>New in v2.0</AlertTitle>
                  <AlertDescription>
                    Pure inline styles - no CSS dependencies required! The widget now works everywhere without any CSS framework setup.
                  </AlertDescription>
                </Alert>
              </section>

              <Separator className="my-8" />

              {/* Usage */}
              <section className="space-y-6">
                <div className="space-y-2">
                  <h2 id="usage" className="text-2xl font-bold tracking-tight">🚀 Usage</h2>
                  <p className="text-muted-foreground">
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

              <Separator className="my-8" />

              {/* API Reference */}
              <section className="space-y-6">
                <div className="space-y-2">
                  <h2 id="api-reference" className="text-2xl font-bold tracking-tight">📖 API Reference</h2>
                  <p className="text-muted-foreground">
                    All available props and their configurations.
                  </p>
                </div>

                <div className="border rounded-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-muted/50">
                        <tr className="border-b">
                          <th className="px-4 py-3 text-left font-semibold">Prop</th>
                          <th className="px-4 py-3 text-left font-semibold">Type</th>
                          <th className="px-4 py-3 text-left font-semibold">Default</th>
                          <th className="px-4 py-3 text-left font-semibold">Description</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b">
                          <td className="px-4 py-3 font-mono text-xs">businessSlug</td>
                          <td className="px-4 py-3">
                            <code className="text-xs bg-muted px-1.5 py-0.5 rounded">string</code>
                            <Badge variant="destructive" className="ml-2 text-xs">Required</Badge>
                          </td>
                          <td className="px-4 py-3 text-muted-foreground">-</td>
                          <td className="px-4 py-3">Your business identifier</td>
                        </tr>
                        <tr className="border-b">
                          <td className="px-4 py-3 font-mono text-xs">position</td>
                          <td className="px-4 py-3">
                            <code className="text-xs bg-muted px-1.5 py-0.5 rounded">'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'</code>
                          </td>
                          <td className="px-4 py-3">
                            <code className="text-xs bg-muted px-1.5 py-0.5 rounded">'bottom-right'</code>
                          </td>
                          <td className="px-4 py-3">Widget position on screen</td>
                        </tr>
                        <tr className="border-b">
                          <td className="px-4 py-3 font-mono text-xs">primaryColor</td>
                          <td className="px-4 py-3">
                            <code className="text-xs bg-muted px-1.5 py-0.5 rounded">string</code>
                          </td>
                          <td className="px-4 py-3">
                            <code className="text-xs bg-muted px-1.5 py-0.5 rounded">'#007bff'</code>
                          </td>
                          <td className="px-4 py-3">Main color theme (hex color)</td>
                        </tr>
                        <tr className="border-b">
                          <td className="px-4 py-3 font-mono text-xs">title</td>
                          <td className="px-4 py-3">
                            <code className="text-xs bg-muted px-1.5 py-0.5 rounded">string</code>
                          </td>
                          <td className="px-4 py-3">
                            <code className="text-xs bg-muted px-1.5 py-0.5 rounded">'Chat with us'</code>
                          </td>
                          <td className="px-4 py-3">Widget header title</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 font-mono text-xs">subtitle</td>
                          <td className="px-4 py-3">
                            <code className="text-xs bg-muted px-1.5 py-0.5 rounded">string</code>
                          </td>
                          <td className="px-4 py-3">
                            <code className="text-xs bg-muted px-1.5 py-0.5 rounded">'We typically reply instantly'</code>
                          </td>
                          <td className="px-4 py-3">Header subtitle text</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>

              <Separator className="my-8" />

              {/* Position Options */}
              <section className="space-y-6">
                <div className="space-y-2">
                  <h2 id="position-options" className="text-2xl font-bold tracking-tight">🌈 Position Options</h2>
                  <p className="text-muted-foreground">
                    Choose where the chat widget appears on your page.
                  </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">bottom-right</CardTitle>
                      <CardDescription>Bottom right corner (default)</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="relative h-32 bg-muted/30 rounded-md border-2 border-dashed">
                        <div className="absolute bottom-4 right-4 h-12 w-12 bg-primary rounded-full flex items-center justify-center">
                          <MessageSquare className="h-6 w-6 text-white" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">bottom-left</CardTitle>
                      <CardDescription>Bottom left corner</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="relative h-32 bg-muted/30 rounded-md border-2 border-dashed">
                        <div className="absolute bottom-4 left-4 h-12 w-12 bg-primary rounded-full flex items-center justify-center">
                          <MessageSquare className="h-6 w-6 text-white" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">top-right</CardTitle>
                      <CardDescription>Top right corner</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="relative h-32 bg-muted/30 rounded-md border-2 border-dashed">
                        <div className="absolute top-4 right-4 h-12 w-12 bg-primary rounded-full flex items-center justify-center">
                          <MessageSquare className="h-6 w-6 text-white" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">top-left</CardTitle>
                      <CardDescription>Top left corner</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="relative h-32 bg-muted/30 rounded-md border-2 border-dashed">
                        <div className="absolute top-4 left-4 h-12 w-12 bg-primary rounded-full flex items-center justify-center">
                          <MessageSquare className="h-6 w-6 text-white" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </section>

              <Separator className="my-8" />

              {/* Responsive Behavior */}
              <section className="space-y-6">
                <div className="space-y-2">
                  <h2 id="responsive" className="text-2xl font-bold tracking-tight">📱 Responsive Behavior</h2>
                  <p className="text-muted-foreground">
                    The widget automatically adjusts its size depending on the device.
                  </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <Terminal className="h-5 w-5 text-blue-500" />
                        <CardTitle>Desktop</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">Large screens and tablets</p>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">400 × 650 px</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <Smartphone className="h-5 w-5 text-green-500" />
                        <CardTitle>Mobile</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">Smartphones and small devices</p>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">360 × 600 px</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </section>

              <Separator className="my-8" />

              {/* Example Use Cases */}
              <section className="space-y-6">
                <div className="space-y-2">
                  <h2 id="examples" className="text-2xl font-bold tracking-tight">🎯 Example Use Cases</h2>
                  <p className="text-muted-foreground">
                    Real-world examples for different business scenarios.
                  </p>
                </div>

                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>🛍️ E-commerce Store</CardTitle>
                      <CardDescription>Help customers with shopping questions</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <CodeBlock language="typescript" showCopy={true}>
{`<ChatEmbedWidget 
  businessSlug="my-store" 
  primaryColor="#10b981"
  title="Shopping Help"
  subtitle="Questions? We're here!"
/>`}
                      </CodeBlock>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>💻 SaaS Application</CardTitle>
                      <CardDescription>Provide support for your software users</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <CodeBlock language="typescript" showCopy={true}>
{`<ChatEmbedWidget 
  businessSlug="my-saas" 
  position="bottom-left"
  primaryColor="#8b5cf6"
  title="Support"
/>`}
                      </CodeBlock>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>🏢 Corporate Website</CardTitle>
                      <CardDescription>Professional support for business clients</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <CodeBlock language="typescript" showCopy={true}>
{`<ChatEmbedWidget 
  businessSlug="my-company" 
  position="bottom-right"
  primaryColor="#0ea5e9"
  title="Contact Us"
  subtitle="Business hours: 9AM - 5PM EST"
/>`}
                      </CodeBlock>
                    </CardContent>
                  </Card>
                </div>
              </section>

              <Separator className="my-8" />

              {/* Styling */}
              <section className="space-y-6">
                <div className="space-y-2">
                  <h2 id="styling" className="text-2xl font-bold tracking-tight">🎨 Styling</h2>
                  <p className="text-muted-foreground">
                    No configuration needed! The widget uses pure inline styles.
                  </p>
                </div>

                <Alert className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200 dark:border-green-800">
                  <Sparkles className="h-4 w-4 text-green-600" />
                  <AlertTitle>Zero Configuration</AlertTitle>
                  <AlertDescription className="space-y-2">
                    <p>The widget works out of the box with zero setup. No need to configure Tailwind, add CSS files, or worry about style conflicts.</p>
                    <div className="space-y-1 text-sm mt-3">
                      <p className="font-medium">Why Pure Inline Styles?</p>
                      <ul className="space-y-1 ml-4">
                        <li>✅ Zero dependencies - no CSS framework required</li>
                        <li>✅ No build setup - works immediately</li>
                        <li>✅ No style conflicts - completely isolated</li>
                        <li>✅ Framework agnostic - works everywhere</li>
                        <li>✅ Smaller bundle - no CSS to load</li>
                      </ul>
                    </div>
                  </AlertDescription>
                </Alert>
              </section>

              <Separator className="my-8" />

              {/* Next Steps */}
              <section className="space-y-6">
                <div className="text-center space-y-4">
                  <h2 className="text-2xl font-bold tracking-tight">Ready to Get Started?</h2>
                  <p className="text-muted-foreground max-w-2xl mx-auto">
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
