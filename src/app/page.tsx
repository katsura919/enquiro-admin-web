"use client"
import { Button } from "@/components/ui/button"
import { ArrowRight, Bot, Brain, Users, GitMerge } from "lucide-react"
import { GridBackground } from "@/components/ui/grid-background"
import Link from "next/link"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import {  Highlight } from "@/components/ui/hero-highlight";
import { ChatEmbedWidget } from "@/components/chat-embed"
import dynamic from "next/dynamic"
import { useState, useEffect } from "react"

// Dynamically import Lottie to avoid SSR issues
const Lottie = dynamic(() => import("lottie-react"), { ssr: false })

export default function Home() {
  const [animationData, setAnimationData] = useState(null)

  // Load animation data
  useEffect(() => {
    fetch('/animations/support.json')
      .then(response => response.json())
      .then(data => setAnimationData(data))
      .catch(error => console.error('Error loading animation:', error))
  }, [])
  return (
    <div className="min-h-screen w-full bg-black relative">
      {/* Black Basic Grid Background */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background: "#000000",
          backgroundImage: `
            linear-gradient(to right, rgba(75, 85, 99, 0.4) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(75, 85, 99, 0.4) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />
        {
                    <GridBackground className="relative flex flex-col min-h-screen overflow-hidden">
            {/* Navigation */}
            <Navbar />

            {/* Hero Section */}
           
            <main className="flex-1 relative">
           
              <section className="w-full pt-20 pb-12 md:pt-5 md:py-24 lg:py-32 xl:py-48">
                <div className="container px-4 md:px-6">
                  <div className="flex flex-col items-center space-y-4 text-center">
                    <div className="space-y-2">
                      <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600 pb-5">
                        Transform Customer Experience with Intelligent AI-Powered Support
                      </h1>
                      
                      <p className="mx-auto max-w-[700px] text-gray-300 text-base md:text-lg pb-5">
                       
                        All your{" "}
                        <Highlight className="text-black dark:text-white p-2">
                          Live Chat, Ticketing, CRM and Workforce
                        </Highlight>
                        {" "}in one platform.
            
                      </p>
                     
                    </div>

                    
                    {/* Lottie Animation */}
                    <div className="mt-10 flex justify-center">
                      <div className="w-full max-w-2xl md:max-w-4xl lg:max-w-7xl">
                        {animationData && (
                          <Lottie 
                            animationData={animationData}
                            loop={true}
                            autoplay={true}
                            className="w-full h-auto scale-110 md:scale-105 lg:scale-120"
                          />
                        )}
                      </div>
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
        frontendUrl="https://enquiro.vercel.app/"
      />
    </div>
  )
}
