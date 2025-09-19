"use client"
import * as React from "react"

import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ThemeSwitch } from "@/components/theme-switch"
import { Menu, Bell, Search, User, LayoutDashboard, FolderKanban, MessageSquare, AlertTriangle, Settings, HelpCircle, Package, Wrench, FileText } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/auth"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface TopbarProps {
  onMenuToggle?: () => void
  isMobile?: boolean
}

const getPageInfo = (pathname: string) => {
  const segments = pathname.split('/').filter(Boolean)
  
  // Handle escalation details
  if (segments.includes('escalations') && segments.length > 2) {
    return { title: 'Escalation Details', icon: AlertTriangle }
  }
  
  const page = segments[segments.length - 1]
  switch (page) {
    case 'dashboard':
      return { title: 'Overview', icon: LayoutDashboard }
    case 'knowledge':
      return { title: 'Knowledge Base', icon: FolderKanban }
    case 'faq':
      return { title: 'FAQ Management', icon: HelpCircle }
    case 'products':
      return { title: 'Products Management', icon: Package }
    case 'services':
      return { title: 'Services Management', icon: Wrench }
    case 'policy':
      return { title: 'Policy Management', icon: FileText }
    case 'sessions':
      return { title: 'Chat Sessions', icon: MessageSquare }
    case 'escalations':
      return { title: 'Escalations', icon: AlertTriangle }
    case 'settings':
      return { title: 'Settings', icon: Settings }
    case 'business':
      return { title: 'Business Settings', icon: Settings }
    case 'realtime-dashboard':
      return { title: 'Real-time Dashboard', icon: Settings }
    default:
      return { title: 'Dashboard', icon: LayoutDashboard }
  }
}

export default function Topbar({ onMenuToggle, isMobile }: TopbarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const segments = pathname.split('/').filter(Boolean);
  // Map segment to label/icon
  const segmentMap: Record<string, { label: string; icon?: React.ElementType }> = {
    dashboard: { label: 'Overview'},
    knowledge: { label: 'Knowledge Base'},
    faq: { label: 'FAQ Management'},
    products: { label: 'Products Management'},
    services: { label: 'Services Management'},
    policy: { label: 'Policy Management'},
    sessions: { label: 'Chat Sessions'},
    escalations: { label: 'Escalations'},
    realtimedashboard: { label: 'Real-time Dashboard' },
    settings: { label: 'General'},
    business: { label: 'Business '},
    account: { label: 'Account '},
    register: { label: 'Register'},
    login: { label: 'Login' },
    chat: { label: 'Chat' },
    auth: { label: 'Auth' },
    agents: { label: 'Agents' },
    security: { label: 'Security' },
  };
  // Breadcrumb import
  // prettier-ignore
  // @ts-ignore
  // eslint-disable-next-line
  const { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator } = require("@/components/ui/breadcrumb");
  const NextLink = require("next/link").default;

  return (
    <header className="sticky top-0 left-0 w-full z-30 h-16 bg-card backdrop-blur-lg border-b border-border flex items-center justify-between px-4 md:px-6">
      {/* Left section */}
      <div className="flex items-center gap-4">
        {/* Menu toggle button - always visible */}
        {onMenuToggle && (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 cursor-pointer"
            onClick={onMenuToggle}
          >
            <Menu className="h-5 w-5 text-foreground" />
          </Button>
        )}

        {/* Breadcrumb */}
        <Breadcrumb>
          <BreadcrumbList>
            {/* Home/dashboard always first */}
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <NextLink href="/dashboard" className="text-foreground">
                  Overview
                </NextLink>
              </BreadcrumbLink>
            </BreadcrumbItem>
            {segments.map((seg, idx) => {
              // Skip dashboard for first segment
              if (idx === 0 && seg === 'dashboard') return null;
              // Skip 'knowledge' segment (no page)
              if (seg === 'knowledge') return null;
              const isLast = idx === segments.length - 1;
              const info = segmentMap[seg] || { label: seg };
              return (
                <React.Fragment key={seg + idx}>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    {isLast ? (
                      <BreadcrumbPage>
                        {info.label}
                      </BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink asChild>
                        <NextLink href={'/' + segments.slice(0, idx + 1).join('/') }>
                          {info.label}
                        </NextLink>
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                </React.Fragment>
              );
            })}
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-2 md:gap-4">        {/* Search button - hidden on mobile to save space */}
        <Button
          variant="ghost"
          size="sm"
          className="hidden md:flex h-9 w-9 p-0 items-center justify-center rounded-lg transition-all duration-300 hover:bg-accent"
        >
          <Search className="h-4 w-4 text-foreground" />
        </Button>

        {/* Notifications */}
        <Button
          variant="ghost"
          size="sm"
          className="h-9 w-9 p-0 items-center justify-center rounded-lg transition-all duration-300 hover:bg-accent relative"
        >
          <Bell className="h-4 w-4 text-foreground" />
          {/* Notification dot */}
          <div className="absolute -top-1 -right-1 h-2 w-2 bg-destructive rounded-full"></div>
        </Button>

        {/* Theme toggle */}
        <div className="flex items-center">
          <ThemeSwitch />
        </div>

        {/* User profile - hidden on small mobile screens */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="hidden sm:flex h-9 w-9 p-0 items-center justify-center rounded-lg transition-all duration-300 hover:bg-accent"
            >
              <User className="h-4 w-4 text-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              {user?.firstName && user?.lastName 
                ? `${user.firstName} ${user.lastName}`
                : user?.email || 'My Account'
              }
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout} className="text-destructive focus:text-destructive">
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
