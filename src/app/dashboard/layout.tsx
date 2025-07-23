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
  HelpCircle,
  Package,
  Wrench,
  FileText,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import ProtectedRoute from '@/components/ProtectedRoute'
import Topbar from '@/components/Topbar'
import { PageSpinner } from '@/components/ui/spinner'

const navigation = [
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { 
    name: "Knowledge Base", 
    href: "/dashboard/knowledge", 
    icon: FolderKanban,
    children: [
      { name: "Products", href: "/dashboard/knowledge/products", icon: Package },
      { name: "Services", href: "/dashboard/knowledge/services", icon: Wrench },
      { name: "Policy", href: "/dashboard/knowledge/policy", icon: FileText },
      { name: "FAQ", href: "/dashboard/knowledge/faq", icon: HelpCircle },
    ]
  },
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
  const [isMobile, setIsMobile] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [animationData, setAnimationData] = useState(null)
  const [expandedItems, setExpandedItems] = useState<string[]>([])
  
  // Auto-expand knowledge base if we're on a knowledge sub-page
  useEffect(() => {
    if (pathname.startsWith('/dashboard/knowledge/')) {
      setExpandedItems(prev => prev.includes('Knowledge Base') ? prev : [...prev, 'Knowledge Base'])
    }
  }, [pathname])
  
  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024)
      setIsSidebarOpen(window.innerWidth >= 1024)
    }
    
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])
  
  // Load Lottie animation
  useEffect(() => {
    fetch('/animations/spinner.json')
      .then(response => response.json())
      .then(data => {
        setAnimationData(data)
      })
      .catch(err => {
        console.error("Failed to load animation:", err)
      })
  }, [])
    // Handle loading state with minimum duration
  useEffect(() => {
    // Set minimum loading duration to 2 seconds
    const minLoadingTime = 1000 // 2 seconds
    const startTime = Date.now()
    
    const timer = setTimeout(() => {
      // Calculate elapsed time
      const elapsed = Date.now() - startTime
      
      // If less than minimum time has passed, wait the remaining time
      if (elapsed < minLoadingTime) {
        setTimeout(() => setIsLoading(false), minLoadingTime - elapsed)
      } else {
        setIsLoading(false)
      }
    }, 500) // Initial delay to check if content is loaded quickly    
    return () => clearTimeout(timer)
  }, [])

  // If loading, show the spinner  
  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-background">
          <PageSpinner 
            animationData={animationData}
          />
        </div>
      </ProtectedRoute>
    )
  }
  
  // Otherwise, show the full dashboard
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-card">
        {/* Sidebar - fixed on the left */}
        <div
          className={cn(
            "fixed top-0 left-0 z-40 flex flex-col h-screen transition-all duration-300 ease-out bg-card/50 backdrop-blur-xl border-r border-border",
            isSidebarOpen ? "w-80" : "lg:w-20 -translate-x-full lg:translate-x-0"
          )}
        >
          <div className="flex grow flex-col overflow-y-auto px-4 pb-4 h-full">            
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
              </Link>              
              {/* Mobile menu button */}
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
                  const isActive = pathname === item.href || (item.children && item.children.some(child => pathname === child.href))
                  const isExpanded = expandedItems.includes(item.name)
                  const hasChildren = item.children && item.children.length > 0
                  
                  const toggleExpanded = () => {
                    if (hasChildren) {
                      setExpandedItems(prev => 
                        prev.includes(item.name) 
                          ? prev.filter(name => name !== item.name)
                          : [...prev, item.name]
                      )
                    }
                  }
                  
                  return (
                    <div key={item.name}>
                      {/* Main navigation item */}
                      <div
                        className={cn(
                          "group relative flex items-center rounded-xl p-3 text-sm font-medium transition-all duration-300 ease-out cursor-pointer",
                          "hover:bg-accent",
                          isActive
                            ? "bg-primary/20 text-foreground shadow-lg"
                            : "text-muted-foreground hover:text-foreground",
                          !isSidebarOpen ? "justify-center gap-0" : "gap-3"
                        )}
                        onClick={() => {
                          if (hasChildren) {
                            toggleExpanded()
                          } else {
                            if (isMobile) setIsSidebarOpen(false)
                          }
                        }}
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
                          "transition-all duration-300 ease-out whitespace-nowrap flex-1",
                          !isSidebarOpen && "lg:opacity-0 lg:w-0 lg:overflow-hidden"
                        )}>
                          {hasChildren ? (
                            <span>{item.name}</span>
                          ) : (
                            <Link href={item.href} className="block w-full">
                              {item.name}
                            </Link>
                          )}
                        </span>
                        
                        {/* Expand/Collapse arrow */}
                        {hasChildren && isSidebarOpen && (
                          <div className="flex-shrink-0">
                            <ChevronRight className={cn(
                              "h-4 w-4 transition-transform duration-200",
                              isExpanded ? "rotate-90" : "rotate-0",
                              isActive ? "text-primary" : "text-muted-foreground"
                            )} />
                          </div>
                        )}
                      </div>
                      
                      {/* Sub-navigation items */}
                      {hasChildren && isSidebarOpen && (
                        <div 
                          className={cn(
                            "ml-6 mt-1 space-y-1 overflow-hidden transition-all duration-300 ease-in-out",
                            isExpanded 
                              ? "max-h-96 opacity-100" 
                              : "max-h-0 opacity-0"
                          )}
                        >
                          {item.children.map((child, childIndex) => {
                            const isChildActive = pathname === child.href
                            return (
                              <Link
                                key={child.name}
                                href={child.href}
                                className={cn(
                                  "group relative flex items-center gap-3 rounded-lg p-2 text-sm font-medium transition-all duration-200",
                                  "hover:bg-accent transform translate-y-0",
                                  "animate-in slide-in-from-top-2 fade-in-0",
                                  isChildActive
                                    ? "bg-primary/10 text-primary"
                                    : "text-muted-foreground hover:text-foreground",
                                  isExpanded ? "delay-75" : ""
                                )}
                                style={{
                                  animationDelay: isExpanded ? `${childIndex * 50}ms` : "0ms",
                                  animationDuration: "200ms"
                                }}
                                onClick={() => isMobile && setIsSidebarOpen(false)}
                              >
                                <div className="flex-shrink-0">
                                  <child.icon className={cn(
                                    "h-4 w-4 transition-colors",
                                    isChildActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                                  )} />
                                </div>
                                <span className="truncate">{child.name}</span>
                              </Link>
                            )
                          })}
                        </div>
                      )}
                    </div>
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
        </div>
        {/* Main content */}
        <main
          className={cn(
            "transition-all duration-300 flex flex-col min-h-screen",
            isSidebarOpen ? "lg:pl-80" : "lg:pl-20 pl-0"
          )}
        >
          {/* Topbar always at the top of the main content */}
          <Topbar 
            onMenuToggle={() => setIsSidebarOpen(true)} 
            isMobile={isMobile}
          />
          <div className="bg-background flex flex-col flex-1 h-full">
            {children}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}