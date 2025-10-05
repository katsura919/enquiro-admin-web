"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Building, User, Lock, Mail, Shield, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { GridPattern } from "@/components/ui/grid-pattern"
import { useAuth } from "@/lib/auth"
import AuthRedirect from "@/components/auth-redirect"
import Lottie from "lottie-react"
import registrationAnimation from "../../../../public/animations/registration.json"
import Navbar from "@/components/hero-page/nav-bar"
import Footer from "@/components/hero-page/footer"
import TermsModal from "./component/TermsModal"
import PrivacyModal from "./component/PrivacyModal"
import {
  BusinessInfoStep,
  PersonalDetailsStep,
  CreatePasswordStep,
  EmailAddressStep,
  VerifyEmailStep,
  TermsAgreementStep,
  RegistrationCompleteStep
} from "./component/steps"

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
          <BusinessInfoStep
            businessName={businessName}
            setBusinessName={setBusinessName}
            category={category}
            setCategory={setCategory}
            description={description}
            setDescription={setDescription}
            address={address}
            setAddress={setAddress}
            errors={errors}
          />
        )
      case 2:
        return (
          <PersonalDetailsStep
            firstName={firstName}
            setFirstName={setFirstName}
            lastName={lastName}
            setLastName={setLastName}
            errors={errors}
          />
        )
      case 3:
        return (
          <CreatePasswordStep
            password={password}
            setPassword={setPassword}
            confirmPassword={confirmPassword}
            setConfirmPassword={setConfirmPassword}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            showConfirmPassword={showConfirmPassword}
            setShowConfirmPassword={setShowConfirmPassword}
            errors={errors}
          />
        )
      case 4:
        return (
          <EmailAddressStep
            email={email}
            setEmail={setEmail}
            errors={errors}
          />
        )
      case 5:
        return (
          <VerifyEmailStep
            registeredEmail={registeredEmail}
            codeDigits={codeDigits}
            setCodeDigits={setCodeDigits}
            setVerificationCode={setVerificationCode}
            errors={errors}
            resendTimer={resendTimer}
            isResending={isResending}
            onResendCode={handleResendCode}
          />
        )
      case 6:
        return (
          <TermsAgreementStep
            agreeToTerms={agreeToTerms}
            setAgreeToTerms={setAgreeToTerms}
            onShowTermsModal={() => setShowTermsModal(true)}
            onShowPrivacyModal={() => setShowPrivacyModal(true)}
            errors={errors}
          />
        )
      case 7:
        return <RegistrationCompleteStep />
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
