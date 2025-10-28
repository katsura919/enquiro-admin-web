"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Building,
  User,
  Lock,
  Mail,
  Shield,
  CheckCircle,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { GridPattern } from "@/components/ui/grid-pattern";
import { useAuth } from "@/lib/auth";
import AuthRedirect from "@/components/auth-redirect";
import { motion } from "framer-motion";
import Lottie from "lottie-react";
import registrationAnimation from "../../../../public/animations/registration.json";
import Navbar from "@/components/hero-page/nav-bar";
import Footer from "@/components/hero-page/footer";
import TermsModal from "./component/TermsModal";
import PrivacyModal from "./component/PrivacyModal";
import {
  BusinessInfoStep,
  PersonalDetailsStep,
  CreatePasswordStep,
  EmailAddressStep,
  VerifyEmailStep,
  TermsAgreementStep,
  RegistrationCompleteStep,
} from "./component/steps";

type RegistrationStep = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export default function RegisterPage() {
  const router = useRouter();
  const { register, verifyCode, completeRegistration, resendCode } = useAuth();
  const [currentStep, setCurrentStep] = useState<RegistrationStep>(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSettingUp, setIsSettingUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  // Form state
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [address, setAddress] = useState("");
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [registeredEmail, setRegisteredEmail] = useState("");
  const [isResending, setIsResending] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [codeDigits, setCodeDigits] = useState(["", "", "", "", "", ""]);

  // Timer effect for resend functionality
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const stepIcons = {
    1: Building,
    2: User,
    3: Lock,
    4: Mail,
    5: Mail, // Verification step
    6: Shield,
    7: CheckCircle,
  };

  const stepTitles = {
    1: "Business Information",
    2: "Personal Details",
    3: "Create Password",
    4: "Email Address",
    5: "Verify Your Email",
    6: "Terms & Agreements",
    7: "Registration Complete",
  };

  const stepDescriptions = {
    1: "Tell us about your business",
    2: "Tell us your name",
    3: "Create a secure password",
    4: "Enter your email address",
    5: "Enter the 6-digit code sent to your email",
    6: "Review and accept our terms",
    7: "Welcome to Enquiro!",
  };

  const validateStep = (step: RegistrationStep): boolean => {
    setErrors({});

    switch (step) {
      case 1:
        const businessErrors: Record<string, string> = {};
        if (!businessName.trim()) {
          businessErrors.businessName = "Please enter your business name";
        }
        if (!description.trim()) {
          businessErrors.description = "Please enter a business description";
        }
        if (!category.trim()) {
          businessErrors.category = "Please enter a business category";
        }
        if (!address.trim()) {
          businessErrors.address = "Please enter your business address";
        }
        if (Object.keys(businessErrors).length > 0) {
          setErrors(businessErrors);
          return false;
        }
        return true;
      case 2:
        const newErrors: Record<string, string> = {};
        if (!firstName.trim()) {
          newErrors.firstName = "Please enter your first name";
        }
        if (!lastName.trim()) {
          newErrors.lastName = "Please enter your last name";
        }
        if (Object.keys(newErrors).length > 0) {
          setErrors(newErrors);
          return false;
        }
        return true;
      case 3:
        const passwordErrors: Record<string, string> = {};
        if (!password) {
          passwordErrors.password = "Please enter a password";
        } else if (password.length < 8) {
          passwordErrors.password =
            "Password must be at least 8 characters long";
        } else if (
          !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/.test(password)
        ) {
          passwordErrors.password =
            "Password must contain at least one uppercase letter, one lowercase letter, and one number";
        }
        if (!confirmPassword) {
          passwordErrors.confirmPassword = "Please confirm your password";
        } else if (password !== confirmPassword) {
          passwordErrors.confirmPassword = "Passwords do not match";
        }
        if (Object.keys(passwordErrors).length > 0) {
          setErrors(passwordErrors);
          return false;
        }
        return true;
      case 4:
        if (!email) {
          setErrors({ email: "Please enter your email address" });
          return false;
        }
        if (!/\S+@\S+\.\S+/.test(email)) {
          setErrors({ email: "Please enter a valid email address" });
          return false;
        }
        return true;
      case 5:
        if (!verificationCode.trim()) {
          setErrors({ verificationCode: "Please enter the verification code" });
          return false;
        }
        if (verificationCode.length !== 6) {
          setErrors({ verificationCode: "Verification code must be 6 digits" });
          return false;
        }
        return true;
      case 6:
        if (!agreeToTerms) {
          setErrors({
            terms: "Please accept the Terms of Service and Privacy Policy",
          });
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const handleNext = async () => {
    if (!validateStep(currentStep)) return;

    if (currentStep === 4) {
      // After email step, submit registration and get verification code
      await handleRegistrationSubmit();
    } else if (currentStep === 5) {
      // Verify code but don't complete registration yet
      await handleVerificationSubmit();
    } else if (currentStep === 6) {
      // Final step - complete registration with terms agreement
      await handleFinalSubmit();
    } else if (currentStep < 6) {
      setCurrentStep((prev) => (prev + 1) as RegistrationStep);
    }
  };

  const handleBack = () => {
    if (currentStep > 1 && currentStep !== 4) {
      setCurrentStep((prev) => (prev - 1) as RegistrationStep);
      setErrors({});
    }
  };

  const handleRegistrationSubmit = async () => {
    setIsLoading(true);
    setErrors({});

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
      });

      setRegisteredEmail(result.email);
      setResendTimer(60); // Start 60 second timer
      setCurrentStep(5); // Move to verification step
    } catch (err) {
      setErrors({
        general: err instanceof Error ? err.message : "An error occurred",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerificationSubmit = async () => {
    setIsLoading(true);
    setErrors({});

    try {
      const result = await verifyCode(registeredEmail, verificationCode);

      if (result.verified) {
        setCurrentStep(6); // Move to terms step
      }
    } catch (err) {
      setErrors({
        general: err instanceof Error ? err.message : "An error occurred",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFinalSubmit = async () => {
    setIsLoading(true);
    setErrors({});

    try {
      const startTime = Date.now();

      // Complete registration with terms acceptance
      await completeRegistration(registeredEmail);

      setCurrentStep(7); // Move to success step

      // Ensure the success screen is visible for at least 2 seconds
      const elapsedTime = Date.now() - startTime;
      const minimumDisplayTime = 2000; // 2 seconds
      const remainingTime = Math.max(0, minimumDisplayTime - elapsedTime);

      setTimeout(() => {
        router.push("/dashboard"); // Go to dashboard
      }, remainingTime + 1000); // Add extra 1 second for better UX
    } catch (err) {
      setErrors({
        general: err instanceof Error ? err.message : "An error occurred",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (resendTimer > 0 || isResending) return;

    setIsResending(true);
    setErrors({});

    try {
      await resendCode(registeredEmail);
      setResendTimer(60); // Reset timer to 60 seconds
      // Clear current digits
      setCodeDigits(["", "", "", "", "", ""]);
      setVerificationCode("");
    } catch (err) {
      setErrors({
        general: err instanceof Error ? err.message : "Failed to resend code",
      });
    } finally {
      setIsResending(false);
    }
  };

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
        );
      case 2:
        return (
          <PersonalDetailsStep
            firstName={firstName}
            setFirstName={setFirstName}
            lastName={lastName}
            setLastName={setLastName}
            errors={errors}
          />
        );
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
        );
      case 4:
        return (
          <EmailAddressStep email={email} setEmail={setEmail} errors={errors} />
        );
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
        );
      case 6:
        return (
          <TermsAgreementStep
            agreeToTerms={agreeToTerms}
            setAgreeToTerms={setAgreeToTerms}
            onShowTermsModal={() => setShowTermsModal(true)}
            onShowPrivacyModal={() => setShowPrivacyModal(true)}
            errors={errors}
          />
        );
      case 7:
        return <RegistrationCompleteStep />;
      default:
        return null;
    }
  };

  return (
    <AuthRedirect>
      <div className="min-h-screen bg-black flex flex-col">
        {/* Enhanced Grid Background with Animation */}
        <div
          className="fixed inset-0 z-0"
          style={{
            background: "#000000",
            backgroundImage: `
              linear-gradient(to right, rgba(59, 130, 246, 0.1) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
            animation: "grid-move 20s linear infinite",
          }}
        />

        {/* Floating Elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-40 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 left-1/3 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
        </div>

        {/* Custom Animation Styles */}
        <style jsx>{`
          @keyframes grid-move {
            0% {
              transform: translate(0, 0);
            }
            100% {
              transform: translate(60px, 60px);
            }
          }
        `}</style>

        {/* Mobile Navigation */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="lg:hidden bg-black/95 backdrop-blur-sm border-b border-blue-500/20 px-4 py-3 relative z-20"
        >
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/logo.png"
                alt="Enquiro Logo"
                width={24}
                height={24}
              />
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600">
                Enquiro
              </span>
            </Link>
            <Link
              href="/auth/login"
              className="text-sm text-blue-400 hover:text-blue-300 font-medium transition-colors duration-200"
            >
              Sign In
            </Link>
          </div>
        </motion.div>

        {/* Desktop Navbar */}
        <div className="hidden lg:block relative z-20">
          <Navbar />
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col lg:flex-row relative z-10">
          {/* Left Side - Illustration/Content Area */}
          <div className="hidden lg:flex lg:w-2/5 xl:w-1/2 relative overflow-hidden bg-black">
            <GridPattern />

            {/* Content Overlay */}
            <div className="relative z-10 flex items-center justify-center px-8 lg:px-12 xl:px-16 h-full w-full">
              {/* Main Content Container */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="max-w-md w-full text-center"
              >
                {/* Badge */}
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 backdrop-blur-sm mb-6">
                  <Sparkles className="w-4 h-4 text-blue-400 mr-2" />
                  <span className="text-sm font-medium text-blue-300">
                    Join Enquiro Today
                  </span>
                </div>

                {/* Lottie Animation - Enhanced */}
                <div className="flex justify-center mb-8">
                  <div className="relative">
                    {/* Glow Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl"></div>
                    <div className="relative w-48 h-48 lg:w-56 lg:h-56">
                      <Lottie
                        animationData={registrationAnimation}
                        loop={true}
                        className="w-full h-full filter brightness-110"
                      />
                    </div>
                  </div>
                </div>

                {/* Heading and Description - Enhanced */}
                <div className="space-y-4 mb-6">
                  <h1 className="text-2xl lg:text-3xl xl:text-4xl font-bold leading-tight tracking-tight">
                    <span className="text-white">Join </span>
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600">
                      Enquiro
                    </span>
                  </h1>
                  <p className="text-sm lg:text-base text-gray-300 leading-relaxed">
                    Transform your customer support with intelligent AI chatbots
                    designed for modern businesses.
                  </p>
                </div>

                {/* Enhanced Steps Indicator */}
                <div className="flex justify-center items-center space-x-2 mb-6">
                  {[1, 2, 3, 4, 5, 6].map((step) => (
                    <div
                      key={step}
                      className={`transition-all duration-300 rounded-full ${
                        step === currentStep
                          ? "bg-gradient-to-r from-blue-500 to-blue-600 w-6 h-2 shadow-lg"
                          : step < currentStep
                          ? "bg-gradient-to-r from-blue-400 to-blue-500 w-2 h-2"
                          : "bg-white/30 w-2 h-2"
                      }`}
                    />
                  ))}
                </div>

                {/* Enhanced Bottom accent */}
                <div className="pt-4 border-t border-white/10">
                  <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span>Join 10,000+ businesses already using Enquiro</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Right Side - Form Area */}
          <div className="w-full lg:w-3/5 xl:w-1/2 bg-black flex flex-col min-h-screen lg:min-h-auto">
            {/* Mobile Step Progress */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="lg:hidden bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-sm px-4 py-3 border-b border-blue-500/20"
            >
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-300 font-medium">
                  Step {currentStep} of 6
                </div>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5, 6].map((step) => (
                    <div
                      key={step}
                      className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                        step === currentStep
                          ? "bg-blue-500"
                          : step < currentStep
                          ? "bg-blue-400"
                          : "bg-gray-600"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Form Content Container */}
            <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="w-full max-w-md"
              >
                {/* Mobile Header */}
                <div className="lg:hidden text-center mb-6">
                  <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 backdrop-blur-sm mb-4">
                    <Shield className="w-4 h-4 text-blue-400 mr-2" />
                    <span className="text-sm font-medium text-blue-300">
                      Secure Registration
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-white mb-1">
                    Join Enquiro
                  </h2>
                  <p className="text-sm text-gray-400">
                    {stepDescriptions[currentStep]}
                  </p>
                </div>

                {/* Error Message */}
                {errors.general && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mb-4 p-3 text-sm bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 backdrop-blur-sm"
                  >
                    {errors.general}
                  </motion.div>
                )}

                {/* Form Content */}
                <div className="mb-6">{renderStepContent()}</div>

                {/* Navigation Buttons */}
                {currentStep !== 7 && (
                  <div className="space-y-3">
                    {/* Primary Action Button */}
                    <Button
                      onClick={handleNext}
                      disabled={isLoading}
                      className="group relative w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white h-11 text-base font-medium transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                      {isLoading ? (
                        <span className="relative flex items-center justify-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white mr-2"></div>
                          Processing...
                        </span>
                      ) : (
                        <span className="relative">
                          {currentStep === 4
                            ? "Send Verification Code"
                            : currentStep === 5
                            ? "Verify Email"
                            : currentStep === 6
                            ? "Complete Registration"
                            : "Continue"}
                        </span>
                      )}
                    </Button>

                    {/* Back Button */}
                    {currentStep > 1 && (
                      <Button
                        onClick={handleBack}
                        variant="ghost"
                        className="w-full text-gray-400 hover:text-white hover:bg-white/10 h-11 text-base font-medium transition-all duration-200"
                      >
                        Back
                      </Button>
                    )}
                  </div>
                )}
              </motion.div>
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
  );
}
