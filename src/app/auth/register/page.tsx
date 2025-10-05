"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, ArrowRight, Eye, EyeOff, CheckCircle, Mail, User, Lock, Building, FileText, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { BackgroundGradient } from "@/components/ui/background-gradient"
import { GridPattern } from "@/components/ui/grid-pattern"
import { useAuth } from "@/lib/auth"
import AuthRedirect from "@/components/auth-redirect"
import Lottie from "lottie-react"
import registrationAnimation from "../../../../public/animations/registration.json"
import checkAnimation from "../../../../public/animations/check.json"
import Navbar from "@/components/hero-page/nav-bar"
import Footer from "@/components/hero-page/footer"
import TermsModal from "./component/TermsModal"
import PrivacyModal from "./component/PrivacyModal"

type RegistrationStep = 1 | 2 | 3 | 4 | 5 | 6 | 7

export default function RegisterPage() {
  const router = useRouter()
  const { register, verifyCode, completeRegistration, resendCode } = useAuth()
  const [currentStep, setCurrentStep] = useState<RegistrationStep>(1)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSettingUp, setIsSettingUp] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [showTermsModal, setShowTermsModal] = useState(false)
  const [showPrivacyModal, setShowPrivacyModal] = useState(false)
  
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
  const [verificationCode, setVerificationCode] = useState("")
  const [registeredEmail, setRegisteredEmail] = useState("")
  const [isResending, setIsResending] = useState(false)
  const [resendTimer, setResendTimer] = useState(0)
  const [codeDigits, setCodeDigits] = useState(["", "", "", "", "", ""])
  
  // Refs for digit inputs
  const digitInputs = useRef<(HTMLInputElement | null)[]>([])

  // Timer effect for resend functionality
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [resendTimer])

  const stepIcons = {
    1: Building,
    2: User,
    3: Lock,
    4: Mail,
    5: Mail, // Verification step
    6: Shield,
    7: CheckCircle
  }

  const stepTitles = {
    1: "Business Information",
    2: "Personal Details",
    3: "Create Password",
    4: "Email Address",
    5: "Verify Your Email",
    6: "Terms & Agreements",
    7: "Registration Complete"
  }

  const stepDescriptions = {
    1: "Tell us about your business",
    2: "Tell us your name",
    3: "Create a secure password",
    4: "Enter your email address",
    5: "Enter the 6-digit code sent to your email",
    6: "Review and accept our terms",
    7: "Welcome to Enquiro!"
  }

  // Handle digit input changes
  const handleDigitChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return // Only allow digits
    
    // Check if previous digits are filled (sequential entry)
    if (index > 0 && !codeDigits[index - 1]) {
      // Focus the first empty digit instead
      const firstEmptyIndex = codeDigits.findIndex(digit => !digit)
      if (firstEmptyIndex !== -1) {
        digitInputs.current[firstEmptyIndex]?.focus()
      }
      return
    }
    
    const newDigits = [...codeDigits]
    newDigits[index] = value.slice(-1) // Only take the last character
    setCodeDigits(newDigits)
    
    // Update the verification code
    setVerificationCode(newDigits.join(''))
    
    // Auto-focus next input
    if (value && index < 5) {
      digitInputs.current[index + 1]?.focus()
    }
  }

  // Handle backspace and navigation
  const handleDigitKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace') {
      if (codeDigits[index]) {
        // Clear current digit
        const newDigits = [...codeDigits]
        newDigits[index] = ''
        setCodeDigits(newDigits)
        setVerificationCode(newDigits.join(''))
      } else if (index > 0) {
        // Move to previous digit and clear it
        const newDigits = [...codeDigits]
        newDigits[index - 1] = ''
        setCodeDigits(newDigits)
        setVerificationCode(newDigits.join(''))
        digitInputs.current[index - 1]?.focus()
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      digitInputs.current[index - 1]?.focus()
    } else if (e.key === 'ArrowRight' && index < 5 && codeDigits[index]) {
      // Only allow right arrow if current digit is filled
      digitInputs.current[index + 1]?.focus()
    }
  }

  // Handle paste functionality
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    const newDigits = Array(6).fill('').map((_, i) => pastedData[i] || '')
    setCodeDigits(newDigits)
    setVerificationCode(newDigits.join(''))
    
    // Focus the next empty input or the last input
    const nextEmptyIndex = newDigits.findIndex(digit => !digit)
    const focusIndex = nextEmptyIndex !== -1 ? nextEmptyIndex : 5
    digitInputs.current[focusIndex]?.focus()
  }

  const validateStep = (step: RegistrationStep): boolean => {
    setErrors({})
    
    switch (step) {
      case 1:
        const businessErrors: Record<string, string> = {}
        if (!businessName.trim()) {
          businessErrors.businessName = "Please enter your business name"
        }
        if (!description.trim()) {
          businessErrors.description = "Please enter a business description"
        }
        if (!category.trim()) {
          businessErrors.category = "Please enter a business category"
        }
        if (!address.trim()) {
          businessErrors.address = "Please enter your business address"
        }
        if (Object.keys(businessErrors).length > 0) {
          setErrors(businessErrors)
          return false
        }
        return true
      case 2:
        const newErrors: Record<string, string> = {}
        if (!firstName.trim()) {
          newErrors.firstName = "Please enter your first name"
        }
        if (!lastName.trim()) {
          newErrors.lastName = "Please enter your last name"
        }
        if (Object.keys(newErrors).length > 0) {
          setErrors(newErrors)
          return false
        }
        return true
      case 3:
        const passwordErrors: Record<string, string> = {}
        if (!password) {
          passwordErrors.password = "Please enter a password"
        } else if (password.length < 8) {
          passwordErrors.password = "Password must be at least 8 characters long"
        }
        if (!confirmPassword) {
          passwordErrors.confirmPassword = "Please confirm your password"
        } else if (password !== confirmPassword) {
          passwordErrors.confirmPassword = "Passwords do not match"
        }
        if (Object.keys(passwordErrors).length > 0) {
          setErrors(passwordErrors)
          return false
        }
        return true
      case 4:
        if (!email) {
          setErrors({ email: "Please enter your email address" })
          return false
        }
        if (!/\S+@\S+\.\S+/.test(email)) {
          setErrors({ email: "Please enter a valid email address" })
          return false
        }
        return true
      case 5:
        if (!verificationCode.trim()) {
          setErrors({ verificationCode: "Please enter the verification code" })
          return false
        }
        if (verificationCode.length !== 6) {
          setErrors({ verificationCode: "Verification code must be 6 digits" })
          return false
        }
        return true
      case 6:
        if (!agreeToTerms) {
          setErrors({ terms: "Please accept the Terms of Service and Privacy Policy" })
          return false
        }
        return true
      default:
        return true
    }
  }

  const handleNext = async () => {
    if (!validateStep(currentStep)) return

    if (currentStep === 4) {
      // After email step, submit registration and get verification code
      await handleRegistrationSubmit()
    } else if (currentStep === 5) {
      // Verify code but don't complete registration yet
      await handleVerificationSubmit()
    } else if (currentStep === 6) {
      // Final step - complete registration with terms agreement
      await handleFinalSubmit()
    } else if (currentStep < 6) {
      setCurrentStep((prev) => (prev + 1) as RegistrationStep)
    }
  }

  const handleBack = () => {
    if (currentStep > 1 && currentStep !== 4) {
      setCurrentStep((prev) => (prev - 1) as RegistrationStep)
      setErrors({})
    }
  }

  const handleRegistrationSubmit = async () => {
    setIsLoading(true)
    setErrors({})

    try {
      const result = await register({
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
      
      setRegisteredEmail(result.email)
      setResendTimer(60) // Start 60 second timer
      setCurrentStep(5) // Move to verification step
    } catch (err) {
      setErrors({ general: err instanceof Error ? err.message : "An error occurred" })
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerificationSubmit = async () => {
    setIsLoading(true)
    setErrors({})

    try {
      const result = await verifyCode(registeredEmail, verificationCode)
      
      if (result.verified) {
        setCurrentStep(6) // Move to terms step
      }
    } catch (err) {
      setErrors({ general: err instanceof Error ? err.message : "An error occurred" })
    } finally {
      setIsLoading(false)
    }
  }

  const handleFinalSubmit = async () => {
    setIsLoading(true)
    setErrors({})

    try {
      const startTime = Date.now()
      
      // Complete registration with terms acceptance
      await completeRegistration(registeredEmail)
      
      setCurrentStep(7) // Move to success step
      
      // Ensure the success screen is visible for at least 2 seconds
      const elapsedTime = Date.now() - startTime
      const minimumDisplayTime = 2000 // 2 seconds
      const remainingTime = Math.max(0, minimumDisplayTime - elapsedTime)
      
      setTimeout(() => {
        router.push("/dashboard") // Go to dashboard
      }, remainingTime + 1000) // Add extra 1 second for better UX
    } catch (err) {
      setErrors({ general: err instanceof Error ? err.message : "An error occurred" })
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendCode = async () => {
    if (resendTimer > 0 || isResending) return
    
    setIsResending(true)
    setErrors({})

    try {
      await resendCode(registeredEmail)
      setResendTimer(60) // Reset timer to 60 seconds
      // Clear current digits
      setCodeDigits(["", "", "", "", "", ""])
      setVerificationCode("")
      // Focus first input
      digitInputs.current[0]?.focus()
    } catch (err) {
      setErrors({ general: err instanceof Error ? err.message : "Failed to resend code" })
    } finally {
      setIsResending(false)
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
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300 block" htmlFor="businessName">
                    Business Name
                  </label>
                  <Input
                    id="businessName"
                    type="text"
                    placeholder="Acme Corporation"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    className={`h-12 text-base bg-white/5 text-white placeholder:text-gray-500 focus:ring-2 transition-all duration-200 ${
                      errors.businessName 
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                        : 'border-gray-700 focus:border-blue-500 focus:ring-blue-500'
                    }`}
                  />
                  {errors.businessName && (
                    <p className="text-sm text-red-400 mt-1">{errors.businessName}</p>
                  )}
                </div>
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
                    className={`h-12 text-base bg-white/5 text-white placeholder:text-gray-500 focus:ring-2 transition-all duration-200 ${
                      errors.category 
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                        : 'border-gray-700 focus:border-blue-500 focus:ring-blue-500'
                    }`}
                  />
                  {errors.category && (
                    <p className="text-sm text-red-400 mt-1">{errors.category}</p>
                  )}
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
                    className={`h-12 text-base bg-white/5 text-white placeholder:text-gray-500 focus:ring-2 transition-all duration-200 ${
                      errors.description 
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                        : 'border-gray-700 focus:border-blue-500 focus:ring-blue-500'
                    }`}
                  />
                  {errors.description && (
                    <p className="text-sm text-red-400 mt-1">{errors.description}</p>
                  )}
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
                    className={`h-12 text-base bg-white/5 text-white placeholder:text-gray-500 focus:ring-2 transition-all duration-200 ${
                      errors.address 
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                        : 'border-gray-700 focus:border-blue-500 focus:ring-blue-500'
                    }`}
                  />
                  {errors.address && (
                    <p className="text-sm text-red-400 mt-1">{errors.address}</p>
                  )}
                </div>
              </div>
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                    className={`h-12 text-base bg-white/5 text-white placeholder:text-gray-500 focus:ring-2 transition-all duration-200 ${
                      errors.firstName 
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                        : 'border-gray-700 focus:border-blue-500 focus:ring-blue-500'
                    }`}
                  />
                  {errors.firstName && (
                    <p className="text-sm text-red-400 mt-1">{errors.firstName}</p>
                  )}
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
                    className={`h-12 text-base bg-white/5 text-white placeholder:text-gray-500 focus:ring-2 transition-all duration-200 ${
                      errors.lastName 
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                        : 'border-gray-700 focus:border-blue-500 focus:ring-blue-500'
                    }`}
                  />
                  {errors.lastName && (
                    <p className="text-sm text-red-400 mt-1">{errors.lastName}</p>
                  )}
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
                    className={`h-12 text-base bg-white/5 text-white placeholder:text-gray-500 focus:ring-2 transition-all duration-200 pr-12 ${
                      errors.password 
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                        : 'border-gray-700 focus:border-blue-500 focus:ring-blue-500'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-400 mt-1">{errors.password}</p>
                )}
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
                    className={`h-12 text-base bg-white/5 text-white placeholder:text-gray-500 focus:ring-2 transition-all duration-200 pr-12 ${
                      errors.confirmPassword 
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                        : 'border-gray-700 focus:border-blue-500 focus:ring-blue-500'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-sm text-red-400 mt-1">{errors.confirmPassword}</p>
                )}
              </div>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div className="space-y-3">
              <h2 className="text-2xl font-bold text-white tracking-tight">{stepTitles[4]}</h2>
              <p className="text-base text-gray-400 leading-relaxed">{stepDescriptions[4]}</p>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300 block" htmlFor="email">
                  Email Address
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`h-12 text-base bg-white/5 text-white placeholder:text-gray-500 focus:ring-2 transition-all duration-200 ${
                    errors.email 
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                      : 'border-gray-700 focus:border-blue-500 focus:ring-blue-500'
                  }`}
                />
                {errors.email && (
                  <p className="text-sm text-red-400 mt-1">{errors.email}</p>
                )}
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
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl px-4 py-3">
                <p className="text-sm text-blue-400">
                  We've sent a verification code to <span className="font-semibold">{registeredEmail}</span>
                </p>
              </div>
            </div>
            <div className="space-y-6">
              <div className="space-y-4">
                <label className="text-sm font-medium text-gray-300 block text-center">
                  Enter Verification Code
                </label>
                
                {/* Digit Input Boxes */}
                <div className="flex justify-center items-center space-x-3 sm:space-x-4">
                  {codeDigits.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => { digitInputs.current[index] = el }}
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleDigitChange(index, e.target.value)}
                      onKeyDown={(e) => handleDigitKeyDown(index, e)}
                      onPaste={index === 0 ? handlePaste : undefined}
                      className={`w-12 h-12 sm:w-14 sm:h-14 text-center text-xl sm:text-2xl font-mono font-semibold bg-white/5 text-white border-2 rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${
                        errors.verificationCode 
                          ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                          : 'border-gray-700 focus:border-blue-500 focus:ring-blue-500'
                      }`}
                    />
                  ))}
                </div>
                
                {errors.verificationCode && (
                  <p className="text-sm text-red-400 text-center mt-2">{errors.verificationCode}</p>
                )}
              </div>
              
              {/* Resend Code Section */}
              <div className="text-center pt-2">
                <div className="space-y-2">
                  {resendTimer > 0 ? (
                    <p className="text-sm text-gray-400">
                      Resend code in <span className="font-medium text-blue-400">{resendTimer}s</span>
                    </p>
                  ) : (
                    <button
                      onClick={handleResendCode}
                      disabled={isResending}
                      className="text-sm text-blue-400 hover:text-blue-300 font-medium transition-colors disabled:opacity-50"
                    >
                      {isResending ? (
                        <div className="flex items-center justify-center space-x-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-400/30 border-t-blue-400"></div>
                          <span>Resending...</span>
                        </div>
                      ) : (
                        "Didn't receive the code? Resend"
                      )}
                    </button>
                  )}
                </div>
              </div>
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
              {/* Summary Card */}
              <div className="bg-white/5 rounded-2xl border border-blue-500/20 p-6">
                <div className="space-y-4">          
                  <div className="flex flex-col space-y-3">
                    <button
                      onClick={() => setShowTermsModal(true)}
                      className="flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-xl border border-gray-700 hover:border-blue-500/50 transition-all duration-200 group"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                          <FileText className="h-4 w-4 text-blue-400" />
                        </div>
                        <span className="text-white font-medium">Terms of Service</span>
                      </div>
                      <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-blue-400 transition-colors" />
                    </button>
                    
                    <button
                      onClick={() => setShowPrivacyModal(true)}
                      className="flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-xl border border-gray-700 hover:border-blue-500/50 transition-all duration-200 group"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                          <Shield className="h-4 w-4 text-blue-400" />
                        </div>
                        <span className="text-white font-medium">Privacy Policy</span>
                      </div>
                      <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-blue-400 transition-colors" />
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Agreement Checkbox */}
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl px-6 py-4">
                <div className="flex items-start space-x-3">
                  <input 
                    type="checkbox" 
                    id="agreeToTerms"
                    checked={agreeToTerms}
                    onChange={(e) => setAgreeToTerms(e.target.checked)}
                    className={`mt-1 w-4 h-4 rounded bg-white/5 focus:ring-offset-0 focus:ring-2 ${
                      errors.terms
                        ? 'border-red-500 text-red-500 focus:ring-red-500'
                        : 'border-gray-700 text-blue-500 focus:ring-blue-500'
                    }`}
                  />
                  <div className="flex-1">
                    <label htmlFor="agreeToTerms" className="text-sm text-gray-400 leading-relaxed">
                      I have read and agree to the{" "}
                      <button
                        onClick={() => setShowTermsModal(true)}
                        className="text-blue-400 font-medium hover:text-blue-300 underline transition-colors"
                      >
                        Terms of Service
                      </button>{" "}
                      and{" "}
                      <button
                        onClick={() => setShowPrivacyModal(true)}
                        className="text-blue-400 font-medium hover:text-blue-300 underline transition-colors"
                      >
                        Privacy Policy
                      </button>. 
                      I understand that my business data will be processed according to these terms.
                    </label>
                    {errors.terms && (
                      <p className="text-sm text-red-400 mt-2">{errors.terms}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      case 7:
        return (
          <div className="space-y-8 text-center py-12">
            <div className="space-y-6">
              <div className="flex justify-center">
                <div className="w-24 h-24">
                  <Lottie 
                    animationData={checkAnimation}
                    loop={false}
                    className="w-full h-full"
                  />
                </div>
              </div>
              <div className="space-y-4">
                <h2 className="text-3xl font-bold text-white tracking-tight">Welcome to Enquiro!</h2>
                <p className="text-lg text-gray-300 leading-relaxed">
                  Registration completed successfully! Redirecting you to your dashboard.
                </p>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <AuthRedirect>
      <div className="min-h-screen bg-black flex flex-col">
        {/* Mobile Navigation */}
        <div className="lg:hidden bg-black/95 backdrop-blur-sm border-b border-gray-800 px-4 py-3">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-white font-bold text-xl">
              Enquiro
            </Link>
            <Link 
              href="/auth/login" 
              className="text-sm text-blue-400 hover:text-blue-300 font-medium"
            >
              Sign In
            </Link>
          </div>
        </div>

      {/* Desktop Navbar */}
      <div className="hidden lg:block">
        <Navbar />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Left Side - Illustration/Content Area */}
        <div className="hidden lg:flex lg:w-2/5 xl:w-1/2 relative overflow-hidden bg-gradient-to-br">
        <GridPattern />
        
        {/* Content Overlay */}
        <div className="relative z-10 flex items-center justify-center px-8 lg:px-12 xl:px-16 h-full w-full">
          {/* Main Content Container */}
          <div className="max-w-lg w-full text-center">
            
            {/* Lottie Animation */}
            <div className="flex justify-center mb-8 lg:mb-10">
              <div className="w-64 h-64 md:w-72 md:h-72 lg:w-80 lg:h-80">
                <Lottie 
                  animationData={registrationAnimation}
                  loop={true}
                  className="w-full h-full"
                />
              </div>
            </div>
            
            {/* Heading and Description */}
            <div className="space-y-6 lg:space-y-8 mb-8 lg:mb-10">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight tracking-tight text-center">
                Join <span className="font-bold">Enquiro</span> Now!
              </h1>
              <p className="text-base md:text-lg text-blue-100/90 leading-relaxed font-medium text-center px-4">
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
      <div className="w-full lg:w-3/5 xl:w-1/2 bg-black flex flex-col min-h-screen lg:min-h-auto">
        {/* Form Content - Properly Structured Layout */}
        <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          <div className="w-full max-w-md lg:max-w-lg">
            
            {/* Progress Steps Indicator - Top aligned */}
            {currentStep < 7 && (
              <div className="mb-6 lg:mb-8">
                <div className="flex items-center justify-center mb-4">
                  <div className="flex items-center space-x-1 sm:space-x-1.5">
                    {[1, 2, 3, 4, 5, 6].map((step) => (
                      <div key={step} className="flex items-center">
                        <div className={`h-2 w-6 sm:w-8 lg:w-10 rounded-full transition-all duration-300 ${
                          step <= currentStep 
                            ? 'bg-blue-500' 
                            : 'bg-gray-700'
                        }`}></div>
                        {step < 6 && <div className="w-0.5 sm:w-1"></div>}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="text-xs text-gray-400 font-medium text-center">
                  Step {currentStep} of 6
                </div>
              </div>
            )}

            {/* Error Message for General Errors */}
            {errors.general && (
              <div className="mb-6 p-4 text-sm bg-red-500/10 border border-red-500/20 rounded-lg text-red-400">
                {errors.general}
              </div>
            )}
            
            {/* Form Content - Natural flow */}
            <div className="mb-8">
              {renderStepContent()}
            </div>

            {/* Footer Button - Right aligned for natural flow */}
            {currentStep !== 7 && (
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0">
                {/* Back Button */}
                {currentStep > 1 ? (
                  <Button
                    onClick={handleBack}
                    variant="ghost"
                    className="w-full sm:w-auto text-gray-400 hover:text-white hover:bg-white/10 h-12 px-6 text-base font-medium transition-all duration-200 order-2 sm:order-1"
                  >
                    Back
                  </Button>
                ) : (
                  <div className="hidden sm:block"></div>
                )}

                {/* Next Button */}
                <Button
                  onClick={handleNext}
                  disabled={isLoading}
                  className="w-full sm:w-auto bg-blue-500 hover:bg-blue-600 text-white h-12 px-8 text-base font-medium transition-all duration-200 rounded-lg shadow-sm order-1 sm:order-2"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white mr-3"></div>
                      <span className="hidden sm:inline">Processing...</span>
                      <span className="sm:hidden">Processing</span>
                    </div>
                  ) : currentStep === 4 ? (
                    <span className="hidden sm:inline">Send Verification Code</span>
                  ) : currentStep === 5 ? (
                    "Verify Email"
                  ) : currentStep === 6 ? (
                    <span className="hidden sm:inline">Complete Registration</span>
                  ) : (
                    "Next"
                  )}
                  {currentStep === 4 && <span className="sm:hidden">Send Code</span>}
                  {currentStep === 6 && <span className="sm:hidden">Complete</span>}
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

      {/* Modals */}
      <TermsModal 
        isOpen={showTermsModal} 
        onClose={() => setShowTermsModal(false)} 
      />
      <PrivacyModal 
        isOpen={showPrivacyModal} 
        onClose={() => setShowPrivacyModal(false)} 
      />
    </div>
    </AuthRedirect>
  )
}
