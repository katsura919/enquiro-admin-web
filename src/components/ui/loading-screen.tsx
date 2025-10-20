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
        <div className="w-80 h-80 mx-auto">
          <Lottie 
            animationData={loadingAnimation} 
            loop={true}
            autoplay={true}
          />
        </div>
        <p className="text-gray-400 mt-4">{subtitle}</p>
      </div>
    </div>
  )
}
