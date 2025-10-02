"use client"

import { Bot, MessageSquare, Users, Calendar, Code, Headphones } from "lucide-react"

interface Feature {
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
  gradient: string
}

const features: Feature[] = [
  {
    icon: Bot,
    title: "AI Chatbot",
    description: "Intelligent AI-powered chatbot that learns from your knowledge base and provides instant, accurate responses to customer inquiries 24/7",
    gradient: "from-blue-500 to-cyan-500"
  },
  {
    icon: MessageSquare,
    title: "Live Chat",
    description: "Real-time live chat system enabling seamless communication between customers and support agents with file sharing and chat history",
    gradient: "from-green-500 to-emerald-500"
  },
  {
    icon: Users,
    title: "CRM Integration",
    description: "Comprehensive customer relationship management with contact profiles, interaction history, and automated lead tracking",
    gradient: "from-purple-500 to-pink-500"
  },
  {
    icon: Calendar,
    title: "Workforce Management",
    description: "Optimize agent scheduling, track performance metrics, manage workloads, and ensure optimal staffing for peak efficiency",
    gradient: "from-orange-500 to-red-500"
  },
  {
    icon: Code,
    title: "Chat Widget Integration",
    description: "Easy-to-embed chat widget that seamlessly integrates with any website using simple HTML/JavaScript code snippets",
    gradient: "from-indigo-500 to-blue-500"
  },
  {
    icon: Headphones,
    title: "Unified Support Hub",
    description: "Centralized dashboard combining all support channels, customer data, and team tools in one powerful interface",
    gradient: "from-teal-500 to-green-500"
  }
]

export default function Features() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32" id="features">
      <div className="container px-4 md:px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600 mb-4">
             Why use Enquiro?
          </h2>
          <p className="mx-auto max-w-[700px] text-gray-300 text-lg">
            Because managing customer support shouldn't require multiple subscriptions, complex integrations, or constant switching between tools.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
          {features.map((feature, index) => {
            const IconComponent = feature.icon
            return (
              <div 
                key={index}
                className="group relative"
              >
                {/* Main Card */}
                <div className="relative flex flex-col items-center space-y-4 text-center p-6 bg-gray-900/50 rounded-2xl backdrop-blur-sm border border-gray-700/50 hover:border-blue-400/60 transition-all duration-300 group-hover:transform group-hover:scale-105 group-hover:bg-gray-800/60 h-full">
                  {/* Icon Container */}
                  <div className="relative p-4 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
                    <IconComponent className={`h-8 w-8 text-white`} />
                  </div>

                  {/* Content */}
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors duration-300">
                      {feature.title}
                    </h3>
                    <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>

                  {/* Subtle bottom gradient line */}
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-0 group-hover:opacity-60 transition-opacity duration-300" />
                </div>
              </div>
            )
          })}
        </div>


      </div>
    </section>
  )
}
