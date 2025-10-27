"use client"

import Lottie from "lottie-react"
import loadingAnimation from "../../../public/animations/loading.json"

interface LoadingScreenProps {
  subtitle?: string
}

export default function LoadingScreen({ 
  subtitle = "Please wait while we prepare your experience." 
}: LoadingScreenProps) {
  return (
    <div className="min-h-screen w-full bg-background flex items-center justify-center">
      <div className="text-center">
        <div className=" mx-auto">
          <div className="animate-spin rounded-full h-25 w-25 border-b-5 border-blue-500 mx-auto mb-6"></div>
        </div>
        <p className="text-gray-400 ">{subtitle}</p>
      </div>
    </div>
  )
}
