"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Mail, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import api from "@/utils/api"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const response = await api.post("/user/forgot-password", { email })
      setSuccess(true)
    } catch (err: any) {
      setError(
        err.response?.data?.error || 
        "Failed to send reset email. Please try again."
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Forgot Password Form */}
      <div className="bg-black flex-1 flex flex-col items-center justify-center p-8 relative">
        {/* Logo/Brand top left */}
        <Link href="/" className="absolute top-8 left-8 flex items-center gap-2 group">
          <Image src="/logo.png" alt="Enquiro Logo" width={32} height={32} className="group-hover:opacity-80 transition-opacity" />
          <span className="text-2xl font-bold text-white transition-colors">Enquiro</span>
        </Link>



        {/* Forgot Password Form Centered */}
        <div className="w-full max-w-md space-y-8">
          {!success ? (
            <>
              {/* Header */}
              <div className="space-y-2 text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center">
                    <Mail className="h-8 w-8 text-blue-400" />
                  </div>
                </div>
                <p className="relative z-20 bg-gradient-to-b from-neutral-200 to-neutral-500 bg-clip-text py-6 text-3xl font-bold text-transparent sm:text-5xl">
                  Forgot Password?
                </p>
                <p className="text-blue-100">
                  No worries! Enter your email address and we'll send you a link to reset your password.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="p-3 text-sm bg-red-500/10 border border-red-500/20 rounded-md text-red-400">
                    {error}
                  </div>
                )}

                {/* Email Field */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-blue-100" htmlFor="email">
                    Email Address
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    autoComplete="email"
                    className="h-12 bg-white/10 border-blue-500/30 text-white placeholder:text-blue-200/50 focus:border-blue-400 focus:ring-blue-400"
                  />
                </div>

                {/* Submit Button */}
                <Button 
                  type="submit" 
                  className="w-full h-12 bg-blue-500 hover:bg-blue-600 text-white font-medium text-base cursor-pointer"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="w-8 h-8 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                  ) : (
                    "Send Reset Link"
                  )}
                </Button>

                {/* Back to Login Link */}
                <div className="text-center text-sm text-blue-200">
                  Remember your password?{" "}
                  <Link 
                    href="/auth/login" 
                    className="text-blue-400 hover:text-blue-200 transition-colors font-medium"
                  >
                    Sign in here
                  </Link>
                </div>
              </form>
            </>
          ) : (
            /* Success State */
            <div className="space-y-6 text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="h-8 w-8 text-green-400" />
                </div>
              </div>
              
              <div className="space-y-2">
                <p className="relative z-20 bg-gradient-to-b from-neutral-200 to-neutral-500 bg-clip-text py-6 text-3xl font-bold text-transparent sm:text-5xl">
                  Check Your Email
                </p>
                <p className="text-blue-100">
                  If an account with <span className="text-white font-medium">{email}</span> exists, we've sent a password reset link to your email.
                </p>
              </div>

              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 space-y-2">
                <p className="text-sm text-blue-200">
                  <strong className="text-white">Didn't receive the email?</strong>
                </p>
                <ul className="text-sm text-blue-200 space-y-1 text-left">
                  <li>• Check your spam or junk folder</li>
                  <li>• Make sure you entered the correct email</li>
                  <li>• The link expires in 1 hour</li>
                </ul>
              </div>

              <div className="space-y-3">
                <Button 
                  onClick={() => {
                    setSuccess(false)
                    setEmail("")
                  }}
                  className="w-full h-12 bg-white/10 hover:bg-white/20 text-white font-medium text-base cursor-pointer border border-blue-500/30"
                >
                  Try Another Email
                </Button>

                <Link href="/auth/login">
                  <Button 
                    className="w-full h-12 bg-blue-500 hover:bg-blue-600 text-white font-medium text-base cursor-pointer"
                  >
                    Back to Login
                  </Button>
                </Link>
              </div>
            </div>
          )}
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
              Secure Password Recovery
            </h2>
            <p className="text-blue-100 text-lg">
              We'll help you regain access to your account quickly and securely.
            </p>
          </div>

          {/* Security Features */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 space-y-4">
            <h3 className="text-xl font-semibold text-white">Security Features</h3>
            
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-400/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <CheckCircle2 className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <h4 className="text-white font-medium">Encrypted Links</h4>
                  <p className="text-blue-100 text-sm">
                    Reset links are securely encrypted and unique to your account
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-400/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <CheckCircle2 className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <h4 className="text-white font-medium">Time-Limited</h4>
                  <p className="text-blue-100 text-sm">
                    Links expire after 1 hour for your security
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-400/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <CheckCircle2 className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <h4 className="text-white font-medium">Privacy Protected</h4>
                  <p className="text-blue-100 text-sm">
                    We never reveal if an email is registered for security reasons
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Help Section */}
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <p className="text-white text-sm">
              <strong>Need help?</strong> Contact our support team if you're having trouble recovering your account.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
