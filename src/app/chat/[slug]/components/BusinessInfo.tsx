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
    <Card className="w-full mb-6 p-6 border border-border/50 shadow-sm">
      {businessLoading ? (
        <div className="flex flex-col items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mb-3" />
          <span className="text-muted-foreground font-medium">Loading business details...</span>
        </div>
      ) : businessData ? (
        <div className="flex items-center space-x-4">
          <div className="relative">
            <img
              src={businessData.logo}
              alt={businessData.name}
              className="w-16 h-16 rounded-full object-cover border-2 border-border/50"
            />
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-background" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-semibold text-foreground truncate">{businessData.name}</h1>
            <p className="text-muted-foreground mt-1 leading-relaxed">{businessData.description}</p>
          </div>
        </div>
      ) : (
        <div className="text-destructive flex items-center justify-center gap-2 py-4">
          <AlertCircle className="h-5 w-5" />
          <span>Business information unavailable</span>
        </div>
      )}
    </Card>
  )
}
