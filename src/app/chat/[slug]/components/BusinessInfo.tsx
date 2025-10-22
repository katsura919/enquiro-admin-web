"use client"

import { Card } from "@/components/ui/card"
import { Loader2, AlertCircle } from "lucide-react"

interface BusinessData {
  _id: string
  name: string
  description: string
  logo: string
}

interface ChatbotSettings {
  _id: string
  businessId: string
  chatbotName: string
  chatbotIcon: string
  enableLiveChat: boolean
  createdAt: string
  updatedAt: string
}

interface BusinessInfoProps {
  businessData: BusinessData | null
  businessLoading: boolean
  chatbotSettings: ChatbotSettings | null
  chatbotSettingsLoading: boolean
}

export default function BusinessInfo({ businessData, businessLoading, chatbotSettings, chatbotSettingsLoading }: BusinessInfoProps) {
  const isLoading = businessLoading || chatbotSettingsLoading
  const chatbotName = chatbotSettings?.chatbotName || "AI Assistant"
  const chatbotIcon = chatbotSettings?.chatbotIcon 
  
  return (
    <div className="w-full mb-8 p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-10">
          <Loader2 className="h-10 w-10 animate-spin text-slate-600 dark:text-slate-400 mb-4" />
          <span className="text-slate-600 dark:text-slate-400 font-medium">Loading business details...</span>
        </div>
      ) : businessData ? (
        <div className="flex items-center space-x-6">
          <div className="relative">
            <img
              src={chatbotIcon}
              alt={chatbotName}
              className="w-20 h-20 rounded-2xl object-cover border-2 border-slate-200 dark:border-slate-700 shadow-sm"
            />
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full border-3 border-white dark:border-slate-900 shadow-sm" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 truncate mb-2">{chatbotName}</h1>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{businessData.name}</p>
          </div>
        </div>
      ) : (
        <div className="text-red-600 dark:text-red-400 flex items-center justify-center gap-3 py-6">
          <AlertCircle className="h-5 w-5" />
          <span className="font-medium">Business information unavailable</span>
        </div>
      )}
    </div>
  )
}
