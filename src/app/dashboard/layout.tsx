"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  MessageSquare,
  FolderKanban,
  Settings,
  LogOut,
  Menu,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import ProtectedRoute from '@/components/ProtectedRoute'
import Topbar from '@/components/Topbar'

const navigation = [
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { name: "Knowledge Base", href: "/dashboard/knowledge", icon: FolderKanban },
  { name: "Chat Sessions", href: "/dashboard/sessions", icon: MessageSquare },
  { name: "Escalations", href: "/dashboard/escalations", icon: AlertTriangle },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isMobile, setIsMobile] = useState(false)  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024)
      setIsSidebarOpen(window.innerWidth >= 1024)
    }
    
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])
  return (    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        {/* Mobile sidebar backdrop */}
        {isMobile && isSidebarOpen && (
          <div
            className="fixed inset-0 bg-background/60 backdrop-blur-sm z-40 transition-all duration-300 ease-out"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}          <div
          className={cn(
            "fixed inset-y-0 z-50 flex flex-col transition-all duration-300 ease-out",
            isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
            isSidebarOpen ? "w-80" : "lg:w-20"
          )}
        >
          <div className="flex grow flex-col overflow-y-auto bg-card/50 backdrop-blur-xl px-4 pb-4 border-r border-border h-full shadow-2xl">            
          {/* Header */}
            <div className="flex h-20 shrink-0 items-center justify-between px-2">              <Link 
                href="/dashboard" 
                className={cn(
                  "flex items-center gap-3 text-foreground transition-all duration-300 ease-out group",
                  !isSidebarOpen && "lg:justify-center"
                )}
              >
                {/* Logo icon */}
                <div className="flex-shrink-0 w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-lg transition-all duration-300 group-hover:scale-110">
                  <span className="text-primary-foreground font-bold text-sm">E</span>
                </div>
                
                {/* Brand name */}                <span 
                  className={cn(
                    "text-xl font-bold transition-all duration-300 ease-out whitespace-nowrap",
                    !isSidebarOpen && "lg:opacity-0 lg:w-0 lg:overflow-hidden"
                  )}
                >
                  Enquiro
                </span>
              </Link>              {/* Mobile menu button */}
              <Button
                variant="ghost"
                className="lg:hidden h-9 w-9 p-0 rounded-lg transition-all duration-300 hover:bg-accent"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              >
                <Menu className="h-5 w-5 text-muted-foreground" />
              </Button>
            </div>

            {/* Navigation */}
            <nav className="flex flex-1 flex-col px-2 py-4">
              <div className="flex flex-1 flex-col gap-2">                
                {navigation.map((item, index) => {
                  const isActive = pathname === item.href
                  return (                    <Link
                      key={item.name}
                      href={item.href}
                      className={cn(
                        "group relative flex items-center rounded-xl p-3 text-sm font-medium transition-all duration-300 ease-out",
                        "hover:bg-accent",
                        isActive
                          ? "bg-primary/20 text-foreground shadow-lg"
                          : "text-muted-foreground hover:text-foreground",
                        !isSidebarOpen ? "justify-center gap-0" : "gap-3"
                      )}
                      onClick={() => isMobile && setIsSidebarOpen(false)}
                    >
                      {/* Active indicator */}
                      {isActive && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-full shadow-lg" />
                      )}
                      
                      <div className="flex-shrink-0">
                        <item.icon className={cn(
                          "h-5 w-5 transition-all duration-300",
                          isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                        )} />
                      </div>
                        <span className={cn(
                        "transition-all duration-300 ease-out whitespace-nowrap",
                        !isSidebarOpen && "lg:opacity-0 lg:w-0 lg:overflow-hidden"
                      )}>
                        {item.name}
                      </span>
                    </Link>
                  )
                })}                {/* Sign out button */}                
                <div className="mt-auto pt-4 border-t border-border">
                  <Link
                    href="/auth"
                    className={cn(
                      "group relative flex items-center rounded-xl p-3 text-sm font-medium transition-all duration-300 ease-out",
                      "text-destructive hover:text-destructive hover:bg-destructive/10",
                      !isSidebarOpen ? "justify-center gap-0" : "gap-3"
                    )}
                    onClick={() => isMobile && setIsSidebarOpen(false)}
                  >
                    <div className="flex-shrink-0">
                      <LogOut className="h-5 w-5 transition-all duration-300" />
                    </div>
                      <span className={cn(
                      "transition-all duration-300 ease-out whitespace-nowrap",
                      !isSidebarOpen && "lg:opacity-0 lg:w-0 lg:overflow-hidden"
                    )}>
                      Sign out
                    </span>
                  </Link>
                </div>
              </div>
            </nav>
          </div>
        </div>        {/* Main content */}        <main className={cn(
          "transition-all duration-300 h-screen flex flex-col",
          isSidebarOpen ? "lg:pl-80" : "lg:pl-20",
          "pl-0" // Default padding for mobile
        )}>
          <div className="bg-background flex flex-col h-full">
            {/* Topbar - shown on all screen sizes */}
            <Topbar 
              onMenuToggle={() => setIsSidebarOpen(true)} 
              isMobile={isMobile}
            />
            
            {/* Page content */}
            <div className="flex-1 overflow-hidden">
              {children}
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
} 