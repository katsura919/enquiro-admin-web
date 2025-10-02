"use client"

interface LoadingScreenProps {
  title?: string
  subtitle?: string
}

export default function LoadingScreen({ 
  subtitle = "Please wait while we prepare your experience." 
}: LoadingScreenProps) {
  return (
    <div className="min-h-screen w-full bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-6"></div>
        <p className="text-gray-400">{subtitle}</p>
      </div>
    </div>
  )
}
