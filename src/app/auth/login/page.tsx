"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Bot } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/lib/auth"

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  
  // Form state
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      await login(email, password)
      router.push("/dashboard")
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Login Form */}
      
      <div className="bg-black flex-1 flex flex-col items-center justify-center p-8 relative">
        {/* Logo/Brand top left */}
        <Link href="/" className="absolute top-8 left-8 flex items-center gap-2 group">
          <Bot className="h-8 w-8 text-blue-400 group-hover:text-blue-500 transition-colors" />
          <span className="text-2xl font-bold text-white group-hover:text-blue-400 transition-colors">Enquiro</span>
        </Link>

        {/* Login Form Centered */}
        <div className="w-full max-w-md space-y-8">
          {/* Welcome Text */}
          <div className="space-y-2 text-center">
            <p className="relative z-20 bg-gradient-to-b from-neutral-200 to-neutral-500 bg-clip-text py-6 text-3xl font-bold text-transparent sm:text-5xl">
              Welcome
            </p>
            <p className="text-blue-100">Enter your email and password to access your account.</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 text-sm bg-red-500/10 border border-red-500/20 rounded-md text-red-400">
                {error}
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-blue-100" htmlFor="email">
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="username"
                className="h-12 bg-white/10 border-blue-500/30 text-white placeholder:text-blue-200 focus:border-blue-400 focus:ring-blue-400"
              />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-blue-100" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="h-12 bg-white/10 border-blue-500/30 text-white placeholder:text-blue-200 focus:border-blue-400 focus:ring-blue-400 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-200 hover:text-white"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2 text-sm text-blue-100">
                <input 
                  type="checkbox" 
                  className="rounded border-blue-500/30 bg-white/10 text-blue-400 focus:ring-blue-400"
                />
                <span>Remember Me</span>
              </label>
              <Link 
                href="#" 
                className="text-sm text-blue-300 hover:text-blue-200 transition-colors"
              >
                Forgot Your Password?
              </Link>
            </div>

            {/* Login Button */}
            <Button 
              type="submit" 
              className="w-full h-12 bg-blue-500 hover:bg-blue-600 text-white font-medium text-base"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                  </svg>
                  Logging In...
                </span>
              ) : (
                "Log In"
              )}
            </Button>




            {/* Register Link */}
            <div className="text-center text-sm text-blue-200">
              Don't Have An Account?{" "}
              <Link 
                href="/auth/register" 
                className="text-blue-400 hover:text-blue-200 transition-colors font-medium"
              >
                Register Now.
              </Link>
            </div>
          </form>
        </div>
      </div>

      {/* Right Side - Promotional Content */}
      <div
        className="hidden lg:flex lg:flex-1 items-center justify-center p-12 relative"
        style={{
          backgroundImage: "url('/assets/login-bg.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0" />
        <div className="max-w-md text-white space-y-8 relative z-10">
          <div className="space-y-4">
            <h2 className="relative z-20 bg-gradient-to-b from-neutral-200 to-neutral-500 bg-clip-text py-6 text-2xl font-bold text-transparent sm:text-4xl leading-tight">
              Effortlessly manage your team and operations.
            </h2>
            <p className="text-blue-100 text-lg">
              Log in to access your dashboard and manage your team.
            </p>
          </div>

          {/* Dashboard Preview */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/20 rounded-lg p-4">
                <div className="text-white/60 text-sm">Total Revenue</div>
                <div className="text-2xl font-bold text-white">$189,374</div>
              </div>
              <div className="bg-white/20 rounded-lg p-4">
                <div className="text-white/60 text-sm">Active Time</div>
                <div className="text-2xl font-bold text-white">00:01:30</div>
              </div>
            </div>

            {/* Chart Area */}
            <div className="bg-white/20 rounded-lg p-4">
              <div className="text-white/60 text-sm mb-2">Performance</div>
              <div className="h-20 bg-white/10 rounded flex items-end justify-between p-2">
                <div className="w-8 bg-blue-400 rounded-sm" style={{height: '60%'}}></div>
                <div className="w-8 bg-blue-400 rounded-sm" style={{height: '80%'}}></div>
                <div className="w-8 bg-blue-400 rounded-sm" style={{height: '40%'}}></div>
                <div className="w-8 bg-blue-400 rounded-sm" style={{height: '90%'}}></div>
                <div className="w-8 bg-blue-400 rounded-sm" style={{height: '70%'}}></div>
              </div>
            </div>

            {/* Team Stats */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/80">Team Performance</span>
                <span className="text-white">6,248 Units</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2">
                <div className="bg-white rounded-full h-2" style={{width: '75%'}}></div>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="text-blue-200 text-sm text-center">
            Copyright © 2025 Enquiro Enterprises LTD.
          </div>
        </div>
      </div>
    </div>
  )
}
