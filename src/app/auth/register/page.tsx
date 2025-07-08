"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, ArrowRight, Eye, EyeOff, CheckCircle, Mail, User, Lock, Building, FileText, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { BackgroundGradient } from "@/components/ui/background-gradient"
import { GridPattern } from "@/components/ui/grid-pattern"
import { useAuth } from "@/lib/auth"
import Lottie from "lottie-react"
import registrationAnimation from "../../../../public/animations/registration.json"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"

type RegistrationStep = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8

export default function RegisterPage() {
  const router = useRouter()
  const { register } = useAuth()
  const [currentStep, setCurrentStep] = useState<RegistrationStep>(1)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSettingUp, setIsSettingUp] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  
  // Form state
  const [email, setEmail] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [businessName, setBusinessName] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const [address, setAddress] = useState("")
  const [agreeToTerms, setAgreeToTerms] = useState(false)

  const stepIcons = {
    1: Mail,
    2: User,
    3: Lock,
    4: null, // Setup step
    5: Building,
    6: FileText,
    7: Shield,
    8: CheckCircle
  }

  const stepTitles = {
    1: "Email Address",
    2: "Personal Details",
    3: "Create Password",
    4: "Setting Up Profile",
    5: "Business Information",
    6: "Business Details",
    7: "Terms & Agreements",
    8: "Registration Complete"
  }

  const stepDescriptions = {
    1: "Enter your email address to get started",
    2: "Tell us your name",
    3: "Create a secure password",
    4: "Please wait while we set up your profile...",
    5: "What's your business called?",
    6: "Tell us more about your business",
    7: "Review and accept our terms",
    8: "Welcome to Enquiro!"
  }

  const validateStep = (step: RegistrationStep): boolean => {
    setError("")
    
    switch (step) {
      case 1:
        if (!email) {
          setError("Please enter your email address")
          return false
        }
        if (!/\S+@\S+\.\S+/.test(email)) {
          setError("Please enter a valid email address")
          return false
        }
        return true
      case 2:
        if (!firstName.trim()) {
          setError("Please enter your first name")
          return false
        }
        if (!lastName.trim()) {
          setError("Please enter your last name")
          return false
        }
        return true
      case 3:
        if (!password) {
          setError("Please enter a password")
          return false
        }
        if (password.length < 8) {
          setError("Password must be at least 8 characters long")
          return false
        }
        if (!confirmPassword) {
          setError("Please confirm your password")
          return false
        }
        if (password !== confirmPassword) {
          setError("Passwords do not match")
          return false
        }
        return true
      case 5:
        if (!businessName.trim()) {
          setError("Please enter your business name")
          return false
        }
        return true
      case 6:
        if (!description.trim()) {
          setError("Please enter a business description")
          return false
        }
        if (!category.trim()) {
          setError("Please enter a business category")
          return false
        }
        if (!address.trim()) {
          setError("Please enter your business address")
          return false
        }
        return true
      case 7:
        if (!agreeToTerms) {
          setError("Please accept the Terms of Service and Privacy Policy")
          return false
        }
        return true
      default:
        return true
    }
  }

  const handleNext = async () => {
    if (!validateStep(currentStep)) return

    if (currentStep === 3) {
      // After password step, show setup screen
      setCurrentStep(4)
      setIsSettingUp(true)
      
      // Simulate profile setup delay
      setTimeout(() => {
        setIsSettingUp(false)
        setCurrentStep(5)
      }, 2500)
    } else if (currentStep === 7) {
      // Final submission
      await handleFinalSubmit()
    } else if (currentStep < 7) {
      setCurrentStep((prev) => (prev + 1) as RegistrationStep)
    }
  }

  const handleBack = () => {
    if (currentStep > 1 && currentStep !== 4) {
      setCurrentStep((prev) => (prev - 1) as RegistrationStep)
      setError("")
    }
  }

  const handleFinalSubmit = async () => {
    setIsLoading(true)
    setError("")

    try {
      await register({
        firstName,
        lastName,
        email,
        password,
        phoneNumber: "", // We'll add this in a future step if needed
        businessName,
        description,
        category,
        address,
      })
      setCurrentStep(8)
      setTimeout(() => {
        router.push("/login")
      }, 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="space-y-3">
              <h2 className="text-2xl font-bold text-white tracking-tight">{stepTitles[1]}</h2>
              <p className="text-base text-gray-400 leading-relaxed">{stepDescriptions[1]}</p>
            </div>
            <div className="space-y-4">
              <label className="text-sm font-medium text-gray-300 block" htmlFor="email">
                Email Address
              </label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 text-base bg-white/5 border-gray-700 text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500 focus:ring-2 transition-all duration-200"
              />
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div className="space-y-3">
              <h2 className="text-2xl font-bold text-white tracking-tight">{stepTitles[2]}</h2>
              <p className="text-base text-gray-400 leading-relaxed">{stepDescriptions[2]}</p>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300 block" htmlFor="firstName">
                    First Name
                  </label>
                  <Input
                    id="firstName"
                    type="text"
                    placeholder="First name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="h-12 text-base bg-white/5 border-gray-700 text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500 focus:ring-2 transition-all duration-200"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300 block" htmlFor="lastName">
                    Last Name
                  </label>
                  <Input
                    id="lastName"
                    type="text"
                    placeholder="Last name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="h-12 text-base bg-white/5 border-gray-700 text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500 focus:ring-2 transition-all duration-200"
                  />
                </div>
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div className="space-y-3">
              <h2 className="text-2xl font-bold text-white tracking-tight">{stepTitles[3]}</h2>
              <p className="text-base text-gray-400 leading-relaxed">{stepDescriptions[3]}</p>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300 block" htmlFor="password">
                  Password
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12 text-base bg-white/5 border-gray-700 text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500 focus:ring-2 transition-all duration-200 pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300 block" htmlFor="confirmPassword">
                  Confirm Password
                </label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="h-12 text-base bg-white/5 border-gray-700 text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500 focus:ring-2 transition-all duration-200 pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-8 text-center py-12">
            <div className="space-y-6">
              <div className="flex justify-center">
                <div className="relative">
                  <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500/20 border-t-blue-500"></div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <div className="w-8 h-8 bg-blue-900/50 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-blue-400" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-white tracking-tight">{stepTitles[4]}</h2>
                <p className="text-base text-gray-300 leading-relaxed">{stepDescriptions[4]}</p>
              </div>
              <div className="bg-blue-900/20 border border-blue-500/30 rounded-xl px-6 py-4">
                <div className="flex items-center justify-center text-blue-400">
                  <div className="animate-pulse text-sm font-medium">Setting up your personal profile...</div>
                </div>
              </div>
            </div>
          </div>
        )

      case 5:
        return (
          <div className="space-y-6">
            <div className="space-y-3">
              <h2 className="text-2xl font-bold text-white tracking-tight">{stepTitles[5]}</h2>
              <p className="text-base text-gray-400 leading-relaxed">{stepDescriptions[5]}</p>
            </div>
            <div className="space-y-4">
              <label className="text-sm font-medium text-gray-300 block" htmlFor="businessName">
                Business Name
              </label>
              <Input
                id="businessName"
                type="text"
                placeholder="Acme Corporation"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="h-12 text-base bg-white/5 border-gray-700 text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500 focus:ring-2 transition-all duration-200"
              />
            </div>
          </div>
        )

      case 6:
        return (
          <div className="space-y-6">
            <div className="space-y-3">
              <h2 className="text-2xl font-bold text-white tracking-tight">{stepTitles[6]}</h2>
              <p className="text-base text-gray-400 leading-relaxed">{stepDescriptions[6]}</p>
            </div>
            <div className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300 block" htmlFor="category">
                    Business Category
                  </label>
                  <Input
                    id="category"
                    type="text"
                    placeholder="Technology"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="h-12 text-base bg-white/5 border-gray-700 text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500 focus:ring-2 transition-all duration-200"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300 block" htmlFor="description">
                    Business Description
                  </label>
                  <Input
                    id="description"
                    type="text"
                    placeholder="Software Development"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="h-12 text-base bg-white/5 border-gray-700 text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500 focus:ring-2 transition-all duration-200"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300 block" htmlFor="address">
                    Business Address
                  </label>
                  <Input
                    id="address"
                    type="text"
                    placeholder="123 Main St, City, State 12345"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="h-12 text-base bg-white/5 border-gray-700 text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500 focus:ring-2 transition-all duration-200"
                  />
                </div>
              </div>
            </div>
          </div>
        )

      case 7:
        return (
          <div className="space-y-6">
            <div className="space-y-3">
              <h2 className="text-2xl font-bold text-white tracking-tight">{stepTitles[7]}</h2>
              <p className="text-base text-gray-400 leading-relaxed">{stepDescriptions[7]}</p>
            </div>
            <div className="space-y-4">
              <div className="bg-white/5 rounded-2xl border border-blue-500/20 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-700/50">
                  <h3 className="text-lg font-semibold text-white">Terms of Service</h3>
                </div>
                <div className="px-6 py-4">
                  <div className="text-sm text-gray-400 space-y-4 max-h-48 overflow-y-auto custom-scrollbar">
                    <div className="space-y-2">
                      <p className="font-medium text-gray-200">1. Acceptance of Terms</p>
                      <p className="leading-relaxed">By using Enquiro's AI Chatbot Platform, you agree to these Terms of Service and our Privacy Policy.</p>
                    </div>
                    
                    <div className="space-y-2">
                      <p className="font-medium text-gray-200">2. Service Description</p>
                      <p className="leading-relaxed">Enquiro provides a multi-tenant AI chatbot platform that helps organizations automate customer support through intelligent conversation management.</p>
                    </div>
                    
                    <div className="space-y-2">
                      <p className="font-medium text-gray-200">3. User Responsibilities</p>
                      <p className="leading-relaxed">You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account.</p>
                    </div>
                    
                    <div className="space-y-2">
                      <p className="font-medium text-gray-200">4. Data Privacy</p>
                      <p className="leading-relaxed">We implement industry-standard security measures to protect your data. Each tenant's data is isolated and encrypted.</p>
                    </div>
                    
                    <div className="space-y-2">
                      <p className="font-medium text-gray-200">5. Service Availability</p>
                      <p className="leading-relaxed">We strive to maintain 99.9% uptime but cannot guarantee uninterrupted service availability.</p>
                    </div>
                    
                    <div className="space-y-2">
                      <p className="font-medium text-gray-200">6. Limitation of Liability</p>
                      <p className="leading-relaxed">Enquiro's liability is limited to the amount paid for the service in the preceding 12 months.</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl px-6 py-4">
                <div className="flex items-start space-x-3">
                  <input 
                    type="checkbox" 
                    id="agreeToTerms"
                    checked={agreeToTerms}
                    onChange={(e) => setAgreeToTerms(e.target.checked)}
                    className="mt-1 w-4 h-4 rounded border-gray-700 bg-white/5 text-blue-500 focus:ring-blue-500 focus:ring-offset-0 focus:ring-2"
                  />
                  <label htmlFor="agreeToTerms" className="text-sm text-gray-400 leading-relaxed">
                    I have read and agree to the{" "}
                    <span className="text-blue-400 font-medium">Terms of Service</span>{" "}
                    and{" "}
                    <span className="text-blue-400 font-medium">Privacy Policy</span>. 
                    I understand that my business data will be processed according to these terms.
                  </label>
                </div>
              </div>
            </div>
          </div>
        )

      case 8:
        return (
          <div className="space-y-8 text-center py-12">
            <div className="space-y-6">
              <div className="flex justify-center">
                <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center border border-green-500/20">
                  <CheckCircle className="h-8 w-8 text-green-500" />
                </div>
              </div>
              <div className="space-y-4">
                <h2 className="text-3xl font-bold text-white tracking-tight">Welcome to Enquiro!</h2>
                <p className="text-lg text-gray-300 leading-relaxed">
                  Your account has been created successfully. You'll be redirected to the login page shortly.
                </p>
              </div>
              <div className="bg-green-500/10 border border-green-500/20 rounded-xl px-6 py-4">
                <p className="text-green-400 font-medium">
                  Registration complete!
                </p>
              </div>
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-500/30 border-t-blue-500"></div>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Left Side - Illustration/Content Area */}
        <div className="hidden lg:flex lg:w-2/5 relative overflow-hidden bg-gradient-to-br">
        <GridPattern />
        
        {/* Content Overlay */}
        <div className="relative z-10 flex items-center justify-center px-8 py-16 h-full w-full">
          {/* Main Content Container */}
          <div className="max-w-md w-full text-center">
            
            {/* Lottie Animation */}
            <div className="flex justify-center mb-10">
              <div className="w-80 h-80">
                <Lottie 
                  animationData={registrationAnimation}
                  loop={true}
                  className="w-full h-full"
                />
              </div>
            </div>
            
            {/* Heading and Description */}
            <div className="space-y-8 mb-10">
              <h1 className="text-4xl font-bold text-white leading-tight tracking-tight">
                Join Enquiro Now!
              </h1>
              <p className="text-lg text-blue-100/90 leading-relaxed font-medium">
                Transform your customer support with intelligent AI chatbots designed for modern businesses.
              </p>
            </div>
            
            
            {/* Bottom accent */}
            <div className="mt-8 pt-6 border-t border-white/10">
              <p className="text-xs text-blue-200/70 font-medium">
                Join thousands of businesses already using Enquiro
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form Area */}
      <div className="w-full lg:w-3/5 bg-black flex flex-col">
        {/* Form Content - Properly Structured Layout */}
        <div className="flex-1 flex items-center justify-center px-6">
          <div className="w-full max-w-md">
            
            {/* Progress Steps Indicator - Top aligned */}
            {currentStep < 8 && (
              <div className="mb-8">
                <div className="flex items-center justify-center mb-4">
                  <div className="flex items-center space-x-1.5">
                    {[1, 2, 3, 4, 5, 6, 7].map((step) => (
                      <div key={step} className="flex items-center">
                        <div className={`h-2 w-8 rounded-full transition-all duration-300 ${
                          step <= (currentStep === 4 ? 3 : currentStep) 
                            ? 'bg-blue-500' 
                            : 'bg-gray-700'
                        }`}></div>
                        {step < 7 && <div className="w-1"></div>}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="text-xs text-gray-400 font-medium text-center">
                  Step {currentStep === 4 ? 3 : currentStep} of 7
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 text-sm bg-red-500/10 border border-red-500/20 rounded-lg text-red-400">
                {error}
              </div>
            )}
            
            {/* Form Content - Natural flow */}
            <div className="mb-8">
              {renderStepContent()}
            </div>

            {/* Footer Button - Right aligned for natural flow */}
            {currentStep !== 4 && currentStep !== 8 && (
              <div className="flex justify-between items-center">
                {/* Back Button */}
                {currentStep > 1 ? (
                  <Button
                    onClick={handleBack}
                    variant="ghost"
                    className="text-gray-400 hover:text-white hover:bg-white/10 h-12 px-6 text-base font-medium transition-all duration-200"
                  >
                    Back
                  </Button>
                ) : (
                  <div></div>
                )}

                {/* Next Button */}
                <Button
                  onClick={handleNext}
                  disabled={isLoading}
                  className="bg-blue-500 hover:bg-blue-600 text-white h-12 px-8 text-base font-medium transition-all duration-200 rounded-lg shadow-sm"
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white mr-3"></div>
                      Processing...
                    </div>
                  ) : currentStep === 7 ? (
                    "Complete Registration"
                  ) : (
                    <>
                      Next
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Custom Scrollbar Styles */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(75, 85, 99, 0.1);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(59, 130, 246, 0.5);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(59, 130, 246, 0.7);
        }
      `}</style>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  )
}
