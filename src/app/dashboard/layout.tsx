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
} from "lucide-react"
import { Button } from "@/components/ui/button"
import ProtectedRoute from '@/components/ProtectedRoute'

const navigation = [
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { name: "Knowledge Base", href: "/dashboard/knowledge", icon: FolderKanban },
  { name: "Chat Sessions", href: "/dashboard/sessions", icon: MessageSquare },
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

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
      setIsSidebarOpen(window.innerWidth >= 768)
    }
    
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-black">
        {/* Mobile sidebar backdrop */}
        {isMobile && isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/80 z-40"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <div
          className={cn(
            "fixed inset-y-0 z-50 flex flex-col transition-all duration-300",
            isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
            isSidebarOpen ? "w-72" : "md:w-20"
          )}
        >
          <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white/5 backdrop-blur-lg px-6 pb-4 border-r border-blue-500/20 h-full">
            <div className="flex h-16 shrink-0 items-center justify-between">
              <Link 
                href="/dashboard" 
                className={cn(
                  "text-xl font-bold text-white transition-all duration-300",
                  !isSidebarOpen && "md:hidden"
                )}
              >
                AI Chatbot
              </Link>
              
              {/* Desktop toggle button */}
              <Button
                variant="ghost"
                className="hidden md:flex h-8 w-8 p-0 items-center justify-center"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              >
                {isSidebarOpen ? (
                  <ChevronLeft className="h-4 w-4 text-gray-400" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                )}
              </Button>

              {/* Mobile menu button */}
              <Button
                variant="ghost"
                className="md:hidden h-8 w-8 p-0"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              >
                <Menu className="h-5 w-5 text-gray-400" />
              </Button>
            </div>

            <nav className="flex flex-1 flex-col">
              <ul role="list" className="flex flex-1 flex-col gap-y-7">
                <li>
                  <ul role="list" className="-mx-2 space-y-1">
                    {navigation.map((item) => {
                      const isActive = pathname === item.href
                      return (
                        <li key={item.name}>
                          <Link
                            href={item.href}
                            className={cn(
                              "group flex gap-x-3 rounded-md p-2 text-sm leading-6",
                              isActive
                                ? "bg-blue-500 text-white"
                                : "text-gray-400 hover:text-white hover:bg-white/10"
                            )}
                            onClick={() => isMobile && setIsSidebarOpen(false)}
                          >
                            <item.icon className="h-6 w-6 shrink-0" />
                            <span className={cn(
                              "transition-all duration-300",
                              !isSidebarOpen && "md:hidden"
                            )}>
                              {item.name}
                            </span>
                          </Link>
                        </li>
                      )
                    })}
                  </ul>
                </li>
                <li className="mt-auto">
                  <Link
                    href="/auth"
                    className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-400 hover:text-white hover:bg-white/10"
                    onClick={() => isMobile && setIsSidebarOpen(false)}
                  >
                    <LogOut className="h-6 w-6 shrink-0" />
                    <span className={cn(
                      "transition-all duration-300",
                      !isSidebarOpen && "md:hidden"
                    )}>
                      Sign out
                    </span>
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        {/* Main content */}
        <main className={cn(
          "transition-all duration-300",
          isSidebarOpen ? "md:pl-72" : "md:pl-20",
          "pl-0" // Default padding for mobile
        )}>
          <div className="min-h-screen bg-black/95">
            {/* Mobile header */}
            <div className="md:hidden flex items-center h-16 px-4 bg-white/5 backdrop-blur-lg border-b border-blue-500/20">
              <Button
                variant="ghost"
                className="h-8 w-8 p-0"
                onClick={() => setIsSidebarOpen(true)}
              >
                <Menu className="h-5 w-5 text-gray-400" />
              </Button>
              <span className="ml-4 text-lg font-semibold text-white">AI Chatbot</span>
            </div>
            
            {children}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
} 