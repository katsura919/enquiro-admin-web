"use client";
import { Button } from "@/components/ui/button";
import { ArrowRight, Users } from "lucide-react";
import { GridBackground } from "@/components/ui/grid-background";
import Link from "next/link";
import Navbar from "@/components/hero-page/nav-bar";
import Footer from "@/components/hero-page/footer";
import { ChatEmbedWidget } from "enquiro-chat-widget";
import Features from "@/components/hero-page/features";
import HeroSection from "@/components/hero-page/hero-section";
import LoadingScreen from "@/components/ui/loading-screen";
import dynamic from "next/dynamic";
import { useState, useEffect } from "react";

// Dynamically import Lottie to avoid SSR issues
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

export default function Home() {
  const [animationData, setAnimationData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load animation data
  useEffect(() => {
    fetch("/animations/support.json")
      .then((response) => response.json())
      .then((data) => {
        setAnimationData(data);
        // Small delay to ensure smooth loading experience
        setTimeout(() => setIsLoading(false), 500);
      })
      .catch((error) => {
        console.error("Error loading animation:", error);
        setIsLoading(false);
      });
  }, []);

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
          0% {
            transform: translate(0, 0);
          }
          100% {
            transform: translate(60px, 60px);
          }
        }
      `}</style>
      {
        <GridBackground className="relative flex flex-col min-h-screen overflow-hidden">
          {/* Navigation */}
          <Navbar />

          {/* Hero Section */}
          <main className="flex-1 relative">
            <HeroSection />

            {/* Features Section */}
            <Features />



            {/* Multi-tenant Section */}
            <section className="w-full py-16 md:py-20 lg:py-24 relative overflow-hidden">
              {/* Background Effects */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
                <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl"></div>
              </div>

              <div className="container px-4 md:px-6 relative z-10">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16">
                  {/* Content */}
                  <div className="flex flex-col space-y-8 lg:w-1/2">
                    <div className="space-y-6">
                      {/* Badge */}
                      <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30 backdrop-blur-sm w-fit">
                        <Users className="w-4 h-4 text-purple-400 mr-2" />
                        <span className="text-sm font-medium text-purple-300">
                          Enterprise Ready
                        </span>
                      </div>

                      <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-blue-300">
                          Enterprise-Grade
                        </span>
                        <br />
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-blue-500">
                          Multi-Tenant Architecture
                        </span>
                      </h2>

                      <p className="text-gray-400 text-lg md:text-xl leading-relaxed">
                        Securely manage multiple organizations with isolated
                        data and customized knowledge bases. Perfect for
                        enterprises and growing businesses with advanced
                        security requirements.
                      </p>
                    </div>

                    {/* Features List */}
                    <div className="space-y-4">
                      <div className="flex items-center space-x-4 p-3 rounded-lg bg-blue-500/5 border border-blue-500/10 backdrop-blur-sm">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                          <div className="w-3 h-3 rounded-full bg-white"></div>
                        </div>
                        <span className="text-gray-300 font-medium">
                          Complete data isolation between tenants
                        </span>
                      </div>
                      <div className="flex items-center space-x-4 p-3 rounded-lg bg-green-500/5 border border-green-500/10 backdrop-blur-sm">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center flex-shrink-0">
                          <div className="w-3 h-3 rounded-full bg-white"></div>
                        </div>
                        <span className="text-gray-300 font-medium">
                          Custom branding and configurations
                        </span>
                      </div>
                      <div className="flex items-center space-x-4 p-3 rounded-lg bg-purple-500/5 border border-purple-500/10 backdrop-blur-sm">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                          <div className="w-3 h-3 rounded-full bg-white"></div>
                        </div>
                        <span className="text-gray-300 font-medium">
                          Scalable infrastructure management
                        </span>
                      </div>
                    </div>

                    <div className="pt-4">
                      <Link href="#security">
                        <Button
                          variant="outline"
                          className="group border-2 border-blue-500/50 text-blue-400 hover:bg-blue-500/10 hover:border-blue-400 transition-all duration-300 backdrop-blur-sm px-6 py-3 font-semibold"
                        >
                          Learn About Security
                          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                        </Button>
                      </Link>
                    </div>
                  </div>

                  {/* Visual Element */}
                  <div className="lg:w-1/2 flex justify-center">
                    <div className="relative w-full max-w-lg">
                      {/* Multiple Glow Effects */}
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl blur-3xl opacity-20"></div>
                      <div className="absolute inset-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-3xl blur-2xl opacity-15"></div>

                      {/* Main Card */}
                      <div className="relative p-8 lg:p-10 rounded-3xl bg-gradient-to-b from-white/10 via-white/5 to-white/2 backdrop-blur-lg border border-white/20 shadow-2xl">
                        {/* Header */}
                        <div className="flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-r from-blue-500 to-purple-600 mb-8 mx-auto shadow-lg">
                          <Users className="h-10 w-10 text-white" />
                        </div>

                        <h3 className="text-2xl font-bold mb-4 text-white text-center">
                          Secure Tenant Management
                        </h3>
                        <p className="text-gray-400 text-center leading-relaxed mb-8">
                          Each organization gets their own secure environment
                          with custom configurations, isolated data, and
                          dedicated resources.
                        </p>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-3 gap-6 pt-6 border-t border-white/10">
                          <div className="text-center">
                            <div className="text-2xl font-bold bg-gradient-to-r from-green-400 to-green-500 bg-clip-text text-transparent mb-1">
                              99.9%
                            </div>
                            <div className="text-xs text-gray-500 font-medium">
                              Uptime
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-blue-500 bg-clip-text text-transparent mb-1">
                              256-bit
                            </div>
                            <div className="text-xs text-gray-500 font-medium">
                              Encryption
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-purple-500 bg-clip-text text-transparent mb-1">
                              SOC 2
                            </div>
                            <div className="text-xs text-gray-500 font-medium">
                              Compliant
                            </div>
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
  );
}
