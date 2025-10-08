"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Settings, Building2, Bot, User, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"

const settingsNavigation = [
  {
    name: "Account & Security",
    href: "/dashboard/settings",
    icon: User,
    description: "Personal information and security"
  },
  {
    name: "Business",
    href: "/dashboard/settings/business",
    icon: Building2,
    description: "Business details and branding"
  },
  {
    name: "Chatbot",
    href: "/dashboard/settings/chatbot",
    icon: Bot,
    description: "Chatbot and QR settings"
  }
]

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Get current page name for mobile display
  const currentPage = settingsNavigation.find(item => item.href === pathname)

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      // Auto-open sidebar on desktop
      if (!mobile) {
        setIsSidebarOpen(true)
      } else {
        setIsSidebarOpen(false)
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

  return (
    <div className="flex-1 flex flex-col md:flex-row relative h-full">
      {/* Mobile Header - Only visible on mobile */}
      <div className="md:hidden sticky top-0 z-20 bg-card border-b border-border px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              {currentPage ? <currentPage.icon className="h-4 w-4 text-primary" /> : <Settings className="h-4 w-4 text-primary" />}
            </div>
            <div>
              <h2 className="font-semibold text-foreground text-sm">
                {currentPage?.name || 'Settings'}
              </h2>
              <p className="text-xs text-muted-foreground">
                {currentPage?.description || 'Manage your preferences'}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="h-9 w-9 p-0"
          >
            {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isMobile && isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Settings Sidebar */}
      <div className={cn(
        "border-r border-border bg-card backdrop-blur-xl flex-shrink-0 z-40 flex flex-col",
        "md:sticky md:top-16 md:translate-x-0 md:w-80 md:h-[calc(100vh-4rem)]",
        // Mobile styles
        "fixed top-0 left-0 h-full w-80 transition-transform duration-300 ease-in-out",
        isMobile && !isSidebarOpen && "-translate-x-full",
        isMobile && isSidebarOpen && "translate-x-0"
      )}>
        <div className="px-6 py-4 border-b border-border/50 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-1 rounded-lg">
                <Settings className="h-5 w-5 text-secondary-foreground" />
              </div>
              <div>
                <h2 className="font-semibold text-secondary-foreground">Settings</h2>
                <p className="text-xs text-secondary-foreground/70">Manage your preferences</p>
              </div>
            </div>
            {/* Close button for mobile */}
            {isMobile && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsSidebarOpen(false)}
                className="h-8 w-8 p-0 md:hidden text-white hover:bg-white/10"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
        
        <nav className="p-4 space-y-2 overflow-y-auto flex-1">
          {settingsNavigation.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-start gap-3 p-3 rounded-lg transition-all duration-200",
                  isActive
                    ? "bg-secondary-foreground/10 text-secondary-foreground"
                    : "text-white/70 hover:bg-secondary-foreground/10"
                )}
                onClick={() => {
                  if (isMobile) {
                    setIsSidebarOpen(false)
                  }
                }}
              >
                <Icon className={cn(
                  "h-5 w-5 flex-shrink-0 mt-0.5",
                  isActive ? "text-secondary-foreground" : "text-secondary-foreground"
                )} />
                <div className="flex-1 min-w-0">
                  <p className={cn(
                    "text-sm font-medium",
                    isActive ? "text-secondary-foreground" : "text-secondary-foreground"
                  )}>
                    {item.name}
                  </p>
                  <p className={cn(
                    "text-xs mt-0.5 line-clamp-2",
                    isActive ? "text-secondary-foreground/70" : "text-secondary-foreground"
                  )}>
                    {item.description}
                  </p>
                </div>
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Settings Content */}
      <div className="flex-1 overflow-auto min-h-0">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          {children}
        </div>
      </div>
    </div>
  )
} 