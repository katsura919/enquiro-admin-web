"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Shield, Clock, RotateCcw, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";
import api from "@/utils/api";

function OTPContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { verifyLoginOtp, resendLoginOtp } = useAuth();

  // Get email from URL params (passed from login page)
  const email = searchParams.get("email") || "";
  const type = searchParams.get("type") || "login"; // login, settings_change, etc.

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [backupCode, setBackupCode] = useState("");
  const [useBackupCode, setUseBackupCode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60); // 5 minutes
  const [canResend, setCanResend] = useState(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown timer
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [timeLeft]);

  // Redirect if no email provided
  useEffect(() => {
    if (!email) {
      router.push("/auth/login");
    }
  }, [email, router]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleInputChange = (index: number, value: string) => {
    if (value.length > 1) return; // Only allow single digit
    if (!/^\d*$/.test(value)) return; // Only allow numbers

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      // Focus previous input on backspace if current is empty
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    const newOtp = [...otp];

    for (let i = 0; i < 6; i++) {
      newOtp[i] = pastedData[i] || "";
    }

    setOtp(newOtp);

    // Focus appropriate input
    const nextEmptyIndex = newOtp.findIndex((digit) => !digit);
    if (nextEmptyIndex !== -1) {
      inputRefs.current[nextEmptyIndex]?.focus();
    } else {
      inputRefs.current[5]?.focus();
    }
  };

  const handleBackupCodeChange = (value: string) => {
    // Remove all non-alphanumeric characters
    const cleaned = value.replace(/[^A-Z0-9]/gi, "").toUpperCase();

    // Limit to 8 characters
    const limited = cleaned.slice(0, 8);

    // Format with dash after 4 characters
    let formatted = limited;
    if (limited.length > 4) {
      formatted = limited.slice(0, 4) + "-" + limited.slice(4);
    }

    setBackupCode(formatted);
  };

  const handleVerifyOtp = async () => {
    const otpCode = useBackupCode ? backupCode.replace("-", "") : otp.join("");

    if (useBackupCode) {
      // Check if the formatted backup code has 9 characters (8 chars + 1 dash)
      if (backupCode.replace("-", "").length !== 8) {
        toast.error("Please enter a complete 8-character backup code");
        return;
      }
    } else {
      if (otpCode.length !== 6) {
        toast.error("Please enter a complete 6-digit code");
        return;
      }
    }

    setIsLoading(true);

    try {
      if (type === "login") {
        // For login OTP verification - use auth context
        await verifyLoginOtp(email, otpCode);
        // Success handling is done in the auth context (redirect to dashboard)
      } else {
        // For other OTP types (settings, etc.)
        // This would be used when implementing OTP for settings changes
        const response = await api.post("/user/otp/verify", {
          otpCode,
          type,
        });

        toast.success("Verification successful!");
        // Handle success based on type
        router.back();
      }
    } catch (error: any) {
      console.error("OTP verification error:", error);
      toast.error(error.message || "Invalid or expired code");

      // Clear inputs on error
      if (useBackupCode) {
        setBackupCode("");
      } else {
        setOtp(["", "", "", "", "", ""]);
        inputRefs.current[0]?.focus();
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setIsResending(true);

    try {
      if (type === "login") {
        // Resend login OTP
        await api.post("/auth/resend-login-otp", { email });
      } else {
        // Resend settings OTP
        await api.post("/user/otp/send-settings-otp");
      }

      toast.success("New verification code sent to your email");
      setTimeLeft(300); // Reset timer
      setCanResend(false);
      setOtp(["", "", "", "", "", ""]); // Clear current input
      setBackupCode("");
      setUseBackupCode(false); // Reset to OTP mode
      inputRefs.current[0]?.focus();
    } catch (error: any) {
      console.error("Resend OTP error:", error);
      toast.error(error.response?.data?.error || "Failed to resend code");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-black relative overflow-hidden">
      {/* Background Grid */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background: "#000000",
          backgroundImage: `
            linear-gradient(to right, rgba(59, 130, 246, 0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/50 z-0"></div>

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/3 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="flex min-h-screen relative z-10 items-center justify-center">
        {/* Main Content */}
        <div className="w-full max-w-xl flex flex-col items-center justify-center p-8 relative">
          {/* OTP Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full max-w-md space-y-8"
          >
            {/* Header */}
            <div className="space-y-4 text-center">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 backdrop-blur-sm">
                <Shield className="w-4 h-4 text-blue-400 mr-2" />
                <span className="text-sm font-medium text-blue-300">
                  Two-Factor Authentication
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600">
                  {useBackupCode
                    ? "Enter Backup Code"
                    : "Enter Verification Code"}
                </span>
              </h1>

              <div className="space-y-2">
                {useBackupCode ? (
                  <p className="text-gray-300 text-lg">
                    Enter one of your 8-character backup codes
                  </p>
                ) : (
                  <>
                    <p className="text-gray-300 text-lg">
                      We've sent a 6-digit verification code to
                    </p>
                    <p className="text-blue-400 font-medium text-lg">{email}</p>
                  </>
                )}
              </div>
            </div>

            {/* OTP/Backup Code Input */}
            <div className="space-y-6">
              {useBackupCode ? (
                /* Backup Code Input */
                <div className="flex justify-center">
                  <Input
                    type="text"
                    maxLength={9}
                    value={backupCode}
                    onChange={(e) => handleBackupCodeChange(e.target.value)}
                    placeholder="XXXX-XXXX"
                    className="w-full max-w-xs h-14 text-center text-2xl font-bold bg-white/5 border-blue-500/30 text-white focus:border-blue-400 focus:ring-blue-400/20 backdrop-blur-sm transition-all duration-200 tracking-widest uppercase"
                    autoFocus
                  />
                </div>
              ) : (
                /* OTP Input */
                <div className="flex justify-center gap-3">
                  {otp.map((digit, index) => (
                    <Input
                      key={index}
                      ref={(el) => {
                        inputRefs.current[index] = el;
                      }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleInputChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      onPaste={handlePaste}
                      className="w-12 h-14 text-center text-2xl font-bold bg-white/5 border-blue-500/30 text-white focus:border-blue-400 focus:ring-blue-400/20 backdrop-blur-sm transition-all duration-200"
                    />
                  ))}
                </div>
              )}

              {/* Toggle Button */}
              <div className="text-center">
                <Button
                  variant="ghost"
                  onClick={() => {
                    setUseBackupCode(!useBackupCode);
                    setOtp(["", "", "", "", "", ""]);
                    setBackupCode("");
                  }}
                  className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 transition-all duration-200 text-sm"
                >
                  {useBackupCode
                    ? "Use verification code instead"
                    : "Use backup code instead"}
                </Button>
              </div>

              {/* Timer - Only show for OTP mode */}
              {!useBackupCode && (
                <div className="text-center">
                  {timeLeft > 0 ? (
                    <div className="flex items-center justify-center gap-2 text-gray-400">
                      <Clock className="w-4 h-4" />
                      <span>Code expires in {formatTime(timeLeft)}</span>
                    </div>
                  ) : (
                    <div className="text-red-400 font-medium">
                      Verification code has expired
                    </div>
                  )}
                </div>
              )}

              {/* Verify Button */}
              <Button
                onClick={handleVerifyOtp}
                disabled={
                  isLoading ||
                  (useBackupCode
                    ? backupCode.replace("-", "").length !== 8
                    : otp.join("").length !== 6)
                }
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold text-base transition-all duration-300 disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                    <span>Verifying...</span>
                  </div>
                ) : (
                  <span className="flex items-center justify-center">
                    <CheckCircle className="mr-2 h-5 w-5" />
                    {useBackupCode ? "Verify Backup Code" : "Verify Code"}
                  </span>
                )}
              </Button>

              {/* Resend Section - Only show for OTP mode */}
              {!useBackupCode && (
                <div className="text-center">
                  {canResend ? (
                    <Button
                      variant="ghost"
                      onClick={handleResendOtp}
                      disabled={isResending}
                      className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 transition-all duration-200"
                    >
                      {isResending ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 rounded-full border-2 border-blue-400/20 border-t-blue-400 animate-spin" />
                          <span>Sending...</span>
                        </div>
                      ) : (
                        <span className="flex items-center">
                          <RotateCcw className="mr-2 h-4 w-4" />
                          Resend Code
                        </span>
                      )}
                    </Button>
                  ) : (
                    <p className="text-gray-400">
                      Didn't receive the code? You can resend it when the timer
                      expires.
                    </p>
                  )}
                </div>
              )}

              {/* Back Button */}
              <Button
                onClick={() => router.back()}
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold text-base transition-all duration-300"
              >
                Back to Login
              </Button>

              {/* Help Text */}
              <div className="text-center text-sm text-gray-400 space-y-2">
                {useBackupCode ? (
                  <p>
                    Enter one of your saved backup codes from when you enabled
                    2FA.
                  </p>
                ) : (
                  <p>Check your email and enter the code above.</p>
                )}
                <p>
                  Having trouble?{" "}
                  <Link
                    href="/support"
                    className="text-blue-400 hover:text-blue-300 transition-colors duration-200"
                  >
                    Contact Support
                  </Link>
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

// Loading fallback component
function OTPPageLoading() {
  return (
    <div className="min-h-screen w-full bg-black flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 rounded-full border-2 border-white/20 border-t-white animate-spin mx-auto mb-4" />
        <p className="text-white/70">Loading verification page...</p>
      </div>
    </div>
  );
}

// Main component wrapped in Suspense
export default function OTPPage() {
  return (
    <Suspense fallback={<OTPPageLoading />}>
      <OTPContent />
    </Suspense>
  );
}
