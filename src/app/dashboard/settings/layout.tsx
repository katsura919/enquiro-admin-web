"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  Settings,
  Building2,
  Bot,
  User,
  Bell,
  Shield,
  CreditCard,
  Users,
} from "lucide-react"

const navigation = [
  {
    name: "General",
    href: "/dashboard/settings",
    icon: Settings,
    description: "Basic settings and preferences",
  },
  {
    name: "Account",
    href: "/dashboard/settings/account",
    icon: User,
    description: "Your personal account settings",
  },
  {
    name: "Business",
    href: "/dashboard/settings/business",
    icon: Building2,
    description: "Business profile and branding",
  },
  {
    name: "Team",
    href: "/dashboard/settings/team",
    icon: Users,
    description: "Manage team members and roles",
  },
  {
    name: "Chatbot",
    href: "/dashboard/settings/chatbot",
    icon: Bot,
    description: "Configure chatbot behavior",
  },
  {
    name: "Notifications",
    href: "/dashboard/settings/notifications",
    icon: Bell,
    description: "Notification preferences",
  },
  {
    name: "Security",
    href: "/dashboard/settings/security",
    icon: Shield,
    description: "Security and access settings",
  },
  {
    name: "Billing",
    href: "/dashboard/settings/billing",
    icon: CreditCard,
    description: "Subscription and billing",
  },
]

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  return (
    <div className="flex min-h-screen">
      {/* Settings Sidebar */}
      <div className="w-80 border-r bg-card backdrop-blur-lg">
        <div className="p-6">
          <p className="text-sm text-gray-400 mb-6">
            Manage your account and preferences
          </p>

          <nav className="space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 text-sm rounded-lg transition-colors",
                    isActive
                      ? "bg-blue-500 text-white"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  <div>
                    <div className="font-medium">{item.name}</div>
                    <div className="text-xs opacity-70">{item.description}</div>
                  </div>
                </Link>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-4xl mx-auto py-8 px-6">
          {children}
        </div>
      </div>
    </div>
  )
} 