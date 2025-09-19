"use client"

import React from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Copy, Check, ExternalLink } from 'lucide-react'
import { useState } from 'react'

interface CodeBlockProps {
  children: React.ReactNode
  language?: string
  title?: string
  showCopy?: boolean
  className?: string
}

export function CodeBlock({ 
  children, 
  language = "typescript", 
  title, 
  showCopy = true,
  className 
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = async () => {
    const code = typeof children === 'string' ? children : children?.toString() || ''
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className={cn("relative group", className)}>
      {title && (
        <div className="flex items-center justify-between px-4 py-2 bg-muted/50 border border-b-0 rounded-t-lg backdrop-blur-sm">
          <span className="text-sm font-medium text-foreground">{title}</span>
          <Badge variant="outline" className="text-xs bg-background/50">
            {language}
          </Badge>
        </div>
      )}
      <div className="relative">
        <pre className={cn(
          "overflow-x-auto p-4 bg-slate-950 text-slate-50 rounded-lg text-sm font-mono leading-relaxed",
          title && "rounded-t-none",
          "scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-800"
        )}>
          <code className="text-slate-50">{children}</code>
        </pre>
        {showCopy && (
          <Button
            size="sm"
            variant="ghost"
            className="absolute top-2 right-2 h-7 w-7 p-0 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 opacity-0 group-hover:opacity-100 transition-all duration-200"
            onClick={copyToClipboard}
          >
            {copied ? (
              <Check className="h-3 w-3" />
            ) : (
              <Copy className="h-3 w-3" />
            )}
          </Button>
        )}
      </div>
    </div>
  )
}

interface FeatureCardProps {
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
  href?: string
  badge?: string
  className?: string
}

export function FeatureCard({ 
  icon: Icon, 
  title, 
  description, 
  href,
  badge,
  className 
}: FeatureCardProps) {
  const Component = href ? 'a' : 'div'
  
  return (
    <Component
      href={href}
      className={cn(
        "group relative overflow-hidden rounded-lg border bg-background p-6 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5",
        href && "hover:border-primary/50 cursor-pointer hover:-translate-y-1",
        className
      )}
    >
      <div className="flex items-start gap-4">
        <div className="rounded-md bg-gradient-to-br from-primary/10 to-primary/20 p-2 group-hover:from-primary/20 group-hover:to-primary/30 transition-all duration-300">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold group-hover:text-primary transition-colors">{title}</h3>
            {badge && (
              <Badge variant="secondary" className="text-xs">
                {badge}
              </Badge>
            )}
            {href && (
              <ExternalLink className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            )}
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {description}
          </p>
        </div>
      </div>
      {/* Subtle gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </Component>
  )
}

interface StepProps {
  step: number
  title: string
  description: string
  children?: React.ReactNode
  className?: string
}

export function Step({ step, title, description, children, className }: StepProps) {
  return (
    <div className={cn("relative pl-8 pb-8 last:pb-0", className)}>
      <div className="absolute left-0 top-0 flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/80 text-xs font-semibold text-primary-foreground shadow-sm">
        {step}
      </div>
      {/* Connecting line */}
      <div className="absolute left-3 top-6 w-px h-full bg-border last:hidden" />
      <div className="space-y-3">
        <h3 className="font-semibold text-lg">{title}</h3>
        <p className="text-muted-foreground leading-relaxed">{description}</p>
        {children}
      </div>
    </div>
  )
}