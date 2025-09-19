"use client"

import React from 'react'
import { cn } from '@/lib/utils'

interface DocsLayoutProps {
  children: React.ReactNode
  className?: string
}

export function DocsLayout({ children, className }: DocsLayoutProps) {
  return (
    <div className={cn("w-full max-w-none flex-1 items-start md:grid md:grid-cols-[240px_minmax(0,1fr)_300px] md:gap-8 lg:gap-12", className)}>
      {children}
    </div>
  )
}

interface DocsPageHeaderProps {
  heading: string
  text?: string
  className?: string
}

export function DocsPageHeader({ heading, text, className }: DocsPageHeaderProps) {
  return (
    <div className={cn("space-y-4", className)}>
      <h1 className="inline-block font-bold text-4xl lg:text-5xl bg-gradient-to-r from-black to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
        {heading}
      </h1>
      {text && (
        <p className="text-xl text-muted-foreground max-w-2xl">
          {text}
        </p>
      )}
    </div>
  )
}

interface DocsPageContentProps {
  children: React.ReactNode
  className?: string
}

export function DocsPageContent({ children, className }: DocsPageContentProps) {
  return (
    <div className={cn("relative py-6 lg:gap-10 lg:py-8 xl:grid xl:grid-cols-[1fr_300px]", className)}>
      <div className="mx-auto w-full min-w-0">
        <div className="prose prose-slate dark:prose-invert max-w-none">
          {children}
        </div>
      </div>
    </div>
  )
}