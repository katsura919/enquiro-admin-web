"use client"

import React from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { DocsSidebar } from '@/components/docs/DocsSidebar'
import { DocsLayout, DocsPageHeader } from '@/components/docs/DocsLayout'
import { TableOfContents } from '@/components/docs/TableOfContents'
import { CodeBlock } from '@/components/docs/DocsComponents'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { 
  Key,
  Shield,
  ArrowRight
} from 'lucide-react'

export default function ApiDocsPage() {
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
                  heading="REST API Reference"
                  text="Complete API documentation for integrating with your chat support system."
                />

                <Separator className="my-8" />

                {/* Authentication */}
                <section className="space-y-6">
                  <div className="space-y-2">
                    <h2 id="authentication" className="text-2xl font-bold tracking-tight">Authentication</h2>
                    <p className="text-muted-foreground">
                      All API requests require authentication using JWT tokens or API keys.
                    </p>
                  </div>

                  <Alert>
                    <Shield className="h-4 w-4" />
                    <AlertTitle>Security</AlertTitle>
                    <AlertDescription>
                      Always use HTTPS in production and keep your API keys secure. Never expose them in client-side code.
                    </AlertDescription>
                  </Alert>

                  <CodeBlock language="bash" title="Authentication Header">
{`# Using Authorization header
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \\
     https://api.yourcompany.com/api/chats

# Using API Key
curl -H "X-API-Key: YOUR_API_KEY" \\
     https://api.yourcompany.com/api/chats`}
                  </CodeBlock>
                </section>

                <Separator className="my-8" />

                {/* Base URL */}
                <section className="space-y-6">
                  <div className="space-y-2">
                    <h2 id="base-url" className="text-2xl font-bold tracking-tight">Base URL</h2>
                  </div>

                  <CodeBlock language="text" title="Production">
{`https://api.yourcompany.com/api`}
                  </CodeBlock>

                  <CodeBlock language="text" title="Development">
{`http://localhost:3001/api`}
                  </CodeBlock>
                </section>

                <Separator className="my-8" />

                {/* Chat Endpoints */}
                <section className="space-y-6">
                  <div className="space-y-2">
                    <h2 id="chat-endpoints" className="text-2xl font-bold tracking-tight">Chat Endpoints</h2>
                  </div>

                  <div className="space-y-6">
                    {/* Get Chats */}
                    <Card>
                      <CardHeader>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">GET</Badge>
                          <CardTitle className="text-lg">/chat/chats</CardTitle>
                        </div>
                        <p className="text-sm text-muted-foreground">Retrieve all chat conversations</p>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <CodeBlock language="bash" title="Request">
{`curl -X GET "https://api.yourcompany.com/api/chat/chats" \\
     -H "Authorization: Bearer YOUR_TOKEN"`}
                        </CodeBlock>

                        <CodeBlock language="json" title="Response">
{`{
  "success": true,
  "data": [
    {
      "_id": "chat_123",
      "businessId": "business_456",
      "sessionId": "session_789",
      "query": "I need help with my order",
      "response": "How can I assist you today?",
      "messageType": "text",
      "senderType": "customer",
      "attachments": [],
      "createdAt": "2023-12-07T10:30:00Z",
      "updatedAt": "2023-12-07T10:30:00Z"
    }
  ],
  "total": 150,
  "page": 1,
  "limit": 20
}`}
                        </CodeBlock>
                      </CardContent>
                    </Card>

                    {/* Create Chat */}
                    <Card>
                      <CardHeader>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">POST</Badge>
                          <CardTitle className="text-lg">/chat</CardTitle>
                        </div>
                        <p className="text-sm text-muted-foreground">Create a new chat message</p>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <CodeBlock language="bash" title="Request">
{`curl -X POST "https://api.yourcompany.com/api/chat" \\
     -H "Authorization: Bearer YOUR_TOKEN" \\
     -H "Content-Type: application/json" \\
     -d '{
       "businessId": "business_456",
       "sessionId": "session_789",
       "query": "Hello, I need help",
       "messageType": "text",
       "senderType": "customer"
     }'`}
                        </CodeBlock>

                        <CodeBlock language="json" title="Response">
{`{
  "success": true,
  "data": {
    "_id": "chat_124",
    "businessId": "business_456", 
    "sessionId": "session_789",
    "query": "Hello, I need help",
    "messageType": "text",
    "senderType": "customer",
    "attachments": [],
    "createdAt": "2023-12-07T10:35:00Z",
    "updatedAt": "2023-12-07T10:35:00Z"
  }
}`}
                        </CodeBlock>
                      </CardContent>
                    </Card>

                    {/* Upload File */}
                    <Card>
                      <CardHeader>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">POST</Badge>
                          <CardTitle className="text-lg">/chat/upload</CardTitle>
                        </div>
                        <p className="text-sm text-muted-foreground">Upload file attachment for chat</p>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <CodeBlock language="bash" title="Request">
{`curl -X POST "https://api.yourcompany.com/api/chat/upload" \\
     -H "Authorization: Bearer YOUR_TOKEN" \\
     -F "file=@/path/to/file.pdf" \\
     -F "sessionId=session_789" \\
     -F "businessId=business_456"`}
                        </CodeBlock>

                        <CodeBlock language="json" title="Response">
{`{
  "success": true,
  "data": {
    "filename": "document.pdf",
    "url": "https://cloudinary.com/uploads/document.pdf",
    "publicId": "uploads/doc_123",
    "size": 1024000,
    "type": "application/pdf"
  }
}`}
                        </CodeBlock>
                      </CardContent>
                    </Card>
                  </div>
                </section>

                <Separator className="my-8" />

                {/* Agent Endpoints */}
                <section className="space-y-6">
                  <div className="space-y-2">
                    <h2 id="agent-endpoints" className="text-2xl font-bold tracking-tight">Agent Endpoints</h2>
                  </div>

                  <div className="space-y-6">
                    {/* Get Agents */}
                    <Card>
                      <CardHeader>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">GET</Badge>
                          <CardTitle className="text-lg">/agent/agents</CardTitle>
                        </div>
                        <p className="text-sm text-muted-foreground">Get all agents for a business</p>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <CodeBlock language="json" title="Response">
{`{
  "success": true,
  "data": [
    {
      "_id": "agent_123",
      "name": "John Doe",
      "email": "john@company.com",
      "businessId": "business_456",
      "status": "available",
      "isOnline": true,
      "specializations": ["technical", "billing"],
      "createdAt": "2023-12-01T09:00:00Z"
    }
  ]
}`}
                        </CodeBlock>
                      </CardContent>
                    </Card>

                    {/* Update Agent Status */}
                    <Card>
                      <CardHeader>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">PUT</Badge>
                          <CardTitle className="text-lg">/agent/status/:agentId</CardTitle>
                        </div>
                        <p className="text-sm text-muted-foreground">Update agent availability status</p>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <CodeBlock language="bash" title="Request">
{`curl -X PUT "https://api.yourcompany.com/api/agent/status/agent_123" \\
     -H "Authorization: Bearer YOUR_TOKEN" \\
     -H "Content-Type: application/json" \\
     -d '{
       "status": "busy",
       "statusMessage": "In a meeting"
     }'`}
                        </CodeBlock>
                      </CardContent>
                    </Card>
                  </div>
                </section>

                <Separator className="my-8" />

                {/* Error Handling */}
                <section className="space-y-6">
                  <div className="space-y-2">
                    <h2 id="error-handling" className="text-2xl font-bold tracking-tight">Error Handling</h2>
                    <p className="text-muted-foreground">
                      The API uses conventional HTTP response codes and returns JSON error objects.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">HTTP Status Codes</h3>
                    <div className="grid gap-3">
                      <div className="flex items-center justify-between p-3 border rounded">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="bg-green-50 text-green-700">200</Badge>
                          <span className="font-medium">OK</span>
                        </div>
                        <span className="text-sm text-muted-foreground">Request successful</span>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="bg-red-50 text-red-700">400</Badge>
                          <span className="font-medium">Bad Request</span>
                        </div>
                        <span className="text-sm text-muted-foreground">Invalid request parameters</span>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="bg-red-50 text-red-700">401</Badge>
                          <span className="font-medium">Unauthorized</span>
                        </div>
                        <span className="text-sm text-muted-foreground">Authentication required</span>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="bg-red-50 text-red-700">404</Badge>
                          <span className="font-medium">Not Found</span>
                        </div>
                        <span className="text-sm text-muted-foreground">Resource not found</span>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="bg-red-50 text-red-700">500</Badge>
                          <span className="font-medium">Server Error</span>
                        </div>
                        <span className="text-sm text-muted-foreground">Internal server error</span>
                      </div>
                    </div>
                  </div>

                  <CodeBlock language="json" title="Error Response Format">
{`{
  "success": false,
  "error": "Validation failed",
  "details": {
    "field": "email",
    "message": "Email is required"
  },
  "code": "VALIDATION_ERROR"
}`}
                  </CodeBlock>
                </section>

                <Separator className="my-8" />

                {/* Rate Limiting */}
                <section className="space-y-6">
                  <div className="space-y-2">
                    <h2 id="rate-limiting" className="text-2xl font-bold tracking-tight">Rate Limiting</h2>
                    <p className="text-muted-foreground">
                      API requests are rate limited to ensure system stability and fair usage.
                    </p>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Standard Limits</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>API Requests</span>
                            <span className="font-medium">1000/hour</span>
                          </div>
                          <div className="flex justify-between">
                            <span>File Uploads</span>
                            <span className="font-medium">100/hour</span>
                          </div>
                          <div className="flex justify-between">
                            <span>WebSocket Connections</span>
                            <span className="font-medium">50 concurrent</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Response Headers</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <CodeBlock language="text" showCopy={false}>
{`X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1609459200`}
                        </CodeBlock>
                      </CardContent>
                    </Card>
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