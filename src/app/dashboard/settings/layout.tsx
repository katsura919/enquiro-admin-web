"use client"

import { useState, useEffect } from "react"
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
  Menu,
  X,
  ChevronLeft
} from "lucide-react"
import { Button } from "@/components/ui/button"

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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Handle window resize and detect mobile
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024
      setIsMobile(mobile)
      if (!mobile) {
        setIsSidebarOpen(false) // Close mobile sidebar when switching to desktop
      }
    }
    
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Close sidebar when route changes on mobile
  useEffect(() => {
    if (isMobile) {
      setIsSidebarOpen(false)
    }
  }, [pathname, isMobile])

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  return (
    <div className="flex min-h-screen relative">
      {/* Mobile Overlay */}
      {isMobile && isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Mobile Header */}
      {isMobile && (
        <div className="fixed top-0 left-0 right-0 h-16 bg-card/95 backdrop-blur-lg border-b z-30 flex items-center px-4">
          <Link
            href="/dashboard"
            className="mr-3 p-2 hover:bg-muted/50 rounded-md transition-colors"
          >
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleSidebar}
            className="mr-4"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="font-semibold text-foreground">Settings</h1>
        </div>
      )}

      {/* Settings Sidebar */}
      <div
        className={cn(
          "bg-card backdrop-blur-lg border-r z-50 transition-transform duration-300 ease-in-out",
          isMobile
            ? "fixed top-0 left-0 h-full w-80 transform"
            : "w-80 relative",
          isMobile && isSidebarOpen
            ? "translate-x-0"
            : isMobile
            ? "-translate-x-full"
            : "translate-x-0"
        )}
      >
        <div className="p-6">
          {/* Mobile Close Button */}
          {isMobile && (
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-foreground">Settings</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsSidebarOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          )}

          <p className="text-sm text-muted-foreground mb-6">
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
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  )}
                  onClick={() => isMobile && setIsSidebarOpen(false)}
                >
                  <item.icon className="h-5 w-5 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div className="font-medium truncate">{item.name}</div>
                    <div className="text-xs opacity-70 truncate">{item.description}</div>
                  </div>
                </Link>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-auto">
        <div
          className={cn(
            "max-w-4xl mx-auto px-6",
            isMobile ? "pt-24 pb-8" : "py-8"
          )}
        >
          {children}
        </div>
      </div>
    </div>
  )
} 