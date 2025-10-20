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
    href: "/docs/chat-widget",
    icon: Code,
  },
  {
    title: "Agent Management",
    href: "/docs/agents",
    icon: Users,
  },
  {
    title: "Escalations",
    href: "/docs/agents/escalations",
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