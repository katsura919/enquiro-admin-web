"use client"
import { Button } from "@/components/ui/button"
import { ArrowRight, Users } from "lucide-react"
import { GridBackground } from "@/components/ui/grid-background"
import Link from "next/link"
import Navbar from "@/components/hero-page/nav-bar"
import Footer from "@/components/hero-page/footer"
import {  Highlight } from "@/components/ui/hero-highlight";
import { ChatEmbedWidget } from "@/components/chat-embed"
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
           
              <section className="w-full pt-20 pb-5 md:pt-5 md:py-24 lg:py-32 xl:py-48">
                <div className="container px-4 md:px-6">
                  <div className="flex flex-col items-center space-y-4 text-center">
                    <div className="space-y-2">
                      <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600 pb-5">
                        Transform Customer Experience with Intelligent AI-Powered Support
                      </h1>
                      
                      <p className="mx-auto max-w-[700px] text-gray-300 text-base md:text-lg pb-5">
                       
                        All your{" "}
                        <Highlight className="text-black dark:text-white p-1">
                          Live Chat, AI Chatbot, CRM and Workforce Management tools
                        </Highlight>
                        {" "}unified in one powerful platform.
            
                      </p>
                     
                    </div>



                  </div>
                </div>
              </section>
            

              {/* Features Section */}
              <Features />

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
      />
    </div>
  )
}
