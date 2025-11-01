"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Eye,
  EyeOff,
  ArrowRight,
  Shield,
  Clock,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/auth";
import AuthRedirect from "@/components/auth-redirect";
import { motion } from "framer-motion";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Rate limiting state
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);
  const [attemptsLeft, setAttemptsLeft] = useState(3);
  const [rateLimitError, setRateLimitError] = useState("");

  // Form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Timer effect for countdown
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRateLimited && remainingTime > 0) {
      interval = setInterval(() => {
        setRemainingTime((prev) => {
          if (prev <= 1) {
            setIsRateLimited(false);
            setRateLimitError("");
            setAttemptsLeft(3); // Reset attempts when rate limit expires
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRateLimited, remainingTime]);

  // Format time display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Don't submit if rate limited
    if (isRateLimited) return;

    setError("");
    setRateLimitError("");
    setIsLoading(true);

    try {
      const result = await login(email, password);

      // Check if OTP is required
      if (result.requiresOtp) {
        // Redirect to OTP page with email parameter
        router.push(
          `/auth/otp?email=${encodeURIComponent(
            result.email || email
          )}&type=login`
        );
        return;
      }

      // Reset rate limit state on successful login (handled in auth context)
      setAttemptsLeft(3);
      setIsRateLimited(false);
      setRemainingTime(0);
      // router.push("/dashboard"); // This is handled in the auth context
    } catch (err) {
      if (err instanceof Error) {
        // Check if it's a rate limit error (429 status)
        if (
          err.message.includes("Too many") ||
          err.message.includes("rate limit")
        ) {
          setIsRateLimited(true);
          setRemainingTime(60); // 1 minute as per backend config
          setRateLimitError(err.message);
          setAttemptsLeft(0);
        } else {
          // Regular login error - decrease attempts left
          setAttemptsLeft((prev) => Math.max(0, prev - 1));
          setError(err.message);

          // Show warning when getting close to rate limit
          if (attemptsLeft <= 2) {
            setError(`${err.message} (${attemptsLeft - 1} attempts remaining)`);
          }
        }
      } else {
        setError("An error occurred");
        setAttemptsLeft((prev) => Math.max(0, prev - 1));
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthRedirect>
      <div className="min-h-screen w-full bg-black relative overflow-hidden">
        {/* Enhanced Grid Background with Animation */}
        <div
          className="absolute inset-0 z-0"
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

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/50 z-0"></div>

        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
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

        <div className="flex min-h-screen relative z-10">
          {/* Left Side - Login Form */}
          <div className="flex-1 flex flex-col items-center justify-center p-8 relative">
            {/* Logo/Brand top left */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Link
                href="/"
                className="absolute top-8 left-8 flex items-center gap-2 group"
              >
                <Image
                  src="/logo.png"
                  alt="Enquiro Logo"
                  width={32}
                  height={32}
                  className="group-hover:opacity-80 transition-opacity"
                />
                <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600 group-hover:from-blue-300 group-hover:to-blue-500 transition-all duration-200">
                  Enquiro
                </span>
              </Link>
            </motion.div>

            {/* Login Form Centered */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="w-full max-w-md space-y-8"
            >
              {/* Welcome Text */}
              <div className="space-y-4 text-center">
                {/* Badge */}
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 backdrop-blur-sm">
                  <Shield className="w-4 h-4 text-blue-400 mr-2" />
                  <span className="text-sm font-medium text-blue-300">
                    Secure Login
                  </span>
                </div>

                <h1 className="text-4xl md:text-5xl font-bold">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600">
                    Welcome Back
                  </span>
                </h1>
                <p className="text-gray-300 text-lg">
                  Enter your credentials to access your dashboard and manage
                  your customer support platform.
                </p>
              </div>

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Rate Limit Error */}
                {isRateLimited && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg backdrop-blur-sm"
                  >
                    <div className="flex items-center space-x-3">
                      <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm text-red-400 font-medium">
                          Too many login attempts
                        </p>
                        <p className="text-xs text-red-300 mt-1">
                          Please wait before trying again
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Regular Error */}
                {error && !isRateLimited && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-4 text-sm bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 backdrop-blur-sm"
                  >
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                      <span>{error}</span>
                    </div>
                  </motion.div>
                )}

                {/* Attempts Warning */}
                {!isRateLimited && attemptsLeft <= 2 && attemptsLeft > 0 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg backdrop-blur-sm"
                  >
                    <div className="flex items-center space-x-2">
                      <Shield className="w-4 h-4 text-amber-400" />
                      <span className="text-sm text-amber-400">
                        {attemptsLeft} attempt{attemptsLeft !== 1 ? "s" : ""}{" "}
                        remaining before temporary lockout
                      </span>
                    </div>
                  </motion.div>
                )}

                {/* Email Field */}
                <div className="space-y-2">
                  <label
                    className="text-sm font-medium text-gray-300"
                    htmlFor="email"
                  >
                    Email Address
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="username"
                    placeholder="Enter your email"
                    className="h-12 bg-white/5 border-blue-500/30 text-white placeholder:text-gray-500 focus:border-blue-400 focus:ring-blue-400/20 backdrop-blur-sm transition-all duration-200"
                  />
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <label
                    className="text-sm font-medium text-gray-300"
                    htmlFor="password"
                  >
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
                      placeholder="Enter your password"
                      className="h-12 bg-white/5 border-blue-500/30 text-white placeholder:text-gray-500 focus:border-blue-400 focus:ring-blue-400/20 pr-12 backdrop-blur-sm transition-all duration-200"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-400 transition-colors duration-200"
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
                  <label className="flex items-center space-x-2 text-sm text-gray-300 cursor-pointer">
                    <input
                      type="checkbox"
                      className="rounded border-blue-500/30 bg-white/5 text-blue-500 focus:ring-blue-400/20 focus:ring-offset-0"
                    />
                    <span>Remember me</span>
                  </label>
                  <Link
                    href="/auth/forgot-password"
                    className="text-sm text-blue-400 hover:text-blue-300 transition-colors duration-200 font-medium"
                  >
                    Forgot password?
                  </Link>
                </div>

                {/* Login Button */}
                <Button
                  type="submit"
                  className="group relative w-full h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold text-base transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:scale-100"
                  disabled={isLoading || isRateLimited}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                  {isRateLimited ? (
                    <div className="flex items-center space-x-2">
                      <Clock className="w-5 h-5" />
                      <span>Locked - {formatTime(remainingTime)}</span>
                    </div>
                  ) : isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-5 h-5 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                      <span>Signing in...</span>
                    </div>
                  ) : (
                    <span className="relative flex items-center justify-center">
                      Sign In
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
                    </span>
                  )}
                </Button>

                {/* Register Link */}
                <div className="text-center text-gray-400">
                  Don't have an account?{" "}
                  <Link
                    href="/auth/register"
                    className="text-blue-400 hover:text-blue-300 transition-colors duration-200 font-medium hover:underline"
                  >
                    Create account
                  </Link>
                </div>
              </form>
            </motion.div>
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
                    <div className="text-2xl font-bold text-white">
                      $189,374
                    </div>
                  </div>
                  <div className="bg-white/20 rounded-lg p-4">
                    <div className="text-white/60 text-sm">Active Time</div>
                    <div className="text-2xl font-bold text-white">
                      00:01:30
                    </div>
                  </div>
                </div>

                {/* Chart Area */}
                <div className="bg-white/20 rounded-lg p-4">
                  <div className="text-white/60 text-sm mb-2">Performance</div>
                  <div className="h-20 bg-white/10 rounded flex items-end justify-between p-2">
                    <div
                      className="w-8 bg-blue-400 rounded-sm"
                      style={{ height: "60%" }}
                    ></div>
                    <div
                      className="w-8 bg-blue-400 rounded-sm"
                      style={{ height: "80%" }}
                    ></div>
                    <div
                      className="w-8 bg-blue-400 rounded-sm"
                      style={{ height: "40%" }}
                    ></div>
                    <div
                      className="w-8 bg-blue-400 rounded-sm"
                      style={{ height: "90%" }}
                    ></div>
                    <div
                      className="w-8 bg-blue-400 rounded-sm"
                      style={{ height: "70%" }}
                    ></div>
                  </div>
                </div>

                {/* Team Stats */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/80">Team Performance</span>
                    <span className="text-white">6,248 Units</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2">
                    <div
                      className="bg-white rounded-full h-2"
                      style={{ width: "75%" }}
                    ></div>
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
      </div>
    </AuthRedirect>
  );
}
