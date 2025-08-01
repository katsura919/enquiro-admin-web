"use client"

import { Card } from "@/components/ui/card"
import { Loader2, AlertCircle } from "lucide-react"

interface BusinessData {
  _id: string
  name: string
  description: string
  logo: string
}

interface BusinessInfoProps {
  businessData: BusinessData | null
  businessLoading: boolean
}

export default function BusinessInfo({ businessData, businessLoading }: BusinessInfoProps) {
  return (
    <Card className="w-full mt-4 sm:mt-8 mb-4 sm:mb-6 p-4 sm:p-8 flex flex-col items-center bg-white/10 backdrop-blur-xl shadow-2xl border-0 rounded-2xl overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 animate-gradient" />
      
      {businessLoading ? (
        <div className="flex flex-col items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-blue-400 mb-2" />
          <span className="text-gray-300 font-medium">Loading business details...</span>
        </div>
      ) : businessData ? (
        <>
          <div className="relative mb-4 group">
            <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-md transform group-hover:scale-110 transition-transform duration-300" />
            <img
              src={businessData.logo}
              alt={businessData.name}
              className="relative w-24 h-24 rounded-full bg-white/20 p-2 shadow-xl transform group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2 text-center">{businessData.name}</h1>
          <p className="text-gray-300 text-center max-w-lg text-lg leading-relaxed">{businessData.description}</p>
        </>
      ) : (
        <div className="text-red-400 flex items-center gap-2 py-4">
          <AlertCircle className="h-5 w-5" />
          <span>Business information unavailable</span>
        </div>
      )}
    </Card>
  )
}
