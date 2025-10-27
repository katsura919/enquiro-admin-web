"use client"
import { Button } from "@/components/ui/button"
import { ArrowRight, Users } from "lucide-react"
import { GridBackground } from "@/components/ui/grid-background"
import Link from "next/link"
import Navbar from "@/components/hero-page/nav-bar"
import Footer from "@/components/hero-page/footer"
import {  Highlight } from "@/components/ui/hero-highlight";
// import { ChatEmbedWidget } from "@/components/chat-embed"
import { ChatEmbedWidget } from "enquiro-chat-widget"
import Features from "@/components/hero-page/features"
import LoadingScreen from "@/components/ui/loading-screen"
import dynamic from "next/dynamic"
import { useState, useEffect } from "react"

// Dynamically import Lottie to avoid SSR issues
const Lottie = dynamic(() => import("lottie-react"), { ssr: false })

export default function Home() {
  const [animationData, setAnimationData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  // Load animation data
  useEffect(() => {
    fetch('/animations/support.json')
      .then(response => response.json())
      .then(data => {
        setAnimationData(data)
        // Small delay to ensure smooth loading experience
        setTimeout(() => setIsLoading(false), 500)
      })
      .catch(error => {
        console.error('Error loading animation:', error)
        setIsLoading(false)
      })
  }, [])


  return (
    <div className="min-h-screen w-full bg-black relative overflow-hidden">
      {/* Enhanced Grid Background with Animation */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background: "#000000",
          backgroundImage: `
            linear-gradient(to right, rgba(59, 130, 246, 0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
          animation: "grid-move 20s linear infinite",
        }}
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/50 z-0"></div>
      
      {/* Custom Animation Styles */}
      <style jsx>{`
        @keyframes grid-move {
          0% { transform: translate(0, 0); }
          100% { transform: translate(60px, 60px); }
        }
      `}</style>
        {
            <GridBackground className="relative flex flex-col min-h-screen overflow-hidden">

            {/* Navigation */}
            <Navbar />

            {/* Hero Section */}
            <main className="flex-1 relative">
              <section className="w-full pt-16 pb-8 md:pt-20 md:pb-12 lg:pt-24 lg:pb-16">
                <div className="container px-4 md:px-6">
                  <div className="flex flex-col items-center space-y-6 text-center max-w-5xl mx-auto">
                    
                    {/* Main Heading */}
                    <div className="space-y-4 pt-15">
                      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600">
                        Transform Customer Experience with Intelligent AI-Powered Support
                      </h1>
                      
                      <p className="mx-auto max-w-3xl text-gray-300 text-base md:text-lg lg:text-xl leading-relaxed">
                        All your{" "}
                        <Highlight className="text-white p-1">
                          Live Chat, AI Chatbot, CRM and Workforce Management tools
                        </Highlight>
                        {" "}unified in one powerful platform.
                      </p>
                    </div>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                      <Link href="/auth/register">
                        <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-base font-medium shadow-lg hover:shadow-xl transition-all duration-200 w-full sm:w-auto">
                          Start Free Trial
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                      </Link>
                      <Link href="#features">
                        <Button variant="outline" size="lg" className="border-blue-500/50 text-blue-400 hover:bg-blue-500/10 hover:border-blue-400 px-8 py-3 text-base font-medium transition-all duration-200 w-full sm:w-auto">
                          Watch Demo
                        </Button>
                      </Link>
                    </div>

                    {/* Trust Indicators */}
                    <div className="pt-8 flex flex-col items-center space-y-3">
                      <p className="text-sm text-gray-500">Trusted by businesses worldwide</p>
                      <div className="flex items-center space-x-6 text-gray-600">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-sm">99.9% Uptime</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span className="text-sm">SOC 2 Compliant</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                          <span className="text-sm">24/7 Support</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            

              {/* Features Section */}
              <Features />

              {/* Stats Section */}
              <section className="w-full py-12 md:py-16 lg:py-20 ">
                <div className="container px-4 md:px-6">
                  <div className="text-center mb-12">
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                      Trusted by Growing Businesses
                    </h2>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                      Join thousands of companies that have transformed their customer support with Enquiro
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    <div className="text-center">
                      <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent mb-2">
                        10k+
                      </div>
                      <p className="text-gray-400 text-sm">Active Users</p>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent mb-2">
                        99.9%
                      </div>
                      <p className="text-gray-400 text-sm">Uptime SLA</p>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent mb-2">
                        50M+
                      </div>
                      <p className="text-gray-400 text-sm">Messages Processed</p>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent mb-2">
                        2min
                      </div>
                      <p className="text-gray-400 text-sm">Avg Response Time</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Multi-tenant Section */}
              <section className="w-full py-16 md:py-20 lg:py-24">
                <div className="container px-4 md:px-6">
                  <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16">
                    
                    {/* Content */}
                    <div className="flex flex-col space-y-6 lg:w-1/2">
                      <div className="space-y-4">
                        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-white">
                          Enterprise-Grade Multi-Tenant Architecture
                        </h2>
                        <p className="text-gray-400 text-base md:text-lg leading-relaxed">
                          Securely manage multiple organizations with isolated data and customized knowledge bases. Perfect for enterprises and growing businesses with advanced security requirements.
                        </p>
                      </div>
                      
                      {/* Features List */}
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center">
                            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                          </div>
                          <span className="text-gray-300 text-sm">Complete data isolation between tenants</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center">
                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                          </div>
                          <span className="text-gray-300 text-sm">Custom branding and configurations</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-5 h-5 rounded-full bg-purple-500/20 flex items-center justify-center">
                            <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                          </div>
                          <span className="text-gray-300 text-sm">Scalable infrastructure management</span>
                        </div>
                      </div>

                      <div className="pt-2">
                        <Button variant="outline" className="border-blue-500/50 text-blue-400 hover:bg-blue-500/10 hover:border-blue-400 transition-all duration-200">
                          Learn About Security
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Visual Element */}
                    <div className="lg:w-1/2 flex justify-center">
                      <div className="relative w-full max-w-md">
                        {/* Glow Effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur-3xl opacity-20"></div>
                        
                        {/* Main Card */}
                        <div className="relative p-8 rounded-2xl bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-sm border border-white/10 shadow-2xl">
                          <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 mb-6 mx-auto">
                            <Users className="h-8 w-8 text-white" />
                          </div>
                          
                          <h3 className="text-xl font-bold mb-3 text-white text-center">Secure Tenant Management</h3>
                          <p className="text-gray-400 text-center text-sm leading-relaxed">
                            Each organization gets their own secure environment with custom configurations, isolated data, and dedicated resources.
                          </p>
                          
                          {/* Stats */}
                          <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/10">
                            <div className="text-center">
                              <div className="text-lg font-bold text-white">99.9%</div>
                              <div className="text-xs text-gray-500">Uptime</div>
                            </div>
                            <div className="text-center">
                              <div className="text-lg font-bold text-white">256-bit</div>
                              <div className="text-xs text-gray-500">Encryption</div>
                            </div>
                            <div className="text-center">
                              <div className="text-lg font-bold text-white">SOC 2</div>
                              <div className="text-xs text-gray-500">Compliant</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </main>

            {/* Footer */}
            <Footer />
          </GridBackground>
              
        }
      
      {/* Chat Embed Widget */}
      <ChatEmbedWidget 
        businessSlug="enquiro-business" 
        position="bottom-right"
        primaryColor="#3b82f6"
        title="Enquiro"
      />
    </div>
  )
}
