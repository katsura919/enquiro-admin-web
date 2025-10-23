"use client"

import { useState, useEffect, Suspense } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter, useSearchParams } from "next/navigation"
import { Eye, EyeOff, CheckCircle2, AlertCircle, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import api from "@/utils/api"

function ResetPasswordContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token")

  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState<{
    score: number
    message: string
    color: string
  }>({ score: 0, message: "", color: "" })

  useEffect(() => {
    if (!token) {
      setError("Invalid or missing reset token. Please request a new password reset link.")
    }
  }, [token])

  // Calculate password strength
  useEffect(() => {
    if (!newPassword) {
      setPasswordStrength({ score: 0, message: "", color: "" })
      return
    }

    let score = 0
    let message = ""
    let color = ""

    // Length check
    if (newPassword.length >= 8) score += 1
    if (newPassword.length >= 12) score += 1

    // Character variety checks
    if (/[a-z]/.test(newPassword)) score += 1
    if (/[A-Z]/.test(newPassword)) score += 1
    if (/[0-9]/.test(newPassword)) score += 1
    if (/[^a-zA-Z0-9]/.test(newPassword)) score += 1

    if (score <= 2) {
      message = "Weak"
      color = "bg-red-500"
    } else if (score <= 4) {
      message = "Medium"
      color = "bg-yellow-500"
    } else {
      message = "Strong"
      color = "bg-green-500"
    }

    setPasswordStrength({ score, message, color })
  }, [newPassword])

  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Validation
    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long")
      return
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (!token) {
      setError("Invalid reset token")
      return
    }

    setIsLoading(true)

    try {
      await api.post("/user/reset-password", {
        token,
        newPassword
      })
      setSuccess(true)
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push("/auth/login")
      }, 3000)
    } catch (err: any) {
      setError(
        err.response?.data?.error || 
        "Failed to reset password. The link may have expired."
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Reset Password Form */}
      <div className="bg-black flex-1 flex flex-col items-center justify-center p-8 relative">
        {/* Logo/Brand top left */}
        <Link href="/" className="absolute top-8 left-8 flex items-center gap-2 group">
          <Image src="/logo.png" alt="Enquiro Logo" width={32} height={32} className="group-hover:opacity-80 transition-opacity" />
          <span className="text-2xl font-bold text-white transition-colors">Enquiro</span>
        </Link>

        {/* Reset Password Form Centered */}
        <div className="w-full max-w-md space-y-8">
          {!success ? (
            <>
              {/* Header */}
              <div className="space-y-2 text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center">
                    <Lock className="h-8 w-8 text-blue-400" />
                  </div>
                </div>
                <p className="relative z-20 bg-gradient-to-b from-neutral-200 to-neutral-500 bg-clip-text py-6 text-3xl font-bold text-transparent sm:text-5xl">
                  Reset Password
                </p>
                <p className="text-blue-100">
                  Enter your new password below to reset your account password.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="p-3 text-sm bg-red-500/10 border border-red-500/20 rounded-md text-red-400 flex items-start gap-2">
                    <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                )}

                {/* New Password Field */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-blue-100" htmlFor="newPassword">
                    New Password
                  </label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                      required
                      autoComplete="new-password"
                      className="h-12 bg-white/10 border-blue-500/30 text-white placeholder:text-blue-200/50 focus:border-blue-400 focus:ring-blue-400 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-200 hover:text-white"
                    >
                      {showNewPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  
                  {/* Password Strength Indicator */}
                  {newPassword && (
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${passwordStrength.color} transition-all duration-300`}
                            style={{ width: `${(passwordStrength.score / 6) * 100}%` }}
                          />
                        </div>
                        <span className="text-xs text-blue-200 min-w-[60px]">
                          {passwordStrength.message}
                        </span>
                      </div>
                      <p className="text-xs text-blue-200">
                        Use at least 8 characters with a mix of letters, numbers, and symbols
                      </p>
                    </div>
                  )}
                </div>

                {/* Confirm Password Field */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-blue-100" htmlFor="confirmPassword">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                      required
                      autoComplete="new-password"
                      className="h-12 bg-white/10 border-blue-500/30 text-white placeholder:text-blue-200/50 focus:border-blue-400 focus:ring-blue-400 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-200 hover:text-white"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  {confirmPassword && newPassword !== confirmPassword && (
                    <p className="text-xs text-red-400">Passwords do not match</p>
                  )}
                  {confirmPassword && newPassword === confirmPassword && (
                    <p className="text-xs text-green-400 flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" />
                      Passwords match
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <Button 
                  type="submit" 
                  className="w-full h-12 bg-blue-500 hover:bg-blue-600 text-white font-medium text-base cursor-pointer"
                  disabled={isLoading || !token}
                >
                  {isLoading ? (
                    <div className="w-8 h-8 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                  ) : (
                    "Reset Password"
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
                  Password Reset!
                </p>
                <p className="text-blue-100">
                  Your password has been successfully reset.
                </p>
                <p className="text-blue-200 text-sm">
                  Redirecting to login page...
                </p>
              </div>

              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                <p className="text-sm text-green-200">
                  You can now log in with your new password.
                </p>
              </div>

              <Link href="/auth/login">
                <Button 
                  className="w-full h-12 bg-blue-500 hover:bg-blue-600 text-white font-medium text-base cursor-pointer"
                >
                  Go to Login
                </Button>
              </Link>
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
              Create a Strong Password
            </h2>
            <p className="text-blue-100 text-lg">
              Choose a secure password to protect your account.
            </p>
          </div>

          {/* Password Tips */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 space-y-4">
            <h3 className="text-xl font-semibold text-white">Password Tips</h3>
            
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-400/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <CheckCircle2 className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <h4 className="text-white font-medium">Use 8+ Characters</h4>
                  <p className="text-blue-100 text-sm">
                    Longer passwords are more secure
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-400/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <CheckCircle2 className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <h4 className="text-white font-medium">Mix Character Types</h4>
                  <p className="text-blue-100 text-sm">
                    Combine uppercase, lowercase, numbers, and symbols
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-400/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <CheckCircle2 className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <h4 className="text-white font-medium">Avoid Common Words</h4>
                  <p className="text-blue-100 text-sm">
                    Don't use easily guessable information
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-400/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <CheckCircle2 className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <h4 className="text-white font-medium">Unique Password</h4>
                  <p className="text-blue-100 text-sm">
                    Don't reuse passwords from other accounts
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="w-8 h-8 rounded-full border-2 border-blue-400/20 border-t-blue-400 animate-spin" />
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  )
}
