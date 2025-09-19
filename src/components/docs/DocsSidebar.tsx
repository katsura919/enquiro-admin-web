"use client"

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  FileText, 
  MessageSquare, 
  Users, 
  Settings, 
  Zap, 
  Shield, 
  Code, 
  Palette,
  Database,
  Webhook
} from 'lucide-react'

interface NavItem {
  title: string
  href: string
  icon?: React.ComponentType<{ className?: string }>
  badge?: string
  items?: NavItem[]
}

const navigation: NavItem[] = [
  {
    title: "Getting Started",
    href: "/docs",
    icon: FileText,
    items: [
      { title: "Introduction", href: "/docs/introduction" },
      { title: "Quick Start", href: "/docs/quick-start" },
      { title: "Installation", href: "/docs/installation" },
    ]
  },
  {
    title: "Chat System",
    href: "/docs/chat",
    icon: MessageSquare,
    items: [
      { title: "Live Chat", href: "/docs/chat/live-chat" },
      { title: "Chat Widget", href: "/docs/chat/widget" },
      { title: "File Uploads", href: "/docs/chat/file-uploads" },
      { title: "Chat Routing", href: "/docs/chat/routing" },
    ]
  },
  {
    title: "Agent Management",
    href: "/docs/agents",
    icon: Users,
    items: [
      { title: "Agent Dashboard", href: "/docs/agents/dashboard" },
      { title: "Agent Status", href: "/docs/agents/status" },
      { title: "Escalations", href: "/docs/agents/escalations" },
      { title: "Performance", href: "/docs/agents/performance" },
    ]
  },
  {
    title: "Integration",
    href: "/docs/integration",
    icon: Code,
    items: [
      { title: "REST API", href: "/docs/integration/api" },
      { title: "Webhooks", href: "/docs/integration/webhooks" },
      { title: "Socket Events", href: "/docs/integration/sockets" },
      { title: "Embed Widget", href: "/docs/integration/embed" },
    ]
  },
  {
    title: "Business Management",
    href: "/docs/business",
    icon: Settings,
    items: [
      { title: "Multi-tenant Setup", href: "/docs/business/multi-tenant" },
      { title: "User Management", href: "/docs/business/users" },
      { title: "Permissions", href: "/docs/business/permissions" },
    ]
  },
  {
    title: "Knowledge Base",
    href: "/docs/knowledge",
    icon: Database,
    items: [
      { title: "FAQ Management", href: "/docs/knowledge/faq" },
      { title: "Articles", href: "/docs/knowledge/articles" },
      { title: "Search", href: "/docs/knowledge/search" },
    ]
  },
  {
    title: "Customization",
    href: "/docs/customization",
    icon: Palette,
    items: [
      { title: "Themes", href: "/docs/customization/themes" },
      { title: "Branding", href: "/docs/customization/branding" },
      { title: "UI Components", href: "/docs/customization/components" },
    ]
  },
  {
    title: "Security",
    href: "/docs/security",
    icon: Shield,
    badge: "Important",
    items: [
      { title: "Authentication", href: "/docs/security/auth" },
      { title: "Data Privacy", href: "/docs/security/privacy" },
      { title: "Best Practices", href: "/docs/security/best-practices" },
    ]
  }
]

interface DocsSidebarProps {
  className?: string
}

export function DocsSidebar({ className }: DocsSidebarProps) {
  const pathname = usePathname()

  return (
    <div className={cn("pb-12", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Documentation
          </h2>
          <ScrollArea className="h-[calc(100vh-8rem)] px-1">
            <div className="space-y-2">
              {navigation.map((item, index) => (
                <div key={index} className="px-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 py-2">
                      {item.icon && (
                        <item.icon className="h-4 w-4 text-muted-foreground" />
                      )}
                      <Link 
                        href={item.href}
                        className={cn(
                          "text-sm font-medium transition-colors hover:text-primary",
                          pathname === item.href ? "text-primary" : "text-muted-foreground"
                        )}
                      >
                        {item.title}
                      </Link>
                      {item.badge && (
                        <Badge variant="secondary" className="text-xs">
                          {item.badge}
                        </Badge>
                      )}
                    </div>
                  </div>
                  {item.items && (
                    <div className="ml-6 space-y-1 border-l pl-4">
                      {item.items.map((subItem, subIndex) => (
                        <Link
                          key={subIndex}
                          href={subItem.href}
                          className={cn(
                            "block py-1 text-sm transition-colors hover:text-primary",
                            pathname === subItem.href 
                              ? "text-primary font-medium" 
                              : "text-muted-foreground"
                          )}
                        >
                          {subItem.title}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  )
}