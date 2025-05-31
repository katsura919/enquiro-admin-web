"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { BackgroundGradient } from "@/components/ui/background-gradient"
import { GridPattern } from "@/components/ui/grid-pattern"
import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/auth"

type AuthMode = "login" | "register"

export default function AuthPage() {
  const router = useRouter()
  const { login, register } = useAuth()
  const [mode, setMode] = useState<AuthMode>("login")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  
  // Login form state
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  
  // Additional register form state
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [businessName, setBusinessName] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const [address, setAddress] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      if (mode === "login") {
        await login(email, password)
        router.push("/dashboard")
      } else {
        await register({
          firstName,
          lastName,
          email,
          password,
          phoneNumber,
          businessName,
          description,
          category,
          address,
        })
        // Registration successful, switch to login mode
        setMode("login")
        setError("Registration successful! Please login.")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const switchMode = (newMode: AuthMode) => {
    setMode(newMode)
    setError("")
    // Clear form fields when switching modes for security
    setPassword("")
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-black">
      <BackgroundGradient />
      <GridPattern />
      
      <Link 
        href="/" 
        className="absolute left-8 top-8 flex items-center text-sm text-gray-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Home
      </Link>

      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <div className="flex space-x-1 bg-white/5 rounded-lg p-1 mb-4">
            <button
              onClick={() => switchMode("login")}
              className={cn(
                "flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors",
                mode === "login" 
                  ? "bg-blue-500 text-white" 
                  : "text-gray-400 hover:text-white hover:bg-white/10"
              )}
            >
              Sign In
            </button>
            <button
              onClick={() => switchMode("register")}
              className={cn(
                "flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors",
                mode === "register" 
                  ? "bg-blue-500 text-white" 
                  : "text-gray-400 hover:text-white hover:bg-white/10"
              )}
            >
              Create Account
            </button>
          </div>
          <CardTitle>
            {mode === "login" ? "Welcome back" : "Create your account"}
          </CardTitle>
          <CardDescription>
            {mode === "login" 
              ? "Enter your credentials to access your account" 
              : "Enter your information to create your account"}
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <div className="p-3 text-sm bg-red-500/10 border border-red-500/20 rounded-md text-red-500">
                {error}
              </div>
            )}
            {mode === "register" && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-200" htmlFor="firstName">
                      First Name
                    </label>
                    <Input
                      id="firstName"
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-200" htmlFor="lastName">
                      Last Name
                    </label>
                    <Input
                      id="lastName"
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-200" htmlFor="phoneNumber">
                    Phone Number
                  </label>
                  <Input
                    id="phoneNumber"
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-200" htmlFor="businessName">
                    Business Name
                  </label>
                  <Input
                    id="businessName"
                    type="text"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-200" htmlFor="description">
                    Business Description
                  </label>
                  <Input
                    id="description"
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-200" htmlFor="category">
                    Business Category
                  </label>
                  <Input
                    id="category"
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-200" htmlFor="address">
                    Business Address
                  </label>
                  <Input
                    id="address"
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                  />
                </div>
              </>
            )}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-200" htmlFor="email">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete={mode === "login" ? "username" : "email"}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-200" htmlFor="password">
                Password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete={mode === "login" ? "current-password" : "new-password"}
                minLength={8}
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button 
              type="submit" 
              className="w-full bg-blue-500 hover:bg-blue-600"
              disabled={isLoading}
            >
              {isLoading 
                ? (mode === "login" ? "Signing in..." : "Creating account...") 
                : (mode === "login" ? "Sign In" : "Create Account")
              }
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
} 