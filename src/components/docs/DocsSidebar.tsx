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
  },
  {
    title: "Introduction",
    href: "/docs/introduction",
    icon: FileText,
  },
  {
    title: "Quick Start",
    href: "/docs/quick-start",
    icon: Zap,
  },
  {
    title: "Installation",
    href: "/docs/installation",
    icon: Settings,
  },
  {
    title: "Chat System",
    href: "/docs/chat",
    icon: MessageSquare,
  },
  {
    title: "Live Chat",
    href: "/docs/chat/live-chat",
    icon: MessageSquare,
  },
  {
    title: "Chat Widget",
    href: "/docs/chat/widget",
    icon: Code,
  },
  {
    title: "File Uploads",
    href: "/docs/chat/file-uploads",
    icon: Database,
  },
  {
    title: "Chat Routing",
    href: "/docs/chat/routing",
    icon: Webhook,
  },
  {
    title: "Agent Management",
    href: "/docs/agents",
    icon: Users,
  },
  {
    title: "Agent Dashboard",
    href: "/docs/agents/dashboard",
    icon: Users,
  },
  {
    title: "Agent Status",
    href: "/docs/agents/status",
    icon: Users,
  },
  {
    title: "Escalations",
    href: "/docs/agents/escalations",
    icon: Shield,
  },
  {
    title: "Performance",
    href: "/docs/agents/performance",
    icon: Zap,
  },
  {
    title: "Integration",
    href: "/docs/integration",
    icon: Code,
  },
  {
    title: "REST API",
    href: "/docs/integration/api",
    icon: Code,
  },
  {
    title: "Webhooks",
    href: "/docs/integration/webhooks",
    icon: Webhook,
  },
  {
    title: "Socket Events",
    href: "/docs/integration/sockets",
    icon: Zap,
  },
  {
    title: "Embed Widget",
    href: "/docs/integration/embed",
    icon: Code,
  },
  {
    title: "Business Management",
    href: "/docs/business",
    icon: Settings,
  },
  {
    title: "Multi-tenant Setup",
    href: "/docs/business/multi-tenant",
    icon: Settings,
  },
  {
    title: "User Management",
    href: "/docs/business/users",
    icon: Users,
  },
  {
    title: "Permissions",
    href: "/docs/business/permissions",
    icon: Shield,
  },
  {
    title: "Knowledge Base",
    href: "/docs/knowledge",
    icon: Database,
  },
  {
    title: "FAQ Management",
    href: "/docs/knowledge/faq",
    icon: Database,
  },
  {
    title: "Articles",
    href: "/docs/knowledge/articles",
    icon: FileText,
  },
  {
    title: "Search",
    href: "/docs/knowledge/search",
    icon: Database,
  },
  {
    title: "Customization",
    href: "/docs/customization",
    icon: Palette,
  },
  {
    title: "Themes",
    href: "/docs/customization/themes",
    icon: Palette,
  },
  {
    title: "Branding",
    href: "/docs/customization/branding",
    icon: Palette,
  },
  {
    title: "UI Components",
    href: "/docs/customization/components",
    icon: Code,
  },
  {
    title: "Security",
    href: "/docs/security",
    icon: Shield,
    badge: "Important",
  },
  {
    title: "Authentication",
    href: "/docs/security/auth",
    icon: Shield,
  },
  {
    title: "Data Privacy",
    href: "/docs/security/privacy",
    icon: Shield,
  },
  {
    title: "Best Practices",
    href: "/docs/security/best-practices",
    icon: Shield,
  },
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
          <h2 className="mb-4 px-4 text-lg font-semibold tracking-tight">
            Documentation
          </h2>
          <ScrollArea className="h-[calc(100vh-8rem)]">
            <div className="space-y-1 pr-4">
              {navigation.map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-all hover:bg-accent",
                    pathname === item.href 
                      ? "bg-accent text-primary shadow-sm" 
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {item.icon && (
                    <item.icon className="h-4 w-4 flex-shrink-0" />
                  )}
                  <span className="flex-1">{item.title}</span>
                  {item.badge && (
                    <Badge variant="secondary" className="text-xs ml-auto">
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  )
}