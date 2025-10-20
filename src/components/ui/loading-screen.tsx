"use client"

import Lottie from "lottie-react"
import loadingAnimation from "../../../public/animations/loading.json"

export default function LoadingScreen() {
  return (
    <div className="min-h-screen w-full bg-background flex items-center justify-center">
      <div className="w-100 h-100">
        <Lottie 
          animationData={loadingAnimation} 
          loop={true}
          autoplay={true}
        />
      </div>
    </div>
  )
}
