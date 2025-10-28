"use client";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Zap, Shield } from "lucide-react";
import Link from "next/link";
import { Highlight } from "@/components/ui/hero-highlight";
import { motion } from "framer-motion";

export default function HeroSection() {
  return (
    <section className="w-full pt-16 pb-8 md:pt-20 md:pb-12 lg:pt-24 lg:pb-16 relative overflow-hidden">
      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/3 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="container px-4 md:px-6 relative z-10">
        <div className="flex flex-col items-center space-y-8 text-center max-w-6xl mx-auto">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 backdrop-blur-sm"
          >
            <Sparkles className="w-4 h-4 text-blue-400 mr-2" />
            <span className="text-sm font-medium text-blue-300">
              AI-Powered Customer Support Platform
            </span>
          </motion.div>

          {/* Main Heading */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-6"
          >
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 leading-tight">
                Transform Customer
              </span>
              <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-blue-500 to-cyan-400 leading-tight">
                Experience with
              </span>
              <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 leading-tight">
                Intelligent AI
              </span>
            </h1>

            <p className="mx-auto max-w-4xl text-gray-300 text-lg md:text-xl lg:text-2xl leading-relaxed font-light">
              All your{" "}
              <Highlight className="text-white px-2 py-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-none rounded-lg">
                Live Chat, AI Chatbot, CRM and Workforce Management tools
              </Highlight>{" "}
              unified in one powerful, intelligent platform.
            </p>
          </motion.div>

          {/* Feature Pills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap justify-center gap-3 max-w-2xl"
          >
            <div className="flex items-center px-3 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 backdrop-blur-sm">
              <Zap className="w-4 h-4 text-blue-400 mr-2" />
              <span className="text-sm text-blue-300">Lightning Fast</span>
            </div>
            <div className="flex items-center px-3 py-2 rounded-full bg-green-500/10 border border-green-500/20 backdrop-blur-sm">
              <Shield className="w-4 h-4 text-green-400 mr-2" />
              <span className="text-sm text-green-300">
                Enterprise Security
              </span>
            </div>
            <div className="flex items-center px-3 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 backdrop-blur-sm">
              <Sparkles className="w-4 h-4 text-purple-400 mr-2" />
              <span className="text-sm text-purple-300">AI-Powered</span>
            </div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 pt-6"
          >
            <Link href="/auth/register">
              <Button
                size="lg"
                className="group relative bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-10 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 w-full sm:w-auto overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                <span className="relative flex items-center">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
                </span>
              </Button>
            </Link>
            <Link href="#features">
              <Button
                variant="outline"
                size="lg"
                className="group border-2 bg-black text-white px-10 py-4 text-lg font-semibold w-full sm:w-auto"
              >
                <span className="flex items-center">
                  Watch Demo
                  <div className="ml-2 w-5 h-5 rounded-full border-2 border-current flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                    <div className="w-2 h-2 bg-current rounded-full group-hover:animate-pulse"></div>
                  </div>
                </span>
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
