"use client"

import { useState, useEffect, Suspense } from "react"
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
  AlertTriangle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import ProtectedRoute from '@/components/ProtectedRoute'
import Topbar from '@/components/Topbar'
import { PageSpinner } from '@/components/ui/spinner'

// Create a custom loading component for your application
function AppLoading() {
  const [animationData, setAnimationData] = useState(null);

  useEffect(() => {
    // Fetch the Lottie animation
    fetch('/animations/loading-animation.json')
      .then(response => response.json())
      .then(data => {
        setAnimationData(data);
      })
      .catch(err => {
        console.error("Failed to load animation:", err);
      });
  }, []);

  return <PageSpinner animationData={animationData} message="Loading content..." />;
}

/* 
HOW TO USE THIS DASHBOARD LAYOUT WITH LOTTIE SPINNER:

1. Replace the standard dashboard layout.tsx with this file
2. Place your Lottie animation file in /public/animations/loading-animation.json
3. The Lottie animation will display when content is loading

For example:

<main className="...">
  <Topbar ... />
  <div className="...">
    <Suspense fallback={<AppLoading />}>
      {children}
    </Suspense>
  </div>
</main>
*/

const navigation = [
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { name: "Knowledge Base", href: "/dashboard/knowledge", icon: FolderKanban },
  { name: "Chat Sessions", href: "/dashboard/sessions", icon: MessageSquare },
  { name: "Escalations", href: "/dashboard/escalations", icon: AlertTriangle },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
]

export default function DashboardLayoutWithLottie({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  
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
  
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        {/* Sidebar - fixed on the left */}
        <div
          className={cn(
            "fixed top-0 left-0 z-40 flex flex-col h-screen transition-all duration-300 ease-out bg-card/50 backdrop-blur-xl border-r border-border shadow-2xl",
            isSidebarOpen ? "w-80" : "lg:w-20 -translate-x-full lg:translate-x-0"
          )}
        >
          {/* Sidebar content (same as in the original layout) */}
          <div className="flex grow flex-col overflow-y-auto px-4 pb-4 h-full">            
            {/* Header */}
            <div className="flex h-20 shrink-0 items-center justify-between px-2">
              {/* Logo and brand name */}
              <Link 
                href="/dashboard" 
                className={cn(
                  "flex items-center gap-3 text-foreground transition-all duration-300 ease-out group",
                  !isSidebarOpen && "lg:justify-center"
                )}
              >
                <div className="flex-shrink-0 w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-lg transition-all duration-300 group-hover:scale-110">
                  <span className="text-primary-foreground font-bold text-sm">E</span>
                </div>
                <span 
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
                {/* Navigation items (same as in the original layout) */}
                {navigation.map((item, index) => {
                  const isActive = pathname === item.href
                  return (
                    <Link
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
                })}
                
                {/* Sign out button */}
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
          
          {/* Main content with Lottie spinner for loading states */}
          <div className="bg-background flex flex-col flex-1 h-full">
            <Suspense fallback={<AppLoading />}>
              {children}
            </Suspense>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
