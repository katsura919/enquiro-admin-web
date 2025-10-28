"use client";

import { Bot, MessageSquare, Users, Code } from "lucide-react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { useState, useEffect } from "react";

// Dynamically import Lottie to avoid SSR issues
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

interface Feature {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  gradient: string;
  lottieFile: string;
  bgGradient: string;
}

const features: Feature[] = [
  {
    icon: Bot,
    title: "AI Chatbot",
    description:
      "Intelligent AI-powered chatbot that learns from your knowledge base and provides instant, accurate responses to customer inquiries 24/7",
    gradient: "from-blue-500 to-cyan-500",
    lottieFile: "/animations/chatbot.json",
    bgGradient: "from-blue-500/10 to-cyan-500/10",
  },
  {
    icon: MessageSquare,
    title: "Live Chat",
    description:
      "Real-time live chat system enabling seamless communication between customers and support agents with file sharing and chat history",
    gradient: "from-green-500 to-emerald-500",
    lottieFile: "/animations/communication.json",
    bgGradient: "from-green-500/10 to-emerald-500/10",
  },
  {
    icon: Users,
    title: "CRM Integration",
    description:
      "Comprehensive customer relationship management with contact profiles, interaction history, and automated lead tracking",
    gradient: "from-purple-500 to-pink-500",
    lottieFile: "/animations/check.json",
    bgGradient: "from-purple-500/10 to-pink-500/10",
  },
  {
    icon: Code,
    title: "Chat Widget Integration",
    description:
      "Easy-to-embed chat widget that seamlessly integrates with any website using simple HTML/JavaScript code snippets",
    gradient: "from-indigo-500 to-blue-500",
    lottieFile: "/animations/chatwidget.json",
    bgGradient: "from-indigo-500/10 to-blue-500/10",
  },
];

export default function Features() {
  const [animationData, setAnimationData] = useState<{ [key: string]: any }>(
    {}
  );

  // Load all animation data
  useEffect(() => {
    const loadAnimations = async () => {
      const animations: { [key: string]: any } = {};

      for (const feature of features) {
        try {
          const response = await fetch(feature.lottieFile);
          const data = await response.json();
          animations[feature.lottieFile] = data;
        } catch (error) {
          console.error(
            `Error loading animation ${feature.lottieFile}:`,
            error
          );
        }
      }

      setAnimationData(animations);
    };

    loadAnimations();
  }, []);

  return (
    <section
      className="w-full py-16 md:py-24 lg:py-32 relative overflow-hidden"
      id="features"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-10 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-10 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container px-4 md:px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 mb-6">
            Why Choose Enquiro?
          </h2>
          <p className="mx-auto max-w-3xl text-gray-300 text-xl leading-relaxed">
            Because managing customer support shouldn't require multiple
            subscriptions, complex integrations, or constant switching between
            tools.
          </p>
        </motion.div>

        {/* Features Vertical Stack */}
        <div className="max-w-6xl mx-auto space-y-16 md:space-y-24">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            const isEven = index % 2 === 0;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="group relative"
              >
                <div
                  className={`flex flex-col ${
                    isEven ? "lg:flex-row" : "lg:flex-row-reverse"
                  } items-center gap-12 lg:gap-16`}
                >
                  {/* Content Side */}
                  <div className="flex-1 space-y-6 text-center lg:text-left">


                    {/* Title */}
                    <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold">
                      <span
                        className={`bg-clip-text text-transparent bg-gradient-to-r ${feature.gradient}`}
                      >
                        {feature.title}
                      </span>
                    </h3>

                    {/* Description */}
                    <p className="text-gray-400 text-lg md:text-xl leading-relaxed max-w-2xl">
                      {feature.description}
                    </p>

                    {/* Feature Highlights */}
                    <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                      <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
                        <span className="text-sm text-gray-300">Real-time</span>
                      </div>
                      <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
                        <span className="text-sm text-gray-300">
                          24/7 Available
                        </span>
                      </div>
                      <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
                        <span className="text-sm text-gray-300">
                          Enterprise Ready
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Animation Side */}
                  <div className="flex-1 flex justify-center">
                    <div className="relative w-full max-w-md">
                      {/* Multiple Glow Effects */}
                      <div
                        className={`absolute inset-0 bg-gradient-to-r ${feature.gradient} rounded-3xl blur-3xl opacity-20 group-hover:opacity-30 transition-opacity duration-500`}
                      ></div>
                      <div
                        className={`absolute inset-4 bg-gradient-to-r ${feature.bgGradient} rounded-3xl blur-2xl opacity-40`}
                      ></div>

                      {/* Main Animation Container */}
                      <div className="relative p-8 lg:p-12 rounded-3xl bg-gradient-to-b from-white/10 via-white/5 to-white/2 backdrop-blur-lg border border-white/20 shadow-2xl group-hover:shadow-3xl transition-all duration-500">
                        {/* Lottie Animation */}
                        <div className="w-full h-64 md:h-80 flex items-center justify-center">
                          {animationData[feature.lottieFile] ? (
                            <Lottie
                              animationData={animationData[feature.lottieFile]}
                              loop={true}
                              autoplay={true}
                              style={{ width: "100%", height: "100%" }}
                              className="filter brightness-110"
                            />
                          ) : (
                            // Fallback icon while loading
                            <div className="flex items-center justify-center w-32 h-32">
                              <div
                                className={`p-8 rounded-full bg-gradient-to-r ${feature.gradient}`}
                              >
                                <IconComponent className="h-16 w-16 text-white" />
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Decorative Elements */}
                        <div className="absolute top-4 right-4 w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                        <div className="absolute bottom-4 left-4 w-1 h-1 bg-purple-400 rounded-full animate-pulse delay-1000"></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Connecting Line (except for last item) */}
                {index < features.length - 1 && (
                  <div className="absolute left-1/2 bottom-0 transform -translate-x-1/2 translate-y-8 w-px h-8 bg-gradient-to-b from-blue-500/50 to-transparent hidden lg:block"></div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center pt-20"
        >
          <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 backdrop-blur-sm">
            <span className="text-blue-300 font-medium">
              Ready to transform your customer support?
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
