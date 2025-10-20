"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import Lottie from "lottie-react"
import { Button } from "@/components/ui/button"
import { Home, ArrowLeft } from "lucide-react"
import notfoundAnimation from "../../public/animations/not-found.json"

export default function NotFound() {
  const router = useRouter()

  return (
    <div className="min-h-screen w-full bg-background flex items-center justify-center p-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="space-y-4">
          <div className="w-80 h-80 mx-auto">
            <Lottie 
              animationData={notfoundAnimation} 
              loop={true}
              autoplay={true}
            />
          </div>
          <p className="text-gray-400 text-lg">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
          <Button
            asChild
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 cursor-pointer"
          >
            <Link href="/">
             
              Go Home
            </Link>
          </Button>
          <Button
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 cursor-pointer"
            onClick={() => router.back()}
          >
        
            Go Back
          </Button>
        </div>
      </div>
    </div>
  )
}
