"use client"

import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { Menu, Bell, Search, User } from "lucide-react"
import { cn } from "@/lib/utils"

interface TopbarProps {
  onMenuToggle?: () => void
  isMobile?: boolean
}

const getPageTitle = (pathname: string) => {
  const segments = pathname.split('/').filter(Boolean)
  // If the path is /dashboard/escalations/[id] or deeper, show 'Escalation Details'
  if (segments.includes('escalations') && segments.length > 2) {
    return 'Escalation Details'
  }
  const page = segments[segments.length - 1]
  switch (page) {
    case 'dashboard':
      return 'Overview'
    case 'knowledge':
      return 'Knowledge Base'
    case 'sessions':
      return 'Chat Sessions'
    case 'escalations':
      return 'Escalations'
    case 'settings':
      return 'Settings'
    case 'business':
      return 'Business Settings'
    
    default:
      return 'Dashboard'
  }
}

export default function Topbar({ onMenuToggle, isMobile }: TopbarProps) {
  const pathname = usePathname()
  const pageTitle = getPageTitle(pathname)
  return (
    <header className="sticky top-0 left-0 w-full z-30 h-16 bg-card/50 backdrop-blur-lg border-b border-border flex items-center justify-between px-4 md:px-6">
      {/* Left section */}
      <div className="flex items-center gap-4">
        {/* Mobile menu button */}
        {isMobile && onMenuToggle && (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 lg:hidden"
            onClick={onMenuToggle}
          >
            <Menu className="h-5 w-5 text-muted-foreground" />
          </Button>
        )}
        
        {/* Page title */}
        <div className="flex flex-col">
          <h1 className="text-lg md:text-xl font-semibold text-foreground">
            {pageTitle}
          </h1>
        </div>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-2 md:gap-4">        {/* Search button - hidden on mobile to save space */}
        <Button
          variant="ghost"
          size="sm"
          className="hidden md:flex h-9 w-9 p-0 items-center justify-center rounded-lg transition-all duration-300 hover:bg-accent"
        >
          <Search className="h-4 w-4 text-muted-foreground" />
        </Button>

        {/* Notifications */}
        <Button
          variant="ghost"
          size="sm"
          className="h-9 w-9 p-0 items-center justify-center rounded-lg transition-all duration-300 hover:bg-accent relative"
        >
          <Bell className="h-4 w-4 text-muted-foreground" />
          {/* Notification dot */}
          <div className="absolute -top-1 -right-1 h-2 w-2 bg-destructive rounded-full"></div>
        </Button>

        {/* Mode toggle */}
        <div className="flex items-center">
          <ModeToggle />
        </div>

        {/* User profile - hidden on small mobile screens */}
        <Button
          variant="ghost"
          size="sm"
          className="hidden sm:flex h-9 w-9 p-0 items-center justify-center rounded-lg transition-all duration-300 hover:bg-accent"
        >
          <User className="h-4 w-4 text-muted-foreground" />
        </Button>
      </div>
    </header>
  )
}
