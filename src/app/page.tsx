import { Button } from "@/components/ui/button"
import { ArrowRight, Bot, Brain, Users, GitMerge } from "lucide-react"
import { BackgroundGradient } from "@/components/ui/background-gradient"
import { GridPattern } from "@/components/ui/grid-pattern"
import Link from "next/link"

export default function Home() {
  return (
    <div className="relative flex flex-col min-h-screen overflow-hidden bg-black">
      <BackgroundGradient />
      <GridPattern />
      
      {/* Navigation */}
      <nav className="relative z-10 w-full border-b border-blue-500/20 bg-black/50 backdrop-blur-sm">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="text-xl font-bold text-white">
            AI Chatbot Platform
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/auth">
              <Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-white/10">
                Sign In
              </Button>
            </Link>
            <Link href="/auth">
              <Button className="bg-blue-500 hover:bg-blue-600">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 relative">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600">
                  Multi-Tenant AI Chatbot Platform
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-300 md:text-xl">
                  Empower your organization with a smart AI assistant that learns from your knowledge base and knows when to escalate.
                </p>
              </div>
              <div className="space-x-4">
                <Link href="/auth">
                  <Button className="bg-blue-500 hover:bg-blue-600" size="lg">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Button variant="outline" size="lg" className="border-blue-500 text-blue-500 hover:bg-blue-500/10">
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col items-center space-y-4 text-center p-6 bg-white/5 rounded-2xl backdrop-blur-sm border border-blue-500/20">
                <div className="p-4 bg-blue-500/10 rounded-full">
                  <Bot className="h-8 w-8 text-blue-500" />
                </div>
                <h2 className="text-xl font-bold text-white">Smart AI Assistant</h2>
                <p className="text-gray-400">
                  Powered by advanced AI to understand and respond to user queries with precision
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center p-6 bg-white/5 rounded-2xl backdrop-blur-sm border border-blue-500/20">
                <div className="p-4 bg-blue-500/10 rounded-full">
                  <Brain className="h-8 w-8 text-blue-500" />
                </div>
                <h2 className="text-xl font-bold text-white">Knowledge Integration</h2>
                <p className="text-gray-400">
                  Store and leverage your organization's knowledge base for more accurate responses
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center p-6 bg-white/5 rounded-2xl backdrop-blur-sm border border-blue-500/20">
                <div className="p-4 bg-blue-500/10 rounded-full">
                  <GitMerge className="h-8 w-8 text-blue-500" />
                </div>
                <h2 className="text-xl font-bold text-white">Smart Escalation</h2>
                <p className="text-gray-400">
                  Automatically identifies when to escalate complex inquiries to human experts
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Multi-tenant Section */}
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex flex-col space-y-4 md:w-1/2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl text-white">
                  Multi-Tenant Architecture
                </h2>
                <p className="text-gray-400">
                  Securely manage multiple organizations with isolated data and customized knowledge bases. Perfect for enterprises and growing businesses.
                </p>
                <Button variant="outline" className="w-fit border-blue-500 text-blue-500 hover:bg-blue-500/10">
                  Learn About Security
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
              <div className="md:w-1/2 flex justify-center">
                <div className="relative w-full max-w-md">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-700 rounded-lg blur-2xl opacity-20"></div>
                  <div className="relative p-8 rounded-lg bg-white/5 backdrop-blur-sm border border-blue-500/20">
                    <Users className="h-12 w-12 text-blue-500 mb-4" />
                    <h3 className="text-xl font-bold mb-2 text-white">Tenant Management</h3>
                    <p className="text-gray-400">
                      Each tenant gets their own secure environment with custom configurations and data isolation.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-800 opacity-90"></div>
          <div className="container px-4 md:px-6 relative">
            <div className="flex flex-col items-center space-y-4 text-center">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl text-white">
                Ready to Transform Your Customer Support?
              </h2>
              <p className="mx-auto max-w-[600px] text-blue-100">
                Join organizations that are already leveraging our AI chatbot to provide superior customer service.
              </p>
              <Button className="bg-white text-blue-600 hover:bg-blue-50" size="lg">
                Start Free Trial
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full py-6 bg-black/50 backdrop-blur-sm border-t border-blue-500/20">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-sm text-gray-400">
              © 2024 AI Chatbot Platform. All rights reserved.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-sm text-gray-400 hover:text-blue-400">
                Privacy Policy
              </a>
              <a href="#" className="text-sm text-gray-400 hover:text-blue-400">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
