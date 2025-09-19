"use client"

import React, { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { ScrollArea } from '@/components/ui/scroll-area'

interface TocItem {
  id: string
  title: string
  level: number
}

interface TableOfContentsProps {
  className?: string
}

export function TableOfContents({ className }: TableOfContentsProps) {
  const [toc, setToc] = useState<TocItem[]>([])
  const [activeId, setActiveId] = useState<string>('')

  useEffect(() => {
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6')
    const tocItems: TocItem[] = []

    headings.forEach((heading) => {
      if (heading.id) {
        tocItems.push({
          id: heading.id,
          title: heading.textContent || '',
          level: parseInt(heading.tagName.charAt(1))
        })
      }
    })

    setToc(tocItems)

    // Set up intersection observer for active headings
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      { 
        rootMargin: '0% 0% -80% 0%',
        threshold: 0.5
      }
    )

    headings.forEach((heading) => {
      if (heading.id) {
        observer.observe(heading)
      }
    })

    return () => observer.disconnect()
  }, [])

  if (toc.length === 0) {
    return null
  }

  return (
    <div className={cn("space-y-2", className)}>
      <p className="font-medium">On This Page</p>
      <ScrollArea className="h-[calc(100vh-4rem)] pb-10">
        <div className="space-y-2">
          {toc.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={cn(
                "block text-sm transition-colors hover:text-foreground",
                item.level > 2 && "pl-4",
                item.level > 3 && "pl-8",
                activeId === item.id
                  ? "font-medium text-foreground"
                  : "text-muted-foreground"
              )}
            >
              {item.title}
            </a>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}